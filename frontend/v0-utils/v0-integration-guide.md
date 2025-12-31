# v0.dev Integration Guide

## Why This Exists

v0.dev generates components that work in v0's relaxed TypeScript preview but fail in our `strict: true` build. This is normal integration work, not a bug.

## Architecture

- **v0 components** (`components/`): Presentation only - receive props, render UI
- **Your code** (`features/`, `app/`): State, API calls, business logic

Once exported, v0 code is YOUR code. Don't treat it as sacred.

## Workflow

```bash
# 1. Generate in v0.dev

# 2. Export using fetch-v0.sh script
./v0-utils/fetch-v0.sh --v0url "https://v0.dev/chat/b/[CHAT_ID]"

# 3. Fix TypeScript errors
npx tsc --noEmit
# - Make props optional (?) when parent might not provide them
# - Use optional chaining: onClick?.()
# - Destructure API responses: const { data } = await apiCall()

# 4. Commit
git add . && git commit -m "feat: import v0 [component-name]"

# 5. NEVER regenerate in v0 after manual changes - it's yours now
```

## fetch-v0.sh Script

Automates v0 code fetching with git-friendly file replacement and selective syncing.

### Usage

```bash
./v0-utils/fetch-v0.sh --v0url <url> [--filter <pattern>...] [--keep-tmp]
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `--v0url <url>` | Yes | v0.dev or v0.app chat URL |
| `--filter <pattern>` | No | Substring filter. Repeatable for multiple files |
| `--keep-tmp` | No | Keep temp directory after sync (for debugging) |

### Examples

```bash
# Sync all files (except globals.css)
./v0-utils/fetch-v0.sh --v0url "https://v0.app/chat/b/abc123?token=..."

# Sync only specific files
./v0-utils/fetch-v0.sh --v0url "https://v0.app/chat/b/abc123?token=..." \
  --filter "editable-segment-list" \
  --filter "app/demo/page" \
  --filter "live-transcript-preview"

# Sync a directory
./v0-utils/fetch-v0.sh --v0url "https://v0.app/chat/b/abc123?token=..." \
  --filter "components/demo"

# Debug mode - keep temp directory
./v0-utils/fetch-v0.sh --v0url "https://v0.app/chat/b/abc123?token=..." --keep-tmp
```

### Features

- **Git-friendly**: Uses `cp` to overwrite files, so git sees modifications not delete+add
- **Protected files**: `src/app/globals.css` is never overwritten
- **Smart skipping**: Identical files are skipped automatically
- **Multi-filter**: Use multiple `--filter` flags to sync specific files

## When to Go Back to v0

| Issue Type | Action |
|------------|--------|
| Visual (colors, layout, spacing) | Go back to v0 |
| TypeScript errors | Fix manually |
| Component structure rework | Go back to v0 |
| Callback signatures, optional props | Fix manually |

## Common Fixes

**Missing optional marker:**
```typescript
// Before: onAction: () => void
// After:  onAction?: () => void
// Usage:  <button onClick={() => onAction?.()}>
```

**API response destructuring:**
```typescript
// Before: const response = await apiCall()
// After:  const { data: response } = await apiCall()
```

## v0 Prompt Addition (Recommended)

Add to prompts for complex components:

```
This is a PRESENTATION component only.
- All data comes via props (no API calls, no fetch)
- All actions go via callback props (onClick, onSubmit, etc.)
- Internal useState only for UI state (dropdowns, modals) not business data
```

---

*Last updated: December 2025*