import { IQuestion } from "../models/question";
import { get } from "./rest-service";

export async function GetQuestions(): Promise<Map<number, IQuestion>> {
    return await get<Map<number, IQuestion>>('questions');
}