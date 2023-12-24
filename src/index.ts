import {type Prisoner, Prisoners} from './prisoners';
import { strategies } from './strats';
import * as fs from 'fs';

export type Decision = 'cooperate' | 'defect';

const {prisoners} = Prisoners.Instance; 

/// SETTINGS
const numberOfRandomPrisoners = 10; // How many random prisooners do we wanna use?
const minRounds = 150; //Prisoners should compete at least this ammount of times with each other.
const maxRounds = 500; //Prisoners should compete at max this ammount of times with each other.
const ammountOfGames = 1; // How many times the game should run.

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
        prisonerA.numberOfOpponents ++;
        prisonerB.numberOfOpponents ++;
    }

    prisonerA.finalScore += scoreA;
    prisonerB.finalScore += scoreB;

    Prisoners.Instance.updatePrisonerByIndex(indexA, prisonerA);
    Prisoners.Instance.updatePrisonerByIndex(indexB, prisonerB);
    return [scoreA, scoreB];
}

function applyError(decision: Decision, errorMargin: number): Decision {
    return Math.random() < errorMargin ? (decision === 'cooperate' ? 'defect' : 'cooperate') : decision;
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
    const errorMargin = parseFloat((Math.random() * 0.5).toFixed(1)); // Error margin between 0 and 0.2
    return {
        name: `Random P. (${randomStrategyKey} + ${errorMargin} error margin)`,
        errorMargin,
        finalScore: 0,
        description: `Randomly generated prisoner of id ${id} with the ${randomStrategyKey} strategy and a ${errorMargin} error margin.`,
        numberOfOpponents: 0,
        realStrategy: randomStrategy,
        publicStrategy: randomStrategy // Assuming public and real strategies are the same for now for simplicity
    };
}

// Generate and add random prisoners
for (let i = 0; i < numberOfRandomPrisoners; i++) {
    const randomPrisoner = createRandomPrisoner(i + 1);
    prisoners.push(randomPrisoner);
}

const run = () => {
    // Run game
    for (let indexA = 0; indexA < prisoners.length; indexA++) {
        for (let indexB = indexA + 1; indexB < prisoners.length; indexB++) {
            let rounds = Math.floor(Math.random() * maxRounds) + minRounds;
            simulateGame(prisoners[indexA], prisoners[indexB], rounds, indexA, indexB);
        }
    }
}

for(let i = 1; i <= ammountOfGames; i++ ){
    console.log("🚀 ~ Run number: ", i)
    run()
}

console.log('--------------------------------------------');
console.log('End result: ');
console.log('--------------------------------------------');
// Sort prisoners based on their average score per round
prisoners.sort((a, b) => {
    const averageScoreA = a.finalScore / a.numberOfOpponents;
    const averageScoreB = b.finalScore / b.numberOfOpponents;
    return averageScoreB - averageScoreA;
});
// Write out results
fs.writeFile(`./results/results-${new Date().toLocaleDateString().replaceAll('/','-')}.txt`, JSON.stringify(prisoners, null, 2), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
// Log the sorted results
prisoners.forEach(prisoner => {
    const averageScorePerRound = prisoner.finalScore / prisoner.numberOfOpponents;
    console.log(`${prisoner.name} score: ${averageScorePerRound.toFixed(2)}`);
});