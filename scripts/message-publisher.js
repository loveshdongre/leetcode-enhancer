const print = require('./debugger.js');

/**
 * Sends a message to the background script (service-worker) or other parts of the extension.
 * @param {Object} payload - The message payload to send.
 */
function sendMessage(payload) {
    var browser = browser || chrome;
    if (!browser || !browser.runtime) {
        print('Browser API not available');
        return;
    }

    try {
        browser.runtime.sendMessage(payload);
    } catch (err) {
        print(`Failed to send message: ${JSON.stringify(payload)} because of the following error: ${err}`);
    }
}

// Export the sendMessage function
module.exports = sendMessage;
