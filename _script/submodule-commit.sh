#!/usr/bin/env bash
set -eu
set -E
# set -x
# set -o pipefail

echo ">>> Pull the submodule."
git pull

changes="$(git status --short)"

echo '>>> Test for existance of files to stage.'
if [ -z "${changes}" ]; then
    exit 0
fi

echo ">>> Type the commit message, followed by [ENTER]:"
read -r commit_message

echo '>>> Stage and commit the submodule.'
git add .
git commit -m "${commit_message}"

submodule_name="$(basename ${PWD})"
submodule_declared_branch="$(cd .. && git config -f .gitmodules submodule.${submodule_name}.branch)"
submodule_actual_branch="$(git symbolic-ref --short HEAD)"

echo '>>> Test for a submodule branch name match.'
if [ "${submodule_declared_branch}" != "${submodule_actual_branch}" ]; then
    exit 0
fi

echo '>>> Stage and commit superproject.'
cd ..
git stash || true
git add "${submodule_name}"
git commit -m "[${submodule_name}, ${submodule_declared_branch}] ${commit_message}"
git stash pop || true

#####################
## Unused snippets ##
#####################

#commit_message=${1:-}

#if [ -z "$commit_message" ]; then
#    echo "usage: $0 COMMIT_MESSAGE"
#    exit 1
#fi