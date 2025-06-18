# Git Hooks Configuration

This project uses [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged) to maintain code quality.

## What happens on commit?

When you run `git commit`, the following checks are automatically executed:

### Pre-commit Hook (`pre-commit`)

- **Biome Linting & Formatting**: Runs `@biomejs/biome check --write` on all staged files
- **File Types Checked**: `.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.css`, `.md`
- **Automatic Fixes**: Code formatting and import organization are automatically applied
- **Quality Checks**: Linting rules are enforced (commit will fail if there are errors)

## Manual Commands

You can run these checks manually:

```bash
# Check all files with Biome (CI mode - no fixes)
npm run lint:check

# Fix all files with Biome
npm run lint:fix

# Run lint-staged on currently staged files
npx lint-staged
```

## What if the commit fails?

If your commit fails due to linting errors:

1. **Review the error messages** - they'll tell you exactly what needs to be fixed
2. **Run `npm run lint:fix`** - this will auto-fix most issues
3. **Manually fix any remaining issues** that can't be auto-fixed
4. **Stage your changes again** with `git add .`
5. **Retry your commit**

## Benefits

- 🚫 **Prevents bad code** from being committed
- 🔧 **Auto-fixes formatting** issues
- 📏 **Enforces consistent code style** across the team
- 🚀 **Ensures CI passes** by catching issues early
- ⚡ **Fast execution** - only checks staged files, not the entire codebase

## Bypassing (Emergency Only)

In rare cases where you need to bypass the checks:

```bash
git commit --no-verify -m "Emergency commit message"
```

**⚠️ Warning**: Only use `--no-verify` in true emergencies, as it skips all quality checks.
