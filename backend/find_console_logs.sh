#!/bin/bash

search_directory() {
    local dir="$1"
    if [[ ! -d "$dir" ]]; then
        printf "Error: Directory '%s' not found.\n" "$dir" >&2
        return 1
    fi

    find "$dir" -type f -name "*.js" -exec grep -Hn "console\.log" {} + | grep -v "^\s*//"
}

main() {
    local target_dir="${1:-.}"
    search_directory "$target_dir"
}

main "$@"
