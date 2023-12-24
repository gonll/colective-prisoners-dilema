import {type Prisoner, Prisoners} from './prisoners';
import { strategies } from './strats';
export type Decision = 'cooperate' | 'defect';

const {prisoners} = Prisoners.Instance; 

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


// Simular juego entre prisioneros
prisoners.forEach((prisonerA, indexA) => {
    prisoners.forEach((prisonerB, indexB) => {
        if (indexA !== indexB) {
            let rounds = Math.floor(Math.random() * 291) + 10; // Entre 10 y 300
            let [scoreA, scoreB] = simulateGame(prisonerA, prisonerB, rounds,indexA, indexB);
            console.log(`Resultado entre ${prisonerA.name} y ${prisonerB.name}: ${scoreA} - ${scoreB}`);
        }
    });
});
console.log('RESULTADO FINAL DE CADA ESTRATEGIA: ');
prisoners.forEach(prisoner => {
    console.log(prisoner.name, ' score: ', prisoner.finalScore)
})
