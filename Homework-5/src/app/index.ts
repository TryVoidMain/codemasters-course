import { IAnswer, IUserAnswer } from "./models/answer";
import { IQuestion } from "./models/question";
import { GetQuestions } from "./services/quiz-service";

export class App {
    public questionH1: HTMLHeadingElement;
    public answersDiv: HTMLDivElement;
    public nextButton: HTMLButtonElement;
    
    public currentQuestionId: number = 0;
    public questions: IQuestion[] = [];
    public userAnswers: IUserAnswer[] = [];

    constructor() {
        this.questionH1 = document.querySelector<HTMLHeadingElement>('#question') as HTMLHeadingElement;
        this.answersDiv = document.querySelector<HTMLDivElement>('#questions') as HTMLDivElement;
        this.nextButton = document.querySelector<HTMLButtonElement>('#btn-answer') as HTMLButtonElement;
    }

    public async init() {
        this.questions = await GetQuestions();
        this.currentQuestionId = 1;
        this.ShowQuestion(this.currentQuestionId);
        this.nextButton.addEventListener('click', () => {
            this.NextQuestion();
        })
    }

    public ShowQuestion(questionId: number) {
        if (!questionId) {
            throw Error('Server error. Wrong question Id')
        }

        const currentQuestion: IQuestion = this.questions[questionId];

        this.FillQuestion(currentQuestion.question);

        if (currentQuestion.answers && (currentQuestion.answers.length == 4)) {
            for (let i = 0; i < currentQuestion.answers.length; i++) {
                const answer: IAnswer = {
                    questionId: questionId, 
                    questionAnswer: currentQuestion.answers[i],
                    answerId: i
                }

                this.CreateAnswerButton(answer);
            }
        }
    }

    public NextQuestion() {
        this.ResetAnswerButton();
        this.currentQuestionId++;
        this.ShowQuestion(this.currentQuestionId);
    }

    public ResetAnswerButton() {
        this.nextButton.style.display = 'none';
        while (this.answersDiv.firstChild) {
            this.answersDiv.removeChild(this.answersDiv.firstChild);
        }
    }


    private FillQuestion(question: string) {
        if (question) {
            this.questionH1.textContent = question;
        } else {
            throw Error('Server error. Question string was corrupted');
        }
    }

    private CreateAnswerButton(answer: IAnswer) {
        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = answer.questionAnswer;
        button.classList.add('button', 'button__answer');
        button.dataset.id = answer.questionId.toString();

        this.answersDiv.appendChild(button);
        button.addEventListener('click', () => this.SelectAnswer);
    }

    private SelectAnswer(e: MouseEvent) {
        const button = e.target as HTMLButtonElement;

        if (!button.dataset.id) {
            throw Error('No answer Id info');
        }

        this.nextButton.style.display = 'block';

        this.userAnswers.forEach((a) => {
            if (a.questionId == this.currentQuestionId) {
                throw Error('You already answered at this question!');
            }
        });

        const choosenAnswerId = parseInt(button.dataset.id);
        const questionCorrectAnswerId = this.questions[this.currentQuestionId].correctAnswer;

        const userAnswer: IUserAnswer = {
            choosenAnswerId: choosenAnswerId,
            questionId: this.questions[this.currentQuestionId].id
        }

        this.userAnswers.push(userAnswer);
        this.ShowCorrectAnswer(questionCorrectAnswerId);
        
        if (choosenAnswerId != questionCorrectAnswerId) {
            button.classList.add('button__answer_error');
        }
    }

    private ShowCorrectAnswer(questionCorrectAnswerId: number) {
        this.answersDiv.querySelectorAll('.button__answer').forEach((b) => {
            const button: HTMLButtonElement = b as HTMLButtonElement;

            if (button.dataset.id) {
                const buttonId = parseInt(button.dataset.id);
                
                if (buttonId == questionCorrectAnswerId) {
                    button.classList.add('button__answer_success');
                }
            }
        })
    }
 }