import { Decision } from ".";

export type Strategy = (opponentHistory: Decision[], ownHistory: Decision[], opponentPublicStrategy: Strategy) => Decision;
interface StrategyList {[key: string]: Strategy}

const mainStrategies: StrategyList = {
    titfortat: (opponentHistory: Decision[]): Decision => {
        if (opponentHistory.length === 0) {
            return 'cooperate';
        } else {
            return opponentHistory[opponentHistory.length - 1];
        }
    },
    alwaysCooperate: (): Decision => {
        return 'cooperate';
    },
    alwaysDefect: (): Decision => {
        return 'defect';
    },
    random: (): Decision => {
        return Math.random() > 0.5 ? 'cooperate' : 'defect';
    },
    adaptive: (opponentHistory: Decision[]): Decision => {
        const cooperationCount = opponentHistory.filter(decision => decision === 'cooperate').length;
        const defectCount = opponentHistory.length - cooperationCount;
        if (cooperationCount > defectCount) {
            return 'cooperate';
        } else {
            return 'defect';
        }
    },
    gradualTrust: (opponentHistory: Decision[]): Decision => {
        const threshold = 3; // Starts cooperating after this many times.
        let consecutiveCooperation = 0;

        for (let i = opponentHistory.length - 1; i >= 0; i--) {
            if (opponentHistory[i] === 'cooperate') {
                consecutiveCooperation++;
            } else {
                break;
            }
        }

        return consecutiveCooperation >= threshold ? 'cooperate' : 'defect';
    },
    advancedMirror: (opponentHistory: Decision[]): Decision => {
        if (opponentHistory.length === 0) {
            return 'cooperate';
        } else {
            const lastDecision = opponentHistory[opponentHistory.length - 1];
            if (lastDecision === 'defect') {
                const cooperationRate = opponentHistory.filter(decision => decision === 'cooperate').length / opponentHistory.length;
                return Math.random() < cooperationRate ? 'cooperate' : 'defect';
            } else {
                return 'cooperate';
            }
        }
    },
    vengeful: (opponentHistory: Decision[]): Decision => {
        return opponentHistory.includes('defect') ? 'defect' : 'cooperate';
    },
    forgivingTitForTat: (opponentHistory: Decision[]): Decision => {
        if (opponentHistory.length === 0 || Math.random() < 0.1) { // 10% chance of forgiving
            return 'cooperate';
        } else {
            return opponentHistory[opponentHistory.length - 1];
        }
    },
    suspiciousTitForTat: (opponentHistory: Decision[]): Decision => {
        if (opponentHistory.length === 0) {
            return 'defect';
        } else {
            return opponentHistory[opponentHistory.length - 1];
        }
    },
    periodicCooperate: (ownHistory: Decision[]): Decision => {
        return ownHistory.length % 3 === 0 ? 'cooperate' : 'defect'; // Cooperates every 3rd round
    },
    periodicDefect: (ownHistory: Decision[]): Decision => {
        return ownHistory.length % 3 === 0 ? 'defect' : 'cooperate'; // Defects every 3rd round
    },
    randomTitForTat: (opponentHistory: Decision[]): Decision => {
        if (opponentHistory.length === 0 || Math.random() < 0.1) { // 10% chance of doing the opposite
            return Math.random() > 0.5 ? 'cooperate' : 'defect';
        } else {
            return opponentHistory[opponentHistory.length - 1];
        }
    },
    majorityRule: (opponentHistory: Decision[]): Decision => {
        const cooperationCount = opponentHistory.filter(decision => decision === 'cooperate').length;
        return cooperationCount > opponentHistory.length / 2 ? 'cooperate' : 'defect';
    },
    minorityRule: (opponentHistory: Decision[]): Decision => {
        const cooperationCount = opponentHistory.filter(decision => decision === 'cooperate').length;
        return cooperationCount <= opponentHistory.length / 2 ? 'cooperate' : 'defect';
    },
    titForTwoTats: (opponentHistory: Decision[]): Decision => {
        if (opponentHistory.length < 2 || (opponentHistory[opponentHistory.length - 1] === 'cooperate' || opponentHistory[opponentHistory.length - 2] === 'cooperate')) {
            return 'cooperate';
        } else {
            return 'defect';
        }
    },
    twoTitsForTat: (opponentHistory: Decision[], ownHistory: Decision[]): Decision => {
        if (opponentHistory.length === 0) {
            return 'cooperate';
        } else if (opponentHistory[opponentHistory.length - 1] === 'defect') {
            return ownHistory.length > 0 && ownHistory[ownHistory.length - 1] === 'defect' ? 'cooperate' : 'defect';
        } else {
            return 'cooperate';
        }
    },
    alternating: (ownHistory: Decision[]): Decision => {
        return ownHistory.length % 2 === 0 ? 'cooperate' : 'defect';
    },
    grudger: (opponentHistory: Decision[]): Decision => {
        return opponentHistory.includes('defect') ? 'defect' : 'cooperate';
    },
    probingTitForTat: (opponentHistory: Decision[], ownHistory: Decision[]): Decision => {
        if (opponentHistory.length === 0 || (ownHistory.length > 0 && ownHistory[ownHistory.length - 1] === 'defect' && Math.random() < 0.1)) {
            return 'defect';
        } else {
            return opponentHistory[opponentHistory.length - 1];
        }
    },
    cautiousTitForTat: (opponentHistory: Decision[]): Decision => {
        if (opponentHistory.length < 2) {
            return 'cooperate';
        } else {
            return opponentHistory[opponentHistory.length - 1];
        }
    },
    copycat: (opponentHistory: Decision[]): Decision => {
        return opponentHistory.length === 0 ? 'cooperate' : opponentHistory[opponentHistory.length - 1];
    },
    antiTitForTat: (opponentHistory: Decision[]): Decision => {
        if (opponentHistory.length === 0) {
            return 'cooperate';
        } else {
            return opponentHistory[opponentHistory.length - 1] === 'cooperate' ? 'defect' : 'cooperate';
        }
    },
    titForTatWithForgiveness: (opponentHistory: Decision[]): Decision => {
        if (opponentHistory.length === 0 || Math.random() < 0.05) { // 5% chance of forgiveness
            return 'cooperate';
        } else {
            return opponentHistory[opponentHistory.length - 1];
        }
    },
    opportunistic: (opponentHistory: Decision[]): Decision => {
        if (opponentHistory.length < 2) {
            return 'cooperate';
        } else {
            return (opponentHistory[opponentHistory.length - 1] === 'cooperate' && opponentHistory[opponentHistory.length - 2] === 'cooperate') ? 'defect' : 'cooperate';
        }
    },
    defectOnLoss: (ownHistory: Decision[]): Decision => {
        if (ownHistory.length === 0 || ownHistory[ownHistory.length - 1] === 'defect') {
            return 'cooperate';
        } else {
            return 'defect';
        }
    },
    cooperateOnWin: (ownHistory: Decision[]): Decision => {
        if (ownHistory.length === 0 || ownHistory[ownHistory.length - 1] === 'cooperate') {
            return 'cooperate';
        } else {
            return 'defect';
        }
    },
    randomAlternating: (ownHistory: Decision[]): Decision => {
        return ownHistory.length % 2 === 0 ? (Math.random() > 0.5 ? 'cooperate' : 'defect') : (Math.random() > 0.5 ? 'defect' : 'cooperate');
    }
}

const smartStrategies = {
     //Straight forward strats. They don't care about other prisoners public strats and barely care about history of decisions.
    trustfulDumb: (function() {
        let inExecution = false;

        return function(opponentHistory: Decision[], ownHistory: Decision[], opponentPublicStrategy: Strategy): Decision {
            if (inExecution) {
                // Return a default decision to avoid infinite recursion
                return 'defect';
            }

            inExecution = true;
            const opponentDecisionToBe = opponentPublicStrategy(ownHistory, opponentHistory, smartStrategies.trustfulDumb);
            inExecution = false;
            
            switch (opponentDecisionToBe) {
                case 'cooperate':
                    return 'defect';
                case 'defect':
                    return 'defect';
            }
        };
    })(),
}

// ------------------ Exports ------------------
export const strategies: StrategyList = {
    ...mainStrategies,
    ...smartStrategies
}

export const publicStrategies: StrategyList = {
    ...mainStrategies,
    ...smartStrategies
}