import { Decision } from '.';
import {Strategy, strategies, publicStrategies} from './strats';

export interface Prisoner {
    name: string;
    errorMargin: number;
    history: Decision[];
    finalScore: number;
    realStrategy: Strategy;
    publicStrategy: Strategy;
}

const {alwaysCooperate, alwaysDefect, random, titfortat} = strategies;
const prisonersDb: Prisoner[] = [
    {
        name: 'Tit for Tat',
        errorMargin: 0.05,
        history: [],
        finalScore: 0,
        realStrategy: titfortat,
        publicStrategy: publicStrategies.titfortat
    },
    {
        name: 'Always Cooperate',
        errorMargin: 0.03,
        history: [],
        finalScore: 0,
        realStrategy: alwaysCooperate,
        publicStrategy: publicStrategies.alwaysCooperate
    },
    {
        name: 'Always Defect',
        errorMargin: 0.1,
        history: [],
        finalScore: 0,
        realStrategy: alwaysDefect,
        publicStrategy: publicStrategies.alwaysDefect
    },
    {
        name: 'Random',
        errorMargin: 0.15,
        history: [],
        finalScore: 0,
        realStrategy: random,
        publicStrategy: publicStrategies.random
    }
];

export class Prisoners {
    public prisoners: Prisoner[];
    constructor () {
        this.prisoners = [];
        for(const prisoner of prisonersDb){
            this.prisoners.push(prisoner);
        }
    }

    public updatePrisoners(updatedPrisoners: Prisoner[]): Prisoner[] {
        this.prisoners = updatedPrisoners;
        return this.prisoners;
    }
    
    public updatePrisonerByIndex(prisonerIndex: number,updatedPrisoner: Prisoner): Prisoner {
        this.prisoners[prisonerIndex] = updatedPrisoner;
        return this.prisoners[prisonerIndex];
    }
    
    private static instance: Prisoners;
    public static get Instance(): Prisoners {
        return this.instance || (this.instance = new this());
    }
}