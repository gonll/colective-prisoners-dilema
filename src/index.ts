import { exit } from 'process';
import {type Prisoner, Prisoners} from './prisoners';
import { strategies } from './strats';
import * as fs from 'fs';
import {numberOfRandomPrisoners, minRounds, maxRounds, showAmmountResults, ammountOfGames, runAllStrats} from './settings'
import { Db } from './db';

// Types
export type Decision = 'cooperate' | 'defect';
export interface GamesPlayed {
    prisonerA: Prisoner;
    prisonerB: Prisoner;
    history: ConjoinedHistory;
    scoreA: number;
    scoreB: number;
    rounds: number;
}
type ConjoinedHistory = {a: Decision, b: Decision}[];

// Instances and earlyreturns
const PrisonersInstance = Prisoners.Instance; 
const {prisoners} = PrisonersInstance; 
if(!prisoners.length)exit();

//Store results in database
const DbInstance = Db.Instance; 
const gamesPlayed: GamesPlayed[] = [];
DbInstance.db

/**
 * Simulates a game between two prisoners over a specified number of rounds.
 * Each prisoner makes decisions based on their strategies and error margins.
 * The function updates the scores and history of each prisoner and returns the final scores.
 * 
 * @param {Prisoner} prisonerA - The first prisoner in the game.
 * @param {Prisoner} prisonerB - The second prisoner in the game.
 * @param {number} rounds - The number of rounds to play in the game.
 * @param {number} indexA - The index of prisonerA in the prisoner array.
 * @param {number} indexB - The index of prisonerB in the prisoner array.
 * @returns {[number, number]} - The final scores of prisonerA and prisonerB.
 */
function simulateGame(prisonerA: Prisoner, prisonerB: Prisoner, rounds: number, indexA: number, indexB: number): [number, number] {
    const historyA: Decision[] = [];
    const historyB: Decision[] = [];
    const conjoinedHistory: ConjoinedHistory = [];
    let scoreA = 0;
    let scoreB = 0;

    for (let round = 0; round < rounds; round++) {
        let decisionA = applyError(prisonerA.realStrategy(historyB, historyA, prisonerB.publicStrategy), prisonerA.errorMargin);
        let decisionB = applyError(prisonerB.realStrategy(historyA, historyB, prisonerA.publicStrategy), prisonerB.errorMargin);

        historyA.push(decisionA);
        historyB.push(decisionB);
        conjoinedHistory.push({a: decisionA, b: decisionB});
        [scoreA, scoreB] = updateScores(decisionA, decisionB, scoreA, scoreB);
        
        prisonerA.numberOfOpponents ++;
        prisonerB.numberOfOpponents ++;
    }

    prisonerA.finalScore += scoreA;
    prisonerB.finalScore += scoreB;

    PrisonersInstance.updatePrisonerByIndex(indexA, prisonerA);
    PrisonersInstance.updatePrisonerByIndex(indexB, prisonerB);

    gamesPlayed.push({
        prisonerA,
        prisonerB,
        history: conjoinedHistory,
        scoreA,
        scoreB,
        rounds
    })

    return [scoreA, scoreB];
}

/**
 * Applies a possible error to a prisoner's decision based on their error margin.
 * There's a chance that the prisoner's decision will be flipped from 'cooperate' to 'defect' or vice versa.
 * 
 * @param {Decision} decision - The original decision made by the prisoner.
 * @param {number} errorMargin - The probability of the decision being incorrect.
 * @returns {Decision} - The possibly altered decision.
 */
function applyError(decision: Decision, errorMargin: number): Decision {
    return Math.random() < errorMargin ? (decision === 'cooperate' ? 'defect' : 'cooperate') : decision;
}

/**
 * Updates and returns the scores of two prisoners based on their decisions in a round.
 * Scoring is based on the classic prisoner's dilemma payoff matrix.
 * 
 * @param {Decision} decisionA - The decision made by the first prisoner.
 * @param {Decision} decisionB - The decision made by the second prisoner.
 * @param {number} scoreA - The current score of the first prisoner.
 * @param {number} scoreB - The current score of the second prisoner.
 * @returns {[number, number]} - The updated scores of both prisoners.
 */
function updateScores(decisionA: Decision, decisionB: Decision, scoreA: number, scoreB: number): [number, number] {
    if (decisionA === 'cooperate' && decisionB === 'cooperate') {
        scoreA += 3;
        scoreB += 3;
    } else if (decisionA === 'cooperate' && decisionB === 'defect') {
        scoreB += 5;
    } else if (decisionA === 'defect' && decisionB === 'cooperate') {
        scoreA += 5;
    } else {
        scoreA += 1;
        scoreB += 1;
    }
    return [scoreA, scoreB];
}

/**
 * Creates a random prisoner with a randomly selected strategy and error margin.
 * 
 * @param {number} id - The identifier for the prisoner.
 * @returns {Prisoner} - The newly created prisoner object.
 */
function createRandomPrisoner(id: number): Prisoner {
    const strategyKeys = Object.keys(strategies);
    const randomStrategyKey = strategyKeys[Math.floor(Math.random() * strategyKeys.length)];
    const randomStrategy = strategies[randomStrategyKey];
    const errorMargin = parseFloat((Math.random() * 0.5).toFixed(1)); // Error margin between 0 and 0.2
    return {
        name: `${randomStrategyKey}`,
        errorMargin,
        finalScore: 0,
        description: `Randomly generated prisoner of id ${id} with the ${randomStrategyKey} strategy and a ${errorMargin} error margin.`,
        numberOfOpponents: 0,
        realStrategy: randomStrategy,
        publicStrategy: randomStrategy // Assuming public and real strategies are the same for now for simplicity
    };
}

/**
 * Runs the prisoner's dilemma game for a set of prisoners.
 * It iterates through all pairs of prisoners, simulating games between them.
 * 
 * @param {Prisoner[]} computedPrisoners - The array of prisoners to participate in the game.
 */
const run = (computedPrisoners: Prisoner[]) => {
    // Run game
    for (let indexA = 0; indexA < computedPrisoners.length; indexA++) {
        for (let indexB = indexA + 1; indexB < computedPrisoners.length; indexB++) {
            let rounds = Math.floor(Math.random() * maxRounds) + minRounds;
            simulateGame(computedPrisoners[indexA], computedPrisoners[indexB], rounds, indexA, indexB);
        }
    }
}

/**
 * Repeatedly runs the prisoner's dilemma game for the given number of times.
 * Each run involves simulating games between all pairs of prisoners.
 * 
 * @param {Prisoner[]} computedPrisoners - The array of prisoners to participate in the games.
 */
const runAllGames = (computedPrisoners: Prisoner[]) => {
    for(let i = 1; i <= ammountOfGames; i++ ){
        console.log("🚀 ~ Run number: ", i)
        run(computedPrisoners)
    }
}

// Execute program

// Generate and add random prisoners
for (let i = 0; i < numberOfRandomPrisoners; i++) {
    const randomPrisoner = createRandomPrisoner(i + 1);
    prisoners.push(randomPrisoner);
}

if(runAllStrats){
    console.log('Run all available strategies against each other enabled. No random nor repeated prisoners will be created.')
    const stratPrisoner = [];
    for(const strat in strategies){
        stratPrisoner.push({
            name: strat,
            errorMargin: 0,
            finalScore: 0,
            numberOfOpponents: 0,
            description: '',
            realStrategy: strategies[strat],
            publicStrategy: strategies[strat],
        })
    }
    runAllGames(stratPrisoner);
}else{
    runAllGames(prisoners);
}

console.log('--------------------------------------------');
console.log('End result ');
console.log('--------------------------------------------');
console.log('Higher means better performing');
// Sort prisoners based on their average score per round
prisoners.sort((a, b) => {
    const averageScoreA = a.finalScore / (a.numberOfOpponents || 1);
    const averageScoreB = b.finalScore / (b.numberOfOpponents || 1);
    return averageScoreB - averageScoreA;
});
const result = prisoners.map( p => ({name: p.name, finalScore: Number((p.finalScore/p.numberOfOpponents).toFixed(2))})).filter( p => p.finalScore > 0).slice(0,showAmmountResults);
// Write out results
fs.writeFile(`./results/results-${new Date().toLocaleDateString().replaceAll('/','-')}-${Date.now()}.txt`, JSON.stringify(result, null, 2), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
// Log the sorted results
console.log(result)

// Store results in db
DbInstance.insertGamesPlayed(JSON.stringify(gamesPlayed))