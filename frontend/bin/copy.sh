#!/bin/bash

# Check if correct number of arguments are provided
if [ "$#" -ne 3 ]; then
  echo "Usage: $0 TEMPLATE TARGET NAME"
  exit 1
fi

TEMPLATE=$1
TARGET=$2
NAME=$3

# Check if template directory exists
if [ ! -d ".template/$TEMPLATE" ]; then
  echo "Template directory .template/$TEMPLATE does not exist"
  exit 1
fi

# Create target directory if it does not exist
mkdir -p "$TARGET/$NAME"

# Copy template to target
cp -r ".template/$TEMPLATE/"* "$TARGET/$NAME"

# Rename files and replace content
for file in $(find "$TARGET/$NAME" -type f); do
  new_file=$(echo "$file" | sed "s/$TEMPLATE/$NAME/g")
  mv "$file" "$new_file"
  sed -i "s/$TEMPLATE/$NAME/g" "$new_file"
done

echo "Template $TEMPLATE has been copied to $TARGET/$NAME and renamed to $NAME"