import { Decision } from '.';
import {Strategy, strategies, publicStrategies} from './strats';

export interface Prisoner {
    name: string;
    errorMargin: number;
    history: Decision[];
    finalScore: number;
    description: string;
    numberOfOpponents: number;
    realStrategy: Strategy;
    publicStrategy: Strategy;
}

const {alwaysCooperate, alwaysDefect, random, titfortat} = strategies;
const generalErrorMargin = 0;
const prisonersDb: Prisoner[] = [
    {
        name: 'Tit for Tat',
        errorMargin: generalErrorMargin + 0.05,
        history: [],
        finalScore: 0,
        numberOfOpponents: 0,
        description: 'Starts nice, then follows the other prisoner.',
        realStrategy: titfortat,
        publicStrategy: publicStrategies.titfortat
    },
    {
        name: 'Always Cooperate',
        errorMargin: generalErrorMargin + 0.03,
        history: [],
        finalScore: 0,
        numberOfOpponents: 0,
        description: 'Always coooperates.',
        realStrategy: alwaysCooperate,
        publicStrategy: publicStrategies.alwaysCooperate
    },
    {
        name: 'Always Defect',
        errorMargin: generalErrorMargin + 0.1,
        history: [],
        finalScore: 0,
        numberOfOpponents: 0,
        description: 'Always defects.',
        realStrategy: alwaysDefect,
        publicStrategy: publicStrategies.alwaysDefect
    },
    {
        name: 'Random',
        errorMargin: generalErrorMargin + 0.15,
        history: [],
        finalScore: 0,
        numberOfOpponents: 0,
        description: 'Randomly cooperates and defects. Mostly used as base line.',
        realStrategy: random,
        publicStrategy: publicStrategies.random
    },
    {
        name: 'Adaptive',
        errorMargin: generalErrorMargin + 0.07,
        history: [],
        finalScore: 0,
        numberOfOpponents: 0,
        description: 'Adapts based on the opponent\'s past behavior, favoring the most frequent action.',
        realStrategy: strategies.adaptive,
        publicStrategy: publicStrategies.adaptive
    },
    {
        name: 'Gradual Trust',
        errorMargin: generalErrorMargin + 0.06,
        history: [],
        finalScore: 0,
        numberOfOpponents: 0,
        description: 'Begins with defection and starts cooperating after the opponent consistently cooperates.',
        realStrategy: strategies.gradualTrust,
        publicStrategy: publicStrategies.gradualTrust
    },
    {
        name: 'Advanced Mirror',
        errorMargin: generalErrorMargin + 0.04,
        history: [],
        finalScore: 0,
        numberOfOpponents: 0,
        description: 'Like Tit for Tat, but with a chance to forgive based on the opponent\'s cooperation rate.',
        realStrategy: strategies.advancedMirror,
        publicStrategy: publicStrategies.advancedMirror
    },
    {
        name: 'Advanced Mirror - High error margin',
        errorMargin: generalErrorMargin + 0.2,
        history: [],
        finalScore: 0,
        numberOfOpponents: 0,
        description: 'Like Tit for Tat, but with a chance to forgive based on the opponent\'s cooperation rate. High erroor margin.',
        realStrategy: strategies.advancedMirror,
        publicStrategy: publicStrategies.advancedMirror
    },
    {
        name: 'Vengeful',
        errorMargin: generalErrorMargin + 0.08,
        history: [],
        finalScore: 0,
        numberOfOpponents: 0,
        description: 'Cooperates until the opponent defects once, then always defects.',
        realStrategy: strategies.vengeful,
        publicStrategy: publicStrategies.vengeful
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