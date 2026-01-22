#!/usr/bin/env node

import { readdir, readFile, mkdir, writeFile, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = resolve(__dirname, '..');

async function getTarget() {
  const args = process.argv.slice(2);

  if (args.includes('--cursor')) {
    return 'cursor';
  }
  if (args.includes('--claude')) {
    return 'claude';
  }

  const select = (await import('@inquirer/select')).default;
  return select({
    message: 'Select target for AI rules:',
    choices: [
      { name: 'Cursor (.cursor/rules)', value: 'cursor' },
      { name: 'Claude Code (.claude)', value: 'claude' },
    ],
  });
}

function parseYamlFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontMatter: {}, body: content };
  }

  const yamlStr = match[1];
  const body = match[2];
  const frontMatter = {};

  for (const line of yamlStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();

      if (value === 'true') value = true;
      else if (value === 'false') value = false;

      frontMatter[key] = value;
    }
  }

  return { frontMatter, body };
}

function serializeFrontMatter(frontMatter) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(frontMatter)) {
    if (value === undefined || value === null || value === '') continue;
    lines.push(`${key}: ${value}`);
  }
  lines.push('---');
  return lines.join('\n');
}

function transformGlobsToPaths(globs) {
  if (!globs || globs === '') return '';

  // Split by comma and clean up
  const patterns = globs.split(',').map((p) => p.trim());

  // Transform glob patterns to path patterns for Claude
  // Claude uses `paths` which are similar but may need slight adjustments
  return patterns.join(', ');
}

async function copyForCursor(cwd) {
  const sourceDir = join(packageRoot, '.ai');
  const targetDir = join(cwd, '.cursor', 'rules');

  await mkdir(targetDir, { recursive: true });

  // Copy rules directory
  const rulesSourceDir = join(sourceDir, 'rules');
  const files = await readdir(rulesSourceDir);

  for (const file of files) {
    const sourcePath = join(rulesSourceDir, file);
    const targetPath = join(targetDir, file);
    await cp(sourcePath, targetPath);
    console.log(`  Copied ${file}`);
  }

  // Copy ignore file if present
  const ignoreSource = join(sourceDir, 'ignore.mdc');
  if (existsSync(ignoreSource)) {
    await cp(ignoreSource, join(targetDir, 'ignore.mdc'));
    console.log(`  Copied ignore.mdc`);
  }

  console.log(`\nCursor rules installed to ${targetDir}`);
}

async function copyForClaude(cwd) {
  const sourceDir = join(packageRoot, '.ai');
  const targetDir = join(cwd, '.claude', 'rules');

  await mkdir(targetDir, { recursive: true });

  // Copy and transform rules
  const rulesSourceDir = join(sourceDir, 'rules');
  const files = await readdir(rulesSourceDir);

  for (const file of files) {
    const sourcePath = join(rulesSourceDir, file);
    const content = await readFile(sourcePath, 'utf-8');
    const { frontMatter, body } = parseYamlFrontMatter(content);

    // Transform globs to paths for Claude
    if (frontMatter.globs) {
      frontMatter.paths = transformGlobsToPaths(frontMatter.globs);
      delete frontMatter.globs;
    }

    const transformed = serializeFrontMatter(frontMatter) + '\n' + body;
    const targetPath = join(targetDir, file);
    await writeFile(targetPath, transformed);
    console.log(`  Copied ${file} (transformed globs -> paths)`);
  }

  // Copy and transform ignore file
  const ignoreSource = join(sourceDir, 'ignore.mdc');
  if (existsSync(ignoreSource)) {
    const content = await readFile(ignoreSource, 'utf-8');
    const { frontMatter, body } = parseYamlFrontMatter(content);

    if (frontMatter.globs) {
      frontMatter.paths = transformGlobsToPaths(frontMatter.globs);
      delete frontMatter.globs;
    }

    const transformed = serializeFrontMatter(frontMatter) + '\n' + body;
    await writeFile(join(targetDir, 'ignore.mdc'), transformed);
    console.log(`  Copied ignore.mdc (transformed globs -> paths)`);
  }

  console.log(`\nClaude rules installed to ${targetDir}`);
}

async function main() {
  const cwd = process.cwd();

  console.log('AI Rules Installer\n');

  try {
    const target = await getTarget();

    console.log(`\nInstalling rules for ${target}...\n`);

    if (target === 'cursor') {
      await copyForCursor(cwd);
    } else {
      await copyForClaude(cwd);
    }

    console.log('\nDone!');
  } catch (error) {
    if (error.name === 'ExitPromptError') {
      console.log('\nCancelled.');
      process.exit(0);
    }
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
