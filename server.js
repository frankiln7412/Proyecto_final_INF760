require('dotenv').config();
const app = require('./src/app');
const { testConnection, pool } = require('./src/config/db');
const { runMigrations } = require('./src/config/migrate');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, 'frontend', 'uploads', 'products'),
];
uploadDirs.forEach(function(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function startServer() {
  try {
    await testConnection();
    await runMigrations();
    var server = app.listen(PORT, function() {
      console.log('Servidor corriendo en puerto ' + PORT);
    });

    // Graceful shutdown
    function shutdown(signal) {
      console.log(signal + ' recibido, cerrando servidor...');
      server.close(function() {
        pool.end(function() {
          console.log('Servidor cerrado');
          process.exit(0);
        });
      });
    }

    process.on('SIGTERM', function() { shutdown('SIGTERM'); });
    process.on('SIGINT', function() { shutdown('SIGINT'); });
  } catch (error) {
    console.error('No fue posible iniciar el servidor:', error.message);
    process.exit(1);
  }
}

startServer();
