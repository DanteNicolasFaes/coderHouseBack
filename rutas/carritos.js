import express from 'express';
import fs from 'fs/promises';
import { obtenerSiguienteIdCarrito } from '../utilidades/contadorIds.js';

const router = express.Router();
const rutaCarritos = './data/carritos.json';
const rutaProductos = './data/productos.json';

const leerCarritos = async () => {
  try {
    const datosCarritos = await fs.readFile(rutaCarritos);
    return JSON.parse(datosCarritos);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(rutaCarritos, '[]');
      return [];
    }
    throw error;
  }
};

const escribirCarritos = async (carritos) => {
  await fs.writeFile(rutaCarritos, JSON.stringify(carritos, null, 2));
};

const leerProductos = async () => {
  try {
    const datosProductos = await fs.readFile(rutaProductos);
    return JSON.parse(datosProductos);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(rutaProductos, '[]');
      return [];
    }
    throw error;
  }
};


router.post('/', async (req, res) => {
  try {
    const carritos = await leerCarritos();
    const nuevoCarrito = {
      id: obtenerSiguienteIdCarrito(),
      products: []
    };
    carritos.push(nuevoCarrito);
    await escribirCarritos(carritos);
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    console.error('Error al crear un nuevo carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});


router.get('/:cid', async (req, res) => {
  try {
    const carritos = await leerCarritos();
    const carrito = carritos.find(c => c.id === parseInt(req.params.cid));
    if (!carrito) {
      return res.status(404).send('Carrito no encontrado');
    }
    res.json(carrito.products);
  } catch (error) {
    console.error('Error al obtener productos del carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});


router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const carritos = await leerCarritos();
    const productos = await leerProductos();

    const carrito = carritos.find(c => c.id === parseInt(cid));
    if (!carrito) {
      return res.status(404).send('Carrito no encontrado');
    }

    const producto = productos.find(p => p.id === parseInt(pid));
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }

    const indiceProducto = carrito.products.findIndex(p => p.product === parseInt(pid));
    if (indiceProducto === -1) {
      carrito.products.push({ product: parseInt(pid), quantity: 1 });
    } else {
      carrito.products[indiceProducto].quantity += 1;
    }

    await escribirCarritos(carritos);
    res.status(201).json(carrito.products);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;
