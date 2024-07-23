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




router.post('/', async (req, res) => {
  try {
    const nuevoProducto = req.body;
    await productsManager.agregarProducto(nuevoProducto);
    const productosActualizados = await productsManager.obtenerProductos();
    io.emit('updateProducts', productosActualizados); 
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al agregar un producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});


router.delete('/:pid', async (req, res) => {
  try {
    const productoId = parseInt(req.params.pid);
    await productsManager.eliminarProducto(productoId);
    const productosActualizados = await productsManager.obtenerProductos();
    io.emit('updateProducts', productosActualizados); 
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar un producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});
export default router;