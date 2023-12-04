import { IAnswer, IUserAnswer } from "./models/answer";
import { IQuestion } from "./models/question";
import { GetQuestions } from "./services/quiz-service";

export class App {
    public questionH1: HTMLHeadingElement;
    public answersDiv: HTMLDivElement;
    public nextButton: HTMLButtonElement;
    
    public currentQuestionId: number = 0;
    public userAnswers = new Array<IUserAnswer>();
    public questions = new Map<number, IQuestion>();

    constructor() {
        this.questionH1 = document.querySelector<HTMLHeadingElement>('#question') as HTMLHeadingElement;
        this.answersDiv = document.querySelector<HTMLDivElement>('#questions') as HTMLDivElement;
        this.nextButton = document.querySelector<HTMLButtonElement>('#btn-answer') as HTMLButtonElement;
    }

    public async init() {
        this.questions = await GetQuestions();
        this.currentQuestionId = this.questions.keys().next().value;
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
        currentQuestion.answers.forEach((a) => {
            this.CreateAnswerButton(a);
        })
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
        button.innerHTML = answer.answer;
        button.classList.add('button', 'button__answer');
        button.dataset.id = answer.answerId.toString();

        this.answersDiv.appendChild(button);
        button.addEventListener('click', () => this.OnSelectAnswer);
    }

    private OnSelectAnswer(e: MouseEvent) {
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