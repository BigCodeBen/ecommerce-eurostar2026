const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 79.99,
    stock: 50,
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    price: 129.99,
    stock: 30,
  },
  {
    id: 3,
    name: 'USB-C Hub',
    price: 49.99,
    stock: 100,
  },
];

function findAll() {
  return [...products];
}

function findById(id) {
  return products.find((product) => product.id === id);
}

function reduceStock(id, quantity) {
  const product = findById(id);

  if (!product || product.stock < quantity) {
    return false;
  }

  product.stock -= quantity;
  return true;
}

module.exports = {
  findAll,
  findById,
  reduceStock,
};
