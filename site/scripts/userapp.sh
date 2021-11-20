#!/bin/sh

script_path=$(realpath $0)
script_dir=$(dirname $script_path)

(
cd $(dirname $script_dir)

# Remove old user files
npm run clean:user
rm -rf ../backend/user-site/*

# Build user site
USER_SUBDOMAIN="{{USER_SUBDOMAIN}}" npm run build:user

# Copy latest build to backend
cp build/user/* ../backend/user-site/
)
