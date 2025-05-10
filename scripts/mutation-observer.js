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
