const http = require('http');

let todos = [];
let currentId = 1;
let error = `{"error": "Todo not found"}`;

http.createServer(function (req, res) {
    
    if (req.method === 'GET' && req.url ==='/todos') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(todos));
    }

    if (req.method === 'POST' && req.url === '/create/todo') {
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', () => {
            let data = JSON.parse(body);

            let todo = {
                id: currentId++,
                title: data.title,
                description: data.description
            };
            todos.push(todo);

            res.writeHead('200', { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(todos));
        });
    }

    if (req.method === 'GET' && req.url.startsWith('/todo')) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const id = Number(url.searchParams.get('id'));

        const todo = todos.find( t => t.id === id);

        if (!todo) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(error);
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(todo));
        }
    }

    if (req.method === 'DELETE' && req.url.startsWith('/todo')) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const id = Number(url.searchParams.get('id'));

        if (todos.find(t => t.id === id)) {
            todos = todos.filter(t => t.id !== id);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(todos))
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(error)
        }
    }

}).listen(8080, () => {
    console.log("server started at port 8080: http://localhost:8080");
});