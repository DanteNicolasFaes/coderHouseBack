/*
import express from 'express';
import fs from 'fs/promises'; // Usamos fs/promises para manejar promesas en lugar de callbacks
import { obtenerSiguienteIdCarrito } from '../utilidades/contadorIds.js'; // Importamos funciones específicas

const router = express.Router();
const rutaCarritos = './data/carritos.json';

const leerCarritos = async () => {
  try {
    if (!(await fs.stat(rutaCarritos)).isFile()) {
      await fs.writeFile(rutaCarritos, JSON.stringify([])); // Si el archivo no existe, creamos un archivo vacío
    }
    const datosCarritos = await fs.readFile(rutaCarritos);
    return JSON.parse(datosCarritos);
  } catch (error) {
    console.error('Error al leer el archivo de carritos:', error);
    return [];
  }
};

const escribirCarritos = async (carritos) => {
  try {
    await fs.writeFile(rutaCarritos, JSON.stringify(carritos, null, 2));
  } catch (error) {
    console.error('Error al escribir en el archivo de carritos:', error);
  }
};

// POST /api/carts - Crear un nuevo carrito
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

// GET /api/carts/:cid - Listar productos de un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const carritos = await leerCarritos();
    const carrito = carritos.find(c => c.id === parseInt(req.params.cid));
    if (carrito) {
      res.json(carrito.products);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
});

// POST /api/carts/:cid/product/:pid - Agregar producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const carritos = await leerCarritos();
    const carrito = carritos.find(c => c.id === parseInt(req.params.cid));

    if (!carrito) {
      return res.status(404).send('Carrito no encontrado');
    }

    const indiceProducto = carrito.products.findIndex(p => p.product === parseInt(req.params.pid));
    if (indiceProducto === -1) {
      carrito.products.push({ product: parseInt(req.params.pid), quantity: 1 });
    } else {
      carrito.products[indiceProducto].quantity += 1;
    }

    await escribirCarritos(carritos);
    res.status(201).json(carrito);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// PATCH /api/carts/:cid/product/:pid - Actualizar la cantidad de un producto en un carrito
router.patch('/:cid/product/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).send('Cantidad no válida');
    }

    const carritos = await leerCarritos();
    const carrito = carritos.find(c => c.id === parseInt(req.params.cid));

    if (!carrito) {
      return res.status(404).send('Carrito no encontrado');
    }

    const indiceProducto = carrito.products.findIndex(p => p.product === parseInt(req.params.pid));
    if (indiceProducto === -1) {
      return res.status(404).send('Producto no encontrado en el carrito');
    }

    carrito.products[indiceProducto].quantity = quantity;
    await escribirCarritos(carritos);
    res.json(carrito);
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;
*/
// rutas/carritos.js

// rutas/carritos.js

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

const escribirProductos = async (productos) => {
  await fs.writeFile(rutaProductos, JSON.stringify(productos, null, 2));
};

// POST /api/carts/ - Crear un nuevo carrito
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

// GET /api/carts/:cid - Listar productos del carrito por ID de carrito
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

// POST /api/carts/:cid/product/:pid - Agregar producto al carrito por IDs de carrito y producto
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
