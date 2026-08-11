require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

// Conectar base de datos
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${PORT}`);
});