# fetch-v0.sh

Automates v0.dev code fetching with diff report preview and git-friendly file replacement.

## Quick Start

```bash
# Preview changes (dry-run, default)
./v0-utils/fetch-v0.sh --v0url "https://v0.app/chat/b/abc123?token=..."

# Apply changes
./v0-utils/fetch-v0.sh --v0url "https://v0.app/chat/b/abc123?token=..." --sync
```

## Usage

```bash
./v0-utils/fetch-v0.sh --v0url <url> [--filter <pattern>...] [--sync] [--clean]
```

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `--v0url <url>` | Yes | v0.dev or v0.app chat URL |
| `--filter <pattern>` | No | Substring filter. Repeatable for multiple files |
| `--sync` | No | Actually copy files. Without this, only shows diff report |
| `--clean` | No | Delete temp directory after run. Default keeps it for inspection |

## Examples

```bash
# Dry-run: fetch and show diff report only (default)
./v0-utils/fetch-v0.sh --v0url "https://v0.app/chat/b/abc123?token=..."

# Actually sync files
./v0-utils/fetch-v0.sh --v0url "https://v0.app/chat/b/abc123?token=..." --sync

# Preview changes for specific files
./v0-utils/fetch-v0.sh --v0url "https://v0.app/chat/b/abc123?token=..." \
  --filter "editable-segment-list" \
  --filter "app/demo/page" \
  --filter "live-transcript-preview"

# Filtered sync with cleanup
./v0-utils/fetch-v0.sh --v0url "https://v0.app/chat/b/abc123?token=..." \
  --filter "components/demo" --sync --clean
```

## Diff Report Format

The script outputs a structured diff report for Claude Code to analyze:

```
===== V0 DIFF REPORT =====

SUMMARY:
  ADDED:     1 files
  MODIFIED:  2 files
  IDENTICAL: 0 files

FILES:
  [A] src/components/demo/new-thing.tsx (+85 lines)
  [M] src/components/demo/existing.tsx (+15, -8 lines)
  [=] src/components/ui/button.tsx (identical)
  [P] src/app/globals.css (protected, skipped)

===== DETAILS =====

--- [A] src/components/demo/new-thing.tsx (85 lines) ---
<full file content for new files>

--- [M] src/components/demo/existing.tsx (+15, -8) ---
<unified diff output for modified files>
```

### Status Markers

| Marker | Meaning |
|--------|---------|
| `[A]` | Added - new file not in project |
| `[M]` | Modified - file exists with different content |
| `[=]` | Identical - no changes needed |
| `[P]` | Protected - file is protected from overwrite |

## Features

- **Dry-run by default**: Shows diff report without making changes
- **Diff report**: Structured output for Claude Code to review changes
- **Git-friendly**: Uses `cp` to overwrite files, so git sees modifications not delete+add
- **Protected files**: `src/app/globals.css` is never overwritten
- **Smart skipping**: Identical files are skipped automatically
- **Multi-filter**: Use multiple `--filter` flags to sync specific files
- **Temp directory kept**: By default, fetched files remain in `.tmp-v0-fetch/` for inspection

## Temp Directory

The script fetches v0 code into `v0-utils/.tmp-v0-fetch/`. This directory is:
- Kept by default for inspection (use `--clean` to remove)
- Cleared at the start of each run (fresh fetch every time)
- Ignored by git (in `.gitignore`)

**Contents after run:**
- `src/` - Fetched v0 source files
- `diff-report.txt` - Full diff report (same as stdout, for later analysis)

## How It Works

1. Creates minimal temp project structure (shadcn CLI requirement)
2. Runs `npx shadcn@latest add <url>` in temp directory
3. Compares fetched files against current `src/`
4. Generates diff report
5. If `--sync` specified, copies changed files to `src/`
