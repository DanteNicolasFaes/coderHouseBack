import fs from 'fs/promises';
import path from 'path';
import { __dirname } from '../utilidades/utils.js';

class ProductsManager {
  #ruta;

  constructor(ruta) {
    // Asegúrate de que la ruta apunte correctamente a la carpeta 'data'
    this.#ruta = path.join(__dirname, '..', 'data', ruta);
    console.log(`Ruta de productos: ${this.#ruta}`);
  }

  async obtenerProductos() {
    try {
      const datos = await fs.readFile(this.#ruta, 'utf-8');
      return JSON.parse(datos);
    } catch (error) {
      console.error('Error leyendo datos de productos:', error);
      return [];
    }
  }

  async agregarProducto(producto) {
    try {
      const productos = await this.obtenerProductos();
      productos.push(producto);
      await fs.writeFile(this.#ruta, JSON.stringify(productos, null, 2));
    } catch (error) {
      console.error('Error agregando producto:', error);
    }
  }

  async actualizarProducto(id, productoActualizado) {
    try {
      const productos = await this.obtenerProductos();
      const indice = productos.findIndex(producto => producto.id === id);
      if (indice !== -1) {
        productos[indice] = { ...productos[indice], ...productoActualizado };
        await fs.writeFile(this.#ruta, JSON.stringify(productos, null, 2));
      }
    } catch (error) {
      console.error('Error actualizando producto:', error);
    }
  }

  async eliminarProducto(id) {
    try {
      const productos = await this.obtenerProductos();
      const productosActualizados = productos.filter(producto => producto.id !== id);
      await fs.writeFile(this.#ruta, JSON.stringify(productosActualizados, null, 2));
    } catch (error) {
      console.error('Error eliminando producto:', error);
    }
  }

  async obtenerProductoPorId(id) {
    try {
      const productos = await this.obtenerProductos();
      return productos.find(producto => producto.id === id);
    } catch (error) {
      console.error('Error obteniendo producto por ID:', error);
      return null;
    }
  }
}

export default ProductsManager;
