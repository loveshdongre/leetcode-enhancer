const { CHROME_APP_PAGE_URL, FIREFOX_APP_PAGE_URL, MESSAGE_ACTIVATE_ICON } = require("./constants");

// Detect browser type
const isFirefox = typeof browser !== 'undefined';

// Get the appropriate API
const api = isFirefox ? browser : chrome;

// enable popup button when content script sends notification
api.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === MESSAGE_ACTIVATE_ICON) {
            if (isFirefox) {
                api.action.show(sender.tab.id);
            } else {
                api.action.enable(sender.tab.id);
            }
        }
    }
);

// uninstall feedback redirect
if(isFirefox) {
    api.runtime.setUninstallURL(FIREFOX_APP_PAGE_URL);
} else {
    api.runtime.setUninstallURL(CHROME_APP_PAGE_URL);
}
