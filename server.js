require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/config/db');
const { runMigrations } = require('./src/config/migrate');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await testConnection();
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No fue posible iniciar el servidor:', error.message);
    process.exit(1);
  }
}

startServer();
