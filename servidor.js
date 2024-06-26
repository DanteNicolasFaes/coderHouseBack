import express from 'express';
import bodyParser from 'body-parser'; 
import productosRouter from './rutas/productos.js';
import carritosRouter from './rutas/carritos.js';

const app = express();
const puerto = 8080;


app.use(bodyParser.json());


app.use('/api/products', productosRouter);
app.use('/api/carts', carritosRouter);

app.listen(puerto, () => {
  console.log(`Servidor escuchando en el puerto ${puerto}`);
});
