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

const args = process.argv.slice(2);
let filepath;

if (args.length > 0) {
  filepath = path.resolve(args[0]);
} else {
  const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.sql')).sort().reverse();
  if (files.length === 0) {
    console.error('No hay copias de seguridad en backup/');
    process.exit(1);
  }
  filepath = path.join(backupDir, files[0]);
  console.log(`Usando la copia más reciente: ${files[0]}`);
}

if (!fs.existsSync(filepath)) {
  console.error('Archivo no encontrado:', filepath);
  process.exit(1);
}

process.env.PGPASSWORD = pass;

try {
  console.log(`Restaurando desde: ${filepath}`);
  execSync(
    `psql -h ${host} -p ${port} -U ${user} -d ${db} -f "${filepath}"`,
    { stdio: 'inherit', env: { ...process.env, PGPASSWORD: pass } }
  );
  console.log('Base de datos restaurada correctamente');
} catch (err) {
  console.error('Error al restaurar:', err.message);
  process.exit(1);
}
