import { IAnswer } from "./answer";

export interface IQuestion {
    question: string;
    correctAnswer: number;
    answers: IAnswer[];
}