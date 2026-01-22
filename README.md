# AI Rules

A collection of AI coding rules for [Cursor](https://cursor.com) and [Claude Code](https://claude.ai/code). Install them instantly with npx.

## Quick Start

```bash
npx ai-rules
```

Select your target (Cursor or Claude Code) from the interactive prompt, or specify directly:

```bash
# Install for Cursor
npx ai-rules --cursor

# Install for Claude Code
npx ai-rules --claude
```

Rules are copied to:
- **Cursor**: `.cursor/rules/`
- **Claude Code**: `.claude/rules/` (with `globs` transformed to `paths`)

## Included Rules

| Rule | Description | Applies To |
|------|-------------|------------|
| `general.mdc` | Code review approach, critical thinking, comment policies | Always |
| `file-structure.mdc` | React/Next.js project structure conventions | Always |
| `javascript-typescript.mdc` | TypeScript strict mode, functional patterns, naming | `**/*.{js,jsx,ts,tsx}` |
| `react.mdc` | React component conventions, hooks, props | React files |
| `styling.mdc` | ITCSS architecture, BEM, CSS Modules, Sass | `**/*.{scss,css,module.scss}` |
| `testing.mdc` | Jest, testing-library, Cypress best practices | `**/*.{test,spec}.{js,jsx,ts,tsx}` |
| `ignore.mdc` | Patterns to exclude from AI context | Always |

## Rule Format

Rules use MDC format with YAML front matter:

```mdc
---
description: Brief description of the rule
globs: **/*.tsx, **/*.ts
alwaysApply: false
---

Your rule content in markdown...
```

### Front Matter Fields

- `description`: Human-readable description
- `globs` / `paths`: File patterns that trigger auto-attachment
- `alwaysApply`: When `true`, rule is always included regardless of file patterns

## Customization

After installation, edit the rules in `.cursor/rules/` or `.claude/rules/` to match your project's conventions.

## Repository Structure

```
.ai/
├── ignore.mdc           # Global ignore patterns
└── rules/
    ├── general.mdc
    ├── file-structure.mdc
    ├── javascript-typescript.mdc
    ├── react.mdc
    ├── styling.mdc
    └── testing.mdc
```
