const express = require('express');
const ProductManager = require('./ProductManager');
const http = require('http');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');


const app = express();
const PORT = 8080; // El puerto se puede cambiar tranquilamente
const server = http.createServer(app);
const io = socketIO(server);

// Crea una instancia del ProductManager y configura el archivo donde se encuentran los productos
const productManager = new ProductManager('products.json');

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para mostrar la vista de productos
app.get('/products', (req, res) => {
  const products = productManager.getProducts();
  res.render('home', { products });
});

// Ruta para mostrar la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
  const products = productManager.getProducts();
  res.render('realTimeProducts', { products });
});

// Endpoint para obtener todos los productos con un límite opcional
app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();
    if (!isNaN(limit) && limit > 0) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint para obtener un producto específico por su id (pid)
app.get('/products/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid)) {
      return res.status(400).json({ error: 'ID de producto invalido' });
    }
    const product = await productManager.getProductById(pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'No se encontró el producto' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor interno' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


// Configurar Socket.io
io.on('connection', (socket) => {
  console.log('A user connected'); 

  io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Escuchar evento de agregar producto
    socket.on('addProduct', (productData) => {
      // Lógica para agregar el producto (usar la misma lógica que en tu aplicación)
      // ...
  
      // Emitir evento de actualización a todos los clientes
      io.emit('updateProducts', productManager.getProducts());
    });
  
    // Lógica de otros eventos de sockets aquí...
  });
  });