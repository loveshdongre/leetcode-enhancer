const { Mode } = require('../mode.js');
const ProblemSetStrategy = require('./problem-set-strategy.js');
const CodingAreaStrategy = require('./coding-area-strategy.js');
const ContestStrategy = require('./contest-strategy.js');

class FeatureStrategyFactory {
    static getStrategy(mode) {
        switch (mode) {
            case Mode.PROBLEM_SET:
                return new ProblemSetStrategy();
            case Mode.CODING_AREA:
                return new CodingAreaStrategy();
            case Mode.CONTEST:
                return new ContestStrategy();
            default:
                console.log('No strategy found for mode:', mode);
                return null;
        }
    }
}

module.exports = FeatureStrategyFactory; 