/*import express from 'express';
import CartManager from '../manager/CartManager.js';
import { obtenerSiguienteIdCarrito } from '../utilidades/contadorIds.js';

const router = express.Router();
const cartManager = new CartManager('carritos.json');

// Ruta para obtener todos los carritos
router.get('/', async (req, res) => {
  try {
    const carritos = await cartManager.obtenerCarritos();
    res.json(carritos);
  } catch (error) {
    console.error('Error al obtener todos los carritos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const carrito = await cartManager.obtenerCarritoPorId(parseInt(req.params.cid));
    if (carrito) {
      res.json(carrito);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener el carrito por ID:', error);
    res.status(500).send('Error interno del servidor');
  }
});
// Ruta para eliminar un producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const carritoId = parseInt(req.params.cid); // ID del carrito
    const productoId = parseInt(req.params.pid); // ID del producto

    // Obtener todos los carritos
    const carritos = await cartManager.obtenerCarritos();
    
    // Buscar el carrito específico
    const carrito = carritos.find(c => c.id === carritoId);

    if (!carrito) {
      return res.status(404).send('Carrito no encontrado');
    }

    // Filtrar los productos para eliminar el producto especificado
    carrito.products = carrito.products.filter(p => p.product !== productoId);
    
    // Guardar los cambios en el archivo
    await cartManager.guardarCarritos(carritos);

    // Responder con el carrito actualizado
    res.json(carrito);
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const nuevoCarrito = {
      id: obtenerSiguienteIdCarrito(),
      products: []
    };

    await cartManager.agregarCarrito(nuevoCarrito);
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    console.error('Error al agregar un nuevo carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para actualizar un carrito por ID
router.put('/:cid', async (req, res) => {
  try {
    const carritoActualizado = {
      ...req.body,
      id: parseInt(req.params.cid)
    };

    await cartManager.actualizarCarrito(parseInt(req.params.cid), carritoActualizado);
    res.json(carritoActualizado);
  } catch (error) {
    console.error('Error al actualizar el carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para eliminar un carrito por ID
router.delete('/:cid', async (req, res) => {
  try {
    await cartManager.eliminarCarrito(parseInt(req.params.cid));
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});
// Ruta para agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const carritoId = parseInt(req.params.cid); // ID del carrito
    const productoId = parseInt(req.params.pid); // ID del producto
    const { quantity } = req.body; // Cantidad del producto

    // Verificar si la cantidad es válida
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser un número positivo.' });
    }

    // Crear un objeto producto con solo el ID y la cantidad
    const producto = { product: productoId, quantity };

    // Agregar el producto al carrito
    await cartManager.agregarProductoAlCarrito(carritoId, producto);

    // Obtener el carrito actualizado
    const carritoActualizado = await cartManager.obtenerCarritoPorId(carritoId);

    if (carritoActualizado) {
      // Responder con el carrito actualizado
      res.json(carritoActualizado);
    } else {
      // Si no se encuentra el carrito, responder con un error 404
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});


export default router;*/

import express from 'express';
import CartManager from '../manager/CartManager.js';
import { obtenerSiguienteIdCarrito } from '../utilidades/contadorIds.js';

const router = express.Router();
const cartManager = new CartManager('carritos.json');

// Ruta para obtener todos los carritos
router.get('/', async (req, res) => {
  try {
    const carritos = await cartManager.obtenerCarritos();
    res.json(carritos);
  } catch (error) {
    console.error('Error al obtener todos los carritos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const carrito = await cartManager.obtenerCarritoPorId(parseInt(req.params.cid));
    if (carrito) {
      res.json(carrito);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener el carrito por ID:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para eliminar un producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const carritoId = parseInt(req.params.cid); // ID del carrito
    const productoId = parseInt(req.params.pid); // ID del producto

    // Obtener todos los carritos
    const carritos = await cartManager.obtenerCarritos();
    
    // Buscar el carrito específico
    const carrito = carritos.find(c => c.id === carritoId);

    if (!carrito) {
      return res.status(404).send('Carrito no encontrado');
    }

    // Filtrar los productos para eliminar el producto especificado
    carrito.products = carrito.products.filter(p => p.product !== productoId);
    
    // Guardar los cambios en el archivo
    await cartManager.guardarCarritos(carritos);

    // Responder con el carrito actualizado
    res.json(carrito);
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const nuevoCarrito = {
      id: obtenerSiguienteIdCarrito(),
      products: []
    };

    await cartManager.agregarCarrito(nuevoCarrito);
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    console.error('Error al agregar un nuevo carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para actualizar un carrito por ID
router.put('/:cid', async (req, res) => {
  try {
    const carritoActualizado = {
      ...req.body,
      id: parseInt(req.params.cid)
    };

    await cartManager.actualizarCarrito(parseInt(req.params.cid), carritoActualizado);
    res.json(carritoActualizado);
  } catch (error) {
    console.error('Error al actualizar el carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para eliminar un carrito por ID
router.delete('/:cid', async (req, res) => {
  try {
    await cartManager.eliminarCarrito(parseInt(req.params.cid));
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const carritoId = parseInt(req.params.cid); // ID del carrito
    const productoId = parseInt(req.params.pid); // ID del producto
    const { quantity } = req.body; // Cantidad del producto

    // Verificar si la cantidad es válida
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser un número positivo.' });
    }

    // Crear un objeto producto con solo el ID y la cantidad
    const producto = { product: productoId, quantity };

    // Agregar el producto al carrito
    await cartManager.agregarProductoAlCarrito(carritoId, producto);

    // Obtener el carrito actualizado
    const carritoActualizado = await cartManager.obtenerCarritoPorId(carritoId);

    if (carritoActualizado) {
      // Responder con el carrito actualizado
      res.json(carritoActualizado);
    } else {
      // Si no se encuentra el carrito, responder con un error 404
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;

