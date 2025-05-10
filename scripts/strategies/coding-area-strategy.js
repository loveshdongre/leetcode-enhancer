const FeatureStrategy = require('./base-strategy');

class CodingAreaStrategy extends FeatureStrategy {

    hideSolvedDiff(checked) {
        const diffCodingArea = document.querySelector('[data-track-load="description_content"]')?.parentElement?.previousElementSibling?.firstChild;
        const diffNext = document.querySelectorAll("a[rel ='noopener noreferrer'] div");

        if (diffCodingArea) {
            diffCodingArea.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        }

        if (diffNext) {
            diffNext.forEach(el => el.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer'));
        }
    }

    hideDiffOfSimilarProb(checked) {
        const allAnchors = document.querySelectorAll('a');
        if (!allAnchors || allAnchors.length === 0) return;

        const urlProb = "https://leetcode.com/problems/";
        const curUrl = urlProb + window.location.pathname.split("/")[2] + "/";
        
        allAnchors.forEach(anchor => {
            if (anchor.href.startsWith(urlProb) && !anchor.href.startsWith(curUrl)) {
                const diffElement = anchor.parentElement?.parentElement?.parentElement?.nextElementSibling;
                if (diffElement) {
                    diffElement.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
                }
            }
        });
    }

    hideStatus(checked) {
        const solvedMarkParent = document.querySelector('[data-track-load="description_content"]')?.parentNode?.previousSibling?.previousSibling?.lastChild;
        if (solvedMarkParent && solvedMarkParent.classList.contains('text-body')) {
            solvedMarkParent.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        }
    }

    hideAcceptance(checked) {
        const parentElement = document.querySelector('[data-track-load="description_content"]')?.parentElement?.nextSibling;
        if (!parentElement) return;

        const acceptanceRateElement = [...parentElement.children]
            .find(child => child.textContent.toLowerCase().includes('acceptance'))?.lastElementChild;

        if (acceptanceRateElement) {
            acceptanceRateElement.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        }
    }

    hideSave(checked) {
        const saveButton = document.querySelector("svg[data-icon='star']");
        if (saveButton) {
            saveButton.classList[checked ? 'remove' : 'add']('hide_leetcode-enhancer');
        }
    }

    toggleByColName(colName, checked) {
        if (colName === 'difficulty') {
            this.hideSolvedDiff(checked);
            this.hideDiffOfSimilarProb(checked);
        } else if (colName === 'status') {
            this.hideStatus(checked);
        } else if (colName === 'acceptance') {
            this.hideAcceptance(checked);
        } else if(colName === 'save') {
            this.hideSave(checked);
        }
    }

    getUserCode() {
        const codeEditor = document.querySelector('div.editor-scrollable');
        return codeEditor ? codeEditor.textContent : '';
    }
}

module.exports = CodingAreaStrategy; 