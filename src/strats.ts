import { Decision } from ".";

export type Strategy = (opponentHistory: Decision[], ownHistory: Decision[], opponentPublicStrategy: Strategy) => Decision;

export const strategies = {
    titfortat: (opponentHistory: Decision[], ownHistory: Decision[]): Decision => {
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
    }
}

export const publicStrategies = {
    ...strategies
}