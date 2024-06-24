// servidor.js
import express from 'express';
import bodyParser from 'body-parser'; // Importar body-parser
import productosRouter from './rutas/productos.js';
import carritosRouter from './rutas/carritos.js';

const app = express();
const puerto = 8080;

// Middleware para parsear el body de las peticiones JSON
app.use(bodyParser.json());

// Rutas para productos y carritos
app.use('/api/products', productosRouter);
app.use('/api/carts', carritosRouter);

app.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});
