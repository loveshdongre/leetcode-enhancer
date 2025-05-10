const FeatureStrategy = require('./base-strategy');

class NewProblemSetStrategy extends FeatureStrategy {
    
    hideLockedProblems(checked) {
        const temp = document.querySelectorAll('a[id]');
        
        temp.forEach(row => {
            const cell = row.querySelector(`div>div:nth-child(1)>svg`);
            if (cell && cell.getAttribute('data-icon') == 'lock') {
                row.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
            }
        });
    }

    highlightSolvedProblems(checked) {
        const temp = document.querySelectorAll('a[id]');
        const isDarkMode = document.querySelector('html').classList.contains('dark');
        temp.forEach(row => {
            const cell = row.querySelector(`div>div:nth-child(1)>svg`);
            if (cell && cell.getAttribute('data-icon') == 'check') {
                if(!checked) {
                    row.classList.add(isDarkMode ? 'add-bg-dark_leetcode-enhancer' : 'add-bg-light_leetcode-enhancer');
                }
                else {
                    row.classList.remove('add-bg-dark_leetcode-enhancer');
                    row.classList.remove('add-bg-light_leetcode-enhancer');
                }
            }
        });
    }

    hideSolvedProb(checked) {
        const temp = document.querySelectorAll('a[id]');
        
        temp.forEach(row => {
            const cell = row.querySelector(`div>div:nth-child(1)>svg`);
            if (cell && cell.getAttribute('data-icon') == 'check') {
                row.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
            }
        });
    }

    toggleByColName(colName, checked) {
        const temp = document.querySelectorAll('a[id]');

        if(colName == 'status') {
            temp.forEach(row => {
                const cell = row.querySelector(`div>div:nth-child(1)`);
                if (cell) {
                    cell.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
                }
            });
        }
        if(colName == 'acceptance') {
            temp.forEach(row => {
                const cell = row.querySelector(`div>div:nth-child(2)>div:nth-child(2)`);
                if (cell) {
                    cell.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
                }
            });
        }
        else if(colName == 'difficulty') {
            temp.forEach(row => {
                const cell = row.querySelector(`div>div:nth-child(2)>p:nth-child(3)`);
                if (cell) {
                    cell.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
                }
            });
        }
        else if(colName == 'frequency') {
            temp.forEach(row => {
                const cell = row.querySelector(`div>div:nth-child(3)`);
                if (cell) {
                    cell.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
                }
            });
        }
        else if(colName == 'save') {
            temp.forEach(row => {
                const cell = row.querySelector(`div>div:nth-child(4)>div`);
                if (cell) {
                    cell.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
                }
            });
        }
    }
}

module.exports = NewProblemSetStrategy; 