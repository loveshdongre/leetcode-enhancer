#!/bin/bash

# Navigate to the directory containing the script file if needed
# cd /path/to/your/scripts/directory

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