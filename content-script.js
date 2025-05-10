(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const KEY_NAME_OPTIONS = "options";
const APP_NAME = "Leetcode Enhancer";
const MESSAGE_ACTIVATE_ICON = 'activate_icon';
const MESSAGE_GET_CODE = 'get_code'
const FIREFOX_APP_PAGE_URL = "https://addons.mozilla.org/en-US/firefox/addon/leetcode-enhancer/";
const CHROME_APP_PAGE_URL = "https://chrome.google.com/webstore/detail/leetcode-enhancer/gcmncppaaebldbkgkcbojghpmpjkdlmp";

module.exports = {KEY_NAME_OPTIONS, APP_NAME, MESSAGE_ACTIVATE_ICON, FIREFOX_APP_PAGE_URL, CHROME_APP_PAGE_URL, MESSAGE_GET_CODE};
},{}],2:[function(require,module,exports){
const sendMessage = require('./message-publisher.js');
const findMode = require('./page-checker.js');
const initMutationObserver = require('./mutation-observer.js');
const {isIterable} = require('./utils.js');
const Mode = require('./mode.js');
const print = require('./debugger.js');
const { MESSAGE_ACTIVATE_ICON, MESSAGE_GET_CODE } = require('./constants.js');
const { FeatureStrategyFactory } = require('./feature-strategies.js');

const browser = window.browser || window.chrome;
let mode = findMode();
let currentStrategy = FeatureStrategyFactory.getStrategy(mode);

// publish message to background script (i.e. service worker) for activating icon
sendMessage({ message: MESSAGE_ACTIVATE_ICON });

// init mutation observer
initMutationObserver(browser, mode, modifyThenApplyChanges);

function modifyThenApplyChanges(options) {
    if(!isIterable(options.options))
        return;
    applyChanges(options.options);
}

// ################### EVENT LISTENER #####################
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    print(`Received Notification in content script: ${JSON.stringify(request)}`);
    if(request.options) {
        ops = []
        for (option of request.options) {
            ops.push(option);
        }
        applyChanges(ops);
    }

    if (request.action === MESSAGE_GET_CODE) {
        const code = getUserCode();
        sendResponse({ code: code });
    }
});

function applyChanges(options) {
    if (!currentStrategy) {
        print('No strategy found for current mode');
        return;
    }

    for (option of options) {
        let name = option.optionName;
        if (name === 'locked') {
            currentStrategy.hideLockedProblems(option.checked);
        } else if (name === 'highlight') {
            currentStrategy.highlightSolvedProblems(option.checked);
        } else if (name === 'solved') {
            currentStrategy.hideSolvedProb(option.checked);
        } else if(name === 'disUsers') {
            currentStrategy.setSolutionsUsers(option.checked);
        } else {
            currentStrategy.toggleByColName(name, option.checked);
        }
    }
}

function getUserCode() {
    if (!currentStrategy) {
        print('Unable to read the code. If you are seeing this error in code editor page, please report this issue.');
        return '';
    }
    return currentStrategy.getUserCode();
}
},{"./constants.js":1,"./debugger.js":3,"./feature-strategies.js":4,"./message-publisher.js":5,"./mode.js":6,"./mutation-observer.js":7,"./page-checker.js":8,"./utils.js":14}],3:[function(require,module,exports){
// debugger.js
const {APP_NAME} = require('./constants');
// Set the debug mode (true to enable debugging)
const debug = false;

/**
 * Prints a message to the console if debugging is enabled.
 * @param {string} message - The message to print.
 */
function print(message) {
    if (debug) {
        console.log(`[${APP_NAME}]: ${message}`);
    }
}

// Export the print function
module.exports = print;

},{"./constants":1}],4:[function(require,module,exports){
const FeatureStrategy = require('./strategies/base-strategy');
const FeatureStrategyFactory = require('./strategies/strategy-factory');

module.exports = {
    FeatureStrategy,
    FeatureStrategyFactory
}; 
},{"./strategies/base-strategy":9,"./strategies/strategy-factory":13}],5:[function(require,module,exports){
const print = require('./debugger.js');

/**
 * Sends a message to the background script (service-worker) or other parts of the extension.
 * @param {Object} payload - The message payload to send.
 */
function sendMessage(payload) {
    const browserAPI = window.browser || window.chrome;
    if (!browserAPI || !browserAPI.runtime) {
        print('Browser API not available');
        return;
    }

    try {
        browserAPI.runtime.sendMessage(payload);
    } catch (err) {
        print(`Failed to send message: ${JSON.stringify(payload)} because of the following error: ${err}`);
    }
}

// Export the sendMessage function
module.exports = sendMessage;

},{"./debugger.js":3}],6:[function(require,module,exports){
// ################### MODES #####################
/*
    1 - problem set
    5 - contest
    6 - coding area
*/

const Mode = {
    PROBLEM_SET: 'PROBLEM_SET',
    CODING_AREA: 'CODING_AREA',
    CONTEST: 'CONTEST'
};

module.exports = { Mode };
},{}],7:[function(require,module,exports){
const print = require('./debugger.js');
const { Mode } = require('./mode.js');
const { KEY_NAME_OPTIONS } = require('./constants.js');

const ERROR_IN_MUTATION_OBSERVER_CALLBACK = "Error in MutationObserver callback";
const ERROR_PROBLEM_SET_UI_NOT_FOUND = "Problem Set UI element not found.";
const ERROR_CODING_AREA_NOT_FOUND = "Coding Area element not found.";
const ERROR_BASE_CONTENT_NOT_FOUND = "Base content element and qd-content element not found.";
const ERROR_NO_VALID_MODE = "No valid mode found yet to observe.";

// More specific selectors for better targeting
const SELECTOR_PROBLEM_SET_UI = '#__next';  // Using ID selector for better specificity
const SELECTOR_CODING_AREA = '#__next';     // Using ID selector for better specificity
const SELECTOR_BASE_CONTENT = 'base_content';
const SELECTOR_NEW_CONTEST_PAGE = 'qd-content';

/**
 * Initialize the Mutation Observer.
 */
function initMutationObserver(browser, mode, modifyThenApplyChanges) {
    const observer = new MutationObserver(function (mutations) {
        try {
            if (mutations.length) {   
                browser.storage.local.get([KEY_NAME_OPTIONS], modifyThenApplyChanges);
            }
        } catch (error) {
            print(`${ERROR_IN_MUTATION_OBSERVER_CALLBACK}: ${error}`);
        }
    });

    // Start observing based on mode
    switch (mode) {
        case Mode.PROBLEM_SET:
            const ui = document.querySelector(SELECTOR_PROBLEM_SET_UI);
            if (ui) {
                observer.observe(ui, {
                    childList: true,
                    subtree: true
                });
            } else {
                print(ERROR_PROBLEM_SET_UI_NOT_FOUND);
            }
            break;

        case Mode.CODING_AREA:
            const code_ui = document.querySelector(SELECTOR_CODING_AREA);
            if (code_ui) {
                observer.observe(code_ui, {
                    childList: true,
                    subtree: true
                });
            } else {
                print(ERROR_CODING_AREA_NOT_FOUND);
            }
            break;

        case Mode.CONTEST:
            // Handle old contest page
            const old_contest_page = document.getElementById(SELECTOR_BASE_CONTENT);
            if (old_contest_page) {
                observer.observe(old_contest_page, {
                    childList: true,
                    subtree: true
                });
                break;
            }

            // Handle new contest page
            const new_contest_page = document.getElementById(SELECTOR_NEW_CONTEST_PAGE);
            if (new_contest_page) {
                observer.observe(new_contest_page, {
                    childList: true,
                    subtree: true
                });
            }

            // Handle new contest page sidebar (loads after 2-3 seconds)
            const next_root = document.querySelector('#__next');
            if (next_root) {
                observer.observe(next_root.parentElement, {
                    childList: true,
                    subtree: true
                });
            }

            if (!old_contest_page && !new_contest_page && !next_root) {
                print(ERROR_BASE_CONTENT_NOT_FOUND);
            }
            break;

        default:
            print(ERROR_NO_VALID_MODE);
            break;
    }
    return observer;
}

// Export the function to initialize the observer
module.exports = initMutationObserver;

},{"./constants.js":1,"./debugger.js":3,"./mode.js":6}],8:[function(require,module,exports){
const { Mode } = require('./mode.js');
const print = require('./debugger.js');

// Constant URLs
const PROBLEMSET_URL = '/problemset/';
const PROBLEMS_URL = '/problems/';
const CONTEST_URL = '/contest/';

/**
 * Check if the current URL is for the problem set page.
 * @returns {boolean}
 */
function isProblemSetPage() {
    return window.location.href.includes(PROBLEMSET_URL);
}

/**
 * Check if the current URL is for the coding area.
 * @returns {boolean}
 */
function isCodingArea() {
    return window.location.href.includes(PROBLEMS_URL);
}

/**
 * Check if the current URL is for contests.
 * @returns {boolean}
 */
function isContest() {
    return window.location.href.includes(CONTEST_URL);
}

/**
 * Determine the current mode based on the page type.
 * @returns {Mode} - The detected mode.
 */
function findMode() {
    let mode;
    if (isContest()) {
        mode = Mode.CONTEST;
    } else if (isCodingArea()) {
        mode = Mode.CODING_AREA;
    } else if (isProblemSetPage()) {
        mode = Mode.PROBLEM_SET;
    }
    print(`Current mode value = ${mode}`);
    return mode;
}

module.exports = findMode;

},{"./debugger.js":3,"./mode.js":6}],9:[function(require,module,exports){
class FeatureStrategy {
    hideLockedProblems(checked) {}
    highlightSolvedProblems(checked) {}
    hideSolvedProb(checked) {}
    setSolutionsUsers(checked) {}
    toggleByColName(colName, checked) {}
    getUserCode() { return ''; }
}

module.exports = FeatureStrategy; 
},{}],10:[function(require,module,exports){
const FeatureStrategy = require('./base-strategy');

class CodingAreaStrategy extends FeatureStrategy {

    hideSolvedDiff(checked) {
        const diffCodingArea = document.querySelector('[data-track-load="description_content"]')?.parentElement?.previousElementSibling?.firstChild;
        const diffNext = document.querySelectorAll("a[rel ='noopener noreferrer'] div");

        if (diffCodingArea) {
            diffCodingArea.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        }

        if (diffNext) {
            diffNext.forEach(el => el.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer'));
        }
    }

    hideDiffOfSimilarProb(checked) {
        const allAnchors = document.querySelectorAll('a');
        if (!allAnchors || allAnchors.length === 0) return;

        const urlProb = "https://leetcode.com/problems/";
        const curUrl = urlProb + window.location.pathname.split("/")[2] + "/";
        
        allAnchors.forEach(anchor => {
            if (anchor.href.startsWith(urlProb) && !anchor.href.startsWith(curUrl)) {
                const diffElement = anchor.parentElement?.parentElement?.parentElement?.nextElementSibling;
                if (diffElement) {
                    diffElement.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
                }
            }
        });
    }

    hideStatus(checked) {
        const solvedMarkParent = document.querySelector('[data-track-load="description_content"]')?.parentNode?.previousSibling?.previousSibling?.lastChild;
        if (solvedMarkParent && solvedMarkParent.classList.contains('text-body')) {
            solvedMarkParent.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        }
    }

    hideAcceptance(checked) {
        const parentElement = document.querySelector('[data-track-load="description_content"]')?.parentElement?.nextSibling;
        if (!parentElement) return;

        const acceptanceRateElement = [...parentElement.children]
            .find(child => child.textContent.toLowerCase().includes('acceptance'))?.lastElementChild;

        if (acceptanceRateElement) {
            acceptanceRateElement.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        }
    }

    hideSave(checked) {
        const saveButton = document.querySelector("svg[data-icon='star']");
        if (saveButton) {
            saveButton.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        }
    }

    toggleByColName(colName, checked) {
        if (colName === 'difficulty') {
            this.hideSolvedDiff(checked);
            this.hideDiffOfSimilarProb(checked);
        } else if (colName === 'status') {
            this.hideStatus(checked);
        } else if (colName === 'acceptance') {
            this.hideAcceptance(checked);
        } else if(colName === 'save') {
            this.hideSave(checked);
        }
    }

    getUserCode() {
        const codeEditor = document.querySelector('div.editor-scrollable');
        return codeEditor ? codeEditor.textContent : '';
    }
}

module.exports = CodingAreaStrategy; 
},{"./base-strategy":9}],11:[function(require,module,exports){
const FeatureStrategy = require('./base-strategy');

class ContestStrategy extends FeatureStrategy {
    hideDiffFromContest(checked) {
        
        // old UI
        const diffLabel = document.querySelectorAll('.contest-question-info .list-group .list-group-item:nth-child(5) .label')[0];
        if (diffLabel) {
            diffLabel.style.visibility = checked ? 'visible_leetcode-enhancer' : 'hidden';
            return;
        }

        // new UI
        const easyDiffLabel = document.querySelector('.text-difficulty-easy');
        if (easyDiffLabel) {
            easyDiffLabel.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        }

        const mediumDiffLabel = document.querySelector('.text-difficulty-medium');
        if (mediumDiffLabel) {
            mediumDiffLabel.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        }

        const hardDiffLabel = document.querySelector('.text-difficulty-hard');
        if (hardDiffLabel) {
            hardDiffLabel.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        }

        // Handle multiple elements in sidebar
        const easyDiffLabelsSideBar = document.querySelectorAll('.text-sd-easy');
        easyDiffLabelsSideBar.forEach(label => {
            label.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        });

        const mediumDiffLabelsSideBar = document.querySelectorAll('.text-sd-medium');
        mediumDiffLabelsSideBar.forEach(label => {
            label.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        });

        const hardDiffLabelsSideBar = document.querySelectorAll('.text-sd-hard');
        hardDiffLabelsSideBar.forEach(label => {
            label.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        });
    }

    toggleByColName(colName, checked) {
        if (colName === 'difficulty') {
            this.hideDiffFromContest(checked);
        }
    }
}

module.exports = ContestStrategy; 
},{"./base-strategy":9}],12:[function(require,module,exports){
const FeatureStrategy = require('./base-strategy');

class NewProblemSetStrategy extends FeatureStrategy {
    
    hideLockedProblems(checked) {
        const temp = document.querySelectorAll('a[id]');
        
        temp.forEach(row => {
            const cell = row.querySelector(`div>div:nth-child(1)>svg`);
            if (cell && cell.getAttribute('data-icon') == 'lock') {
                row.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
            }
        });
    }

    highlightSolvedProblems(checked) {
        const temp = document.querySelectorAll('a[id]');
        const isDarkMode = document.querySelector('html').classList.contains('dark');
        temp.forEach(row => {
            const cell = row.querySelector(`div>div:nth-child(1)>svg`);
            if (cell && cell.getAttribute('data-icon') == 'check') {
                if(!checked) {
                    row.classList.add(isDarkMode ? 'add-bg-dark_leetcode-enhancer' : 'add-bg-light_leetcode-enhancer');
                }
                else {
                    row.classList.remove('add-bg-dark_leetcode-enhancer');
                    row.classList.remove('add-bg-light_leetcode-enhancer');
                }
            }
        });
    }

    hideSolvedProb(checked) {
        const temp = document.querySelectorAll('a[id]');
        
        temp.forEach(row => {
            const cell = row.querySelector(`div>div:nth-child(1)>svg`);
            if (cell && cell.getAttribute('data-icon') == 'check') {
                row.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
            }
        });
    }

    toggleByColName(colName, checked) {
        const temp = document.querySelectorAll('a[id]');

        if(colName == 'status') {
            temp.forEach(row => {
                const cell = row.querySelector(`div>div:nth-child(1)`);
                if (cell) {
                    cell.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
                }
            });
        }
        if(colName == 'acceptance') {
            temp.forEach(row => {
                const cell = row.querySelector(`div>div:nth-child(2)>div:nth-child(2)`);
                if (cell) {
                    cell.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
                }
            });
        }
        else if(colName == 'difficulty') {
            temp.forEach(row => {
                const cell = row.querySelector(`div>div:nth-child(2)>p:nth-child(3)`);
                if (cell) {
                    cell.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
                }
            });
        }
        else if(colName == 'frequency') {
            temp.forEach(row => {
                const cell = row.querySelector(`div>div:nth-child(3)`);
                if (cell) {
                    cell.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
                }
            });
        }
        else if(colName == 'save') {
            temp.forEach(row => {
                const cell = row.querySelector(`div>div:nth-child(4)>div`);
                if (cell) {
                    cell.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
                }
            });
        }
    }
}

module.exports = NewProblemSetStrategy; 
},{"./base-strategy":9}],13:[function(require,module,exports){
const { Mode } = require('../mode.js');
const ProblemSetStrategy = require('./problem-set-strategy.js');
const CodingAreaStrategy = require('./coding-area-strategy.js');
const ContestStrategy = require('./contest-strategy.js');

class FeatureStrategyFactory {
    static getStrategy(mode) {
        switch (mode) {
            case Mode.PROBLEM_SET:
                return new ProblemSetStrategy();
            case Mode.CODING_AREA:
                return new CodingAreaStrategy();
            case Mode.CONTEST:
                return new ContestStrategy();
            default:
                console.log('No strategy found for mode:', mode);
                return null;
        }
    }
}

module.exports = FeatureStrategyFactory; 
},{"../mode.js":6,"./coding-area-strategy.js":10,"./contest-strategy.js":11,"./problem-set-strategy.js":12}],14:[function(require,module,exports){
const print = require('./debugger.js');
let browser = window.browser || window.chrome;

/**
 * Checks if an object is iterable.
 * @param {Object} obj - The object to check.
 * @returns {boolean} - True if the object is iterable, false otherwise.
 */
function isIterable(obj) {
    if(obj != null && typeof obj[Symbol.iterator] === 'function')
        return true;
    print(`${JSON.stringify(obj)} is not iterable`)
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
        print("Error while retrieving key");
    }
}

async function getDataAsUint8Array(key) {
    return new Uint8Array((await browser.storage.local.get(key))[key] || []);
}

// Export the isIterable function using CommonJS syntax
module.exports = {isIterable, storeDataWithObjectWrapping, getData, getDataAsUint8Array, storeData};
},{"./debugger.js":3}]},{},[2]);
