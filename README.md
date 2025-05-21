# Cursor Rules Examples

This repository contains example Cursor rules files that demonstrate best practices and common use cases for [Cursor](https://cursor.com) rules.

## What are Cursor Rules?

Cursor Rules are a powerful way to provide system-level guidance to the AI in Cursor. They help encode context, preferences, and workflows for your projects. Rules can be:

- Project Rules: Stored in `.cursor/rules`, version-controlled and scoped to your codebase
- User Rules: Global to your Cursor environment, defined in settings
- Legacy Rules: Using `.cursorrules` (deprecated)

## Repository Structure

```
.cursor/
  └── rules/           # Contains all rule files
      ├── always/      # Rules that are always included
      ├── auto/        # Rules that are automatically attached based on file patterns
      └── manual/      # Rules that must be explicitly referenced
```

## Rule Types

1. **Always Rules**
   - Automatically included in every context
   - Use for project-wide standards and conventions

2. **Auto Attached Rules**
   - Included when files matching specified patterns are referenced
   - Great for language or framework-specific guidelines

3. **Manual Rules**
   - Only included when explicitly referenced using @ruleName
   - Perfect for specialized workflows or templates

## Example Rules

Each rule file is written in MDC (`.mdc`) format, which supports metadata and content in a single file. Here's a basic example:

```mdc
---
description: React Component Standards
globs: ["**/*.tsx"]
alwaysApply: false
---

- Use functional components
- Follow atomic design principles
- Implement proper TypeScript types
- Use Tailwind for styling
```

## Getting Started

1. Clone this repository
2. Copy the relevant rules to your project's `.cursor/rules` directory
3. Customize the rules to match your project's needs


