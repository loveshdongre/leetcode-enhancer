#!/bin/bash

# Specify the name of the output zip file
OUTPUT_ZIP="my_archive.zip"

# Specify the files and folders to include in the zip
FILES_AND_FOLDERS=(
  "icons"
  "content-script.css"
  "content-script.js"
  "manifest.json"
  "popup.css"
  "popup.html"
  "popup.js"
  "service-worker.js"
)

# Create the zip file with the specified files and folders
zip -r "$OUTPUT_ZIP" "${FILES_AND_FOLDERS[@]}"

echo "
**********************[IMPORTANT]**************************
***********************************************************
***********************************************************
Hope you have set debugger value to FALSE before deploying
***********************************************************
***********************************************************
**********************[IMPORTANT]**************************"
