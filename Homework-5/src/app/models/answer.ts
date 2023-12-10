export interface IUserAnswer {
    questionId: number;
    choosenAnswerId: number;
}

export interface IServerAnswer {
    isCorrect: boolean;
    correctAnswer: number;
}