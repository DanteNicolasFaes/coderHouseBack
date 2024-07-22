import fs from 'fs/promises';
import path from 'path';
import { __dirname } from '../utilidades/utils.js';

class CartManager {
  #ruta;

  constructor(ruta) {
    this.#ruta = path.join(__dirname, ruta);
  }

  async obtenerCarritos() {
    try {
      const datos = await fs.readFile(this.#ruta, 'utf-8');
      return JSON.parse(datos);
    } catch (error) {
      console.error('Error leyendo datos de carritos:', error);
      return [];
    }
  }

  async agregarCarrito(carrito) {
    try {
      const carritos = await this.obtenerCarritos();
      carritos.push(carrito);
      await fs.writeFile(this.#ruta, JSON.stringify(carritos, null, 2));
    } catch (error) {
      console.error('Error agregando carrito:', error);
    }
  }

  async actualizarCarrito(id, carritoActualizado) {
    try {
      const carritos = await this.obtenerCarritos();
      const indice = carritos.findIndex(carrito => carrito.id === id);
      if (indice !== -1) {
        carritos[indice] = { ...carritos[indice], ...carritoActualizado };
        await fs.writeFile(this.#ruta, JSON.stringify(carritos, null, 2));
      }
    } catch (error) {
      console.error('Error actualizando carrito:', error);
    }
  }

  async eliminarCarrito(id) {
    try {
      const carritos = await this.obtenerCarritos();
      const carritosActualizados = carritos.filter(carrito => carrito.id !== id);
      await fs.writeFile(this.#ruta, JSON.stringify(carritosActualizados, null, 2));
    } catch (error) {
      console.error('Error eliminando carrito:', error);
    }
  }

  async obtenerCarritoPorId(id) {
    try {
      const carritos = await this.obtenerCarritos();
      return carritos.find(carrito => carrito.id === id);
    } catch (error) {
      console.error('Error obteniendo carrito por ID:', error);
      return null;
    }
  }
}

export default CartManager;
