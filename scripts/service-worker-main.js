const { CHROME_APP_PAGE_URL, FIREFOX_APP_PAGE_URL, MESSAGE_ACTIVATE_ICON } = require("./constants");

// Detect browser type
const isFirefox = typeof browser !== 'undefined';

// Get the appropriate API
var browser = browser || chrome;

// enable popup button when content script sends notification
browser.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === MESSAGE_ACTIVATE_ICON) {
            if (isFirefox) {
                browser.action.show(sender.tab.id);
            } else {
                browser.action.enable(sender.tab.id);
            }
        }
    }
);

// uninstall feedback redirect
if(isFirefox) {
    browser.runtime.setUninstallURL(FIREFOX_APP_PAGE_URL);
} else {
    browser.runtime.setUninstallURL(CHROME_APP_PAGE_URL);
}
