const FeatureStrategy = require('./base-strategy');

class NewProblemSetStrategy extends FeatureStrategy {
    
    hideLockedProblems(checked) {
        const temp = document.querySelectorAll('[role="table"] [role="row"]');
        const lockIconPath = 'M7 8v2H6a3 3 0 00-3 3v6a3 3 0 003 3h12a3 3 0 003-3v-6a3 3 0 00-3-3h-1V8A5 5 0 007 8zm8 0v2H9V8a3 3 0 116 0zm-3 6a2 2 0 100 4 2 2 0 000-4z';
        
        temp.forEach(row => {
            if (row.querySelector(`[role="cell"]:nth-child(1) path[d="${lockIconPath}"]`)) {
                row.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
            }
        });
    }

    highlightSolvedProblems(checked) {
        const temp = document.querySelectorAll('[role="table"] [role="row"]');
        const solvedCheckMarkSvg = 'M21.6 12a9.6 9.6 0 01-9.6 9.6 9.6 9.6 0 110-19.2c1.507 0 2.932.347 4.2.965M19.8 6l-8.4 8.4L9 12';
        const add_bg_class = document.querySelector('html').classList.contains('dark') ? 'add-bg-dark' : 'add-bg-old';
        
        temp.forEach(row => {
            if (row.querySelector(`[role="cell"]:nth-child(1) path[d="${solvedCheckMarkSvg}"]`)) {
                row.classList[checked ? 'add' : 'remove'](add_bg_class);
            }
        });
    }

    hideSolvedDiff(checked) {
        const el = document.querySelector("div.col-span-4.md\\:col-span-1")?.children;
        if (el && el.length && el[3]) {
            el[3].classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        }
    }

    hideSolvedProb(checked) {
        const temp = document.querySelectorAll('[role="table"] [role="row"]');
        const solvedCheckMarkSvg = 'M21.6 12a9.6 9.6 0 01-9.6 9.6 9.6 9.6 0 110-19.2c1.507 0 2.932.347 4.2.965M19.8 6l-8.4 8.4L9 12';
        const attemptedCheckMarkSvg = 'M20 12.005v-.828a1 1 0 112 0v.829a10 10 0 11-5.93-9.14 1 1 0 01-.814 1.826A8 8 0 1020 12.005zM8.593 10.852a1 1 0 011.414 0L12 12.844l8.293-8.3a1 1 0 011.415 1.413l-9 9.009a1 1 0 01-1.415 0l-2.7-2.7a1 1 0 010-1.414z';
        
        temp.forEach(row => {
            if (row.querySelector(`[role="cell"]:nth-child(1) path[d="${solvedCheckMarkSvg}"]`) || 
                row.querySelector(`[role="cell"]:nth-child(1) path[d="${attemptedCheckMarkSvg}"]`)) {
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