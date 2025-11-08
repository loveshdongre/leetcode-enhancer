const printToConsole = require('./debugger.js');
let browser = window.browser || window.chrome;

/**
 * Checks if an object is iterable.
 * @param {Object} obj - The object to check.
 * @returns {boolean} - True if the object is iterable, false otherwise.
 */
function isIterable(obj) {
    if(obj != null && typeof obj[Symbol.iterator] === 'function')
        return true;
    printToConsole(`${JSON.stringify(obj)} is not iterable`)
}

function storeDataWithObjectWrapping(key, value) {
    const data = {};
    data[key] = value;
    storeData(data);
}

function storeData(data) {
    browser.storage.local.set(data);
}
 

function getData(key, callback) {
    try {
        browser.storage.local.get([key], result => callback(result[key]));
    }
    catch (err) {
        printToConsole("Error while retrieving key");
    }
}

async function getDataAsUint8Array(key) {
    return new Uint8Array((await browser.storage.local.get(key))[key] || []);
}

// Export the isIterable function using CommonJS syntax
module.exports = {isIterable, storeDataWithObjectWrapping, getData, getDataAsUint8Array, storeData};