require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const db = process.env.DB_NAME || 'inventario';
const user = process.env.DB_USER || 'postgres';
const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '5432';
const pass = process.env.DB_PASSWORD || 'postgres';

const backupDir = path.resolve(__dirname, '..', 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const filename = `backup-${db}-${timestamp}.sql`;
const filepath = path.join(backupDir, filename);

process.env.PGPASSWORD = pass;

try {
  console.log('Creando copia de seguridad...');
  execSync(
    `pg_dump -h ${host} -p ${port} -U ${user} -d ${db} --no-owner --no-acl -f "${filepath}"`,
    { stdio: 'inherit', env: { ...process.env, PGPASSWORD: pass } }
  );
  const stats = fs.statSync(filepath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`Copia de seguridad creada: backup/${filename} (${sizeMB} MB)`);
} catch (err) {
  console.error('Error al crear la copia de seguridad:', err.message);
  process.exit(1);
}
