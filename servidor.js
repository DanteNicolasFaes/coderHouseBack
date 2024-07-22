import express from 'express';
import productosRouter from './rutas/productos.js';
import carritosRouter from './rutas/carritos.js';
import { __dirname } from './utilidades/utils.js';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const puerto = 8080;
const server = http.createServer(app);
const io = new Server(server);


app.use(express.json());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productosRouter);
app.use('/api/carts', carritosRouter);

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
});

app.listen(puerto), () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`)};

export default io;
