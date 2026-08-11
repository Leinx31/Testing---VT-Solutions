require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado a MongoDB');

  await Category.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();

  const categories = await Category.insertMany([
    { name: 'Laptops',      description: 'Computadoras portátiles' },
    { name: 'Smartphones',  description: 'Teléfonos inteligentes' },
    { name: 'Audio',        description: 'Auriculares y altavoces' },
    { name: 'Tablets',      description: 'Tabletas digitales' },
    { name: 'Wearables',    description: 'Relojes y dispositivos portables' }
  ]);

  await Product.insertMany([
    {
      name: 'MacBook Pro M5',
      description: 'Laptop con chip Apple M5, 16GB RAM, 512GB SSD, pantalla Liquid Retina XDR 14" 120Hz. Ideal para programación y edición profesional.',
      price: 1299.99,
      stock: 10,
      image: 'img/producto01.jpg',
      category: categories[0]._id
    },
    {
      name: 'iPhone 17 Pro Max',
      description: 'Smartphone con chip A19 Pro, cámara ProRAW 48MP, pantalla Super Retina XDR 6.9" ProMotion, 256GB almacenamiento.',
      price: 1199.99,
      stock: 15,
      image: 'img/producto02.jpg',
      category: categories[1]._id
    },
    {
      name: 'AirPods Pro 3',
      description: 'Auriculares inalámbricos con cancelación activa de ruido, chip H2, 8h de autonomía, resistentes al agua y polvo.',
      price: 329.99,
      stock: 30,
      image: 'img/producto03.jpg',
      category: categories[2]._id
    },
    {
      name: 'iPad Pro M5',
      description: 'Tablet con chip M5, pantalla OLED 13" Tandem, 8GB RAM, 512GB, compatible con Apple Pencil Pro y Magic Keyboard.',
      price: 999.99,
      stock: 12,
      image: 'img/producto04.jpg',
      category: categories[3]._id
    },
    {
      name: 'Apple Watch Ultra 3',
      description: 'Smartwatch de titanio con GPS de doble frecuencia, pantalla LTPO 49mm, batería 72h, resistencia extrema certificada.',
      price: 799.99,
      stock: 20,
      image: 'img/producto05.jpg',
      category: categories[4]._id
    }
  ]);
  console.log('Productos tech creados: 5');

const salt = await bcrypt.genSalt(10);

const users = [];

// Administrador
users.push({
  name: 'Administrador VT',
  email: 'admin@vtsolutions.com',
  password: await bcrypt.hash('admin123', salt),
  role: 'admin'
});

// Usuario principal
users.push({
  name: 'Usuario Test',
  email: 'user@test.com',
  password: await bcrypt.hash('user123', salt)
});

// Usuarios para pruebas de carga
// for (let i = 1; i <= 2; i++) {
//   users.push({
//     name: `Usuario ${i}`,
//     email: `user${String(i).padStart(3, '0')}@test.com`,
//     password: await bcrypt.hash('user123', salt)
//   });
// }

await User.insertMany(users);

console.log(`Usuarios creados: ${users.length}`);

  await mongoose.disconnect();
  console.log('Seed completado exitosamente');
};

seed().catch(err => { console.error(err); process.exit(1); });
