// for compatibility between chrome and firefox
var browser = browser || chrome

// sends message to enable popup icon
chrome.runtime.sendMessage({ "message": "activate_icon" });

// Mutation Observer (to load extension only after the page questions)
const observer = new MutationObserver(function (mutations) {
    if (mutations.length) {
        browser.storage.local.get(["options"], modifyThenApplyChanges);
    }
});

// on page refresh changes should be reflected automatically
el = document.getElementsByClassName('jsx-3812067982');
el2 = document.getElementById('app');
el3 = document.querySelector('div.space-y-4:nth-child(1)')

// all problems page
if (el.length) {
    observer.observe(el[0], {
        childList: true,
        subtree: true,
    });
}
// tags page
if (el2) {
    observer.observe(el2, {
        childList: true,
        subtree: true
    });
}
// solved difficulty
if (el3) {
    observer.observe(el3, {
        childList: true,
    });
}

// event listener
browser.runtime.onMessage.addListener(function (response, sender, sendResponse) {
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
        }
        else if (name === 'highlight') {
            highlightSolvedProblems(option.checked)
        }
        else if (name === 'solvedDiff') {
            hideSolvedDiff(option.checked)
        }
        else if (name === 'solved') {
            hideSolvedProb(option.checked)
        }
        else {
            toggleByColName(name, option.checked);
        }
    }
}

function modifyThenApplyChanges(options) {
    applyChanges(options.options);
}

// hide column
function findColNoByColName(colName) {
    colList = document.querySelectorAll('table thead tr th')

    for (i = 0; i < colList.length; i++) {
        if (colList[i].innerText.toLowerCase().includes(colName)) {
            return i;
        }
    }

    return 0;
}

// toggle columns
function toggleByColName(colName, checked) {

    //hide diff from coding area
    if (colName === 'difficulty') {
        hideSolvedDiffFromCodingArea(checked);
    }

    colNo = findColNoByColName(colName);
    if (colNo) {
        temp = document.querySelectorAll('table tr td:nth-child(' + (colNo + 1) + ')');
        if (checked) {
            document.querySelector('table tr th:nth-child(' + (colNo + 1) + ')').classList.remove('hide');

            for (i = 0; i < temp.length; i++) {
                temp[i].classList.remove('hide');
            }
        }
        else {
            document.querySelector('table tr th:nth-child(' + (colNo + 1) + ')').classList.add('hide');
            for (i = 0; i < temp.length; i++) {
                temp[i].classList.add('hide');
            }
        }
    }
}


//hide difficulty from coding area
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
        }
        else {
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


function isProbSetPage() {
    url = window.location.href;
    return url.includes('problemset')
}

// hide locked problems
function hideLockedProblems(checked) {
    temp = document.querySelectorAll('table tr')
    if(isProbSetPage()) {
        for(i = 0; i < temp.length; i++) {
            if (temp[i].querySelector("td:nth-child(1) path[d='M7 8v2H6a3 3 0 00-3 3v6a3 3 0 003 3h12a3 3 0 003-3v-6a3 3 0 00-3-3h-1V8A5 5 0 007 8zm8 0v2H9V8a3 3 0 116 0zm-3 6a2 2 0 100 4 2 2 0 000-4z']")) {
                if(checked)
                    temp[i].classList.remove('hide');
                else
                    temp[i].classList.add('hide');
            }
        }
    }
    else {
        for(i = 0; i < temp.length; i++) {
            if(temp[i].querySelector('td:nth-child(3) .fa-lock')) {
                if(checked)
                    temp[i].classList.remove('hide');
                else
                    temp[i].classList.add('hide');
            }
        }
    }

}

// highlight solved problems
function highlightSolvedProblems(checked) {
    if(isProbSetPage()) {
        temp = document.querySelectorAll('tbody > tr')
        for (i = 0; i < temp.length; i++) {
            if (temp[i].querySelector("path[d='M9.688 15.898l-3.98-3.98a1 1 0 00-1.415 1.414L8.98 18.02a1 1 0 001.415 0L20.707 7.707a1 1 0 00-1.414-1.414l-9.605 9.605z']")) {
                if (checked) {
                    temp[i].querySelector('td:nth-child(1)').classList.add('add-bg');
                    temp[i].querySelector('td:nth-child(2)').classList.add('add-bg');
                }
                else {
                    temp[i].querySelector('td:nth-child(1)').classList.remove('add-bg');
                    temp[i].querySelector('td:nth-child(2)').classList.remove('add-bg');
                }
            }
        }
    }
    else {
        temp = document.querySelectorAll('thead tr, tbody.reactable-data tr')
        for(i = 0; i < temp.length; i++) {
            if(temp[i].querySelector('.fa-check')) {
                if(checked) {
                    // temp[i].querySelector('*:nth-child(1)').classList.add('hide');
                    temp[i].classList.add('add-bg-old');
                }
                else {
                    // temp[i].querySelector('*:nth-child(1)').classList.remove('hide');
                    temp[i].classList.remove('add-bg-old');
                }
            }
        }
    }
}

// hide solved difficulty
function hideSolvedDiff(checked) {

    el = document.getElementsByClassName('py-2 bg-overlay-3 rounded-lg');
    if (checked) {
        if(el.length) {
            el[1].classList.remove('hide');
        }
    }
    else {
        if(el.length) {
            el[1].classList.add('hide');
        }
    }
}

function hideSolvedProb(checked) {
  
    if(isProbSetPage()) {
        temp = document.querySelectorAll('tbody > tr')
        for (i = 0; i < temp.length; i++) {
            if (temp[i].querySelector("path[d='M9.688 15.898l-3.98-3.98a1 1 0 00-1.415 1.414L8.98 18.02a1 1 0 001.415 0L20.707 7.707a1 1 0 00-1.414-1.414l-9.605 9.605z']")) {
                if (checked)
                    temp[i].classList.remove('hide');
                else
                    temp[i].classList.add('hide')
            }
        }
    }
    else {
        temp = document.querySelectorAll('table tr')
        for (i = 0; i < temp.length; i++) {
            if(temp[i].querySelector('.fa-check')) {
                if (checked)
                    temp[i].classList.remove('hide');
                else
                    temp[i].classList.add('hide')
            }
        }
    }

}
