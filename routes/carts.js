const express = require('express');
const CartManager = require('../cartManager');

const cartsRouter = express.Router();
const cartManager = new CartManager('carrito.json');

cartsRouter.post('/', async (req, res) => {
  try {
    const cartData = req.body;
    await cartManager.addCart(cartData);
    res.json({ message: 'Carrito creado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    if (isNaN(cid)) {
      return res.status(400).json({ error: 'ID de carrito invalida' });
    }
    const cart = await cartManager.getCartById(cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    if (isNaN(cid)) {
      return res.status(400).json({ error: 'ID de carrito invalida' });
    }
    const pid = parseInt(req.params.pid);
    if (isNaN(pid)) {
      return res.status(400).json({ error: 'Id de producto invalido' });
    }
    const quantity = parseInt(req.body.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Cantidad invalida' });
    }
    await cartManager.addProductToCart(cid, pid, quantity);
    res.json({ message: 'Producto añadido al carrito correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = cartsRouter;
