// here jquery is provided by leetcode

// don't need to write $(document).ready because content scripts is loaded after the page is loaded
var browser = browser || chrome

// if saved data exist then call cleanDataThenApplyChanges
browser.storage.local.get(["options"], unpack_UpdatePopup_ApplyChanges)

browser.runtime.onMessage.addListener(function(response, sender, sendResponse) {
    ops = []
    for(option of response.options) {
        ops.push(option);
    }
    saveLocally(ops);
    applyChanges(ops);
});

function applyChanges(options) {
    for(option of options) {
        console.log(option);
    }
}

function saveLocally(options) {
    browser.storage.local.set({options});
}

function unpack_UpdatePopup_ApplyChanges(options) {

    

    applyChanges(options.options);
}