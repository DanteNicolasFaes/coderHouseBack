import fs from 'fs/promises';
import { __dirname } from '../utilidades/utils.js';

class CartManager {
  #path;

  constructor(path) {
    this.#path = `${__dirname}/${path}`;
  }

  async getCart() {
    try {
      const data = await fs.readFile(this.#path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo datos de carritos:', error);
      return [];
    }
  }

  async addCart(cart) {
    try {
      const carts = await this.getCart();
      carts.push(cart);
      await fs.writeFile(this.#path, JSON.stringify(carts, null, 2));
    } catch (error) {
      console.error('Error agregando carrito:', error);
    }
  }

  async updateCart(id, updatedCart) {
    try {
      const carts = await this.getCart();
      const index = carts.findIndex(cart => cart.id === id);
      if (index !== -1) {
        carts[index] = { ...carts[index], ...updatedCart };
        await fs.writeFile(this.#path, JSON.stringify(carts, null, 2));
      }
    } catch (error) {
      console.error('Error actualizando carrito:', error);
    }
  }

  async deleteCart(id) {
    try {
      const carts = await this.getCart();
      const updatedCarts = carts.filter(cart => cart.id !== id);
      await fs.writeFile(this.#path, JSON.stringify(updatedCarts, null, 2));
    } catch (error) {
      console.error('Error eliminando carrito:', error);
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getCart();
      return carts.find(cart => cart.id === id);
    } catch (error) {
      console.error('Error obteniendo carrito por ID:', error);
      return null;
    }
  }
}

export default CartManager;
