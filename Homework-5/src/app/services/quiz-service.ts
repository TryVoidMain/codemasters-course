import { IQuestion } from "../models/question";
import { get } from "./rest-service";

export async function GetQuestions(): Promise<IQuestion[]> {

    return await get<IQuestion[]>('questions');
}