require('dotenv').config();

const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router(process.env.DB_FILE || 'db.json');
const middlewares = jsonServer.defaults();

const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(router);
server.listen(port, () => console.log(`json-server corriendo en :${port}`));