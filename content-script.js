// for compatibility between chrome and firefox
var browser = browser || chrome

// sends message to enable popup icon
chrome.runtime.sendMessage({"message": "activate_icon"});

// Mutation Observer (to load extension only after the page questions)
const observer = new MutationObserver(function (mutations) {
    if(mutations.length) {
        browser.storage.local.get(["options"], modifyThenApplyChanges);
    }
});

//on page refresh changes should be reflected automatically
el = document.getElementsByClassName('question-list-base');
el2 = document.getElementById('app');

// all problems page
if(el.length) {
    observer.observe(el[0], {
        childList: true,
        subtree: true,
    });
}
// tags page
if(el2) {
    observer.observe(el2, {
        childList: true,
        subtree:true
    });
}

// event listener
browser.runtime.onMessage.addListener(function(response, sender, sendResponse) {
    ops = []
    for(option of response.options) {
        ops.push(option);
    }
    applyChanges(ops);
});

function applyChanges(options) {
    for(option of options) {
        let name = option.optionName;
        if(name === 'locked') { 
            hideLockedProblems(option.checked);
        }
        else if(name === 'highlight') {
            highlightSolvedProblems(option.checked)
        }
        else if(name === 'solvedDiff') {
            hideSolvedDiff(option.checked)
        }
        else if(name === 'solved') {
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

    for(i = 0; i < colList.length; i++) {
        if(colList[i].innerText.toLowerCase().includes(colName)) {
            return i;
        }
    }

    return 0;
}

// toggle columns
function toggleByColName(colName, checked) {

    //hide diff from coding area
    if(colName === 'difficulty') {
        hideSolvedDiffFromCodingArea(checked);
    }

    colNo = findColNoByColName(colName);
    if(colNo) {
        temp = document.querySelectorAll('table tr td:nth-child(' + (colNo + 1) + ')');
        if(checked) {
            document.querySelector('table tr th:nth-child(' + (colNo + 1) + ')').classList.remove('hide');
            
            for (i = 0; i < temp.length; i++ ) {
                temp[i].classList.remove('hide');
            }
        }
        else {
            document.querySelector('table tr th:nth-child(' + (colNo + 1) + ')').classList.add('hide');
            for (i = 0; i < temp.length; i++ ) {
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

    if(diffCodingArea){
        if(checked) {
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

// hide locked problems
function hideLockedProblems(checked) {
    colNo = findColNoByColName('title');
    temp = document.querySelectorAll('table tr')
    if(checked) {
        for(i = 0; i < temp.length; i++) {
            if(temp[i].querySelector('td:nth-child(3) .fa-lock')) {
                temp[i].classList.remove('hide');
            }
        }
    }
    else {
        for(i = 0; i < temp.length; i++) {
            if(temp[i].querySelector('td:nth-child(3) .fa-lock')) {
                temp[i].classList.add('hide');
            }
        }
    }
}

// highlight solved problems
function highlightSolvedProblems(checked) {
    
    temp = document.querySelectorAll('thead tr, tbody.reactable-data tr')

    if(checked) {
        for(i = 0; i < temp.length; i++) {
            temp[i].querySelector('*:nth-child(1)').classList.add('hide');
            if(temp[i].querySelector('.fa-check')) {
                temp[i].classList.add('add-bg');
            }
        }
    }
    else {
        for(i = 0; i < temp.length; i++) {
            temp[i].querySelector('*:nth-child(1)').classList.remove('hide');
            if(temp[i].querySelector('.fa-check')) {
                temp[i].classList.remove('add-bg');
            }
        }
    }
}

// hide solved difficulty
function hideSolvedDiff(checked) {

    if(document.querySelector('.question-solved')) {
        if(checked) {
            document.querySelectorAll('.question-solved>span>span:not(:first-child)')
                    .forEach(el => el.classList.remove('hide'));

            document.querySelector('.question-solved span').classList.remove('color-alfa0')
        }
        else {
            document.querySelectorAll('.question-solved span span:not(:first-child)')
                    .forEach(el => el.classList.add('hide'));
            document.querySelector('.question-solved span').classList.add('color-alfa0')
        }
    }
}

function hideSolvedProb(checked) {
    colNo = findColNoByColName('title');
    temp = document.querySelectorAll('table tr')
    if(checked) {
        for(i = 0; i < temp.length; i++) {
            if(temp[i].querySelector('.fa-check')) {
                temp[i].classList.remove('hide');
            }
        }
    }
    else {
        for(i = 0; i < temp.length; i++) {
            if(temp[i].querySelector('.fa-check')) {
                temp[i].classList.add('hide');
            }
        }
    }
}
