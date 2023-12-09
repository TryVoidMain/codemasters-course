export interface IServerQuestion extends IQuestion {
    correctAnswer: number;
}

export interface IQuestion {
    id: number;
    question: string;
    answers: IAnswer[];
}

export interface IAnswer {
    answerId: number;
    answer: string;
}