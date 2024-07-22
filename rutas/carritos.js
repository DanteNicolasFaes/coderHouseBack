import express from 'express';
import CartManager from '../manager/CartManager.js';
import { obtenerSiguienteIdCarrito } from '../utilidades/contadorIds.js';

const router = express.Router();
const cartManager = new CartManager('data/carritos.json');

router.get('/', async (req, res) => {
  try {
    const carritos = await cartManager.obtenerCarritos();
    res.json(carritos);
  } catch (error) {
    console.error('Error al obtener todos los carritos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

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


router.delete('/:cid', async (req, res) => {
  try {
    await cartManager.eliminarCarrito(parseInt(req.params.cid));
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});


router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const carritoId = parseInt(req.params.cid);
    const productoId = parseInt(req.params.pid);
    
    
    const carrito = await cartManager.obtenerCarritoPorId(carritoId);
    if (!carrito) {
      return res.status(404).send('Carrito no encontrado');
    }
    const productoIndex = carrito.products.findIndex(p => p.product === productoId);
    if (productoIndex !== -1) {
      carrito.products[productoIndex].quantity += 1;
    } else {
      carrito.products.push({ product: productoId, quantity: 1 });
    }

    
    await cartManager.actualizarCarrito(carritoId, carrito);
    res.json(carrito);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;
