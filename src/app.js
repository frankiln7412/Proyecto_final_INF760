const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const supplyRoutes = require('./routes/supplyRoutes');
const repositionRoutes = require('./routes/repositionRoutes');
const alertRoutes = require('./routes/alertRoutes');
const saleRoutes = require('./routes/saleRoutes');
const inventoryMovementRoutes = require('./routes/inventoryMovementRoutes');
const productMovementRoutes = require('./routes/productMovementRoutes');
const productCostHistoryRoutes = require('./routes/productCostHistoryRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const backupRoutes = require('./routes/backupRoutes');

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin === '*' ? '*' : corsOrigin.split(',').map(function(s) { return s.trim(); }),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/supplies', supplyRoutes);
app.use('/api/repositions', repositionRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/inventory-movements', inventoryMovementRoutes);
app.use('/api/product-movements', productMovementRoutes);
app.use('/api/product-cost-history', productCostHistoryRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/backups', backupRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  // Multer errors (file too large, wrong format)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'La imagen no puede superar los 5 MB' });
  }
  if (err.message && (err.message.includes('Formato no permitido') || err.message.includes('formato'))) {
    return res.status(400).json({ message: err.message });
  }
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

module.exports = app;
