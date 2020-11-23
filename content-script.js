// here jquery is provided by leetcode but we used just JS

// don't need to write $(document).ready because content scripts is loaded after the page is loaded
var browser = browser || chrome

// if saved data exist then call unpack_ApplyChanges
browser.storage.local.get(["options"], unpack_ApplyChanges)

browser.runtime.onMessage.addListener(function(response, sender, sendResponse) {
    ops = []
    for(option of response.options) {
        ops.push(option);
    }
    applyChanges(ops);
});

function applyChanges(options) {
    for(option of options) {
        console.log(option);

    }
}

function unpack_ApplyChanges(options) {
    applyChanges(options.options);
}