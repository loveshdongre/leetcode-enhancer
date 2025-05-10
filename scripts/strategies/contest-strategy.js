const FeatureStrategy = require('./base-strategy');

class ContestStrategy extends FeatureStrategy {
    hideDiffFromContest(checked) {
        
        // old UI
        const diffLabel = document.querySelectorAll('.contest-question-info .list-group .list-group-item:nth-child(5) .label')[0];
        if (diffLabel) {
            diffLabel.style.visibility = checked ? 'visible_leetcode-enhancer' : 'hidden';
            return;
        }

        // new UI
        const easyDiffLabel = document.querySelector('.text-difficulty-easy');
        if (easyDiffLabel) {
            easyDiffLabel.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        }

        const mediumDiffLabel = document.querySelector('.text-difficulty-medium');
        if (mediumDiffLabel) {
            mediumDiffLabel.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        }

        const hardDiffLabel = document.querySelector('.text-difficulty-hard');
        if (hardDiffLabel) {
            hardDiffLabel.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        }

        // Handle multiple elements in sidebar
        const easyDiffLabelsSideBar = document.querySelectorAll('.text-sd-easy');
        easyDiffLabelsSideBar.forEach(label => {
            label.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        });

        const mediumDiffLabelsSideBar = document.querySelectorAll('.text-sd-medium');
        mediumDiffLabelsSideBar.forEach(label => {
            label.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        });

        const hardDiffLabelsSideBar = document.querySelectorAll('.text-sd-hard');
        hardDiffLabelsSideBar.forEach(label => {
            label.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        });
    }

    toggleByColName(colName, checked) {
        if (colName === 'difficulty') {
            this.hideDiffFromContest(checked);
        }
    }
}

module.exports = ContestStrategy; 