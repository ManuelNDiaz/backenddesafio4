const fs = require('fs/promises');

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
    this.loadCarts();
  }

  async loadCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      if (data) {
        this.carts = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading carts:', error);
    }
  }

  async saveCarts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
      console.log('Carts saved successfully.');
    } catch (error) {
      console.error('Error saving carts:', error);
    }
  }

  async addCart(cartData) {
    const newCart = {
      id: this.carts.length + 1,
      products: []
    };

    this.carts.push(newCart);
    await this.saveCarts();
  }

  async getCartById(id) {
    return this.carts.find(cart => cart.id === id);
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = this.getCartById(cartId);
    if (!cart) {
      throw new Error('Cart not found');
    }

    const productIndex = cart.products.findIndex(product => product.id === productId);
    if (productIndex === -1) {
      cart.products.push({ id: productId, quantity });
    } else {
      cart.products[productIndex].quantity += quantity;
    }

    await this.saveCarts();
  }
}

module.exports = CartManager;
