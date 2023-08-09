const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct(product) {
    const products = this.getProducts();
    product.id = products.length + 1;
    products.push(product);
    this.saveProducts(products);
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
    return [];
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(product => product.id === id);
  }

  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      const updatedProduct = { ...products[productIndex], ...updatedFields };
      products[productIndex] = updatedProduct;
      this.saveProducts(products);
      return updatedProduct;
    }
    return null;
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      const deletedProduct = products.splice(productIndex, 1)[0];
      this.saveProducts(products);
      return deletedProduct;
    }
    return null;
  }

  saveProducts(products) {
    try {
      fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
      console.log('Los productos fueron agregados correctamente');
    } catch (error) {
      console.error('Error al agregar los productos:', error);
    }
  }
}

// Como se utilizaría el proyecto

const productManager = new ProductManager('products.json');

productManager.addProduct({
  title: 'Producto 1',
  description: 'Descripción del producto 1',
  price: 10000,
  thumbnail: 'imagendelproducto.jpg',
  code: 'codigoproducto1',
  stock: 37
});

productManager.addProduct({
  title: 'Producto 2',
  description: 'Descripción del producto 2',
  price: 7350,
  thumbnail: 'imagendelproducto2.jpg',
  code: 'Codigoproducto2',
  stock: 0
});

console.log(productManager.getProducts());

const updatedProduct = productManager.updateProduct(1, {
  title: 'Producto actualizado',
  description: 'Descripción del producto actualizada',
  price: 9500,
  thumbnail: 'imagenactualizada.jpg',
  code: 'codigo actualizado',
  stock: 23
});
console.log(updatedProduct);

const deletedProduct = productManager.deleteProduct(2);
console.log(deletedProduct);

console.log(productManager.getProducts());

module.exports = ProductManager;