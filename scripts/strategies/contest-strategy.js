const FeatureStrategy = require('./base-strategy');

class ContestStrategy extends FeatureStrategy {
    hideDiffFromContest(checked) {
        const diffLabel = document.querySelectorAll('.contest-question-info .list-group .list-group-item:nth-child(5) .label')[0];
        if (diffLabel) {
            diffLabel.style.visibility = checked ? 'visible_leetcode-enhancer' : 'hidden';
        }
    }

    toggleByColName(colName, checked) {
        if (colName === 'difficulty') {
            this.hideDiffFromContest(checked);
        }
    }
}

module.exports = ContestStrategy; 