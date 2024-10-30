const Mode = require('./mode.js');
const print = require('./debugger.js');

// Constant selectors
const OLD_PROBLEM_SET_SELECTOR = '.css-ly0btt-NewDiv';
const CODING_AREA_SELECTOR = '#app';

// Constant URLs
const PROBLEMSET_URL = '/problemset/';
const TAG_URL = '/tag/';
const PROBLEMS_URL = '/problems/';
const SOLUTIONS_URL = '/solutions/';
const CONTEST_URL = '/contest/';

/**
 * Check if the current page is the old problem set page.
 * @returns {boolean}
 */
function isOldProbSetPage() {
    return document.querySelector(OLD_PROBLEM_SET_SELECTOR) !== null;
}

/**
 * Check if the current URL is for the new problem set page.
 * @returns {boolean}
 */
function isNewProbSetPage() {
    return window.location.href.includes(PROBLEMSET_URL);
}

/**
 * Check if the current URL is for the tag page.
 * @returns {boolean}
 */
function isTagPage() {
    return window.location.href.includes(TAG_URL);
}

/**
 * Check if the current URL is for the coding area.
 * @returns {boolean}
 */
function isCodingArea() {
    return window.location.href.includes(PROBLEMS_URL);
}

/**
 * Check if the current URL is for solutions.
 * @returns {boolean}
 */
function isSolutions() {
    return window.location.href.includes(SOLUTIONS_URL);
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
    if (isSolutions()) {
        mode = Mode.SOLUTIONS;
    } else if (isCodingArea() && document.querySelector(CODING_AREA_SELECTOR) !== null) {
        mode = Mode.CODING_AREA;
    } else if (isCodingArea()) {
        mode = Mode.NEW_CODING_AREA;
    } else if (isOldProbSetPage()) {
        mode = Mode.OLD_PROBLEM_SET;
    } else if (isNewProbSetPage()) {
        mode = Mode.NEW_PROBLEM_SET;
    } else if (isTagPage()) {
        mode = Mode.TAG;
    } else if (isContest()) {
        mode = Mode.CONTEST;
    }
    print(`Current mode value = ${mode}`);
    return mode;
}

module.exports = findMode;
