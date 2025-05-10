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
