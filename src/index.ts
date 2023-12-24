import {type Prisoner, Prisoners} from './prisoners';
import { strategies } from './strats';
export type Decision = 'cooperate' | 'defect';

const {prisoners} = Prisoners.Instance; 

/// SETTINGS
const numberOfRandomPrisoners = 5; // How many random prisooners do we wanna use?

function simulateGame(prisonerA: Prisoner, prisonerB: Prisoner, rounds: number, indexA: number, indexB: number): [number, number] {
    let historyA: Decision[] = [];
    let historyB: Decision[] = [];
    let scoreA = 0;
    let scoreB = 0;

    for (let round = 0; round < rounds; round++) {
        let decisionA = applyError(prisonerA.realStrategy(historyB, historyA, prisonerB.publicStrategy), prisonerA.errorMargin);
        let decisionB = applyError(prisonerB.realStrategy(historyA, historyB, prisonerA.publicStrategy), prisonerB.errorMargin);

        historyA.push(decisionA);
        historyB.push(decisionB);

        [scoreA, scoreB] = updateScores(decisionA, decisionB, scoreA, scoreB);
    }

    prisonerA.finalScore += scoreA;
    prisonerB.finalScore += scoreB;

    Prisoners.Instance.updatePrisonerByIndex(indexA, prisonerA);
    Prisoners.Instance.updatePrisonerByIndex(indexB, prisonerB);
    return [scoreA, scoreB];
}

function applyError(decision: Decision, errorMargin: number): Decision {
    if (Math.random() < errorMargin) {
        return decision === 'cooperate' ? 'defect' : 'cooperate';
    }
    return decision;
}

function updateScores(decisionA: Decision, decisionB: Decision, scoreA: number, scoreB: number): [number, number] {
    if (decisionA === 'cooperate' && decisionB === 'cooperate') {
        scoreA += 3;
        scoreB += 3;
    } else if (decisionA === 'cooperate' && decisionB === 'defect') {
        scoreA += 5;
    } else if (decisionA === 'defect' && decisionB === 'cooperate') {
        scoreB += 5;
    } else {
        scoreA += 1;
        scoreB += 1;
    }
    return [scoreA, scoreB];
}

function createRandomPrisoner(id: number): Prisoner {
    const strategyKeys = Object.keys(strategies);
    const randomStrategyKey = strategyKeys[Math.floor(Math.random() * strategyKeys.length)];
    const randomStrategy = strategies[randomStrategyKey];

    return {
        name: `Random Prisoner ${id} (${randomStrategyKey})`,
        errorMargin: Math.random() * 0.999, // Error margin between 0 and 0.2
        history: [],
        finalScore: 0,
        description: `Randomly generated prisoner with the ${randomStrategyKey} strategy.`,
        realStrategy: randomStrategy,
        publicStrategy: randomStrategy // assuming public and real strategies are the same for simplicity
    };
}

// Generar y añadir prisioneros aleatorios
for (let i = 0; i < numberOfRandomPrisoners; i++) {
    const randomPrisoner = createRandomPrisoner(i + 1);
    console.log("🚀 ~ randomPrisoner created:", randomPrisoner);
    prisoners.push(randomPrisoner);
}
// Simulate game
prisoners.forEach((prisonerA, indexA) => {
    prisoners.forEach((prisonerB, indexB) => {
        if (indexA !== indexB) {
            let rounds = Math.floor(Math.random() * 90000) + 10; // Entre 10 y 300
            let [scoreA, scoreB] = simulateGame(prisonerA, prisonerB, rounds,indexA, indexB);
            console.log(`Resultado entre ${prisonerA.name} y ${prisonerB.name}: ${scoreA} - ${scoreB}`);
        }
    });
});
console.log('--------------------------------------------');
console.log('End result: ');
console.log('--------------------------------------------');
prisoners.sort((a, b) => b.finalScore - a.finalScore).forEach(prisoner => {
    console.log(prisoner.name, ' score: ', prisoner.finalScore)
})
