import { IUserAnswer } from "./models/answer";
import { IQuestion, IAnswer } from "./models/question";
import { CheckAnswer, GetQuestions } from "./services/quiz-service";

export class App {
    public questionH1: HTMLHeadingElement;
    public answersDiv: HTMLDivElement;
    public nextButton: HTMLButtonElement;
    
    private currentQuestionId: number = 0;
    private correctAnswers: number = 0;
    private incorrectAnswers: number = 0;

    public userAnswers = new Array<IUserAnswer>();
    public questions = new Array<IQuestion>();

    constructor() {
        this.questionH1 = document.querySelector<HTMLHeadingElement>('#question') as HTMLHeadingElement;
        this.answersDiv = document.querySelector<HTMLDivElement>('#questions') as HTMLDivElement;
        this.nextButton = document.querySelector<HTMLButtonElement>('#btn-answer') as HTMLButtonElement;
    }

    public async init() {
        this.questions = await GetQuestions();
        let question = this.questions.shift();
        if (question) {
            this.ShowQuestion(question);
        }
        else {
            throw Error('There is no questions on server');
        }
    }

    public ShowQuestion(question: IQuestion) {
        this.ResetAnswersDiv();
        this.FillQuestion(question.question);

        this.currentQuestionId = question.id;

        question.answers.forEach((a) => {
            this.CreateAnswerButton(a);
        });

        this.nextButton.addEventListener('click', () => {
            const nextQuestion = this.questions.shift();
            if (nextQuestion) {
                this.ShowQuestion(nextQuestion);
            } else {
                this.EndGame();
            }
        });
    }

    public ResetAnswersDiv() {
        this.nextButton.setAttribute("disabled","disabled");
        while (this.answersDiv.firstChild) {
            this.answersDiv.removeChild(this.answersDiv.firstChild);
        }
    }

    private FillQuestion(question: string) {
        if (question) {
            this.questionH1.textContent = question;
        } else {
            throw Error('Question string was corrupted');
        }
    }

    private CreateAnswerButton(answer: IAnswer) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = answer.answer;

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

        this.userAnswers.forEach((a) => {
            if (a.questionId === this.currentQuestionId) {
                throw Error('You already answered at this question!');
            }
        });

        const choosenAnswerId = parseInt(button.dataset.id);
        let userAnswer: IUserAnswer = { 
            choosenAnswerId: choosenAnswerId, 
            questionId: this.currentQuestionId
        };

        this.userAnswers.push(userAnswer);

        try {
            CheckAnswer(userAnswer).then((res) => {
                if (res) {
                    if (res.correctAnswer === choosenAnswerId) {
                        this.correctAnswers++;
                        button.classList.add('button__answer_success');
                    } else {
                        this.incorrectAnswers++;
                        button.classList.add('button__answer_error');
                        this.ShowCorrectAnswer(res.correctAnswer);
                    }
                } else {
                    throw Error("Wrong answer from server");
                }
            });
        }
        catch (e) {
            console.log((e as Error).message);
        }
        finally {
            this.nextButton.removeAttribute('disabled');
        }
    }

    private ShowCorrectAnswer(questionCorrectAnswerId: number) {
        this.answersDiv.querySelectorAll('.button__answer').forEach((b) => {
            const button: HTMLButtonElement = b as HTMLButtonElement;

            if (button.dataset.id) {
                const buttonId = parseInt(button.dataset.id);
                
                if (buttonId === questionCorrectAnswerId) {
                    button.classList.add('button__answer_success');
                }
            }
        });
    }

    private EndGame() {
        this.questionH1.textContent = 'Quiz ended. Your\'s stats: ';
        this.ResetAnswersDiv();
        let result = 
`<div> \
    <span>Правильных ответов: ${this.correctAnswers}</span>    \
    <span>Неправильных ответов: ${this.incorrectAnswers}</span>   \
</div>`;
        
        this.answersDiv.innerHTML = result;

        this.nextButton.textContent = 'Play again';
        this.nextButton.addEventListener('click', () => {
            this.init();
        });
    }
 }