#!/usr/bin/env bash
set -euo pipefail

BASE="${1:-c622aa4}"
TIP="${2:-backup-with-cursor-coauthor}"
AUTHOR_NAME="AmirMatin"
AUTHOR_EMAIL="amirmatinjamshidi@gmail.com"

new_parent="$BASE"

while IFS= read -r commit; do
  tree=$(git show -s --format=%T "$commit")
  subject=$(git show -s --format=%s "$commit")
  author_date=$(git show -s --format=%aI "$commit")
  committer_date=$(git show -s --format=%cI "$commit")

  export GIT_AUTHOR_NAME="$AUTHOR_NAME"
  export GIT_AUTHOR_EMAIL="$AUTHOR_EMAIL"
  export GIT_COMMITTER_NAME="$AUTHOR_NAME"
  export GIT_COMMITTER_EMAIL="$AUTHOR_EMAIL"
  export GIT_AUTHOR_DATE="$author_date"
  export GIT_COMMITTER_DATE="$committer_date"

  new_commit=$(printf '%s\n' "$subject" | git commit-tree "$tree" -p "$new_parent")
  new_parent="$new_commit"
  echo "rewrote: $subject"
done < <(git rev-list --reverse "$BASE".."$TIP")

git reset --hard "$new_parent"
echo "done: $new_parent"
