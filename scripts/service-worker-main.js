const { CHROME_APP_PAGE_URL, FIREFOX_APP_PAGE_URL, MESSAGE_ACTIVATE_ICON } = require("./constants");

var browser = browser || chrome;

// enable popup button when content script sends notification
browser.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    if (request.message === MESSAGE_ACTIVATE_ICON) {
        browser.pageAction?.show(sender.tab.id);
    }
});

// uninstall feedback redirect
var isFirefox = typeof InstallTrigger !== 'undefined';

if(isFirefox) {
    browser.runtime.setUninstallURL(FIREFOX_APP_PAGE_URL);
}
else {
    browser.runtime.setUninstallURL(CHROME_APP_PAGE_URL);
}
