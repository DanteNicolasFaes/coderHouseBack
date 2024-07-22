
import express from 'express';
import CartManager from '../manager/CartManager.js';  
import ProductManager from '../manager/ProductsManager.js';
import { obtenerSiguienteIdCarrito } from '../utilidades/contadorIds.js';

const router = express.Router();
const cartManager = new CartManager('data/carritos.json');
const productManager = new ProductManager('data/productos.json');

router.post('/', async (req, res) => {
  try {
    const nuevoCarrito = {
      id: obtenerSiguienteIdCarrito(),
      products: []
    };
    await cartManager.addCart(nuevoCarrito);
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    console.error('Error al crear un nuevo carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const carrito = await cartManager.getCartById(parseInt(req.params.cid));
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
    const carrito = await cartManager.getCartById(parseInt(cid));
    if (!carrito) {
      return res.status(404).send('Carrito no encontrado');
    }

    const producto = await productManager.getProductById(parseInt(pid));
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }

    const indiceProducto = carrito.products.findIndex(p => p.product === parseInt(pid));
    if (indiceProducto === -1) {
      carrito.products.push({ product: parseInt(pid), quantity: 1 });
    } else {
      carrito.products[indiceProducto].quantity += 1;
    }

    await cartManager.updateCart(parseInt(cid), carrito);
    res.status(201).json(carrito.products);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;

