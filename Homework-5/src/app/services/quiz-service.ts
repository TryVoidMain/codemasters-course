import { IUserAnswer, IServerAnswer } from "../models/answer";
import { IQuestion } from "../models/question";
import { get, post } from "./rest-service";

export async function GetQuestions(): Promise<Array<IQuestion>> {
    return await get<Array<IQuestion>>('questions');
}

export async function CheckAnswer(answer: IUserAnswer): Promise<IServerAnswer> {
    return await post<IUserAnswer, IServerAnswer>('check-answer', answer);
}