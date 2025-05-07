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
        } else if (name === 'solvedDiff') {
            currentStrategy.hideSolvedDiff(option.checked);
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