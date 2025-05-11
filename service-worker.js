(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const KEY_NAME_OPTIONS = "options";
const APP_NAME = "Leetcode Enhancer";
const MESSAGE_ACTIVATE_ICON = 'activate_icon';
const MESSAGE_GET_CODE = 'get_code'
const FIREFOX_APP_PAGE_URL = "https://addons.mozilla.org/en-US/firefox/addon/leetcode-enhancer/";
const CHROME_APP_PAGE_URL = "https://chrome.google.com/webstore/detail/leetcode-enhancer/gcmncppaaebldbkgkcbojghpmpjkdlmp";

module.exports = {KEY_NAME_OPTIONS, APP_NAME, MESSAGE_ACTIVATE_ICON, FIREFOX_APP_PAGE_URL, CHROME_APP_PAGE_URL, MESSAGE_GET_CODE};
},{}],2:[function(require,module,exports){
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

},{"./constants":1}]},{},[2]);
