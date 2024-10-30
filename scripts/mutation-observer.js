const print = require('./debugger.js');
const Mode = require('./mode.js');
const {KEY_NAME_OPTIONS} = require('./constants.js');

const ERROR_IN_MUTATION_OBSERVER_CALLBACK = "Error in MutationObserver callback";
const ERROR_OLD_UI_PAGE_NOT_FOUND = "Old UI page element not found.";
const ERROR_NEW_PROBLEM_SET_UI_NOT_FOUND = "New Problem Set UI element not found.";
const ERROR_APP_PAGE_NOT_FOUND = "App page element not found.";
const ERROR_BASE_CONTENT_NOT_FOUND = "Base content element not found.";
const ERROR_NEW_CODING_AREA_NOT_FOUND = "New Coding Area element not found.";
const ERROR_NO_VALID_MODE = "No valid mode found to observe.";

const SELECTOR_OLD_UI_PAGE = 'question-list-base';
const SELECTOR_NEW_PROBLEM_SET_UI = '__next';
const SELECTOR_APP_PAGE = 'app';
const SELECTOR_BASE_CONTENT = 'base_content';
const SELECTOR_NEW_CODING_AREA = '__next';

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
        case Mode.OLD_PROBLEM_SET:
            const old_ui_page = document.getElementsByClassName(SELECTOR_OLD_UI_PAGE);
            if (old_ui_page.length) {
                observer.observe(old_ui_page[0], {
                    childList: true,
                    subtree: true,
                });
            } else {
                print(ERROR_OLD_UI_PAGE_NOT_FOUND);
            }
            break;

        case Mode.NEW_PROBLEM_SET:
            const ui = document.getElementById(SELECTOR_NEW_PROBLEM_SET_UI);
            if (ui) {
                observer.observe(ui, {
                    childList: true,
                    subtree: true
                });
            } else {
                print(ERROR_NEW_PROBLEM_SET_UI_NOT_FOUND);
            }
            break;

        case Mode.TAG:
        case Mode.CODING_AREA:
        case Mode.SOLUTIONS:
            const page = document.getElementById(SELECTOR_APP_PAGE);
            if (page) {
                observer.observe(page, {
                    childList: true,
                    subtree: true
                });
            } else {
                print(ERROR_APP_PAGE_NOT_FOUND);
            }
            break;

        case Mode.CONTEST:
            const base_content = document.getElementById(SELECTOR_BASE_CONTENT);
            if (base_content) {
                observer.observe(base_content, {
                    childList: true,
                    subtree: true
                });
            } else {
                print(ERROR_BASE_CONTENT_NOT_FOUND);
            }
            break;

        case Mode.NEW_CODING_AREA:
            const new_code_ui = document.getElementById(SELECTOR_NEW_CODING_AREA);
            if (new_code_ui) {
                observer.observe(new_code_ui, {
                    childList: true,
                    subtree: true
                });
            } else {
                print(ERROR_NEW_CODING_AREA_NOT_FOUND);
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
