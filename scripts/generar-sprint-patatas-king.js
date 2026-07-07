const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, PageBreak,
  Header, Footer, TabStopPosition, TabStopType
} = require('docx');
const fs = require('fs');

function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 200 }, children: [new TextRun({ text, bold: true, size: 32, color: "1E5FE0" })] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 250, after: 150 }, children: [new TextRun({ text, bold: true, size: 26, color: "1544D6" })] }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 }, children: [new TextRun({ text, bold: true, size: 22, color: "0D1B3E" })] }); }
function p(text, opts) { return new Paragraph({ spacing: { after: 80 }, ...opts, children: [new TextRun({ text, size: 20, ...(opts?.run || {}) })] }); }
function bold(text) { return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text, bold: true, size: 20 })] }); }
function spacer(h) { return new Paragraph({ spacing: { before: h || 200, after: 0 }, children: [] }); }

function cell(text, opts) {
  const children = [new TextRun({ text: text || '', size: 18, bold: opts?.bold, color: opts?.color })];
  return new TableCell({ children: [new Paragraph({ children, alignment: opts?.align || AlignmentType.LEFT })], width: opts?.width, shading: opts?.shading });
}

function headerRow(cells) { return new TableRow({ tableHeader: true, children: cells.map(c => cell(c, { bold: true, color: "FFFFFF", shading: { fill: "1E5FE0", type: "solid" }, width: { size: 100 / cells.length, type: WidthType.PERCENTAGE } })) }); }
function dataRow(cells, opts) { return new TableRow({ children: cells.map((c, i) => cell(c, { width: { size: 100 / cells.length, type: WidthType.PERCENTAGE }, ...(opts?.cells?.[i] || {}) })) }); }
function buildTable(headers, rows) { return new Table({ rows: [headerRow(headers), ...rows.map(r => dataRow(r))] }); }

const doc = new Document({
  styles: { default: { document: { run: { font: 'Calibri', size: 20 } } } },
  sections: [
    // ==================== PORTADA ====================
    {
      children: [
        spacer(2000),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "UNIVERSIDAD AUTÓNOMA TOMÁS FRÍAS", bold: true, size: 32, color: "1E5FE0" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "INGENIERÍA INFORMÁTICA", size: 28, color: "1544D6" })] }),
        spacer(600),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "INFORME DE SPRINT FINAL", bold: true, size: 36, color: "0D1B3E" })] }),
        spacer(200),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Sistema de Información Web Contable — Patatas King", size: 24, color: "2A3A5C" })] }),
        spacer(600),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Autor: Benjamin Franklin Olmedo Porco", size: 22, italics: true })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Docente: Erick Sierra Caballero", size: 22, italics: true })] }),
        spacer(200),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Metodología: Scrum (Sprint Final) + Prototipos", size: 20, color: "6B7B9A" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Generado: ${new Date().toLocaleDateString("es-PE")}`, size: 18, color: "6B7B9A" })] }),
      ]
    },
    // ==================== 1. OBJETIVO ====================
    {
      children: [
        h1("1. Objetivo del Sprint Final"),
        p('Completar la funcionalidad del sistema de información web contable para Patatas King, integrando los módulos de ventas, control de insumos, cálculo automático de ganancias, reportes estadísticos y gestión de compras. Garantizar la integridad de los datos, la usabilidad para empleados y propietario, y la generación de comprobantes con código QR. Dejar preparado el sistema para su puesta en producción.'),
        p('Capacidad del equipo: 1 persona (Benjamin F. Olmedo Porco). Duración: 8 días hábiles. Factor enfoque: 0.7. Story Points disponibles: 11 SP.'),
        spacer(),
        h1("2. Product Backlog — Historias de Usuario"),

        h2("HU-01: Registro de Ventas Diarias"),
        p('Como encargado de Patatas King, quiero registrar las ventas diarias con selección de productos, cálculo automático del total y método de pago, para llevar un control organizado de los ingresos del negocio.'),
        bold("Criterios de aceptación:"),
        p('• El sistema permite agregar productos al carrito con cantidades ajustables (+/-).'),
        p('• Calcula automáticamente el subtotal y total de la venta.'),
        p('• Permite seleccionar método de pago (Efectivo / QR).'),
        p('• Al confirmar, descuenta automáticamente del stock.'),
        p('• Genera comprobante con código QR y opción de impresión.'),
        bold("Prioridad: Indispensable | Story Points: 5"),

        spacer(),
        h2("HU-02: Control de Insumos"),
        p('Como propietario de Patatas King, quiero controlar el inventario de insumos (papas, conos, aceite) y que el sistema calcule automáticamente el consumo basado en las ventas registradas, para verificar la coherencia entre productos vendidos e insumos utilizados.'),
        bold("Criterios de aceptación:"),
        p('• El sistema registra movimientos de entrada y salida de insumos.'),
        p('• Cada venta descuenta automáticamente los insumos correspondientes.'),
        p('• Permite ajustes manuales de inventario con registro de motivo.'),
        p('• Muestra el historial completo de movimientos.'),
        bold("Prioridad: Indispensable | Story Points: 5"),

        spacer(),
        h2("HU-03: Dashboard y KPIs"),
        p('Como propietario, quiero ver un tablero resumen con indicadores clave (productos totales, ventas totales, ventas del día, alertas activas) al iniciar sesión, para tener una visión general del estado del negocio.'),
        bold("Criterios de aceptación:"),
        p('• Muestra 4 tarjetas KPI: Productos, Ventas totales, Ventas hoy, Alertas activas.'),
        p('• Incluye tabla de productos con stock bajo.'),
        p('• Incluye barra "Stock Pulse" en el sidebar con porcentajes visuales.'),
        p('• Los datos se actualizan desde la API en tiempo real.'),
        bold("Prioridad: Indispensable | Story Points: 3"),

        spacer(),
        h2("HU-04: Reportes Estadísticos"),
        p('Como propietario, quiero generar reportes diarios y mensuales de ventas con desglose detallado, totales y filtros por fecha, exportables a impresión, para analizar el comportamiento del negocio y tomar decisiones informadas.'),
        bold("Criterios de aceptación:"),
        p('• El sistema ofrece vista de reporte diario con selector de fecha.'),
        p('• El sistema ofrece vista de reporte mensual con selector de mes/año.'),
        p('• Muestra desglose de productos vendidos, cantidades y totales.'),
        p('• Incluye libro diario y libro mensual con resumen de transacciones.'),
        p('• Botón de impresión nativa del navegador.'),
        bold("Prioridad: Indispensable | Story Points: 5"),

        spacer(),
        h2("HU-05: Gestión de Productos"),
        p('Como administrador, quiero gestionar el catálogo de productos (nombre, precio, stock mínimo, código SKU), para mantener actualizada la oferta del negocio.'),
        bold("Criterios de aceptación:"),
        p('• CRUD completo de productos con validación de datos.'),
        p('• Código SKU único por producto.'),
        p('• Precio y stock no negativos con restricciones CHECK en BD.'),
        p('• Búsqueda por nombre.'),
        bold("Prioridad: Importante | Story Points: 3"),

        spacer(),
        h2("HU-06: Reposición de Stock"),
        p('Como administrador, quiero registrar reposiciones de stock indicando producto, cantidad, proveedor y usuario, para mantener el inventario actualizado y tener trazabilidad de las compras.'),
        bold("Criterios de aceptación:"),
        p('• Registro de reposición con producto, cantidad, proveedor y usuario.'),
        p('• Al confirmar, aumenta automáticamente el stock del producto.'),
        p('• Permite eliminar reposiciones con reversión de stock.'),
        p('• Muestra historial completo con proveedor y usuario.'),
        bold("Prioridad: Importante | Story Points: 3"),

        spacer(),
        h2("HU-07: Alertas de Stock Bajo"),
        p('Como propietario, quiero que el sistema genere alertas automáticas cuando el stock de un producto esté por debajo del mínimo, para prevenir desabastecimiento.'),
        bold("Criterios de aceptación:"),
        p('• Al registrarse una venta, si el stock resultante es <= stock mínimo, se crea alerta.'),
        p('• Las alertas se muestran en el Dashboard y en página de Alertas.'),
        p('• Permite marcar alertas como resueltas.'),
        bold("Prioridad: Deseable | Story Points: 2"),

        spacer(),
        h2("HU-08: Gestión de Proveedores"),
        p('Como administrador, quiero gestionar proveedores (nombre, contacto, teléfono, email, dirección) para asociarlos a las reposiciones de stock.'),
        bold("Criterios de aceptación:"),
        p('• CRUD completo de proveedores.'),
        p('• Asociación de proveedor en cada reposición.'),
        p('• Visualización del proveedor en el historial de reposiciones.'),
        bold("Prioridad: Deseable | Story Points: 2"),

        spacer(),
        h2("HU-09: Historial de Costos"),
        p('Como propietario, quiero ver el historial de cambios de precio de cada producto, para rastrear la evolución de costos y calcular ganancias con precisión.'),
        bold("Criterios de aceptación:"),
        p('• Cada cambio de precio registra costo anterior y nuevo.'),
        p('• Historial visible por producto con fecha y usuario.'),
        p('• Los movimientos de producto (ventas, reposiciones, ajustes) quedan registrados.'),
        bold("Prioridad: Deseable | Story Points: 2"),

        spacer(),
        h2("HU-10: Generación de Comprobante con QR"),
        p('Como encargado, quiero que cada venta genere un comprobante con código QR que contenga el detalle de la transacción, para facilitar la verificación y el respaldo de cada operación.'),
        bold("Criterios de aceptación:"),
        p('• Al finalizar la venta se muestra un modal con el comprobante.'),
        p('• El QR contiene: número de venta, fecha, total, método de pago y productos.'),
        p('• Botón de impresión del comprobante.'),
        bold("Prioridad: Deseable | Story Points: 1"),

        spacer(),
        h2("HU-11: Modo Oscuro / Claro"),
        p('Como usuario, quiero poder alternar entre modo oscuro y claro, para adaptar la interfaz a mis preferencias y condiciones de iluminación.'),
        bold("Criterios de aceptación:"),
        p('• Toggle de tema en la barra superior.'),
        p('• Persistencia de la preferencia en localStorage.'),
        p('• Sincronización del tema entre sidebar y contenido en iframe.'),
        p('• Paleta Azul Eléctrico consistente en ambos modos.'),
        bold("Prioridad: Deseable | Story Points: 1"),

        spacer(),
        h1("3. Plan de Actividades del Sprint Final"),
        h2("3.1 Descomposición en Tareas"),
        buildTable(
          ["HU", "Tarea", "Estado"],
          [
            ["HU-01", "Frontend: carrito de compras con +/- y cálculo automático", "Completado"],
            ["HU-01", "Frontend: modal de comprobante con QR y botón imprimir", "Completado"],
            ["HU-01", "Backend: endpoint POST /api/sales con validación y FOR UPDATE", "Completado"],
            ["HU-01", "Backend: descuento automático de stock en transacción", "Completado"],
            ["HU-02", "Backend: modelo de insumos con movimientos (inventario_movimiento)", "Completado"],
            ["HU-02", "Frontend: formulario de ajuste manual de inventario", "Completado"],
            ["HU-02", "Backend: control de movimientos de insumos con costo anterior", "Completado"],
            ["HU-03", "Frontend: dashboard con 4 KPI cards + tabla stock bajo", "Completado"],
            ["HU-03", "Frontend: Stock Pulse bar en sidebar", "Completado"],
            ["HU-03", "Backend: endpoint GET /api/sales/dashboard", "Completado"],
            ["HU-04", "Frontend: vista de reporte diario con filtro de fecha", "Completado"],
            ["HU-04", "Frontend: vista de reporte mensual con selector mes/año", "Completado"],
            ["HU-04", "Backend: endpoint GET /api/sales/reportes (diario/mensual/detalle)", "Completado"],
            ["HU-04", "Backend: endpoints libro diario y libro mensual", "Completado"],
            ["HU-05", "Frontend: CRUD de productos con búsqueda", "Completado"],
            ["HU-05", "Backend: endpoint GET/POST/PUT/DELETE /api/products", "Completado"],
            ["HU-05", "Migración: columna codigo (SKU) con UNIQUE", "Completado"],
            ["HU-06", "Frontend: formulario de reposición con proveedor", "Completado"],
            ["HU-06", "Backend: reposición con FOR UPDATE y reversión en DELETE", "Completado"],
            ["HU-07", "Backend: alertas automáticas al vender con stock bajo", "Completado"],
            ["HU-07", "Frontend: página de alertas con estado y resolución", "Completado"],
            ["HU-08", "Frontend: CRUD de proveedores", "Completado"],
            ["HU-08", "Backend: endpoint GET/POST/PUT/DELETE /api/proveedores", "Completado"],
            ["HU-09", "Backend: tabla producto_movimiento y producto_costo_historico", "Completado"],
            ["HU-09", "Frontend: vista de movimientos y costos históricos", "Completado"],
            ["HU-10", "Frontend: librería QRCode.js integrada en comprobante", "Completado"],
            ["HU-10", "Backend: generación de texto QR con detalle de venta", "Completado"],
            ["HU-11", "Frontend: toggle de tema con persistencia en localStorage", "Completado"],
            ["HU-11", "Frontend: sincronización de tema entre padre e iframe via postMessage", "Completado"],
            ["HU-11", "CSS: paleta Azul Eléctrico con variables en theme.css", "Completado"],
          ]
        ),

        spacer(),
        h1("4. Avance de Interfaces Finales"),
        buildTable(
          ["Interfaz", "Rol", "Funcionalidad", "Estado"],
          [
            ["Login", "Todos", "Autenticación con JWT", "Completado"],
            ["Dashboard", "Propietario", "KPIs, stock bajo, Stock Pulse", "Completado"],
            ["Ventas", "Encargado", "Carrito, QR, comprobante imprimible", "Completado"],
            ["Productos", "Admin", "CRUD con SKU y búsqueda", "Completado"],
            ["Reposiciones", "Admin", "Registro con proveedor y reversión", "Completado"],
            ["Mov. Inventario", "Admin", "Ajustes con historial de costos", "Completado"],
            ["Insumos", "Admin", "CRUD de insumos con movimientos", "Completado"],
            ["Reportes", "Propietario", "Diario, mensual, libro contable, imprimible", "Completado"],
            ["Proveedores", "Admin", "CRUD completo", "Completado"],
            ["Alertas", "Propietario", "Stock bajo, resolución", "Completado"],
            ["Usuarios", "Admin", "CRUD de usuarios y roles", "Completado"],
          ]
        ),

        spacer(),
        h1("5. Preparación del Release"),
        bold("Actividades previas al despliegue:"),
        p("1. Migraciones automáticas de base de datos ejecutadas al iniciar el servidor."),
        p("2. Validación de restricciones CHECK (precio >= 0, stock >= 0) con limpieza de datos existentes."),
        p("3. Pruebas de integración: flujo completo de venta (agregar carrito → checkout → stock decrementado → alerta generada)."),
        p("4. Pruebas de tema oscuro/claro en todas las páginas mediante sincronización postMessage."),
        p("5. Verificación de responsividad: sidebar colapsable, bottom-nav en móvil."),
        bold("Entregables:"),
        p("• Código fuente completo (Node.js + Express + PostgreSQL)."),
        p("• Base de datos con migraciones automáticas."),
        p("• 11 interfaces funcionales y probadas."),
        p("• Sistema de autenticación con roles (PROPIETARIO, ENCARGADO)."),
        p("• Generación de comprobantes con código QR."),
        p("• Tema oscuro/claro con persistencia."),

        spacer(),
        h1("6. Release Notes — v1.0.0"),
        bold("Nuevas funcionalidades:"),
        p("• Módulo de ventas con carrito interactivo, cálculo automático y comprobante QR."),
        p("• Control de inventario de productos e insumos con movimientos trazables."),
        p("• Dashboard ejecutivo con 4 indicadores clave y tabla de stock bajo."),
        p("• Reportes diarios, mensuales y libro contable con filtros."),
        p("• Gestión de productos con código SKU y validaciones."),
        p("• Reposiciones de stock con proveedores y reversión automática."),
        p("• Alertas automáticas de stock bajo."),
        p("• Gestión de proveedores."),
        p("• Historial de costos y movimientos de producto."),
        p("• Autenticación JWT con roles (Propietario, Encargado)."),
        p("• Interfaz responsiva con sidebar colapsable y navegación móvil."),
        p("• Tema oscuro/claro con sincronización en tiempo real."),
        bold("Tecnologías utilizadas:"),
        p("• Backend: Node.js + Express 5, PostgreSQL 18, JWT."),
        p("• Frontend: Bootstrap 5.3, vanilla JS, QRCode.js."),
        p("• Arquitectura: MVC, iframe-based page navigation, CSS custom properties."),
        bold("Mejoras post-release planificadas:"),
        p("• Exportación a Excel/PDF nativa."),
        p("• Módulo de cálculo de ganancias con costos históricos."),
        p("• Clientes recurrentes con historial de compras."),
        p("• Panel de tendencias y análisis predictivo."),
        p("• Notificaciones por correo electrónico."),

        spacer(),
        h1("7. Correspondencia con el Perfil de Investigación"),
        bold("Módulos implementados vs. objetivos específicos del perfil:"),
        buildTable(
          ["Objetivo del Perfil", "Módulo Implementado", "HU Relacionada"],
          [
            ["Registro de ventas diarias", "Ventas + Comprobante QR", "HU-01, HU-10"],
            ["Control de insumos", "Insumos + Mov. Inventario", "HU-02"],
            ["Cálculo automático de ganancias", "Dashboard + Reportes", "HU-03, HU-04"],
            ["Reportes estadísticos", "Reportes + Libro Diario/Mensual", "HU-04"],
            ["Gestión de compras", "Reposiciones + Proveedores", "HU-06, HU-08"],
          ]
        ),
        spacer(),
        p("El sistema desarrollado cumple con la totalidad de los objetivos específicos planteados en el perfil de investigación. La arquitectura web permite acceso desde cualquier dispositivo, y las medidas de seguridad implementadas (JWT, roles, validaciones) garantizan la integridad de los datos del negocio."),
      ]
    }
  ]
});

const outPath = 'sprint-final-patatas-king.docx';
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('Documento generado: ' + outPath);
});
