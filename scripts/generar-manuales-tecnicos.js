const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle
} = require('docx');
const fs = require('fs');

function h1(t) { return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 200 }, children: [new TextRun({ text: t, bold: true, size: 32, color: "1E5FE0" })] }); }
function h2(t) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 250, after: 150 }, children: [new TextRun({ text: t, bold: true, size: 26, color: "1544D6" })] }); }
function h3(t) { return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 }, children: [new TextRun({ text: t, bold: true, size: 22, color: "0D1B3E" })] }); }
function p(t, o) { return new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: t, size: 20, ...(o?.run || {}) })] }); }
function b(t) { return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: t, bold: true, size: 20 })] }); }
function sp(n) { return new Paragraph({ spacing: { before: n || 200 }, children: [] }); }

function cell(text, opts) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text: text || '', size: 18, bold: opts?.bold, color: opts?.color })], alignment: opts?.align || AlignmentType.LEFT })],
    width: opts?.width,
    shading: opts?.shading,
  });
}
function hRow(cells, w) {
  const ww = w || cells.map(() => ({ size: 100 / cells.length, type: WidthType.PERCENTAGE }));
  return new TableRow({ tableHeader: true, children: cells.map((c, i) => cell(c, { bold: true, color: "FFFFFF", shading: { fill: "1E5FE0", type: "solid" }, width: ww[i] })) });
}
function dRow(cells, w) {
  const ww = w || cells.map(() => ({ size: 100 / cells.length, type: WidthType.PERCENTAGE }));
  return new TableRow({ children: cells.map((c, i) => cell(c, { width: ww[i] })) });
}
function okR(cells, w) {
  const ww = w || cells.map(() => ({ size: 100 / cells.length, type: WidthType.PERCENTAGE }));
  return new TableRow({ children: cells.map((c, i) => cell(c, { width: ww[i], shading: i === cells.length - 1 ? { fill: "E8F5E9", type: "solid" } : undefined })) });
}
function penR(cells, w) {
  const ww = w || cells.map(() => ({ size: 100 / cells.length, type: WidthType.PERCENTAGE }));
  return new TableRow({ children: cells.map((c, i) => cell(c, { width: ww[i], shading: i === cells.length - 1 ? { fill: "FFF8E1", type: "solid" } : undefined })) });
}

function tbl(headers, rows, widths) {
  const w = widths || headers.map(() => ({ size: 100 / headers.length, type: WidthType.PERCENTAGE }));
  return new Table({ rows: [hRow(headers, w), ...rows.map(r => dRow(r, w))] });
}

function numberedList(items) {
  return items.map((item, i) => new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: `${i + 1}. ${item}`, size: 20 })],
  }));
}

const doc = new Document({
  styles: { default: { document: { run: { font: 'Calibri', size: 20 } } } },
  sections: [
    // ==================== PORTADA ====================
    {
      children: [
        sp(1500),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'UNIVERSIDAD AUTÓNOMA "TOMÁS FRÍAS"', bold: true, size: 28, color: "1E5FE0" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'INGENIERÍA INFORMÁTICA', bold: true, size: 24, color: "1544D6" })] }),
        sp(400),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'INVENTARIO+ / PATATAS KING', bold: true, size: 34, color: "0D1B3E" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'MANUALES TÉCNICOS DEL SISTEMA', bold: true, size: 30, color: "F5B800" })] }),
        sp(600),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Manual de Usuario | Manual de Administrador', size: 22 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Manual de Instalación | Manual de Base de Datos', size: 22 })] }),
        sp(600),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Docente:', bold: true, size: 20 }), new TextRun({ text: ' Erick Sierra Caballero', size: 20 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Estudiante:', bold: true, size: 20 }), new TextRun({ text: ' Benjamin Franklin Olmedo Porco', size: 20 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Materia:', bold: true, size: 20 }), new TextRun({ text: ' SICP - Sistemas de Información y Control de Procesos', size: 20 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Fecha:', bold: true, size: 20 }), new TextRun({ text: ' Julio 2026', size: 20 })] }),
        sp(300),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Potosi - Bolivia', size: 20 })] }),
      ],
    },

    // ==================== CONTROL DE CAMBIOS ====================
    {
      children: [
        h1('Control de Cambios'),
        tbl(
          ['Versión', 'Fecha', 'Autor', 'Descripción del Cambio', 'Aprobador', 'Estado'],
          [
            ['v1.0', '06/07/2026', 'Benjamin Olmedo', 'Creación inicial de los 4 manuales técnicos', 'Erick Sierra', 'Borrador'],
          ]
        ),
        sp(200),
        h1('Glosario de Términos'),
        tbl(
          ['Término', 'Definición'],
          [
            ['Stock', 'Cantidad disponible de un producto en el inventario'],
            ['Stock mínimo', 'Cantidad mínima deseable de un producto antes de generar alerta'],
            ['Reposición', 'Proceso de reabastecimiento de stock de un producto'],
            ['Insumo', 'Material prima o insumo utilizado en el proceso productivo'],
            ['Detalle de venta', 'Registro individual de cada producto vendido en una transacción'],
            ['RBAC', 'Role-Based Access Control — control de acceso basado en roles'],
            ['JWT', 'JSON Web Token — estándar de autenticación basado en tokens'],
            ['KPI', 'Key Performance Indicator — indicador clave de rendimiento'],
            ['QR', 'Código de respuesta rápida generado para cada venta'],
          ]
        ),
      ],
    },

    // ================================================================
    // MANUAL DE USUARIO
    // ================================================================
    {
      children: [
        h1('MANUAL DE USUARIO'),
        p('Versión: v1.0 | Fecha: Julio 2026 | Sistema: INVENTARIO+ (Patatas King)'),
        sp(100),
        h2('1.1 Introducción y Roles'),
        p('El sistema INVENTARIO+ está diseñado para la gestión de inventario y facturación del negocio Patatas King. Cuenta con dos roles de usuario:'),
        b('• PROPIETARIO: Acceso completo al sistema. Puede gestionar usuarios, ver el dashboard con KPIs, generar reportes financieros, y administrar todos los módulos.'),
        b('• EMPLEADO: Acceso limitado. Puede registrar ventas, consultar productos, gestionar reposiciones y ver alertas de stock.'),
        sp(100),
        h2('1.2 Requisitos del Sistema'),
...numberedList([
  'Navegador web moderno (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)',
  'Conexión a internet o red local',
  'Resolución de pantalla mínima: 320px (móvil)',
  'Cuenta de usuario proporcionada por el administrador',
]),
        sp(100),
        h2('1.3 Inicio de Sesión'),
        b('Objetivo: Acceder al sistema con credenciales válidas.'),
        b('Condiciones previas: Tener credenciales (correo y contraseña) proporcionadas por el administrador.'),
        b('Pasos:'),
        ...numberedList([
          'Abrir el navegador y acceder a la URL del sistema (ej. http://localhost:5000)',
          'Ingresar el correo electrónico en el campo "Correo"',
          'Ingresar la contraseña en el campo "Contraseña"',
          'Hacer clic en el botón "Entrar"',
          'El sistema redirige al panel principal con el sidebar de navegación',
        ]),
        b('Resultado esperado: El dashboard se muestra con las tarjetas KPI (Productos, Ventas totales, Ventas hoy, Alertas activas).'),
        sp(100),
        h2('1.4 Navegación Principal'),
        p('El sistema utiliza un sidebar lateral con íconos y etiquetas. En dispositivos móviles (<=640px), el sidebar se reemplaza por una barra de navegación inferior.'),
        b('Módulos disponibles:'),
        tbl(
          ['Módulo', 'Ícono', 'Descripción'],
          [
            ['Dashboard', 'Velocímetro', 'Panel principal con indicadores KPI y Stock Pulse'],
            ['Productos', 'Caja', 'Gestión CRUD de productos del catálogo'],
            ['Reposiciones', 'Flecha arriba', 'Reposición de stock de productos con proveedor'],
            ['Mov. Inventario', 'Canasta', 'Historial de movimientos de inventario'],
            ['Insumos', 'Caja', 'Gestión de materias primas e insumos'],
            ['Ventas', 'Carrito', 'Registro de ventas, libro diario/mensual, reportes'],
            ['Reportes', 'Gráfico', 'Reportes de ventas con filtro por fechas'],
            ['Proveedores', 'Camión', 'Gestión de proveedores'],
            ['Alertas', 'Triángulo', 'Alertas automáticas de stock bajo'],
            ['Usuarios', 'Personas', 'Gestión de usuarios del sistema (solo PROPIETARIO)'],
          ]
        ),
        sp(100),
        h2('1.5 Registro de Ventas (PROPIETARIO y EMPLEADO)'),
        b('Objetivo: Registrar una venta con productos, calcular el total y generar el recibo con código QR.'),
        b('Condiciones previas: Tener productos creados con stock disponible.'),
        b('Pasos:'),
        ...numberedList([
          'Navegar al módulo "Ventas" desde el sidebar',
          'Seleccionar un producto del catálogo en la sección "Agregar Producto"',
          'Ingresar la cantidad deseada (debe ser entero positivo y menor o igual al stock disponible)',
          'Opcional: Ingresar el nombre del cliente en el campo "Cliente"',
          'Seleccionar el método de pago (EFECTIVO, QR, TARJETA)',
          'Hacer clic en "Registrar Venta"',
          'El sistema muestra un modal con el resumen de la venta, el código QR y un botón "Imprimir Recibo"',
        ]),
        b('Resultado esperado: La venta se registra, el stock se descuenta automáticamente, y se genera una alerta si el stock cae por debajo del mínimo.'),
        sp(100),
        h2('1.6 Gestión de Productos (PROPIETARIO)'),
        b('Objetivo: Crear, editar y eliminar productos del catálogo.'),
        b('Pasos para crear un producto:'),
        ...numberedList([
          'Navegar al módulo "Productos"',
          'Hacer clic en "Nuevo Producto"',
          'Llenar los campos: Nombre (obligatorio), Código SKU, Descripción, Precio (>=0), Stock (>=0), Stock Mínimo (>=0)',
          'Hacer clic en "Guardar"',
          'El producto aparece en la tabla del catálogo',
        ]),
        sp(100),
        h2('1.7 Reportes y Libros Contables (PROPIETARIO)'),
        b('Objetivo: Consultar el libro diario, libro mensual y reportes de ventas.'),
        b('Pasos:'),
        ...numberedList([
          'Navegar al módulo "Ventas"',
          'En la sección "Reporte de Ventas", seleccionar una fecha "Desde" y "Hasta"',
          'Hacer clic en "Filtrar"',
          'El sistema muestra una tabla con: hora, producto, cantidad, precio unitario, subtotal y total de venta',
          'Hacer clic en "Imprimir" para obtener una versión imprimible',
          'En la sección "Libro Diario" se puede consultar el resumen por día',
          'En la sección "Libro Mensual" se puede consultar el resumen por mes',
        ]),
        sp(100),
        h2('1.8 Modo Oscuro'),
        b('Objetivo: Alternar entre modo claro y oscuro.'),
        b('Pasos:'),
        ...numberedList([
          'En la barra superior, hacer clic en el interruptor de tema (ícono de sol/luna)',
          'El sistema cambia instantáneamente entre modo claro y oscuro',
          'La preferencia se guarda automáticamente y persiste entre sesiones',
        ]),
        sp(100),
        h2('1.9 Solución de Problemas (FAQ)'),
        b('Problema: No puedo iniciar sesión.'),
        p('Solución: Verificar que el correo y la contraseña sean correctos. Si olvidó la contraseña, contactar al administrador. El sistema muestra "Credenciales inválidas" si los datos son incorrectos.'),
        b('Problema: No puedo registrar una venta porque el stock es insuficiente.'),
        p('Solución: El sistema valida el stock antes de registrar la venta. Debe realizar una reposición de stock desde el módulo "Reposiciones" o contactar al administrador.'),
        b('Problema: El botón de un módulo no funciona.'),
        p('Solución: Verificar que el usuario tenga los permisos necesarios. El rol EMPLEADO no puede acceder a Usuarios ni al Dashboard completo.'),
        b('Problema: La pantalla se ve desordenada en el móvil.'),
        p('Solución: El sistema está diseñado para ser responsive. En dispositivos menores a 640px, aparece una barra de navegación inferior. Girar el dispositivo a horizontal si es necesario.'),
      ],
    },

    // ================================================================
    // MANUAL DE ADMINISTRADOR
    // ================================================================
    {
      children: [
        h1('MANUAL DE ADMINISTRADOR'),
        p('Versión: v1.0 | Fecha: Julio 2026 | Sistema: INVENTARIO+ (Patatas King)'),
        p('Audiencia: Usuario con rol PROPIETARIO y personal de soporte TI.'),
        sp(100),
        h2('2.1 Gestión de Usuarios y Roles (RBAC)'),
        b('Objetivo: Crear, modificar y deshabilitar usuarios del sistema.'),
        b('Pasos para crear un usuario:'),
        ...numberedList([
          'Navegar al módulo "Usuarios"',
          'Hacer clic en "Nuevo Usuario"',
          'Completar: Nombre, Correo electrónico, Contraseña, Rol (PROPIETARIO o EMPLEADO)',
          'Hacer clic en "Guardar"',
          'El usuario recibe acceso inmediato al sistema con las credenciales creadas',
        ]),
        b('Política de contraseñas: Las contraseñas se almacenan cifradas con bcrypt (salt rounds = 10). No es posible recuperar la contraseña original; el administrador debe generar una nueva.'),
        sp(100),
        h2('2.2 Parametrización del Negocio'),
        b('Stock Mínimo:'),
        p('Cada producto tiene un campo "Stock Mínimo". Cuando el stock actual es menor o igual al mínimo, el sistema genera automáticamente una alerta en el módulo "Alertas" y muestra el producto en rojo en el dashboard (Stock Pulse).'),
        b('Métodos de Pago:'),
        p('Los métodos de pago disponibles son: EFECTIVO, QR, TARJETA. Se almacenan en la tabla venta.metodo_pago. Para agregar nuevos métodos, modificar el controlador de ventas y el frontend.'),
        b('Configuración de Alertas:'),
        p('Las alertas se generan automáticamente cuando:'),
        ...numberedList([
          'El stock de un producto cae por debajo del stock mínimo (al registrar una venta)',
          'Se actualiza manualmente el stock de un producto',
        ]),
        p('Las alertas tienen estado ACTIVA o SOLUCIONADA. El administrador puede marcarlas como SOLUCIONADA desde el módulo "Alertas".'),
        sp(100),
        h2('2.3 Gestión de Respaldos (Backups)'),
        b('Objetivo: Realizar respaldos de la base de datos PostgreSQL.'),
        b('Procedimiento:'),
        b('Respaldo manual:'),
        p('Ejecutar el siguiente comando en la terminal:'),
        p('pg_dump -U postgres -h localhost -p 5432 inventario > backup_$(date +%Y%m%d).sql', { run: { font: 'Courier New', size: 18 } }),
        b('Respaldo automático (Windows - Tarea Programada):'),
        p('Crear una tarea programada que ejecute:'),
        p('"C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe" -U postgres inventario > C:\\backups\\inventario_%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%.sql', { run: { font: 'Courier New', size: 18 } }),
        b('Ubicación de respaldos: Almacenar en una unidad externa o en la nube. No almacenar en el mismo disco del servidor.'),
        sp(100),
        h2('2.4 Logs de Auditoría'),
        p('El sistema registra automáticamente todas las acciones en las siguientes tablas:'),
        tbl(
          ['Tabla', 'Acciones Registradas', 'Inmutabilidad'],
          [
            ['producto_movimiento', 'Entradas y salidas de stock de productos', 'Sí (solo INSERT)'],
            ['producto_costo_historico', 'Cambios de precio de productos', 'Sí (solo INSERT)'],
            ['inventario_movimiento', 'Cambios en insumos (precio/cantidad)', 'Sí (solo INSERT)'],
          ]
        ),
        p('No es posible eliminar o modificar registros históricos de movimientos. Esto garantiza la trazabilidad completa del inventario.'),
        sp(100),
        h2('2.5 Integraciones'),
        p('El sistema expone una API RESTful en el puerto 5000. Todas las rutas (excepto /api/auth/login y /api/auth/register) requieren autenticación JWT.'),
        p('Para integrar con otros sistemas, usar el endpoint de login para obtener un token y luego incluirlo en el header Authorization: Bearer <token>.'),
        b('Variables de entorno requeridas:'),
        tbl(
          ['Variable', 'Descripción', 'Ejemplo'],
          [
            ['PORT', 'Puerto del servidor', '5000'],
            ['DB_HOST', 'Host de PostgreSQL', 'localhost'],
            ['DB_PORT', 'Puerto de PostgreSQL', '5432'],
            ['DB_USER', 'Usuario de BD', 'postgres'],
            ['DB_PASSWORD', 'Contraseña de BD', 'postgres'],
            ['DB_NAME', 'Nombre de la BD', 'inventario'],
            ['JWT_SECRET', 'Clave secreta para firmar tokens', 'mi_secreto'],
            ['JWT_EXPIRES_IN', 'Tiempo de expiración del token', '8h'],
          ]
        ),
      ],
    },

    // ================================================================
    // MANUAL DE INSTALACIÓN Y DESPLIEGUE
    // ================================================================
    {
      children: [
        h1('MANUAL DE INSTALACIÓN Y DESPLIEGUE'),
        p('Versión: v1.0 | Fecha: Julio 2026 | Sistema: INVENTARIO+ (Patatas King)'),
        p('Audiencia: DevOps, Ingenieros de Sistemas, personal de infraestructura.'),
        sp(100),
        h2('3.1 Requisitos Previos'),
        h3('Hardware Mínimo'),
        tbl(
          ['Componente', 'Requisito Mínimo', 'Recomendado'],
          [
            ['CPU', '2 núcleos', '4 núcleos'],
            ['RAM', '2 GB', '4 GB'],
            ['Disco', '10 GB libres', '20 GB SSD'],
            ['Red', 'Conexión a internet / LAN', '100 Mbps'],
          ]
        ),
        h3('Software'),
        tbl(
          ['Componente', 'Versión', 'Notas'],
          [
            ['Node.js', '18.x o superior', 'Incluye npm'],
            ['PostgreSQL', '15.x o superior', 'Con autenticación por contraseña'],
            ['Navegador', 'Chrome 90+ / Firefox 88+ / Edge 90+', 'Para el frontend'],
          ]
        ),
        h3('Puertos de Red'),
        tbl(
          ['Puerto', 'Servicio', 'Observación'],
          [
            ['5000', 'Servidor Express (API + Frontend)', 'Configurable via PORT'],
            ['5432', 'PostgreSQL', 'Configurable via DB_PORT'],
          ]
        ),
        sp(100),
        h2('3.2 Pasos de Instalación'),
        b('Paso 1: Clonar el repositorio'),
        p('git clone <url-del-repositorio> && cd backend', { run: { font: 'Courier New', size: 18 } }),
        b('Paso 2: Instalar dependencias'),
        p('npm install', { run: { font: 'Courier New', size: 18 } }),
        b('Paso 3: Configurar variables de entorno'),
        p('Crear archivo .env en la raíz del proyecto:'),
        p('PORT=5000\nDB_HOST=localhost\nDB_PORT=5432\nDB_USER=postgres\nDB_PASSWORD=postgres\nDB_NAME=inventario\nJWT_SECRET=mi_super_secreto_jwt_2026\nJWT_EXPIRES_IN=8h', { run: { font: 'Courier New', size: 18 } }),
        b('Paso 4: Crear la base de datos'),
        p('Ejecutar en PostgreSQL:'),
        p("CREATE DATABASE inventario;", { run: { font: 'Courier New', size: 18 } }),
        b('Paso 5: Iniciar el servidor'),
        p('npm start    # ó npm run dev (con Nodemon)', { run: { font: 'Courier New', size: 18 } }),
        b('Paso 6: Verificar instalación'),
        p('Abrir http://localhost:5000/api/health — debe responder: {"status":"ok","message":"API funcionando correctamente"}', { run: { font: 'Courier New', size: 18 } }),
        sp(100),
        h2('3.3 Configuración de Seguridad'),
        h3('Generación de Certificado SSL (Let\'s Encrypt)'),
        p('Para producción con dominio:'),
        p('sudo certbot --nginx -d mdominio.com', { run: { font: 'Courier New', size: 18 } }),
        h3('Firewall (UFW en Linux)'),
        p('sudo ufw allow 5000/tcp\nsudo ufw allow 22/tcp\nsudo ufw enable', { run: { font: 'Courier New', size: 18 } }),
        sp(100),
        h2('3.4 Checklist de Verificación Post-Instalación'),
        tbl(
          ['Paso', 'Acción', 'Resultado Esperado', 'Estado'],
          [
            ['1', 'Verificar Node.js', 'node --version >= 18', 'OK'],
            ['2', 'Verificar PostgreSQL', 'pg_isready', 'OK'],
            ['3', 'Instalar dependencias', 'npm install sin errores', 'OK'],
            ['4', 'Configurar .env', 'Archivo con 8 variables', 'OK'],
            ['5', 'Iniciar servidor', 'Servidor en puerto 5000', 'OK'],
            ['6', 'Health Check', '{"status":"ok"}', 'OK'],
            ['7', 'Login de prueba', 'Acceder a /login y autenticarse', 'OK'],
            ['8', 'Verificar migraciones', 'Tablas creadas en BD', 'OK'],
          ]
        ),
      ],
    },

    // ================================================================
    // MANUAL DE BASE DE DATOS
    // ================================================================
    {
      children: [
        h1('MANUAL DE BASE DE DATOS'),
        p('Versión: v1.0 | Fecha: Julio 2026 | Sistema: INVENTARIO+ (Patatas King)'),
        p('Audiencia: DBAs, Arquitectos de Software, soporte avanzado.'),
        p('Motor: PostgreSQL 15+'),
        p('Base de datos: inventario'),
        sp(100),
        h2('4.1 Diagrama Entidad-Relación (Texto)'),
        p('El sistema consta de 11 tablas principales con las siguientes relaciones:'),
        b('Relaciones clave:'),
        p('• usuario (1) ──< (N) venta: Un usuario registra muchas ventas'),
        p('• venta (1) ──< (N) detalle_venta: Una venta tiene muchos productos'),
        p('• producto (1) ──< (N) detalle_venta: Un producto aparece en muchos detalles'),
        p('• producto (1) ──< (N) reposicion: Un producto tiene muchas reposiciones'),
        p('• producto (1) ──< (N) alerta: Un producto tiene muchas alertas'),
        p('• producto (1) ──< (N) producto_movimiento: Un producto tiene muchos movimientos'),
        p('• producto (1) ──< (N) producto_costo_historico: Historial de cambios de precio'),
        p('• proveedor (1) ──< (N) reposicion: Una reposición puede tener un proveedor'),
        p('• usuario (1) ──< (N) reposicion: Un usuario registra muchas reposiciones'),
        sp(100),
        h2('4.2 Diccionario de Datos'),
        h3('Tabla: usuario'),
        tbl(
          ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
          [
            ['id', 'SERIAL', 'PRIMARY KEY', 'Identificador único del usuario'],
            ['nombre', 'VARCHAR(100)', 'NOT NULL', 'Nombre completo del usuario'],
            ['correo', 'VARCHAR(100)', 'UNIQUE, NOT NULL', 'Correo electrónico (login)'],
            ['password', 'TEXT', 'NOT NULL', 'Hash bcrypt de la contraseña'],
            ['rol', 'VARCHAR(20)', 'CHECK(rol IN (\'PROPIETARIO\',\'EMPLEADO\'))', 'Rol del usuario'],
            ['created_at', 'TIMESTAMP', 'DEFAULT CURRENT_TIMESTAMP', 'Fecha de creación'],
          ]
        ),
        h3('Tabla: producto'),
        tbl(
          ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
          [
            ['id', 'SERIAL', 'PRIMARY KEY', 'Identificador único'],
            ['nombre', 'VARCHAR(150)', 'UNIQUE, NOT NULL', 'Nombre del producto'],
            ['codigo', 'VARCHAR(50)', 'UNIQUE', 'Código SKU del producto'],
            ['descripcion', 'TEXT', '', 'Descripción del producto'],
            ['precio', 'NUMERIC(10,2)', 'NOT NULL, CHECK(>=0)', 'Precio unitario'],
            ['stock', 'INTEGER', 'NOT NULL, CHECK(>=0)', 'Stock actual'],
            ['stock_minimo', 'INTEGER', 'NOT NULL, CHECK(>=0)', 'Stock mínimo para alerta'],
            ['created_at', 'TIMESTAMP', 'DEFAULT CURRENT_TIMESTAMP', 'Fecha de creación'],
          ]
        ),
        h3('Tabla: venta'),
        tbl(
          ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
          [
            ['id', 'SERIAL', 'PRIMARY KEY', 'Identificador único'],
            ['usuario_id', 'INTEGER', 'FK -> usuario(id), NOT NULL', 'Usuario que registró la venta'],
            ['total', 'NUMERIC(10,2)', 'NOT NULL', 'Total de la venta'],
            ['metodo_pago', 'VARCHAR(50)', 'DEFAULT \'EFECTIVO\'', 'Método de pago'],
            ['fecha', 'TIMESTAMP', 'DEFAULT CURRENT_TIMESTAMP', 'Fecha de la venta'],
            ['cliente_nombre', 'VARCHAR(255)', '', 'Nombre del cliente'],
          ]
        ),
        h3('Tabla: detalle_venta'),
        tbl(
          ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
          [
            ['id', 'SERIAL', 'PRIMARY KEY', 'Identificador único'],
            ['venta_id', 'INTEGER', 'FK -> venta(id) ON DELETE CASCADE', 'Venta asociada'],
            ['producto_id', 'INTEGER', 'FK -> producto(id)', 'Producto vendido'],
            ['cantidad', 'INTEGER', 'CHECK(>0)', 'Cantidad vendida'],
            ['precio_unitario', 'NUMERIC(10,2)', 'NOT NULL', 'Precio en el momento de la venta'],
            ['subtotal', 'NUMERIC(10,2)', 'NOT NULL', 'Subtotal del producto'],
          ]
        ),
        h3('Tabla: reposicion'),
        tbl(
          ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
          [
            ['id', 'SERIAL', 'PRIMARY KEY', 'Identificador único'],
            ['producto_id', 'INTEGER', 'FK -> producto(id)', 'Producto repuesto'],
            ['cantidad', 'INTEGER', 'CHECK(>0)', 'Cantidad repuesta'],
            ['usuario_id', 'INTEGER', 'FK -> usuario(id) ON DELETE SET NULL', 'Usuario que registró'],
            ['proveedor_id', 'INTEGER', 'FK -> proveedor(id) ON DELETE SET NULL', 'Proveedor asociado'],
            ['fecha', 'TIMESTAMP', 'DEFAULT CURRENT_TIMESTAMP', 'Fecha de reposición'],
          ]
        ),
        h3('Tabla: producto_movimiento'),
        tbl(
          ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
          [
            ['id', 'SERIAL', 'PRIMARY KEY', 'Identificador único'],
            ['producto_id', 'INTEGER', 'FK -> producto(id)', 'Producto'],
            ['tipo', 'VARCHAR(20)', 'CHECK(IN (\'ENTRADA\',\'SALIDA\'))', 'Tipo de movimiento'],
            ['cantidad', 'INTEGER', 'CHECK(>0)', 'Cantidad movida'],
            ['stock_anterior', 'INTEGER', 'NOT NULL', 'Stock antes del movimiento'],
            ['stock_nuevo', 'INTEGER', 'NOT NULL', 'Stock después del movimiento'],
            ['motivo', 'TEXT', '', 'Motivo del movimiento'],
            ['usuario_id', 'INTEGER', 'FK -> usuario(id)', 'Usuario responsable'],
            ['fecha', 'TIMESTAMP', 'DEFAULT CURRENT_TIMESTAMP', 'Fecha del movimiento'],
          ]
        ),
        h3('Otras tablas:'),
        p('• insumo: Materias primas (nombre, cantidad, unidad_medida, precio)'),
        p('• proveedor: Proveedores (nombre, contacto, telefono, email, direccion)'),
        p('• alerta: Alertas de stock (producto_id, mensaje, estado ACTIVA/SOLUCIONADA)'),
        p('• producto_costo_historico: Historial de cambios de precio (costo_anterior, costo_nuevo, usuario_id)'),
        p('• inventario_movimiento: Movimientos de insumos (inventario_id, tipo, cantidad, costo)'),
        sp(100),
        h2('4.3 Índices'),
        tbl(
          ['Índice', 'Tabla', 'Columna(s)', 'Propósito'],
          [
            ['idx_venta_usuario_id', 'venta', 'usuario_id', 'Optimizar consultas de ventas por usuario'],
            ['idx_detalle_venta_venta_id', 'detalle_venta', 'venta_id', 'JOIN entre venta y detalle'],
            ['idx_reposicion_producto_id', 'reposicion', 'producto_id', 'JOIN entre reposicion y producto'],
            ['idx_alerta_producto_id', 'alerta', 'producto_id', 'JOIN entre alerta y producto'],
            ['idx_producto_movimiento_producto_id', 'producto_movimiento', 'producto_id', 'JOIN con producto'],
            ['idx_producto_costo_historico_producto_id', 'producto_costo_historico', 'producto_id', 'JOIN con producto'],
          ]
        ),
        sp(100),
        h2('4.4 Plan de Respaldo y Recuperación (BDR)'),
        h3('Respaldo Completo (pg_dump)'),
        p('Para realizar un respaldo completo de la base de datos:'),
        p('pg_dump -U postgres -h localhost -p 5432 -F c -b -v -f "respaldo_inventario.backup" inventario', { run: { font: 'Courier New', size: 18 } }),
        h3('Restauración'),
        p('Para restaurar desde un respaldo:'),
        p('pg_restore -U postgres -h localhost -p 5432 -d inventario -v "respaldo_inventario.backup"', { run: { font: 'Courier New', size: 18 } }),
        h3('Respaldo Automático (Tarea Programada)'),
        p('En Windows, crear una tarea programada que ejecute:'),
        p('"C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe" -U postgres -F c -b -v -f "C:\\backups\\inventario_%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2%.backup" inventario', { run: { font: 'Courier New', size: 18 } }),
        p('En Linux, programar un cron job:'),
        p('0 2 * * * pg_dump -U postgres -F c -b -v -f /backups/inventario_$(date +\\%Y\\%m\\%d).backup inventario', { run: { font: 'Courier New', size: 18 } }),
        sp(100),
        h2('4.5 Migraciones'),
        p('El sistema ejecuta migraciones automáticas al iniciar el servidor (en src/config/migrate.js). Las migraciones incluyen:'),
        ...numberedList([
          'Adición de columnas (metodo_pago, cliente_nombre, codigo, usuario_id, proveedor_id)',
          'Creación de restricciones CHECK con NOT VALID + limpieza de datos existentes',
          'Restricción UNIQUE en producto.nombre (con eliminación de duplicados previa)',
          'Creación de tablas (producto_movimiento, producto_costo_historico, proveedor)',
          'Creación de índices para optimización de consultas',
        ]),
        sp(200),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '— FIN DE LOS MANUALES TÉCNICOS —', bold: true, size: 22, color: "1E5FE0" })] }),
      ],
    },
  ],
});

async function main() {
  const buffer = await Packer.toBuffer(doc);
  const outPath = 'manuales-tecnicos-patatas-king.docx';
  fs.writeFileSync(outPath, buffer);
  console.log(`Documento generado: ${outPath} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

main().catch(console.error);
