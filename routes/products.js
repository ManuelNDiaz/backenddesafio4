const express = require('express');
const ProductManager = require('../ProductManager');

const productsRouter = express.Router();
const productManager = new ProductManager('productos.json');

productsRouter.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();
    if (!isNaN(limit) && limit > 0) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor interno' });
  }
});

productsRouter.get('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid)) {
      return res.status(400).json({ error: 'ID de producto invalida' });
    }
    const product = await productManager.getProductById(pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor interno' });
  }
});

productsRouter.post('/', async (req, res) => {
  try {
    const productData = req.body;
    await productManager.addProduct(productData);
    res.json({ message: 'Producto añadido correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor interno' });
  }
});

productsRouter.put('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid)) {
      return res.status(400).json({ error: 'ID de producto invalida' });
    }
    const updatedFields = req.body;
    await productManager.updateProduct(pid, updatedFields);
    res.json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor interno' });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid)) {
      return res.status(400).json({ error: 'ID de producto invalida' });
    }
    await productManager.deleteProduct(pid);
    res.json({ message: 'Producto borrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor interno' });
  }
});

module.exports = productsRouter;
