import { Decision } from ".";

export type Strategy = (opponentHistory: Decision[], ownHistory: Decision[], opponentPublicStrategy: Strategy) => Decision;

export const strategies: {[key: string]: Strategy} = {
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
        const threshold = 3; // Número de veces consecutivas para comenzar a cooperar
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
    }
}

export const publicStrategies = {
    ...strategies
}