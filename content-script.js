console.log('content script attached');

// don't need to write $(document).ready because content scripts is loaded after the page is loaded
var browser = browser || chrome

const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function(mutation) {
        if(mutation.addedNodes.length) {
                browser.storage.local.get(["options"], modifyThenApplyChanges);
        }
    });
});
el = document.getElementsByClassName('question-list-base');
observer.observe(el[0], {
    childList: true
});

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
        toggleByColName(name, option.checked);
    }
}


function modifyThenApplyChanges(options) {
    applyChanges(options.options);
}

// hide column

function findColNoByColName(colName) {


    colNo = 0;
    $('table thead tr th').each(function(index){
        if($(this).text().toLowerCase().includes(colName)) {
            colNo = index;
        }
    });
    
    return colNo;
}

function toggleByColName(colName, checked) {

    colNo = findColNoByColName(colName);
    if(colNo) {
        tar = 'td:eq('+ colNo +')';
        if(checked) {
            $('table tr th:eq(' + colNo + ')').hide();
            $('table tr').each(function() {
                $(this).find(tar).hide();
            });
        }
        else {
            $('table tr th:eq(' + colNo + ')').show();
            $('table tr').each(function() {
                $(this).find(tar).show();
            });
        }
    }
}

// hide locked problems
function hideLockedProblems(checked) {
    colNo = findColNoByColName('title');
    if(checked) {
        $('table tr').each(function() {
            if($(this).find('td:eq(' + colNo + ')').find('.fa-lock').length == 1) {
                $(this).hide();
            }
        });
    }
    else {
        $('table tr').each(function() {
            if($(this).find('td:eq(' + colNo + ')').find('.fa-lock').length == 1) {
                $(this).show();
            }            
        });
    }
}

// highlight solved problems
function highlightSolvedProblems(checked) {
    
    if(checked) {
        $('table tr th:first-child').hide();
        $('table tr').each(function() {
            $(this).find('td:first-child').hide();
            if($(this).find('td').find('.fa-check').length == 1) {
                $(this).css({'background-color': 'rgb(118, 255, 118)'})
            }
        });
    }
    else {
        $('table tr th:first-child').show();
        $('table tr').each(function() {
            $(this).find('td:first-child').show();
            if($(this).find('td').find('.fa-check').length == 1) {
                $(this).css({'background-color': 'rgba(118, 255, 118, 0)'})
            }
        });
    }
}

// hide solved difficulty
function hideSolvedDiff(checked) {
    if(checked) {
        $('.question-solved span:not(:first-child)').hide();
    }
    else {
        $('.question-solved span:not(:first-child)').show();
    }
}