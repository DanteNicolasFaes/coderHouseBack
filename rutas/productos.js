// rutas/productos.js

import express from 'express';
import fs from 'fs/promises';
import { obtenerSiguienteIdProducto } from '../utilidades/contadorIds.js';

const router = express.Router();
const rutaProductos = './data/productos.json';

const leerProductos = async () => {
  try {
    const datosProductos = await fs.readFile(rutaProductos);
    return JSON.parse(datosProductos);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Si el archivo no existe, se crea vacío
      await fs.writeFile(rutaProductos, JSON.stringify([]));
      return [];
    }
    throw error;
  }
};

const escribirProductos = async (productos) => {
  await fs.writeFile(rutaProductos, JSON.stringify(productos, null, 2));
};

// Función para obtener un producto por su ID
export const obtenerProductoPorId = async (id) => {
  const productos = await leerProductos();
  return productos.find(p => p.id === parseInt(id));
};

// GET /api/products - Listar todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await leerProductos();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// GET /api/products/:pid - Obtener un producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const producto = await obtenerProductoPorId(req.params.pid);
    if (producto) {
      res.json(producto);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener el producto por ID:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// POST /api/products - Agregar un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).send('Todos los campos son obligatorios, excepto thumbnails');
    }

    const productos = await leerProductos();
    const nuevoProducto = {
      id: obtenerSiguienteIdProducto(),
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails
    };

    productos.push(nuevoProducto);
    await escribirProductos(productos);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al agregar un nuevo producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// PUT /api/products/:pid - Actualizar un producto por ID
router.put('/:pid', async (req, res) => {
  try {
    const productos = await leerProductos();
    const indiceProducto = productos.findIndex(p => p.id === parseInt(req.params.pid));

    if (indiceProducto === -1) {
      return res.status(404).send('Producto no encontrado');
    }

    const productoActualizado = {
      ...productos[indiceProducto],
      ...req.body,
      id: parseInt(req.params.pid) // Asegurar que el ID no cambie
    };

    productos[indiceProducto] = productoActualizado;
    await escribirProductos(productos);
    res.json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// PATCH /api/products/:pid - Actualizar parcialmente un producto por ID
router.patch('/:pid', async (req, res) => {
  try {
    const productos = await leerProductos();
    const indiceProducto = productos.findIndex(p => p.id === parseInt(req.params.pid));

    if (indiceProducto === -1) {
      return res.status(404).send('Producto no encontrado');
    }

    // Actualizar solo las propiedades especificadas en el body
    for (let campo in req.body) {
      if (campo !== 'id') { // No permitir la actualización del ID
        productos[indiceProducto][campo] = req.body[campo];
      }
    }

    await escribirProductos(productos);
    res.json(productos[indiceProducto]);
  } catch (error) {
    console.error('Error al actualizar parcialmente el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// DELETE /api/products/:pid - Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
  try {
    const productos = await leerProductos();
    const nuevosProductos = productos.filter(p => p.id !== parseInt(req.params.pid));

    if (productos.length === nuevosProductos.length) {
      return res.status(404).send('Producto no encontrado');
    }

    await escribirProductos(nuevosProductos);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;
