const print = require('./debugger.js');
const {browser} = require('./utils.js');

/**
 * Sends a message to the background script or other parts of the extension.
 * @param {Object} browser - The browser object (e.g., window.browser or window.chrome).
 * @param {Object} payload - The message payload to send.
 */
function sendMessage(payload) {
    try {
        browser.runtime.sendMessage(payload);
    } catch (err) {
        print(`Failed to send message: ${JSON.stringify(payload)} because of the following error: ${err}`);
    }
}

// Export the sendMessage function
module.exports = sendMessage;
