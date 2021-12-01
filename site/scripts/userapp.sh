#!/bin/sh

script_path=$(realpath $0)
script_dir=$(dirname $script_path)

(
cd $(dirname $script_dir)

# Remove old user files
npm run clean:user
rm -rf ../backend/templates/*

# Build user site
export USER_SUBDOMAIN="{{USER_SUBDOMAIN}}"
export USER_AVATAR="{{USER_AVATAR}}"
export USER_LINKS="{{USER_LINKS}}"

npm run build:user-onchain
npm run build:user-allinone

# Copy latest build to backend
cp -r build/user/* ../backend/templates/
)
