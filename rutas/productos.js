
/*
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
      await fs.writeFile(rutaProductos, JSON.stringify([]));
      return [];
    }
    throw error;
  }
};

const escribirProductos = async (productos) => {
  await fs.writeFile(rutaProductos, JSON.stringify(productos, null, 2));
};


export const obtenerProductoPorId = async (id) => {
  const productos = await leerProductos();
  return productos.find(p => p.id === parseInt(id));
};


router.get('/', async (req, res) => {
  try {
    const productos = await leerProductos();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});


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
      id: parseInt(req.params.pid) 
    };

    productos[indiceProducto] = productoActualizado;
    await escribirProductos(productos);
    res.json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});


router.patch('/:pid', async (req, res) => {
  try {
    const productos = await leerProductos();
    const indiceProducto = productos.findIndex(p => p.id === parseInt(req.params.pid));

    if (indiceProducto === -1) {
      return res.status(404).send('Producto no encontrado');
    }

   
    for (let campo in req.body) {
      if (campo !== 'id') { 
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
*/

import express from 'express';
import ProductsManager from '../manager/ProductsManager.js';
import { obtenerSiguienteIdProducto } from '../utilidades/contadorIds.js';
import io from '../servidor.js';

const router = express.Router();
const productsManager = new ProductsManager('productos.json');

router.get('/', async (req, res) => {
  try {
    const productos = await productsManager.obtenerProductos();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const producto = await productsManager.obtenerProductoPorId(parseInt(req.params.pid));
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

router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).send('Todos los campos son obligatorios, excepto thumbnails');
    }

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

    await productsManager.agregarProducto(nuevoProducto);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al agregar un nuevo producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const productoActualizado = {
      ...req.body,
      id: parseInt(req.params.pid)
    };

    await productsManager.actualizarProducto(parseInt(req.params.pid), productoActualizado);
    res.json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.patch('/:pid', async (req, res) => {
  try {
    const producto = await productsManager.obtenerProductoPorId(parseInt(req.params.pid));

    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }

    for (let campo in req.body) {
      if (campo !== 'id') {
        producto[campo] = req.body[campo];
      }
    }

    await productsManager.actualizarProducto(parseInt(req.params.pid), producto);
    res.json(producto);
  } catch (error) {
    console.error('Error al actualizar parcialmente el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    await productsManager.eliminarProducto(parseInt(req.params.pid));
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});



// Ruta para agregar un producto
router.post('/', async (req, res) => {
  try {
    const nuevoProducto = req.body;
    await productsManager.agregarProducto(nuevoProducto);
    const productosActualizados = await productsManager.obtenerProductos();
    io.emit('updateProducts', productosActualizados); // Emite la lista de productos actualizada
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al agregar un producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para eliminar un producto
router.delete('/:pid', async (req, res) => {
  try {
    const productoId = parseInt(req.params.pid);
    await productsManager.eliminarProducto(productoId);
    const productosActualizados = await productsManager.obtenerProductos();
    io.emit('updateProducts', productosActualizados); // Emite la lista de productos actualizada
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar un producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});
export default router;