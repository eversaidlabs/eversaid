#!/usr/bin/env bash
# fetch-v0.sh - Fetch and sync v0.dev code into the project
# Location: frontend/v0-utils/fetch-v0.sh

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# ===== CONFIGURATION =====
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"
SRC_DIR="$FRONTEND_DIR/src"
TMP_DIR="$SCRIPT_DIR/.tmp-v0-fetch"
PROTECTED_FILES=("src/app/globals.css")
KEEP_TMP=false

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
Usage: $(basename "$0") --v0url <url> [--filter <path>] [--keep-tmp]

Fetch v0.dev code and sync to project src directory.

Arguments:
  --v0url <url>    Required. The v0 chat URL (e.g., https://v0.dev/chat/b/abc123 or https://v0.app/chat/b/...)
  --filter <path>  Optional. Only copy files matching this pattern. Can be repeated for multiple filters.
  --keep-tmp       Optional. Keep temp directory after sync (useful for debugging)

Examples:
  $(basename "$0") --v0url "https://v0.dev/chat/b/abc123"
  $(basename "$0") --v0url "https://v0.dev/chat/b/abc123" --filter "components/demo"
  $(basename "$0") --v0url "https://v0.dev/chat/b/abc123" --filter "page.tsx" --filter "editable-segment"
  $(basename "$0") --v0url "https://v0.dev/chat/b/abc123" --keep-tmp

Notes:
  - globals.css is always preserved (never overwritten)
  - Identical files are skipped
  - Git will see changes as modifications, not delete+add
  - Temp directory is always cleaned at start of each run
EOF
    exit 1
}

cleanup() {
    if [[ "$KEEP_TMP" == false ]] && [[ -d "$TMP_DIR" ]]; then
        print_info "Cleaning up temp directory..."
        rm -rf "$TMP_DIR"
    elif [[ "$KEEP_TMP" == true ]] && [[ -d "$TMP_DIR" ]]; then
        print_info "Keeping temp directory at: $TMP_DIR"
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
            --keep-tmp)
                KEEP_TMP=true
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
    print_info "Keep tmp: $KEEP_TMP"
    echo ""

    # Always clean existing temp directory at start
    clean_existing_tmp

    # Execute
    setup_temp_project
    fetch_v0_code "$v0url"
    sync_files "${filters[@]}"

    echo ""
    print_success "Done! Run 'git status' to review changes."
}

main "$@"
