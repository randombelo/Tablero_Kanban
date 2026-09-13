const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();   // ← incluye CORS, logger, estáticos

const port = process.env.PORT || 3000;       // ← Render inyecta PORT (10000)

server.use(middlewares);
server.use(router);
server.listen(port, () => console.log(`json-server corriendo en :${port}`));