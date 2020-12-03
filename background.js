var browser = browser || chrome;

// enable popup btn when on correct url
browser.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    if (request.message === "activate_icon") {
        browser.pageAction.show(sender.tab.id);
    }
});

// uninstall feedback redirect
var isFirefox = typeof InstallTrigger !== 'undefined';
if(isFirefox) {
    browser.runtime.setUninstallURL("https://addons.mozilla.org/en-US/firefox/addon/leetcode-enhancer/"); // mozilla feedback url
}
else {
    browser.runtime.setUninstallURL("https://chrome.google.com/webstore/detail/leetcode-enhancer/gcmncppaaebldbkgkcbojghpmpjkdlmp");
}
