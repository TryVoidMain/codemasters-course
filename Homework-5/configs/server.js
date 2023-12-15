const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./src/db/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/check-answer', (req, res) => {
    const questions = router.db.get('questions').value();
    const questionId = req.body.questionId;
    const userAnswer = req.body.choosenAnswerId;
    const question = questions.find(q => q.id === questionId);
    const isCorrect = question.correctAnswer === userAnswer;
    
    res.json({
        isCorrect: isCorrect,
        correctAnswer: question.correctAnswer
    });
});

server.use(router);
server.listen(3000, () => {
    console.log('json-server started');
});