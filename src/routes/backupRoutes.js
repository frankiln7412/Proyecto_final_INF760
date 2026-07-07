const express = require('express');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();
const backupDir = path.resolve(__dirname, '..', '..', 'backups');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Check if pg_dump is available (not available on Railway/Render/etc)
var pgDumpAvailable = false;
try {
  execSync('pg_dump --version', { stdio: 'pipe' });
  pgDumpAvailable = true;
} catch (e) {
  pgDumpAvailable = false;
}

router.get('/', authMiddleware, (req, res) => {
  try {
    const files = fs.readdirSync(backupDir)
      .filter(f => f.endsWith('.sql'))
      .map(f => {
        const stat = fs.statSync(path.join(backupDir, f));
        return { name: f, size: stat.size, created: stat.birthtime || stat.mtime };
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created));

    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar copias' });
  }
});

router.post('/create', authMiddleware, (req, res) => {
  if (!pgDumpAvailable) {
    return res.status(400).json({ message: 'Las copias de seguridad solo están disponibles en el servidor local. En la nube, usa el panel de tu proveedor de base de datos.' });
  }
  try {
    const db = process.env.DB_NAME || 'inventario';
    const user = process.env.DB_USER || 'postgres';
    const host = process.env.DB_HOST || 'localhost';
    const dbport = process.env.DB_PORT || '5432';

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `backup-${db}-${timestamp}.sql`;
    const filepath = path.join(backupDir, filename);

    execSync(
      `pg_dump -h ${host} -p ${dbport} -U ${user} -d ${db} --no-owner --no-acl -f "${filepath}"`,
      { stdio: 'pipe', env: { ...process.env, PGPASSWORD: process.env.DB_PASSWORD } }
    );

    const stat = fs.statSync(filepath);
    res.json({ message: 'Copia creada', name: filename, size: stat.size, created: stat.birthtime || stat.mtime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la copia: ' + error.message });
  }
});

router.get('/download/:filename', authMiddleware, (req, res) => {
  const filepath = path.join(backupDir, req.params.filename);
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ message: 'Archivo no encontrado' });
  }
  res.download(filepath);
});

router.delete('/:filename', authMiddleware, (req, res) => {
  try {
    const filepath = path.join(backupDir, req.params.filename);
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    fs.unlinkSync(filepath);
    res.json({ message: 'Copia eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar copia' });
  }
});

module.exports = router;
