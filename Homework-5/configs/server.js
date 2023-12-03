const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('..\\src\\db\\db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

server.use(jsonServer.bodyParser);


server.post('/check-answer', (req, res) => {
    res.jsonp(req.query)
});

server.post('calculate-answers')


server.listen(3000, () => {
    
});