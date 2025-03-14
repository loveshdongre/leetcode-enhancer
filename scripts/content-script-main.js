const sendMessage = require('./message-publisher.js');
const findMode = require('./page-checker.js');
const initMutationObserver = require('./mutation-observer.js');
const {isIterable} = require('./utils.js');
const Mode = require('./mode.js');
const print = require('./debugger.js');
const { MESSAGE_ACTIVATE_ICON, MESSAGE_GET_CODE } = require('./constants.js');

const browser = window.browser || window.chrome
let mode = findMode();

// svg for encircled green checkmark icon
const solvedCheckMarkSvg = 'M21.6 12a9.6 9.6 0 01-9.6 9.6 9.6 9.6 0 110-19.2c1.507 0 2.932.347 4.2.965M19.8 6l-8.4 8.4L9 12'

// publish message to background script (i.e. service worker) for activating icon
sendMessage(browser, { message: MESSAGE_ACTIVATE_ICON });

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
            setSolutionsUsers(option.checked)
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
            diffCodingArea.classList.remove('hide_leetcode-enhancer');
            for (var i = 0; i < diffType.length; ++i) {
                diffType[i].classList.remove('hide_leetcode-enhancer');
            }

            for (var i = 0; i < diffNext.length; ++i) {
                diffNext[i].classList.remove('remove_diff_color_leetcode-enhancer');
            }
        } else {
            diffCodingArea.classList.add('hide_leetcode-enhancer');

            for (var i = 0; i < diffType.length; ++i) {
                diffType[i].classList.add('hide_leetcode-enhancer');
            }

            for (var i = 0; i < diffNext.length; ++i) {
                diffNext[i].classList.add('remove_diff_color_leetcode-enhancer');
            }
        }
    }
}

// function toggleClass(elements, className, checked) {
//     elements.forEach(element => {
//         element.classList[checked ? 'remove' : 'add'](className);
//     });
// }

//###################### HIDE DIFF OF SIMILAR Problems FROM NEW CODING AREA
function hideDiffOfSimilarProbFromNewCodingArea(checked) {
    allAnchors = document.querySelectorAll('a');
    if(!allAnchors || allAnchors.length == 0)
        return;

    anchors = [];
    urlProb = "https://leetcode.com/problems/";
    curUrl = urlProb + window.location.pathname.split("\/")[2] + "/";
    for(i = 0; i < allAnchors.length; i++)
        if(allAnchors[i].href.startsWith(urlProb) && !allAnchors[i].href.startsWith(curUrl))
            anchors.push(allAnchors[i]);

    if (checked) {
        for(i = 0; i < anchors.length; i++) {
            if(anchors[i] && anchors[i].parentElement && anchors[i].parentElement.parentElement && anchors[i].parentElement.parentElement.parentElement && anchors[i].parentElement.parentElement.parentElement.nextElementSibling) {
                anchors[i].parentElement.parentElement.parentElement.nextElementSibling.classList.remove('hide_leetcode-enhancer')
            }
        }
    }
    else {
        for(i = 0; i < anchors.length; i++) {
            if(anchors[i] && anchors[i].parentElement && anchors[i].parentElement.parentElement && anchors[i].parentElement.parentElement.parentElement && anchors[i].parentElement.parentElement.parentElement.nextElementSibling) {
                anchors[i].parentElement.parentElement.parentElement.nextElementSibling.classList.add('hide_leetcode-enhancer')
            }
        }
    }
}

//####################### HIDE DIFFICULTY FROM NEW CODING AREA #######################
function hideSolvedDiffFromNewCodingArea(checked) {

    diffCodingArea = document.querySelector('[data-track-load="description_content"]').parentElement.previousElementSibling.firstChild;
    
    // hide difficulty from next challenge
    diffNext = document.querySelectorAll("a[rel ='noopener noreferrer'] div")

    if (diffCodingArea) {
        if (checked) {
            diffCodingArea.classList.remove('hide_leetcode-enhancer');
        } else {
            diffCodingArea.classList.add('hide_leetcode-enhancer');
        }
    }

    if(diffNext) {
        if(checked) {
            for (var i = 0; i < diffNext.length; ++i) {
                diffNext[i].classList.remove('hide_leetcode-enhancer');
            }
        }
        else {
            for (var i = 0; i < diffNext.length; ++i) {
                diffNext[i].classList.add('hide_leetcode-enhancer');
            }
        }
    }
}

// ################ HIDE DIFFICULTY OF SIMILAR PROBLEMS ########
function hideDiffOfSimilarProb(checked) {
    if (checked)
        document.querySelectorAll('.difficulty__ES5S').forEach(el => el.classList.remove('hide_leetcode-enhancer'));
    else
        document.querySelectorAll('.difficulty__ES5S').forEach(el => el.classList.add('hide_leetcode-enhancer'));
}

// ############### HIDE DIFFICULTY FROM CONTEST ##############
function hideDiffFromContest(checked) {
    if(checked) {
        document.querySelectorAll('.contest-question-info .list-group .list-group-item:nth-child(5) .label')[0].style.visibility = 'visible_leetcode-enhancer'
    }
    else {
        document.querySelectorAll('.contest-question-info .list-group .list-group-item:nth-child(5) .label')[0].style.visibility = 'hidden'
    }
}

// ################## TOGGLE COLUMNS ##########################
function toggleByColName(colName, checked) {

    if (mode == Mode.OLD_PROBLEM_SET || mode == Mode.TAG) {
        colNo = findColNoByColName(colName);
        if (colNo != -1) {
            temp = document.querySelectorAll('table tr td:nth-child(' + (colNo + 1) + ')');
            if (checked) {
                document.querySelector('table tr th:nth-child(' + (colNo + 1) + ')').classList.remove('hide_leetcode-enhancer');

                for (i = 0; i < temp.length; i++) {
                    temp[i].classList.remove('hide_leetcode-enhancer');
                }
            } else {
                document.querySelector('table tr th:nth-child(' + (colNo + 1) + ')').classList.add('hide_leetcode-enhancer');
                for (i = 0; i < temp.length; i++) {
                    temp[i].classList.add('hide_leetcode-enhancer');
                }
            }
        }
    } else if (mode == Mode.NEW_PROBLEM_SET) {
        colNo = findColNoByColName2(colName);

        if (colNo != -1) {
            temp = document.querySelectorAll('[role="table"] [role="row"]')
            if (checked) {
                for (i = 0; i < temp.length; i++) {
                    temp[i].querySelector('div:nth-child(' + (colNo + 1) + ')').classList.remove('hide_leetcode-enhancer');
                }
            } else {
                for (i = 0; i < temp.length; i++) {
                    temp[i].querySelector('div:nth-child(' + (colNo + 1) + ')').classList.add('hide_leetcode-enhancer');
                }
            }
        }

    } else if (mode == Mode.CODING_AREA) {
        //hide diff from coding area
        if (colName === 'difficulty') {
            hideSolvedDiffFromCodingArea(checked); // difficulty from problem statement and problem list
            hideDiffOfSimilarProb(checked);
        } else if(colName === "acceptance") {
            hideAcceptanceFromCodingArea(checked)
        }
    }
    else if (mode == Mode.CONTEST) {
        // hide diff from contest
        if(colName === 'difficulty') {
            hideDiffFromContest(checked);
        }
    }
    else if(mode == Mode.NEW_CODING_AREA) {
        if(colName === 'difficulty') {
            hideSolvedDiffFromNewCodingArea(checked); // Lag possiblity mild
            hideDiffOfSimilarProbFromNewCodingArea(checked);
            hideDiffFromProblemSetTableOfCodingArea(checked); // Lag possiblity high
        }
        else if(colName === 'status') {
            hideStatusFromNewCodingArea(checked);
            hideStatusFromProblemSetTableOfCodingArea(checked); // Lag possibility high
        } else if(colName === "acceptance") {
            hideAcceptanceFromNewCodingArea(checked);
        }
    }

}

// ################# HIDE DIFF FROM PROBLEM SET TABLE OF CODING AREA
function hideDiffFromProblemSetTableOfCodingArea(checked) {
    diffTextList = document.querySelectorAll('[rel="https://leetcode.com/problemset/"]');
    
    if(diffTextList == null)
        return;

    if(checked) {
        for(i = 0; i < diffTextList.length; i++) {
            diffTextList[i].lastChild.lastChild.lastChild.classList.remove('hide_leetcode-enhancer');
        }
    }
    else {
        for(i = 0; i < diffTextList.length; i++) {
            diffTextList[i].lastChild.lastChild.lastChild.classList.add('hide_leetcode-enhancer');
        }
    }
}

// ################# HIDE STATUS FROM PROBLEM SET TABLE OF CODING AREA
function hideStatusFromProblemSetTableOfCodingArea(checked) {
    
    solved = document.querySelectorAll('.chakra-icon.css-1hwpjif');
    unsolved = document.querySelectorAll('.chakra-icon.css-5uhenc');
    attempted = document.querySelectorAll('.chakra-icon.css-atp543');

    statusList = [...solved, ...unsolved, ...attempted]
    if(statusList == null)
        return;

    if(checked) {
        for(i = 0; i < statusList.length; i++) {
            statusList[i].classList.remove('hide_leetcode-enhancer');
        }
    }
    else {
        for(i = 0; i < statusList.length; i++) {
            statusList[i].classList.add('hide_leetcode-enhancer');
        }
    }
}

// ################# HIDE STATUS FROM NEW CODING AREA ############
function hideStatusFromNewCodingArea(checked) {
    solvedMarkParent = document.querySelector('[data-track-load="description_content"]')?.parentNode?.previousSibling?.previousSibling?.lastChild
    if(solvedMarkParent == null || !solvedMarkParent.classList.contains('text-body')) {
        print("Couldn't find selector for status in new coding area. Could also be because the page didn't loaded");
        return;
    }
    
    if(solvedMarkParent) {
        if(checked) {
            solvedMarkParent.classList.remove('hide_leetcode-enhancer');
        }
        else {
            solvedMarkParent.classList.add('hide_leetcode-enhancer');
        }
    }
}

// ################# HIDE ACCEPTANCE FROM NEW CODING AREA ############
function hideAcceptanceFromNewCodingArea(checked) {
    const parentElement = document.querySelector('[data-track-load="description_content"]').parentElement.nextSibling;
    if (!parentElement) return;

    const acceptanceRateElement = [...parentElement.children].find(child => child.textContent.toLowerCase().includes('acceptance')).lastElementChild;

    if (!acceptanceRateElement) return;

    if (checked) {
        acceptanceRateElement.classList.remove('hide_leetcode-enhancer');
    } else {
        acceptanceRateElement.classList.add('hide_leetcode-enhancer');
    }
}

// ################# HIDE ACCEPTANCE FROM OLD CODING AREA ############
function hideAcceptanceFromCodingArea(checked) {
    const acceptanceDiv = document.querySelector(".description__24sA div:nth-child(3) .css-q9155n")
    if(acceptanceDiv) {
        if(checked) {
            acceptanceDiv.classList.remove('hide_leetcode-enhancer')
        } else {
            acceptanceDiv.classList.add('hide_leetcode-enhancer')
        }
    }
    
}

// ################# HIDE LOCKED PROBLEMS ########################
function hideLockedProblems(checked) {
    if (mode == Mode.OLD_PROBLEM_SET) {
        colNo = findColNoByColName('title');
        temp = document.querySelectorAll('table tr')
        if (checked) {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('td:nth-child(3) .fa-lock')) {
                    temp[i].classList.remove('hide_leetcode-enhancer');
                }
            }
        } else {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('td:nth-child(3) .fa-lock')) {
                    temp[i].classList.add('hide_leetcode-enhancer');
                }
            }
        }
    } else if (mode == Mode.NEW_PROBLEM_SET) {
        temp = document.querySelectorAll('[role="table"] [role="row"]')
        if (checked) {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('[role="cell"]:nth-child(1) path[d="M7 8v2H6a3 3 0 00-3 3v6a3 3 0 003 3h12a3 3 0 003-3v-6a3 3 0 00-3-3h-1V8A5 5 0 007 8zm8 0v2H9V8a3 3 0 116 0zm-3 6a2 2 0 100 4 2 2 0 000-4z"]')) {
                    temp[i].classList.remove('hide_leetcode-enhancer');
                }
            }
        } else {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('[role="cell"]:nth-child(1) path[d="M7 8v2H6a3 3 0 00-3 3v6a3 3 0 003 3h12a3 3 0 003-3v-6a3 3 0 00-3-3h-1V8A5 5 0 007 8zm8 0v2H9V8a3 3 0 116 0zm-3 6a2 2 0 100 4 2 2 0 000-4z"]')) {
                    temp[i].classList.add('hide_leetcode-enhancer');
                }
            }
        }
    } else if (mode == Mode.TAG) {
        temp = document.querySelectorAll('table tr')
        for (i = 0; i < temp.length; i++) {
            if (temp[i].querySelector('td:nth-child(3) .fa-lock')) {
                if (checked)
                    temp[i].classList.remove('hide_leetcode-enhancer');
                else
                    temp[i].classList.add('hide_leetcode-enhancer');
            }
        }
    }

}

// ################## HIGHLIGHT SOLVED PROBLEMS ##################
function highlightSolvedProblems(checked) {

    if (mode == Mode.OLD_PROBLEM_SET) {
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
    } else if (mode == Mode.NEW_PROBLEM_SET) {
        temp = document.querySelectorAll('[role="table"] [role="row"]')

        add_bg_class = document.querySelector('html').classList.contains('dark') ? 'add-bg-dark' : 'add-bg-old';
        if (checked) {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('[role="cell"]:nth-child(1) path[d=\"' + solvedCheckMarkSvg + '\"]')) {
                    temp[i].classList.add(add_bg_class);
                } else {
                    temp[i].classList.remove(add_bg_class);
                }
            }
        } else {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('[role="cell"]:nth-child(1) path[d=\"' + solvedCheckMarkSvg + '\"]')) {
                    temp[i].classList.remove(add_bg_class);
                }
            }
        }
    } else if (mode == Mode.TAG) {
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
    if (mode == Mode.OLD_PROBLEM_SET) {
        if (checked) {
            document.querySelectorAll('.question-solved>span>span:not(:first-child)')
                .forEach(el => el.classList.remove('hide_leetcode-enhancer'));

            document.querySelector('.question-solved span').classList.remove('color-alfa0')
        } else {
            document.querySelectorAll('.question-solved span span:not(:first-child)')
                .forEach(el => el.classList.add('hide_leetcode-enhancer'));
            document.querySelector('.question-solved span').classList.add('color-alfa0')
        }
    } else if (mode == Mode.NEW_PROBLEM_SET) {
        el = document.querySelector("div.col-span-4.md\\:col-span-1").children;
        if (checked) {
            if (el && el.length && el[3]) {
                el[3].classList.remove('hide_leetcode-enhancer');
            }
        } else {
            if (el && el.length && el[3]) {
                el[3].classList.add('hide_leetcode-enhancer');
            }
        }
    }
}

// ################## HIDE SOLVED PROBLEMS #######################
function hideSolvedProb(checked) {
    if (mode == Mode.OLD_PROBLEM_SET) {
        colNo = findColNoByColName('title');
        temp = document.querySelectorAll('table tr')
        if (checked) {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('.fa-check')) {
                    temp[i].classList.remove('hide_leetcode-enhancer');
                }
            }
        } else {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('.fa-check')) {
                    temp[i].classList.add('hide_leetcode-enhancer');
                }
            }
        }
    } else if (mode == Mode.NEW_PROBLEM_SET) {
        temp = document.querySelectorAll('[role="table"] [role="row"]')
        if (checked) {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('[role="cell"]:nth-child(1) path[d=\"' + solvedCheckMarkSvg + '\"]') || temp[i].querySelector('[role="cell"]:nth-child(1) path[d="M20 12.005v-.828a1 1 0 112 0v.829a10 10 0 11-5.93-9.14 1 1 0 01-.814 1.826A8 8 0 1020 12.005zM8.593 10.852a1 1 0 011.414 0L12 12.844l8.293-8.3a1 1 0 011.415 1.413l-9 9.009a1 1 0 01-1.415 0l-2.7-2.7a1 1 0 010-1.414z"]')) {
                    temp[i].classList.remove('hide_leetcode-enhancer');
                }
            }
        } else {
            for (i = 0; i < temp.length; i++) {
                if (temp[i].querySelector('[role="cell"]:nth-child(1) path[d=\"' + solvedCheckMarkSvg + '\"]') || temp[i].querySelector('[role="cell"]:nth-child(1) path[d="M20 12.005v-.828a1 1 0 112 0v.829a10 10 0 11-5.93-9.14 1 1 0 01-.814 1.826A8 8 0 1020 12.005zM8.593 10.852a1 1 0 011.414 0L12 12.844l8.293-8.3a1 1 0 011.415 1.413l-9 9.009a1 1 0 01-1.415 0l-2.7-2.7a1 1 0 010-1.414z"]')) {
                    temp[i].classList.add('hide_leetcode-enhancer');
                }
            }
        }
    } else if (mode == Mode.TAG) {
        temp = document.querySelectorAll('table tr')
        for (i = 0; i < temp.length; i++) {
            if (temp[i].querySelector('.fa-check')) {
                if (checked)
                    temp[i].classList.remove('hide_leetcode-enhancer');
                else
                    temp[i].classList.add('hide_leetcode-enhancer')
            }
        }
    }

}

// ################## HIDE SOLUTIONS USERS #######################
function setSolutionsUsers(checked) {
    if(mode == Mode.SOLUTIONS) {
        const posts = document.getElementsByClassName("topic-item-wrap__2FSZ")
        if(posts) {
            if(checked) {
                for(let i = 0; i < posts.length; i++) {
                    posts[i].querySelector('a.topic-info__tdz0').style.visibility = 'visible_leetcode-enhancer';
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
                    postDetails[i].querySelector('a').style.visibility = 'visible_leetcode-enhancer';
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

function getUserCode() {
    let codeEditor;
    if(mode === Mode.NEW_CODING_AREA) {
        codeEditor = document.querySelector('div.editor-scrollable');
        return codeEditor.textContent;
    }
    else if(mode === Mode.CODING_AREA) {
        return getOldCodingAreaCode();
    }
    else {
        alert('Unable to read the code. If you are seeing this error in code editor page, please report this issue.')
    }
    return '';
}

function getOldCodingAreaCode() {
    const lines = document.querySelectorAll('.CodeMirror-line');
    let result = '';
    
    lines.forEach(line => {
        result += line.textContent + '\n';
    });

    return result.trim();
}