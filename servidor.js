import express from 'express';
import productosRouter from './rutas/productos.js';
import carritosRouter from './rutas/carritos.js';
import { __dirname } from './utilidades/utils.js';

const app = express();
const puerto = 8080;

// Usamos express.json() en lugar de bodyParser.json()
app.use(express.json());

app.use('/api/products', productosRouter);
app.use('/api/carts', carritosRouter);

app.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});
