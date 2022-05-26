debug = false

function print(x) {
    if (debug) {
        console.log(x);
    }
}

// for compatibility between chrome and firefox
var browser = browser || chrome

// sends message to enable popup icon
chrome.runtime.sendMessage({ "message": "activate_icon" });

// ################### MODES #####################
/*
    0 - old version of leetcode/problemset
    1 - new version of leetcode/problemset
    2 - for https://leetcode.com/tag/* (example - https://leetcode.com/tag/array/)
    3 - coding area (example - https://leetcode.com/problems/remove-duplicates-from-sorted-array/)
    4 - discussion
*/

function isOldProbSetPage() {
    return document.querySelector('.css-ly0btt-NewDiv') != null
}

function isNewProbSetPage() {
    url = window.location.href;
    return url.includes('/problemset/')
}

function isTagPage() {
    url = window.location.href;
    return url.includes('/tag/')
}

function isCodingArea() {
    url = window.location.href;
    return url.includes('/problems/')
}

function isDiscussion() {
    url = window.location.href;
    return url.includes('/discuss/')
}

function setMode() {
    mode = 2;
    if (isOldProbSetPage())
        mode = 0;
    else if (isNewProbSetPage())
        mode = 1;
    else if (isTagPage())
        mode = 2;
    else if (isDiscussion()) // should be before isCodingArea() since url will also contain /problems/
        mode = 4;
    else if (isCodingArea())
        mode = 3;

    print("mode = " + mode)
}

setMode();

function resetHide() {
    temp = document.querySelectorAll('[role="rowgroup"] [role="row"]');
    for (i = 0; i < temp.length; i++)
        temp[i].classList.remove('hide');
}

// ################### MUTATION OBSERVER #####################
// to load extension only after the page content

function modifyThenApplyChanges(options) {
    applyChanges(options.options);
}

const observer = new MutationObserver(function(mutations) {
    print(mutations)
    setMode();
    if (mutations.length) {
        print('hit');
        if (mode == 1) {
            resetHide();
        }
        browser.storage.local.get(["options"], modifyThenApplyChanges);

    }
});


// on page refresh changes should be reflected automatically
if (mode == 0) {
    old_ui_page = document.getElementsByClassName('question-list-base');
    // all problems page
    if (old_ui_page.length) {
        observer.observe(old_ui_page[0], {
            childList: true,
            subtree: true,
        });
    }
} else if (mode == 1) {
    // ui = document.getElementById('__next')
    ui = document.querySelector('div [role="table"]')
    if (ui) {
        observer.observe(ui, {
            childList: true,
            subtree: true
        });
    }

} else if (mode == 2) {
    tag_page = document.getElementById('app');
    // tags page
    if (tag_page) {
        observer.observe(tag_page, {
            childList: true,
            subtree: true
        });
    }
} else if (mode == 3) {
    coding_page = document.getElementById('app');
    // tags page
    if (coding_page) {
        observer.observe(coding_page, {
            childList: true,
            subtree: true
        });
    }
} else if (mode == 4) {
    disPage = document.getElementById('app');
    console.log('observe');
    console.log(disPage);
    // discussion page
    if (disPage) {
        observer.observe(disPage, {
            childList: true,
            subtree: true
        });
    }
}

// ################### EVENT LISTENER #####################
browser.runtime.onMessage.addListener(function(response, sender, sendResponse) {
    ops = []
    for (option of response.options) {
        ops.push(option);
    }
    applyChanges(ops);
});

function applyChanges(options) {
    for (option of options) {
        let name = option.optionName;
        if (name === 'locked') {
            hideLockedProblems(option.checked);
        } else if (name === 'highlight') {
            highlightSolvedProblems(option.checked)
        } else if (name === 'solvedDiff') {
            hideSolvedDiff(option.checked)
        } else if (name === 'solved') {
            hideSolvedProb(option.checked)
        } else if(name === 'disUsers') {
            setDiscussionUsers(option.checked)
        } 
        else {
            toggleByColName(name, option.checked);
        }
    }
}

// hide column
function findColNoByColName(colName) {

    // hard coded fix
    if (colName === 'status')
        return 0;

    colList = document.querySelectorAll('table thead tr th')
    for (i = 0; i < colList.length; i++) {
        if (colList[i].innerText.toLowerCase().includes(colName)) {
            return i;
        }
    }
    return -1;
}

//hide column2 - for new ui
function findColNoByColName2(colName) {
    colList = document.querySelectorAll('[role="table"] [role="columnheader"]')
    for (i = 0; i < colList.length; i++) {
        if (colList[i].innerText.toLowerCase().includes(colName))
            return i;
    }
    return -1;
}

//####################### HIDE DIFFICULTY FROM CODING AREA #######################
function hideSolvedDiffFromCodingArea(checked) {

    // hide difficulty from side panel
    diffType = document.querySelectorAll('.question-row-right__21IS');

    //hide difficulty from problem statement
    diffCodingArea = document.querySelector('[diff]')

    // hide difficulty from next challenge
    diffNext = document.querySelectorAll('.next-challenge__A4ZV a')

    if (diffCodingArea) {
        if (checked) {
            diffCodingArea.classList.remove('hide');

            for (var i = 0; i < diffType.length; ++i) {
                diffType[i].classList.remove('hide');
            }

            for (var i = 0; i < diffNext.length; ++i) {
                diffNext[i].classList.remove('blur');
            }
        } else {
            diffCodingArea.classList.add('hide');

            for (var i = 0; i < diffType.length; ++i) {
                diffType[i].classList.add('hide');
            }

            for (var i = 0; i < diffNext.length; ++i) {
                diffNext[i].classList.add('blur');
            }
        }
    }
}
// ################ HIDE DIFFICULTY OF SIMILAR PROBLEMS ########
function hideDiffOfSimilarProb(checked) {
    if (checked)
        document.querySelectorAll('.difficulty__ES5S').forEach(el => el.classList.remove('hide'));
    else
        document.querySelectorAll('.difficulty__ES5S').forEach(el => el.classList.add('hide'));
}

// ################## TOGGLE COLUMNS ##########################
function toggleByColName(colName, checked) {

    if (mode == 0 || mode == 2) {
        colNo = findColNoByColName(colName);
        if (colNo != -1) {
            temp = document.querySelectorAll('table tr td:nth-child(' + (colNo + 1) + ')');
            if (checked) {
                document.querySelector('table tr th:nth-child(' + (colNo + 1) + ')').classList.remove('hide');

                for (i = 0; i < temp.length; i++) {
                    temp[i].classList.remove('hide');
                }
            } else {
                document.querySelector('table tr th:nth-child(' + (colNo + 1) + ')').classList.add('hide');
                for (i = 0; i < temp.length; i++) {
                    temp[i].classList.add('hide');
                }
            }
        }
    } else if (mode == 1) {
        colNo = findColNoByColName2(colName);

        if (colNo != -1) {
            temp = document.querySelectorAll('[role="table"] [role="row"]')
            if (checked) {
                for (i = 0; i < temp.length; i++) {
                    temp[i].querySelector('div:nth-child(' + (colNo + 1) + ')').classList.remove('hide');
                }
            } else {
                for (i = 0; i < temp.length; i++) {
                    temp[i].querySelector('div:nth-child(' + (colNo + 1) + ')').classList.add('hide');
                }
            }
        }

    } else if (mode == 3) {
        //hide diff from coding area
        if (colName === 'difficulty') {
            hideSolvedDiffFromCodingArea(checked);
            hideDiffOfSimilarProb(checked);
        }
    }

}


// ################# HIDE LOCKED PROBLEMS ########################
function hideLockedProblems(checked) {
    if (mode == 0) {
        colNo = findColNoByColName('title');
        temp = document.querySelectorAll('table tr')
        if (checked) {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('td:nth-child(3) .fa-lock')) {
                    temp[i].classList.remove('hide');
                }
            }
        } else {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('td:nth-child(3) .fa-lock')) {
                    temp[i].classList.add('hide');
                }
            }
        }
    } else if (mode == 1) {
        temp = document.querySelectorAll('[role="table"] [role="row"]')
        if (checked) {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('[role="cell"]:nth-child(1) path[d="M7 8v2H6a3 3 0 00-3 3v6a3 3 0 003 3h12a3 3 0 003-3v-6a3 3 0 00-3-3h-1V8A5 5 0 007 8zm8 0v2H9V8a3 3 0 116 0zm-3 6a2 2 0 100 4 2 2 0 000-4z"]')) {
                    temp[i].classList.remove('hide');
                }
            }
        } else {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('[role="cell"]:nth-child(1) path[d="M7 8v2H6a3 3 0 00-3 3v6a3 3 0 003 3h12a3 3 0 003-3v-6a3 3 0 00-3-3h-1V8A5 5 0 007 8zm8 0v2H9V8a3 3 0 116 0zm-3 6a2 2 0 100 4 2 2 0 000-4z"]')) {
                    temp[i].classList.add('hide');
                }
            }
        }
    } else if (mode == 2) {
        temp = document.querySelectorAll('table tr')
        for (i = 0; i < temp.length; i++) {
            if (temp[i].querySelector('td:nth-child(3) .fa-lock')) {
                if (checked)
                    temp[i].classList.remove('hide');
                else
                    temp[i].classList.add('hide');
            }
        }
    }

}

// ################## HIGHLIGHT SOLVED PROBLEMS ##################
function highlightSolvedProblems(checked) {

    if (mode == 0) {
        temp = document.querySelectorAll('thead tr, tbody.reactable-data tr')

        if (checked) {
            for (i = 0; i < temp.length; i++) {
                // temp[i].querySelector('*:nth-child(1)').classList.add('hide');
                if (temp[i].querySelector('.fa-check')) {
                    temp[i].classList.add('add-bg-old');
                }
            }
        } else {
            for (i = 0; i < temp.length; i++) {
                // temp[i].querySelector('*:nth-child(1)').classList.remove('hide');
                if (temp[i].querySelector('.fa-check')) {
                    temp[i].classList.remove('add-bg-old');
                }
            }
        }
    } else if (mode == 1) {
        temp = document.querySelectorAll('[role="table"] [role="row"]')

        add_bg_class = document.querySelector('html').classList.contains('dark') ? 'add-bg-dark' : 'add-bg-old';
        if (checked) {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('[role="cell"]:nth-child(1) path[d="M9.688 15.898l-3.98-3.98a1 1 0 00-1.415 1.414L8.98 18.02a1 1 0 001.415 0L20.707 7.707a1 1 0 00-1.414-1.414l-9.605 9.605z"]') || temp[i].querySelector('[role="cell"]:nth-child(1) path[d="M20 12.005v-.828a1 1 0 112 0v.829a10 10 0 11-5.93-9.14 1 1 0 01-.814 1.826A8 8 0 1020 12.005zM8.593 10.852a1 1 0 011.414 0L12 12.844l8.293-8.3a1 1 0 011.415 1.413l-9 9.009a1 1 0 01-1.415 0l-2.7-2.7a1 1 0 010-1.414z"]')) {
                    temp[i].classList.add(add_bg_class);
                } else {
                    temp[i].classList.remove(add_bg_class);
                }
            }
        } else {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('[role="cell"]:nth-child(1) path[d="M9.688 15.898l-3.98-3.98a1 1 0 00-1.415 1.414L8.98 18.02a1 1 0 001.415 0L20.707 7.707a1 1 0 00-1.414-1.414l-9.605 9.605z"]') || temp[i].querySelector('[role="cell"]:nth-child(1) path[d="M20 12.005v-.828a1 1 0 112 0v.829a10 10 0 11-5.93-9.14 1 1 0 01-.814 1.826A8 8 0 1020 12.005zM8.593 10.852a1 1 0 011.414 0L12 12.844l8.293-8.3a1 1 0 011.415 1.413l-9 9.009a1 1 0 01-1.415 0l-2.7-2.7a1 1 0 010-1.414z"]')) {
                    temp[i].classList.remove(add_bg_class);
                }
            }
        }
    } else if (mode == 2) {
        temp = document.querySelectorAll('thead tr, tbody.reactable-data tr')
        for (i = 0; i < temp.length; i++) {
            if (temp[i].querySelector('.fa-check')) {
                if (checked) {
                    // temp[i].querySelector('*:nth-child(1)').classList.add('hide');
                    temp[i].classList.add('add-bg-old');
                } else {
                    // temp[i].querySelector('*:nth-child(1)').classList.remove('hide');
                    temp[i].classList.remove('add-bg-old');
                }
            }
        }
    }
}

// ################# HIDE SOLVED DIFFICULTY ######################
function hideSolvedDiff(checked) {
    if (mode == 0) {
        if (checked) {
            document.querySelectorAll('.question-solved>span>span:not(:first-child)')
                .forEach(el => el.classList.remove('hide'));

            document.querySelector('.question-solved span').classList.remove('color-alfa0')
        } else {
            document.querySelectorAll('.question-solved span span:not(:first-child)')
                .forEach(el => el.classList.add('hide'));
            document.querySelector('.question-solved span').classList.add('color-alfa0')
        }
    } else if (mode == 1) {
        el = document.getElementsByClassName('py-2 bg-layer-1 rounded-lg');
        if (checked) {
            if (el.length) {
                el[0].classList.remove('hide');
            }
        } else {
            if (el.length) {
                el[0].classList.add('hide');
            }
        }
    }
}

// ################## HIDE SOLVED PROBLEMS #######################
function hideSolvedProb(checked) {
    if (mode == 0) {
        colNo = findColNoByColName('title');
        temp = document.querySelectorAll('table tr')
        if (checked) {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('.fa-check')) {
                    temp[i].classList.remove('hide');
                }
            }
        } else {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('.fa-check')) {
                    temp[i].classList.add('hide');
                }
            }
        }
    } else if (mode == 1) {
        temp = document.querySelectorAll('[role="table"] [role="row"]')
        if (checked) {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('[role="cell"]:nth-child(1) path[d="M9.688 15.898l-3.98-3.98a1 1 0 00-1.415 1.414L8.98 18.02a1 1 0 001.415 0L20.707 7.707a1 1 0 00-1.414-1.414l-9.605 9.605z"]') || temp[i].querySelector('[role="cell"]:nth-child(1) path[d="M20 12.005v-.828a1 1 0 112 0v.829a10 10 0 11-5.93-9.14 1 1 0 01-.814 1.826A8 8 0 1020 12.005zM8.593 10.852a1 1 0 011.414 0L12 12.844l8.293-8.3a1 1 0 011.415 1.413l-9 9.009a1 1 0 01-1.415 0l-2.7-2.7a1 1 0 010-1.414z"]')) {
                    temp[i].classList.remove('hide');
                }
            }
        } else {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('[role="cell"]:nth-child(1) path[d="M9.688 15.898l-3.98-3.98a1 1 0 00-1.415 1.414L8.98 18.02a1 1 0 001.415 0L20.707 7.707a1 1 0 00-1.414-1.414l-9.605 9.605z"]') || temp[i].querySelector('[role="cell"]:nth-child(1) path[d="M20 12.005v-.828a1 1 0 112 0v.829a10 10 0 11-5.93-9.14 1 1 0 01-.814 1.826A8 8 0 1020 12.005zM8.593 10.852a1 1 0 011.414 0L12 12.844l8.293-8.3a1 1 0 011.415 1.413l-9 9.009a1 1 0 01-1.415 0l-2.7-2.7a1 1 0 010-1.414z"]')) {
                    temp[i].classList.add('hide');
                }
            }
        }
    } else if (mode == 2) {
        temp = document.querySelectorAll('table tr')
        for (i = 0; i < temp.length; i++) {
            if (temp[i].querySelector('.fa-check')) {
                if (checked)
                    temp[i].classList.remove('hide');
                else
                    temp[i].classList.add('hide')
            }
        }
    }

}

// ################## HIDE DISCUSSION USERS #######################
function setDiscussionUsers(checked) {
    if(mode == 4) {
        const posts = document.getElementsByClassName("topic-item-wrap__2FSZ")
        if(posts) {
            if(checked) {
                for(let i = 0; i < posts.length; i++) {
                    posts[i].querySelector('a.topic-info__tdz0').style.visibility = 'visible';
                }
            }
            else {
                for(let i = 0; i < posts.length; i++) {
                    posts[i].querySelector('a.topic-info__tdz0').style.visibility = 'hidden';
                }
            }
        }

        const postDetails = document.getElementsByClassName('root__3bcS');

        if(postDetails) {
            if(checked) {
                for(let i = 0; i < postDetails.length; i++) {
                    postDetails[i].querySelector('a').style.visibility = 'visible';
                }
            }
            else {
                for(let i = 0; i < postDetails.length; i++) {
                    postDetails[i].querySelector('a').style.visibility = 'hidden';
                }
            }
        }

    }
}