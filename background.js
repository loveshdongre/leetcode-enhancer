var browser = browser || chrome;
browser.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
    if (request.message === "activate_icon") {
        browser.pageAction.show(sender.tab.id);
    }
});