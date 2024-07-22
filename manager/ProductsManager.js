import fs from 'fs/promises';
import { __dirname } from '../utilidades/utils.js';

class ProductManager {
  #path;

  constructor(path) {
    this.#path = `${__dirname}/${path}`;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.#path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo datos de productos:', error);
      return [];
    }
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      products.push(product);
      await fs.writeFile(this.#path, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error('Error agregando producto:', error);
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex(product => product.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        await fs.writeFile(this.#path, JSON.stringify(products, null, 2));
      }
    } catch (error) {
      console.error('Error actualizando producto:', error);
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const updatedProducts = products.filter(product => product.id !== id);
      await fs.writeFile(this.#path, JSON.stringify(updatedProducts, null, 2));
    } catch (error) {
      console.error('Error eliminando producto:', error);
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      return products.find(product => product.id === id);
    } catch (error) {
      console.error('Error obteniendo producto por ID:', error);
      return null;
    }
  }
}

export default ProductManager;
