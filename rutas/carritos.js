import express from 'express';
import CartManager from '../manager/CartManager.js';
import { obtenerSiguienteIdCarrito } from '../utilidades/contadorIds.js';
import io from '../servidor.js';

const router = express.Router();
const cartManager = new CartManager('carritos.json');

//get generl
router.get('/', async (req, res) => {
  try {
    const carritos = await cartManager.obtenerCarritos();
    res.json(carritos);
  } catch (error) {
    console.error('Error al obtener todos los carritos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

//  carrito por ID
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

// elimino producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const carritoId = parseInt(req.params.cid); // ID del carrito
    const productoId = parseInt(req.params.pid); // ID del producto

    // todos los carritos
    const carritos = await cartManager.obtenerCarritos();
    
    // busco un carrito en particilar
    const carrito = carritos.find(c => c.id === carritoId);

    if (!carrito) {
      return res.status(404).send('Carrito no encontrado');
    }

    // filtrado de productos para eliminar el producto especificado
    carrito.products = carrito.products.filter(p => p.product !== productoId);
    
    // guardo los cambios en el archivo
    await cartManager.guardarCarritos(carritos);

    
    res.json(carrito);
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// ruta para crear un nuevo carrito
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

// ruta actualizar un carrito por ID
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

// ruta eliminar un carrito por ID
router.delete('/:cid', async (req, res) => {
  try {
    await cartManager.eliminarCarrito(parseInt(req.params.cid));
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// ruta para agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const carritoId = parseInt(req.params.cid); // ID del carrito
    const productoId = parseInt(req.params.pid); // ID del producto
    const { quantity } = req.body; // Cantidad del producto

    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser un número positivo.' });
    }

    
    const producto = { product: productoId, quantity };

    
    await cartManager.agregarProductoAlCarrito(carritoId, producto);

    
    const carritoActualizado = await cartManager.obtenerCarritoPorId(carritoId);

    if (carritoActualizado) {
      
      res.json(carritoActualizado);
    } else {
      
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});





router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const carritoId = parseInt(req.params.cid);
    const productoId = parseInt(req.params.pid);
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser un número positivo.' });
    }

    const producto = { product: productoId, quantity };
    await cartManager.agregarProductoAlCarrito(carritoId, producto);

    const carritoActualizado = await cartManager.obtenerCarritoPorId(carritoId);
    io.emit('updateCarts', carritoActualizado); 
    res.json(carritoActualizado);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});


router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const carritoId = parseInt(req.params.cid);
    const productoId = parseInt(req.params.pid);

    await cartManager.eliminarProductoDelCarrito(carritoId, productoId);

    const carritoActualizado = await cartManager.obtenerCarritoPorId(carritoId);
    io.emit('updateCarts', carritoActualizado); // Emite el carrito actualizado
    res.json(carritoActualizado);
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;