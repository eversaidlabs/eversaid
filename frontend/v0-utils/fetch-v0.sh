#!/usr/bin/env bash
# fetch-v0.sh - Fetch and sync v0.dev code into the project
# Location: frontend/v0-utils/fetch-v0.sh

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# ===== CONFIGURATION =====
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
SRC_DIR="$FRONTEND_DIR/src"
TMP_DIR="$SCRIPT_DIR/.tmp-v0-fetch"
DIFF_REPORT_FILE="$TMP_DIR/diff-report.txt"
PROTECTED_FILES=("src/app/globals.css")
CLEAN_TMP=false
SYNC_MODE=false

# ===== COLOR OUTPUT =====
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ===== FUNCTIONS =====

print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[OK]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }

usage() {
    cat << EOF
Usage: $(basename "$0") --v0url <url> [--filter <path>] [--sync] [--clean]

Fetch v0.dev code and show diff report. Use --sync to apply changes.

Arguments:
  --v0url <url>    Required. The v0 chat URL (e.g., https://v0.dev/chat/b/abc123 or https://v0.app/chat/b/...)
  --filter <path>  Optional. Only process files matching this pattern. Can be repeated for multiple filters.
  --sync           Optional. Actually copy files to src. Without this, only shows diff report (dry-run).
  --clean          Optional. Delete temp directory after run. Default keeps it for inspection.

Examples:
  # Dry-run: fetch and show diff report only (default)
  $(basename "$0") --v0url "https://v0.dev/chat/b/abc123"

  # Actually sync the files
  $(basename "$0") --v0url "https://v0.dev/chat/b/abc123" --sync

  # Dry-run with filter
  $(basename "$0") --v0url "https://v0.dev/chat/b/abc123" --filter "components/demo"

  # Filtered sync and cleanup temp
  $(basename "$0") --v0url "https://v0.dev/chat/b/abc123" --filter "page.tsx" --filter "editable-segment" --sync --clean

Notes:
  - Default is dry-run (diff report only)
  - Temp directory is kept by default for inspection (use --clean to remove)
  - globals.css is always preserved (never overwritten)
  - Identical files are skipped
  - Git will see changes as modifications, not delete+add
EOF
    exit 1
}

cleanup() {
    if [[ "$CLEAN_TMP" == true ]] && [[ -d "$TMP_DIR" ]]; then
        print_info "Cleaning up temp directory..."
        rm -rf "$TMP_DIR"
    elif [[ -d "$TMP_DIR" ]]; then
        print_info "Temp directory kept at: $TMP_DIR"
    fi
}

# Trap to ensure cleanup on exit (success or failure)
trap cleanup EXIT

validate_url() {
    local url="$1"
    if [[ ! "$url" =~ ^https://v0\.(dev|app)/chat/b/ ]]; then
        print_error "Invalid v0 URL format. Expected: https://v0.dev/chat/b/<id> or https://v0.app/chat/b/<id>"
        exit 1
    fi
}

files_are_identical() {
    local file1="$1"
    local file2="$2"

    if [[ -f "$file1" ]] && [[ -f "$file2" ]]; then
        if diff -q "$file1" "$file2" > /dev/null 2>&1; then
            return 0  # Files are identical
        fi
    fi
    return 1  # Files differ or one doesn't exist
}

is_protected_file() {
    local relative_path="$1"
    for protected in "${PROTECTED_FILES[@]}"; do
        if [[ "$relative_path" == "$protected" ]]; then
            return 0
        fi
    done
    return 1
}

matches_filter() {
    local path="$1"
    shift
    local filters=("$@")

    # No filters = match all
    if [[ ${#filters[@]} -eq 0 ]]; then
        return 0
    fi

    # Match if ANY filter matches
    for f in "${filters[@]}"; do
        if [[ "$path" == *"$f"* ]]; then
            return 0
        fi
    done
    return 1
}

clean_existing_tmp() {
    if [[ -d "$TMP_DIR" ]]; then
        print_info "Removing existing temp directory..."
        rm -rf "$TMP_DIR"
    fi
}

setup_temp_project() {
    print_info "Setting up temporary project directory..."

    mkdir -p "$TMP_DIR/src/app"
    mkdir -p "$TMP_DIR/src/components"
    mkdir -p "$TMP_DIR/src/lib"

    # Copy components.json (shadcn needs this)
    cp "$FRONTEND_DIR/components.json" "$TMP_DIR/components.json"

    # Create minimal package.json
    cat > "$TMP_DIR/package.json" << 'PKGJSON'
{
  "name": "v0-temp-fetch",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  }
}
PKGJSON

    # Create minimal tsconfig.json (shadcn needs this for path resolution)
    cat > "$TMP_DIR/tsconfig.json" << 'TSCONFIG'
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
TSCONFIG

    # Create a placeholder globals.css (shadcn may try to modify it)
    touch "$TMP_DIR/src/app/globals.css"

    # Create minimal next.config.ts
    cat > "$TMP_DIR/next.config.ts" << 'NEXTCONFIG'
import type { NextConfig } from "next";
const nextConfig: NextConfig = {};
export default nextConfig;
NEXTCONFIG
}

fetch_v0_code() {
    local url="$1"

    print_info "Fetching v0 code from: $url"
    print_info "This may take a moment..."

    cd "$TMP_DIR"

    # Run shadcn add with the v0 URL
    if ! npx shadcn@latest add "$url" --yes --overwrite 2>&1; then
        print_error "Failed to fetch v0 code. Check the URL and try again."
        exit 1
    fi

    cd "$FRONTEND_DIR"

    print_success "v0 code fetched successfully"
}

count_diff_additions() {
    local diff_output="$1"
    echo "$diff_output" | grep '^+[^+]' 2>/dev/null | wc -l | tr -d ' '
}

count_diff_deletions() {
    local diff_output="$1"
    echo "$diff_output" | grep '^-[^-]' 2>/dev/null | wc -l | tr -d ' '
}

generate_diff_report() {
    local filters=("$@")

    local added_files=()
    local modified_files=()
    local identical_files=()
    local protected_files_list=()

    # Collect file statuses
    while IFS= read -r -d '' tmp_file; do
        local relative_path="${tmp_file#$TMP_DIR/}"
        local dest_file="$FRONTEND_DIR/$relative_path"

        # Skip if doesn't match filter
        if ! matches_filter "$relative_path" "${filters[@]}"; then
            continue
        fi

        # Check protected
        if is_protected_file "$relative_path"; then
            protected_files_list+=("$relative_path")
            continue
        fi

        # Categorize file
        if [[ ! -f "$dest_file" ]]; then
            added_files+=("$relative_path")
        elif files_are_identical "$tmp_file" "$dest_file"; then
            identical_files+=("$relative_path")
        else
            modified_files+=("$relative_path")
        fi

    done < <(find "$TMP_DIR/src" -type f -print0 2>/dev/null)

    # Generate report to file first
    {
        echo ""
        echo "===== V0 DIFF REPORT ====="
        echo ""
        echo "SUMMARY:"
        echo "  ADDED:     ${#added_files[@]} files"
        echo "  MODIFIED:  ${#modified_files[@]} files"
        echo "  IDENTICAL: ${#identical_files[@]} files"
        if [[ ${#protected_files_list[@]} -gt 0 ]]; then
            echo "  PROTECTED: ${#protected_files_list[@]} files"
        fi
        echo ""

        # Print file list
        echo "FILES:"
        for f in "${added_files[@]}"; do
            local lines
            lines=$(wc -l < "$TMP_DIR/$f" | tr -d ' ')
            echo "  [A] $f (+${lines} lines)"
        done
        for f in "${modified_files[@]}"; do
            local diff_output additions deletions
            diff_output=$(diff -u "$FRONTEND_DIR/$f" "$TMP_DIR/$f" 2>/dev/null || true)
            additions=$(count_diff_additions "$diff_output")
            deletions=$(count_diff_deletions "$diff_output")
            echo "  [M] $f (+${additions}, -${deletions} lines)"
        done
        for f in "${identical_files[@]}"; do
            echo "  [=] $f (identical)"
        done
        for f in "${protected_files_list[@]}"; do
            echo "  [P] $f (protected, skipped)"
        done

        # Print details for added and modified files
        if [[ ${#added_files[@]} -gt 0 ]] || [[ ${#modified_files[@]} -gt 0 ]]; then
            echo ""
            echo "===== DETAILS ====="

            for f in "${added_files[@]}"; do
                local lines
                lines=$(wc -l < "$TMP_DIR/$f" | tr -d ' ')
                echo ""
                echo "--- [A] $f (${lines} lines) ---"
                cat "$TMP_DIR/$f"
            done

            for f in "${modified_files[@]}"; do
                local diff_output additions deletions
                diff_output=$(diff -u "$FRONTEND_DIR/$f" "$TMP_DIR/$f" 2>/dev/null || true)
                additions=$(count_diff_additions "$diff_output")
                deletions=$(count_diff_deletions "$diff_output")
                echo ""
                echo "--- [M] $f (+${additions}, -${deletions}) ---"
                echo "$diff_output"
            done
        fi

        echo ""
    } > "$DIFF_REPORT_FILE"

    # Output to stdout
    cat "$DIFF_REPORT_FILE"

    print_info "Diff report saved to: $DIFF_REPORT_FILE"

    # Return whether there are changes
    if [[ ${#added_files[@]} -gt 0 ]] || [[ ${#modified_files[@]} -gt 0 ]]; then
        return 0  # Has changes
    else
        return 1  # No changes
    fi
}

sync_files() {
    local filters=("$@")

    print_info "Syncing files to main src directory..."

    local copied=0
    local skipped_identical=0
    local skipped_protected=0
    local skipped_filter=0

    # Find all files in the temp src directory
    while IFS= read -r -d '' tmp_file; do
        # Get relative path from src directory
        local relative_path="${tmp_file#$TMP_DIR/}"
        local dest_file="$FRONTEND_DIR/$relative_path"

        # Skip if doesn't match filter
        if ! matches_filter "$relative_path" "${filters[@]}"; then
            ((skipped_filter++)) || true
            continue
        fi

        # Skip protected files
        if is_protected_file "$relative_path"; then
            print_warning "Protected: $relative_path (skipped)"
            ((skipped_protected++)) || true
            continue
        fi

        # Skip if files are identical
        if files_are_identical "$tmp_file" "$dest_file"; then
            print_info "Identical: $relative_path (skipped)"
            ((skipped_identical++)) || true
            continue
        fi

        # Ensure destination directory exists
        local dest_dir
        dest_dir="$(dirname "$dest_file")"
        mkdir -p "$dest_dir"

        # Check if this is an update or new file
        if [[ -f "$dest_file" ]]; then
            # Copy file (overwrites if exists - git sees as modification)
            cp "$tmp_file" "$dest_file"
            print_success "Updated: $relative_path"
        else
            cp "$tmp_file" "$dest_file"
            print_success "Created: $relative_path"
        fi
        ((copied++)) || true

    done < <(find "$TMP_DIR/src" -type f -print0 2>/dev/null)

    echo ""
    print_info "===== SYNC SUMMARY ====="
    print_success "Files copied/updated: $copied"
    print_info "Files skipped (identical): $skipped_identical"
    print_info "Files skipped (protected): $skipped_protected"
    if [[ ${#filters[@]} -gt 0 ]]; then
        print_info "Files skipped (filter): $skipped_filter"
    fi
}

# ===== MAIN =====

main() {
    local v0url=""
    local filters=()

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --v0url)
                v0url="$2"
                shift 2
                ;;
            --filter)
                filters+=("$2")
                shift 2
                ;;
            --clean)
                CLEAN_TMP=true
                shift
                ;;
            --sync)
                SYNC_MODE=true
                shift
                ;;
            -h|--help)
                usage
                ;;
            *)
                print_error "Unknown option: $1"
                usage
                ;;
        esac
    done

    # Validate required arguments
    if [[ -z "$v0url" ]]; then
        print_error "Missing required argument: --v0url"
        usage
    fi

    validate_url "$v0url"

    # Show what we're about to do
    echo ""
    print_info "===== V0 FETCH CONFIGURATION ====="
    print_info "v0 URL: $v0url"
    if [[ ${#filters[@]} -eq 0 ]]; then
        print_info "Filter: <none - all files>"
    else
        print_info "Filters: ${filters[*]}"
    fi
    print_info "Target: $SRC_DIR"
    print_info "Protected: ${PROTECTED_FILES[*]}"
    if [[ "$SYNC_MODE" == true ]]; then
        print_info "Mode: SYNC (will apply changes)"
    else
        print_warning "Mode: DRY-RUN (use --sync to apply changes)"
    fi
    if [[ "$CLEAN_TMP" == true ]]; then
        print_info "Cleanup: temp directory will be deleted after run"
    fi
    echo ""

    # Always clean existing temp directory at start
    clean_existing_tmp

    # Execute
    setup_temp_project
    fetch_v0_code "$v0url"

    # Generate and show diff report
    local has_changes=true
    if ! generate_diff_report "${filters[@]}"; then
        has_changes=false
    fi

    # Sync files if --sync was specified
    if [[ "$SYNC_MODE" == true ]]; then
        if [[ "$has_changes" == true ]]; then
            sync_files "${filters[@]}"
            echo ""
            print_success "Done! Run 'git status' to review changes."
        else
            print_info "No changes to sync."
        fi
    else
        if [[ "$has_changes" == true ]]; then
            print_info "Dry-run complete. Use --sync to apply these changes."
        else
            print_info "No changes detected."
        fi
    fi
}

main "$@"
