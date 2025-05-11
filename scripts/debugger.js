// debugger.js
const {APP_NAME} = require('./constants');
// Set the debug mode (true to enable debugging)
const debug = false;

/**
 * Prints a message to the console if debugging is enabled.
 * @param {string} message - The message to print.
 */
function print(message) {
    if (debug) {
        console.log(`[${APP_NAME}]: ${message}`);
    }
}

// Export the print function
module.exports = print;
