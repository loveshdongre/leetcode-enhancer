#!/bin/bash

echo "Deleting existing deployment directory..."
rm -rf deployment

# Run browserify to bundle the scripts
echo "Running browserify..."

# Run the Browserify command
browserify scripts/content-script-main.js -o content-script.js
browserify scripts/popup-main.js -o popup.js
browserify scripts/service-worker-main.js -o service-worker.js

# Confirm success or output an error if Browserify is not installed
if [ $? -eq 0 ]; then
    echo "Browserify succeeded"
else
    echo "Error: Browserify command failed. Ensure Browserify is installed and try again."
fi

# Create deployment directories
echo "Creating deployment directories..."
mkdir -p deployment/chrome
mkdir -p deployment/firefox

# Define files and folders to copy
FOLDERS=("icons")
FILES=("content-script.css" "content-script.js" "service-worker.js" "popup.html" "popup.css" "popup.js")

# Create Chrome deployment
echo "Creating Chrome deployment..."
# Copy folders
for folder in "${FOLDERS[@]}"; do
    cp -r "$folder" deployment/chrome/
done

# Copy files
for file in "${FILES[@]}"; do
    cp "$file" deployment/chrome/
done

# Copy Chrome manifest
cp manifest-chrome.json deployment/chrome/manifest.json

# Verify Chrome deployment
echo "Verifying Chrome deployment..."
ls -la deployment/chrome/
echo "Chrome deployment files copied successfully!"

# Create Firefox deployment
echo "Creating Firefox deployment..."
# Copy folders
for folder in "${FOLDERS[@]}"; do
    cp -r "$folder" deployment/firefox/
done

# Copy files
for file in "${FILES[@]}"; do
    cp "$file" deployment/firefox/
done

# Copy Firefox manifest
cp manifest-firefox.json deployment/firefox/manifest.json

# Verify Firefox deployment
echo "Verifying Firefox deployment..."
ls -la deployment/firefox/
echo "Firefox deployment files copied successfully!"

# Create zip files
echo "Creating zip files..."
cd deployment
zip -r chrome.zip chrome/
cd firefox
zip -r ../firefox.zip ./*
cd ../..

echo "Deployment packages created in deployment directory!"

echo "
**********************[IMPORTANT]**************************
***********************************************************
***********************************************************
Hope you have set debugger value to FALSE before deploying
***********************************************************
***********************************************************
**********************[IMPORTANT]**************************"
