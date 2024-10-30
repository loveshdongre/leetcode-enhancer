// ################### MODES #####################
/*
    0 - old version of leetcode/problemset
    1 - new version of leetcode/problemset
    2 - for https://leetcode.com/tag/* (example - https://leetcode.com/tag/array/)
    3 - coding area (example - https://leetcode.com/problems/remove-duplicates-from-sorted-array/)
    4 - solutions (discussion)
    5 - contest
    6 - new coding area
*/

const Mode = Object.freeze({
    OLD_PROBLEM_SET: 0,
    NEW_PROBLEM_SET: 1,
    TAG: 2,
    CODING_AREA: 3,
    SOLUTIONS: 4,
    CONTEST: 5,
    NEW_CODING_AREA: 6,
});

module.exports = Mode;