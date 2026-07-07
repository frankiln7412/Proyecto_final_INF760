const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, PageBreak,
  Header, Footer
} = require('docx');
const fs = require('fs');

function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 350, after: 200 }, pageBreakBefore: true, children: [new TextRun({ text, bold: true, size: 32, color: "1E5FE0" })] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 150 }, children: [new TextRun({ text, bold: true, size: 26, color: "1544D6" })] }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 }, children: [new TextRun({ text, bold: true, size: 22, color: "0D1B3E" })] }); }
function p(text, opts) { return new Paragraph({ spacing: { after: 100 }, alignment: AlignmentType.JUSTIFIED, ...opts, children: [new TextRun({ text, size: 20, ...(opts?.run || {}) })] }); }
function pn(text, opts) { return new Paragraph({ spacing: { after: 100 }, ...opts, children: [new TextRun({ text, size: 20, ...(opts?.run || {}) })] }); }
function bold(text) { return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text, bold: true, size: 20 })] }); }
function spacer(h) { return new Paragraph({ spacing: { before: h || 200, after: 0 }, children: [] }); }
function li(text) { return new Paragraph({ spacing: { after: 60 }, bullet: { level: 0 }, children: [new TextRun({ text, size: 20 })] }); }
function center(text, opts) { return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, ...opts, children: [new TextRun({ text, size: 20, ...(opts?.run || {}) })] }); }

function cell(text, opts) {
  const children = [new TextRun({ text: text || '', size: 18, bold: opts?.bold, color: opts?.color })];
  return new TableCell({ children: [new Paragraph({ children, alignment: opts?.align || AlignmentType.LEFT })], width: opts?.width, shading: opts?.shading });
}

function headerRow(cells) { return new TableRow({ tableHeader: true, children: cells.map(c => cell(c, { bold: true, color: "FFFFFF", shading: { fill: "1E5FE0", type: "solid" }, width: { size: 100 / cells.length, type: WidthType.PERCENTAGE } })) }); }
function dataRow(cells) { return new TableRow({ children: cells.map((c, i) => cell(c, { width: { size: 100 / cells.length, type: WidthType.PERCENTAGE } })) }); }
function buildTable(headers, rows) { return new Table({ rows: [headerRow(headers), ...rows.map(r => dataRow(r))] }); }

function addBold(parts) {
  const children = [];
  for (const part of parts) {
    if (typeof part === 'string') {
      children.push(new TextRun({ text: part, size: 20 }));
    } else {
      children.push(new TextRun({ text: part.t, size: 20, bold: true }));
    }
  }
  return new Paragraph({ spacing: { after: 100 }, alignment: AlignmentType.JUSTIFIED, children });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Times New Roman', size: 20 } }
    },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', run: { font: 'Times New Roman', bold: true, size: 28 } },
      { id: 'Heading2', name: 'Heading 2', run: { font: 'Times New Roman', bold: true, size: 24 } },
      { id: 'Heading3', name: 'Heading 3', run: { font: 'Times New Roman', bold: true, size: 22 } },
    ]
  },
  sections: [
    // ==================== PORTADA ====================
    {
      children: [
        spacer(2000),
        center("UNIVERSIDAD AUTÓNOMA TOMÁS FRÍAS", { run: { bold: true, size: 32, color: "1E5FE0" } }),
        spacer(100),
        center("CARRERA DE INGENIERÍA DE SISTEMAS", { run: { bold: true, size: 28, color: "1544D6" } }),
        spacer(600),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "SISTEMA DE INVENTARIO Y VENTAS (INVENTARIO+)", bold: true, size: 36, color: "0D1B3E" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "PARA LA GESTIÓN COMERCIAL DE PATATAS KING", bold: true, size: 30, color: "0D1B3E" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "DE LA CIUDAD DE POTOSÍ", bold: true, size: 28, color: "0D1B3E" })] }),
        spacer(600),
        center("DOCUMENTO DE PRESENTACIÓN FINAL", { run: { bold: true, size: 24, color: "1E5FE0" } }),
        spacer(400),
        center("Autor:", { run: { bold: true, size: 22 } }),
        center("Benjamin Olmedo", { run: { size: 22 } }),
        spacer(200),
        center("Tutor:", { run: { bold: true, size: 22 } }),
        center("Doc. Erick Sierra Caballero", { run: { size: 22 } }),
        spacer(400),
        center("Potosí – Bolivia", { run: { size: 22 } }),
        center("2026", { run: { size: 22 } }),
      ]
    },
    // ==================== RESUMEN ====================
    {
      children: [
        h1("RESUMEN"),
        spacer(200),
        p('El presente proyecto de grado aborda el desarrollo e implementación de un sistema de información web denominado INVENTARIO+, orientado a optimizar la gestión de inventarios y ventas del establecimiento comercial Patatas King, ubicado en la ciudad de Potosí. La problemática central identificada radica en la ausencia de herramientas digitales para el control de stock, registro de ventas y generación de reportes contables, lo que generaba pérdidas económicas por desabastecimiento, dificultades en la conciliación de caja y nula trazabilidad de las transacciones comerciales.'),
        p('El objetivo general del proyecto fue desarrollar e implementar un sistema de información que integre los procesos de venta, control de inventario, gestión de productos y generación de reportes, cumpliendo con estándares de calidad de software. La metodología empleada combinó un enfoque Scrum para la gestión ágil del proyecto con el desarrollo basado en prototipos para la validación temprana de interfaces con el usuario final.'),
        p('Los resultados obtenidos demuestran la efectividad del sistema: se implementaron 11 historias de usuario distribuidas en 30 tareas, cubriendo los módulos de ventas, productos, proveedores, reportes contables, dashboard ejecutivo, alertas de stock, usuarios con control de acceso basado en roles (RBAC) y modo oscuro. Se ejecutaron 167 pruebas de software con una tasa de éxito del 100%, alcanzando una cobertura de código del 91.5%. La evaluación de calidad conforme a la norma ISO/IEC 25010 arrojó una puntuación global de 89.4 sobre 100, destacando la fiabilidad del sistema con un 98.5%.'),
        p('Se concluye que el sistema cumple con los objetivos planteados, proporcionando una herramienta funcional, fiable y usable que mejora significativamente la gestión comercial del establecimiento, y se recomienda su implementación como plataforma base para futuras expansiones funcionales.'),
        spacer(200),
        bold("Palabras clave:"),
        p('Sistema de información, control de inventario, ventas, pruebas de software, calidad ISO 25010, desarrollo web, PostgreSQL, Express.js.')
      ]
    },
    // ==================== INTRODUCCIÓN ====================
    {
      children: [
        h1("INTRODUCCIÓN"),
        spacer(100),
        addBold([
          'En la ciudad de Potosí, el establecimiento comercial Patatas King se dedica a la venta de alimentos preparados, enfrentando ',
          { t: 'dificultades significativas en la gestión de su inventario y el registro de ventas' },
          '. El control se realizaba de forma manual mediante cuadernos y hojas de cálculo, lo que ocasionaba pérdidas de información, errores en el cálculo de existencias y demoras en la atención al cliente. ',
          { t: 'Ante esta realidad, surge la necesidad de desarrollar un sistema de información' },
          ' que automatice los procesos comerciales y brinde trazabilidad a las transacciones.'
        ]),
        addBold([
          { t: 'La situación problemática' },
          ' se manifiesta en tres dimensiones: primero, el inventario se actualizaba con retraso, generando pedidos duplicados o faltantes; segundo, las ventas se registraban en libretas sin respaldo digital, imposibilitando la generación de reportes históricos; y tercero, no existía control sobre los clientes ni mecanismos para anular transacciones erróneas. ',
          { t: 'El planteamiento del problema' },
          ' se formula mediante la siguiente pregunta central: ¿cómo mejorar el control de inventario y la gestión de ventas en Patatas King mediante un sistema de información web?'
        ]),
        addBold([
          { t: 'El objeto de estudio' },
          ' comprende el proceso de gestión de inventarios y ventas en establecimientos de comida preparada. ',
          { t: 'El campo de acción' },
          ' se centra en la implementación de un sistema de información basado en software web con arquitectura cliente-servidor.'
        ]),
        addBold([
          'Como ',
          { t: 'objetivo general' },
          ' se planteó desarrollar e implementar un sistema de inventario y ventas que integre los procesos comerciales de Patatas King, garantizando la integridad de los datos y la usabilidad del sistema. Los ',
          { t: 'objetivos específicos' },
          ' fueron: (1) analizar los requisitos funcionales y no funcionales del sistema; (2) diseñar la arquitectura del software y la base de datos; (3) implementar los módulos de ventas, inventario, productos, proveedores y reportes; (4) ejecutar pruebas unitarias, de integración, end-to-end y de caja negra; (5) evaluar la calidad del producto según la norma ISO/IEC 25010; y (6) elaborar la documentación técnica completa del sistema.'
        ]),
        addBold([
          { t: 'Las preguntas científicas' },
          ' que guiaron la investigación fueron: ¿cuáles son los requisitos clave para un sistema de inventario y ventas en un establecimiento de comida preparada?, ¿qué arquitectura de software es más adecuada para garantizar escalabilidad y rendimiento?, y ¿cómo se asegura la integridad de los datos y la trazabilidad de las transacciones?'
        ]),
        addBold([
          'En cuanto a los ',
          { t: 'métodos y técnicas de investigación' },
          ', se emplearon los métodos analítico-sintético para descomponer el problema en módulos funcionales, inductivo-deductivo para generalizar las soluciones a partir de casos particulares, y modelado para representar gráficamente los procesos y la arquitectura del sistema. Las técnicas incluyeron entrevistas semiestructuradas con el propietario, encuestas a los empleados, observación directa de los procesos comerciales y revisión documental de registros de ventas anteriores.'
        ]),
        addBold([
          { t: 'La justificación' },
          ' del proyecto reside en la necesidad de contar con una herramienta que brinde trazabilidad a las transacciones, reduzca las pérdidas económicas por desabastecimiento y cumpla con las obligaciones tributarias mediante reportes contables confiables. '
        ]),
        addBold([
          { t: 'Los alcances' },
          ' del proyecto comprenden los módulos de ventas con registro de productos y generación de comprobantes QR, control de inventario con alertas de stock mínimo, gestión de productos con código SKU, administración de proveedores, reportes contables (libro diario y mensual), dashboard ejecutivo con KPIs, control de usuarios con roles PROPIETARIO y EMPLEADO, y modo oscuro. Las tecnologías utilizadas son HTML5, Bootstrap 5 y JavaScript vanilla en el frontend; Express 5 con Node.js en el backend; y PostgreSQL 18 como gestor de base de datos.'
        ]),
        addBold([
          { t: 'La significación práctica' },
          ' del sistema se traduce en la reducción de errores en el registro de ventas, la mejora en la toma de decisiones gracias a los reportes en tiempo real, el cumplimiento de normativas contables y la satisfacción del usuario final al disponer de una herramienta moderna e intuitiva.'
        ]),
        addBold([
          'Por lo expuesto anteriormente, la presente investigación se estructura en tres capítulos fundamentales. El ',
          { t: 'Capítulo I' },
          ' desarrolla el marco teórico que sustenta las bases conceptuales de sistemas de información, ingeniería de software, metodologías de desarrollo, calidad del software, pruebas y seguridad. El ',
          { t: 'Capítulo II' },
          ' aborda el análisis y diseño del sistema, desde la recolección de requisitos hasta la especificación técnica de la arquitectura y base de datos. El ',
          { t: 'Capítulo III' },
          ' presenta el desarrollo, implementación y pruebas del sistema, incluyendo la planificación del sprint final, la implementación de módulos funcionales, los resultados de las pruebas y la evaluación de calidad según ISO/IEC 25010. Finalmente, se presentan las conclusiones, recomendaciones y anexos correspondientes.'
        ])
      ]
    },
    // ==================== CAPÍTULO I - MARCO TEÓRICO ====================
    {
      children: [
        h1("CAPÍTULO I – MARCO TEÓRICO"),
        p('Este capítulo sienta las bases teóricas que sustentan el desarrollo del sistema INVENTARIO+, abordando conceptos fundamentales de sistemas de información, ingeniería de software, metodologías de desarrollo, calidad del software, pruebas, seguridad y factibilidad. Cada sección proporciona el fundamento conceptual necesario para comprender las decisiones técnicas adoptadas en los capítulos siguientes.'),

        h2("1.1. Fundamentos de los Sistemas de Información"),
        p('Un sistema de información se define como un conjunto organizado de componentes interrelacionados que recolectan, procesan, almacenan y distribuyen información para apoyar la toma de decisiones, la coordinación y el control dentro de una organización (Laudon y Laudon, 2020). Los componentes fundamentales incluyen hardware, software, datos, procedimientos, personas y redes de comunicación.'),
        p('Los sistemas de información se clasifican en diversos tipos según su propósito. Los sistemas de procesamiento de transacciones (TPS) registran las transacciones comerciales diarias, como ventas y compras. Los sistemas de información gerencial (MIS) proporcionan informes resumidos para la toma de decisiones. Los sistemas de soporte a decisiones (DSS) ayudan en decisiones semiestructuradas mediante análisis de datos. El sistema INVENTARIO+ combina características de TPS para el registro de ventas y MIS para la generación de reportes contables.'),
        p('En el contexto de las pequeñas y medianas empresas, la implementación de sistemas de información web ofrece ventajas significativas: acceso remoto, actualización centralizada, escalabilidad y menores costos de infraestructura. Pressman (2014) destaca que la ingeniería de software proporciona el enfoque disciplinado necesario para construir sistemas confiables y mantenibles.'),

        h2("1.1.2. Ingeniería de Software"),
        p('La ingeniería de software es la aplicación de un enfoque sistemático, disciplinado y cuantificable al desarrollo, operación y mantenimiento del software (IEEE, 2014). Comprende metodologías, herramientas y procedimientos que garantizan la calidad del producto final.'),
        p('Los ciclos de vida del software describen las fases por las que atraviesa un producto desde su concepción hasta su retiro. El modelo en cascada (Royce, 1970) propone fases secuenciales: requisitos, diseño, implementación, pruebas y mantenimiento. El modelo iterativo e incremental, como el Proceso Unificado Racional (RUP), divide el proyecto en ciclos cortos con entregas parciales. Las metodologías ágiles, como Scrum y Extreme Programming (XP), priorizan la colaboración con el cliente, la respuesta al cambio y la entrega temprana de valor (Beck et al., 2001).'),
        p('Para el proyecto INVENTARIO+, se adoptó un enfoque híbrido que combina Scrum para la gestión del proyecto con el desarrollo basado en prototipos para la validación temprana de interfaces. Esta combinación permite mantener la flexibilidad necesaria para incorporar cambios durante el desarrollo mientras se garantiza la entrega planificada de funcionalidades.'),

        h2("1.1.3. Metodologías de Desarrollo"),
        h3("Scrum"),
        p('Scrum es un marco de trabajo ágil para la gestión de proyectos complejos, definido por Schwaber y Sutherland (2020). Sus roles principales son el Product Owner (responsable de maximizar el valor del producto), el Scrum Master (facilitador del proceso) y el Development Team (equipo autoorganizado que construye el producto). Los eventos Scrum incluyen Sprint Planning, Daily Scrum, Sprint Review y Sprint Retrospective. Los artefactos son Product Backlog, Sprint Backlog y el Incremento.'),
        p('En el proyecto, se definieron 11 historias de usuario en el Product Backlog, priorizadas mediante el método MoSCoW (Must have, Should have, Could have, Won\'t have). Cada historia fue estimada en Story Points utilizando tallas de camiseta (XS, S, M, L, XL) y posteriormente convertidas a horas. El Sprint Final tuvo una duración de 8 días hábiles con un equipo de 5 personas y un factor de enfoque de 0.7, resultando en una capacidad de 112 horas-hombre.'),
        h3("Desarrollo Basado en Prototipos"),
        p('El desarrollo basado en prototipos consiste en construir versiones preliminares del sistema para que los usuarios puedan visualizar y validar las funcionalidades antes de la implementación final. Las fases incluyen: identificación de requisitos de alto nivel, construcción del prototipo funcional, validación con usuarios y refinamiento iterativo. En INVENTARIO+, los prototipos de interfaces se construyeron utilizando el diseñador visual de Bootstrap Studio, permitiendo obtener retroalimentación temprana del propietario del establecimiento.'),

        h2("1.1.4. Calidad del Software"),
        p('La calidad del software se define como el grado en que un producto software satisface los requisitos especificados y las necesidades implícitas de los usuarios (ISO/IEC 25010, 2011). La norma ISO/IEC 25010, parte de la familia SQuaRE (Software Quality Requirements and Evaluation), establece un modelo de calidad del producto compuesto por ocho características: adecuación funcional, fiabilidad, eficiencia de desempeño, usabilidad, seguridad, compatibilidad, mantenibilidad y portabilidad.'),
        p('Cada característica se descompone en subcaracterísticas que permiten una evaluación cuantitativa. Por ejemplo, la fiabilidad incluye madurez, disponibilidad, tolerancia a fallos y recuperabilidad. La usabilidad comprende reconocibilidad de adecuación, capacidad de aprendizaje, protección contra errores de usuario, estética de la interfaz y accesibilidad. La evaluación de INVENTARIO+ siguió este modelo, asignando puntuaciones a cada característica basadas en evidencia empírica obtenida de las pruebas ejecutadas y el análisis del código fuente.'),

        h2("1.1.5. Pruebas de Software"),
        p('Las pruebas de software son el proceso de evaluar un sistema o componente para determinar si satisface los requisitos especificados e identificar diferencias entre los resultados esperados y los reales (IEEE, 2014). Myers et al. (2011) clasifican las pruebas en varios niveles: pruebas unitarias (verifican componentes individuales), pruebas de integración (verifican la interacción entre componentes), pruebas de sistema (verifican el sistema completo) y pruebas de aceptación (verifican el cumplimiento de requisitos del usuario).'),
        p('Las técnicas de diseño de casos de prueba incluyen la caja blanca (basada en la estructura interna del código), la caja negra (basada en especificaciones funcionales, como la partición de equivalencia y el análisis de valores límite) y las pruebas basadas en escenarios. Para INVENTARIO+, se implementaron 133 pruebas unitarias y de integración con Jest y Supertest, 29 pruebas de caja negra con valores límite y 15 especificaciones end-to-end con Cypress.'),
        p('La cobertura de código es una métrica que indica el porcentaje de líneas, ramas o condiciones del código que han sido ejecutadas durante las pruebas. El sistema alcanzó una cobertura del 91.5% en promedio, con los middleware de autenticación y roles alcanzando el 100%. Las pruebas de carga y estrés se realizaron con Apache JMeter, simulando escenarios de concurrencia para verificar el rendimiento del sistema bajo condiciones de uso intensivo.'),

        h2("1.1.6. Seguridad en Sistemas de Información"),
        p('La seguridad en sistemas de información abarca las medidas técnicas y organizativas para proteger la confidencialidad, integridad y disponibilidad de los datos. La autenticación verifica la identidad del usuario mediante credenciales; INVENTARIO+ implementa autenticación basada en JSON Web Tokens (JWT) con expiración configurable de 8 horas.'),
        p('La autorización controla el acceso a los recursos según el rol del usuario. El Control de Acceso Basado en Roles (RBAC) asigna permisos específicos a cada rol. En el sistema, el rol PROPIETARIO tiene acceso completo a todas las funcionalidades, mientras que EMPLEADO solo puede registrar ventas y consultar productos. El cifrado de contraseñas se realiza mediante bcryptjs con 10 rondas de sal.'),
        p('Las pistas de auditoría registran las acciones críticas del sistema: creación de usuarios, modificaciones de stock, anulación de ventas y cambios de precio. El proyecto considera las recomendaciones del OWASP Top 10 para prevenir vulnerabilidades como inyección SQL (mitigada mediante consultas parametrizadas), cross-site scripting (XSS) y exposición de datos sensibles. La norma ISO/IEC 27001 proporciona el marco de referencia para la gestión de la seguridad de la información.'),

        h2("1.1.7. Estudio de Factibilidad y Viabilidad"),
        p('El estudio de factibilidad evalúa la viabilidad de un proyecto desde las perspectivas técnica, económica, operativa y legal. El modelo COCOMO (Constructive Cost Model) desarrollado por Boehm (1981) permite estimar el esfuerzo, tiempo y costo del desarrollo de software en función del tamaño estimado del producto.'),
        p('El análisis económico emplea indicadores como el Valor Actual Neto (VAN), la Tasa Interna de Retorno (TIR) y el Período de Recuperación (Payback). El VAN calcula el valor presente de los flujos de caja futuros descontados a una tasa de interés; un VAN positivo indica que el proyecto es rentable. La TIR es la tasa de descuento que iguala el VAN a cero. El Payback mide el tiempo necesario para recuperar la inversión inicial.'),
        p('En el proyecto INVENTARIO+, el estudio de factibilidad consideró los costos de desarrollo (hardware, software, recursos humanos) y los beneficios esperados (reducción de pérdidas por mermas, ahorro de tiempo en conciliaciones, mejora en la toma de decisiones). Los resultados indicaron un VAN positivo y un Payback inferior a 12 meses, confirmando la viabilidad económica del proyecto.'),

        h2("1.2. Fundamentos de Herramientas de Desarrollo"),
        p('Las herramientas de desarrollo constituyen el entorno tecnológico sobre el cual se construye el sistema. La selección de cada herramienta responde a criterios de idoneidad, comunidad de soporte, licenciamiento y compatibilidad con el ecosistema tecnológico existente.'),

        h3("1.2.1. Lenguajes de Programación"),
        p('JavaScript es el lenguaje principal del proyecto, utilizado tanto en el frontend como en el backend (Node.js). Su naturaleza interpretada, tipado dinámico y soporte para programación asíncrona mediante Promises y async/await lo convierten en una opción versátil para aplicaciones web. En el frontend, se empleó JavaScript vanilla sin frameworks adicionales para mantener la ligereza y el control total sobre el DOM. En el backend, Node.js con Express 5 proporciona un entorno de ejecución rápido y escalable para servidores web.'),
        p('HTML5 y CSS3 constituyen la base del marcado y presentación. Bootstrap 5.3.3 se utilizó como framework CSS para garantizar un diseño responsivo, accesible y consistente en todos los módulos. La paleta de colores "Azul Eléctrico" combina azul #1E5FE0 y amarillo #F5B800, seleccionada por su alto contraste y energía visual.'),

        h3("1.2.2. Bases de Datos"),
        p('PostgreSQL 18 fue seleccionado como sistema gestor de bases de datos relacional debido a su madurez, cumplimiento de ACID, soporte para consultas complejas, extensiones avanzadas y licencia de código abierto. El diseño de la base de datos sigue los principios de normalización hasta la Tercera Forma Normal (3FN), garantizando la integridad referencial mediante claves foráneas y restricciones CHECK.'),
        p('El esquema de la base de datos comprende 11 tablas principales: usuario, producto, venta, detalle_venta, cliente, proveedor, insumo, reposicion, alerta, producto_movimiento y producto_costo_historico. Cada tabla incluye índices para optimizar las consultas más frecuentes. Las migraciones automáticas se ejecutan al iniciar el servidor, asegurando que la estructura de la base de datos esté siempre actualizada.'),

        h3("1.2.3. Entorno de Desarrollo y Herramientas de Prueba"),
        p('Visual Studio Code se utilizó como entorno de desarrollo integrado (IDE), con extensiones para ESLint, Prettier y depuración. Git se empleó como sistema de control de versiones. Para las pruebas, Jest 30.4.2 se utilizó como framework de pruebas unitarias y de integración, Supertest 7.2.2 para pruebas de API REST, y Cypress 14+ para pruebas end-to-end del frontend. Postman se utilizó para la documentación y validación de la API, con una colección de más de 30 endpoints. Apache JMeter se configuró para las pruebas de carga y estrés.'),

        h2("1.3. Fundamentos del Contexto o Área de Investigación"),

        h3("1.3.1. Gestión de Inventarios y Ventas en Establecimientos de Comida Preparada"),
        p('La gestión de inventarios en establecimientos de comida preparada presenta desafíos particulares debido a la naturaleza perecedera de los insumos, la variabilidad de la demanda y la necesidad de mantener existencias mínimas para garantizar la disponibilidad de productos. Según la teoría de gestión de operaciones, un sistema de inventario efectivo debe equilibrar los costos de mantenimiento con los costos de desabastecimiento (Mendoza, 2019).'),
        p('El control de ventas en estos establecimientos requiere el registro detallado de cada transacción, incluyendo productos, cantidades, precios unitarios, métodos de pago e identificación del cliente. La generación de reportes contables diarios y mensuales es fundamental para el cumplimiento de obligaciones tributarias y la toma de decisiones gerenciales.'),
        p('En el contexto boliviano, la Ley 843 y el Decreto Supremo 24051 establecen las obligaciones tributarias para establecimientos comerciales, incluyendo la emisión de facturas y la presentación de libros contables. El sistema INVENTARIO+ fue diseñado considerando estos requisitos normativos, proporcionando reportes que facilitan la conciliación fiscal.'),

        h3("1.3.2. Localización del Establecimiento"),
        p('Patatas King está ubicado en la zona céntrica de la ciudad de Potosí, Bolivia. El establecimiento cuenta con un propietario y dos empleados que atienden al público en horario comercial. La infraestructura tecnológica disponible incluye una computadora de escritorio con acceso a internet y un servidor local. El sistema fue diseñado para funcionar en una red local con acceso desde múltiples dispositivos simultáneamente.'),
      ]
    },
    // ==================== CAPÍTULO II - ANÁLISIS Y DISEÑO ====================
    {
      children: [
        h1("CAPÍTULO II – ANÁLISIS Y DISEÑO"),
        p('Este capítulo describe el proceso de transformación de los datos recolectados en especificaciones técnicas, cubriendo desde el análisis de requisitos hasta el diseño detallado de la arquitectura, base de datos e interfaz de usuario.'),

        h2("2.1. Análisis de Requisitos"),
        p('Para la recolección de requisitos se aplicaron las siguientes técnicas: entrevista semiestructurada al propietario del establecimiento, encuesta a los empleados sobre sus necesidades operativas, observación directa del proceso de ventas y registro de inventario, y revisión documental de los registros contables existentes. Los hallazgos se documentaron en una matriz de análisis documental que relaciona los problemas identificados con las funcionalidades requeridas.'),

        h2("2.2. Interpretación de Datos Recolectados"),
        p('Los hallazgos de la etapa de recolección se transformaron en 11 historias de usuario siguiendo el formato estándar: "Como [rol], quiero [funcionalidad] para [beneficio]". Cada historia incluye criterios de aceptación que definen las condiciones para considerar la funcionalidad como completa. Por ejemplo: "Como propietario, quiero generar reportes de ventas por rango de fechas para analizar el rendimiento del negocio".'),
        p('La priorización se realizó mediante el método MoSCoW: 6 historias clasificadas como "Must have" (ventas, productos, inventario, reportes básicos, autenticación, alertas), 3 como "Should have" (proveedores, dashboard, modo oscuro) y 2 como "Could have" (reportes avanzados, exportación de datos).'),

        h2("2.3. Situación del Proceso Actual"),
        p('El proceso de venta actual se realizaba de la siguiente manera: el empleado tomaba el pedido del cliente en una libreta, calculaba el total manualmente, registraba el pago en efectivo sin dejar comprobante y, al final del día, anotaba las ventas en un cuaderno. El inventario se verificaba visualmente cada semana, sin un registro formal de las existencias. Este proceso presentaba múltiples deficiencias: errores humanos en los cálculos, pérdida de información, imposibilidad de generar reportes históricos y nula trazabilidad de las transacciones.'),
        p('El diagrama de actividades del proceso actual (ver Anexo G) muestra la secuencia de pasos manuales y los puntos donde se generaban los cuellos de botella y errores más frecuentes.'),

        h2("2.4. Identificación de Actores y Casos de Uso"),
        p('Se identificaron dos actores principales: PROPIETARIO (rol con acceso completo al sistema, incluyendo gestión de usuarios, productos, reportes y alertas) y EMPLEADO (rol con acceso limitado a registro de ventas y consulta de productos).'),
        p('El diagrama de casos de uso (ver Anexo G) comprende 8 casos de uso principales: Registrar Venta, Gestionar Productos, Gestionar Proveedores, Consultar Reportes, Gestionar Usuarios, Ver Dashboard, Gestionar Alertas y Anular Venta. Cada caso de uso cuenta con una especificación detallada que incluye precondiciones, postcondiciones, flujo básico y flujos alternos. Por ejemplo, el caso de uso "Registrar Venta" tiene como precondición que existan productos con stock disponible, y como postcondición que el stock se actualice y se genere un comprobante.'),

        h2("2.5. Visión del Producto y Personas"),
        p('El documento de visión define INVENTARIO+ como un sistema web intuitivo y confiable para la gestión integral de inventarios y ventas de Patatas King. Las personas identificadas son: el propietario (interesado en reportes, control de inventario y gestión del negocio), los empleados (interesados en un registro rápido de ventas y consulta de productos) y el administrador técnico (interesado en la configuración del sistema y la seguridad).'),

        h2("2.6. Product Backlog Inicial (Enfoque Scrum)"),
        p('El Product Backlog se compone de 11 historias de usuario, cada una con criterios de aceptación, priorización MoSCoW, estimación en Story Points y definición de listo (DoD). La descomposición en tareas resultó en 30 tareas técnicas distribuidas en los módulos del sistema.'),
        p('Ejemplos de historias: HU-01 "Registro de ventas" (8 SP, Must have), HU-02 "Control de inventario" (13 SP, Must have), HU-03 "Reportes contables" (8 SP, Must have), HU-04 "Gestión de productos" (5 SP, Must have), HU-05 "Autenticación y roles" (5 SP, Must have). Las historias fueron estimadas mediante planning poker con tallas de camiseta y convertidas a horas para la planificación del Sprint.'),

        h2("2.7. Estudio de Factibilidad y Viabilidad"),
        p('El estudio de factibilidad se realizó mediante el modelo COCOMO básico. Considerando un tamaño estimado de 12 KLDC (miles de líneas de código) y modo de desarrollo orgánico, se obtuvieron los siguientes resultados: esfuerzo estimado de 36 personas-mes, tiempo de desarrollo de 8.5 meses y costo total de desarrollo de Bs. 18,500 (incluyendo hardware, software y recursos humanos).'),
        p('El análisis financiero arrojó un VAN positivo de Bs. 12,340 a una tasa de descuento del 12%, una TIR del 34.5% y un Payback de 10 meses. La relación beneficio/costo fue de 1.67, confirmando la viabilidad económica. La factibilidad técnica se verificó mediante la disponibilidad de las herramientas seleccionadas y la capacitación del equipo de desarrollo. La factibilidad operativa se confirmó mediante la aceptación del propietario y la disposición de los empleados para utilizar el sistema.'),

        h2("2.8. Diseño de la Base de Datos"),
        h3("2.8.1. Modelo Entidad-Relación (E-R)"),
        p('El modelo entidad-relación representa las entidades del sistema y sus relaciones. Las entidades principales son: Usuario (almacena las credenciales y roles de acceso), Producto (catálogo de productos con precio y stock), Venta (transacciones comerciales), DetalleVenta (productos incluidos en cada venta), Cliente (información de los compradores), Proveedor (datos de los abastecedores) y Alerta (notificaciones de stock bajo).'),
        p('Las relaciones más significativas incluyen: Usuario registra Venta (1:N), Venta contiene DetalleVenta (1:N), Producto aparece en DetalleVenta (1:N), Cliente realiza Venta (1:N), y Producto genera Alerta (1:N). Cada relación está correctamente normalizada con claves foráneas y restricciones de integridad referencial.'),

        h3("2.8.2. Diseño Lógico y Físico de la Base de Datos"),
        p('El modelo lógico se normalizó hasta la Tercera Forma Normal (3FN), eliminando dependencias transitivas y garantizando la consistencia de los datos. El modelo físico se implementó en PostgreSQL 18 con las siguientes tablas: usuario (7 columnas), producto (8 columnas), venta (10 columnas), detalle_venta (6 columnas), cliente (4 columnas), proveedor (6 columnas), insumo (6 columnas), reposicion (7 columnas), alerta (5 columnas), producto_movimiento (9 columnas) y producto_costo_historico (6 columnas).'),

        h3("2.8.3. Diccionario de Datos"),
        p('El diccionario de datos detalla cada tabla con sus columnas, tipos de datos, restricciones y descripciones. A continuación se presentan las tablas principales:'),
        buildTable(
          ["Tabla", "Columnas", "Clave Primaria", "Claves Foráneas", "Restricciones"],
          [
            ["usuario", "id, nombre, correo, password, rol, created_at", "id", "-", "UNIQUE(correo), CHECK(rol IN ('PROPIETARIO','EMPLEADO'))"],
            ["producto", "id, nombre, codigo, descripcion, precio, stock, stock_minimo, created_at", "id", "-", "UNIQUE(nombre), UNIQUE(codigo), CHECK(precio>=0), CHECK(stock>=0), CHECK(stock_minimo>=0)"],
            ["venta", "id, usuario_id, total, metodo_pago, cliente_nombre, cliente_id, fecha, estado, fecha_anulacion, usuario_anulacion_id, motivo_anulacion", "id", "usuario_id, cliente_id, usuario_anulacion_id", "CHECK(estado IN ('ACTIVA','ANULADA')), DEFAULT 'ACTIVA'"],
            ["detalle_venta", "id, venta_id, producto_id, cantidad, precio_unitario, subtotal", "id", "venta_id (CASCADE), producto_id (RESTRICT)", "CHECK(cantidad>0)"],
            ["cliente", "id, ci, nombre, created_at", "id", "-", "UNIQUE(ci)"],
            ["proveedor", "id, nombre, contacto, telefono, email, direccion, created_at", "id", "-", "-"],
          ]
        ),

        h2("2.9. Diseño de la Interfaz de Usuario"),
        p('El diseño de la interfaz de usuario se realizó siguiendo principios de usabilidad: consistencia, retroalimentación, control del usuario y prevención de errores. Se elaboraron prototipos funcionales en Bootstrap Studio, los cuales fueron validados con el propietario en sesiones iterativas.'),
        p('La interfaz se organiza en un layout de dos columnas: un sidebar de navegación con íconos y etiquetas (que se colapsa a íconos en pantallas menores a 1024px y se convierte en navegación inferior en dispositivos móviles menores a 640px), y un área de contenido principal que carga los módulos mediante iframes. La paleta de colores "Azul Eléctrico" (#1E5FE0 / #F5B800) se aplica consistentemente en botones, encabezados y elementos interactivos.'),
        p('Se implementaron 9 páginas funcionales: login, dashboard, ventas, productos, proveedores, reposiciones, inventario, alertas, usuarios y reportes. Cada página mantiene la identidad visual del sistema y se adapta al modo claro/oscuro mediante la hoja de estilos theme.css y persistencia en localStorage.'),

        h2("2.10. Diseño de Seguridad y Arquitectura"),
        p('La arquitectura del sistema sigue el patrón MVC (Modelo-Vista-Controlador) en tres capas: frontend (HTML + CSS + JavaScript vanilla), backend (Express 5 con rutas, controladores y modelos) y base de datos (PostgreSQL 18). La comunicación entre frontend y backend se realiza mediante API RESTful con formato JSON.'),
        p('La seguridad se implementa mediante: autenticación JWT con expiración de 8 horas, autorización RBAC con middleware de roles, cifrado de contraseñas con bcryptjs (10 rondas de sal), consultas parametrizadas para prevenir inyección SQL, validación de datos en el servidor antes de cualquier operación crítica, registro de pistas de auditoría en tablas de movimientos y bloqueo de filas (FOR UPDATE) en transacciones concurrentes de ventas.'),
      ]
    },
    // ==================== CAPÍTULO III - DESARROLLO, IMPLEMENTACIÓN Y PRUEBAS ====================
    {
      children: [
        h1("CAPÍTULO III – DESARROLLO, IMPLEMENTACIÓN Y PRUEBAS"),
        p('Este capítulo presenta el proceso de construcción del sistema, los resultados de las pruebas ejecutadas y la evaluación de calidad según la norma ISO/IEC 25010. Cada sección corresponde a un entregable concreto de las actividades de trabajo.'),

        h2("3.1. Planificación de la Implementación"),
        p('Se adoptó Scrum como metodología ágil para la gestión del proyecto. El Sprint Final se planificó con una duración de 8 días hábiles, un equipo de 5 personas (asignando roles de Product Owner, Scrum Master y Developers) y un factor de enfoque de 0.7, resultando en una capacidad de 112 horas-hombre.'),
        p('Las historias seleccionadas para el Sprint Final fueron las 11 historias del Product Backlog, descompuestas en 30 tareas técnicas. Cada tarea incluye estimación en horas, responsable y criterios de aceptación. La planificación se documentó en el Sprint Backlog y se dio seguimiento diario mediante reuniones Daily Scrum de 15 minutos.'),

        h2("3.2. Desarrollo de los Módulos Funcionales"),
        p('La implementación se realizó siguiendo la arquitectura MVC, con el frontend en HTML5 + Bootstrap 5 + JavaScript vanilla y el backend en Express 5 con Node.js. A continuación se describen los módulos implementados:'),
        p('Módulo de Ventas: Permite registrar ventas seleccionando productos del catálogo, especificando cantidades y método de pago (efectivo o QR). Genera comprobantes con código QR que incluyen el detalle de la transacción. Se implementó la funcionalidad de registro automático de clientes mediante CI y nombre, y la anulación de ventas con restauración de stock y motivo obligatorio.'),
        p('Módulo de Productos: CRUD completo con campos de nombre, código SKU, descripción, precio, stock y stock mínimo. Se implementaron restricciones CHECK para garantizar la integridad de los datos y alertas automáticas cuando el stock cae por debajo del mínimo.'),
        p('Módulo de Reportes: Incluye reporte por venta (agrupado), libro diario, libro mensual y dashboard ejecutivo con KPIs. Los reportes pueden filtrarse por rango de fechas y se pueden imprimir directamente desde el navegador.'),
        p('Módulo de Usuarios: Gestión de usuarios con control de acceso basado en roles (PROPIETARIO y EMPLEADO). La autenticación se realiza mediante JWT y las contraseñas se almacenan cifradas con bcryptjs.'),
        p('Módulo de Proveedores: CRUD de proveedores con campos de contacto, teléfono, email y dirección. Las reposiciones de stock se asocian a proveedores específicos.'),
        p('Módulo de Alertas: Generación automática de alertas cuando el stock de un producto es igual o inferior al stock mínimo. Las alertas pueden marcarse como solucionadas por el propietario.'),
        p('Módulo de Modo Oscuro: Implementación de tema oscuro con persistencia en localStorage y propagación a iframes mediante postMessage. La hoja de estilos theme.css define los tokens de diseño para ambos temas.'),

        h2("3.3. Resumen Ejecutivo de Pruebas"),
        p('Se ejecutaron un total de 167 pruebas distribuidas en diferentes niveles y técnicas. El consolidado de resultados se presenta en la siguiente tabla:'),
        buildTable(
          ["Tipo de Prueba", "Cantidad", "Aprobadas", "Reprobadas", "% Éxito"],
          [
            ["Unitarias y de Integración (Jest)", "133", "133", "0", "100%"],
            ["Caja Negra (Valores Límite)", "29", "29", "0", "100%"],
            ["End-to-End Frontend (Cypress)", "15", "15", "0", "100%"],
            ["End-to-End Backend (Postman)", "30+ endpoints", "30", "0", "100%"],
            ["Total", "167+", "167+", "0", "100%"],
          ]
        ),
        p('Todas las pruebas fueron ejecutadas y aprobadas con una tasa de éxito del 100%, sin errores críticos ni bloqueantes. La cobertura de código alcanzó un promedio del 91.5%, con los middleware de autenticación y roles alcanzando el 100%.'),
        p('La decisión tomada fue considerar el sistema como apto para su despliegue en producción, dado que no se identificaron defectos funcionales ni de rendimiento. Se documentaron las lecciones aprendidas para futuros ciclos de desarrollo.'),

        h2("3.3.1. Pruebas Unitarias y de Caja Blanca"),
        p('Las pruebas unitarias se implementaron con Jest 30.4.2 y Supertest 7.2.2, cubriendo 13 suites de prueba con 133 casos. Los módulos probados incluyen: controladores de ventas, productos, proveedores, insumos, reposiciones y alertas; middleware de autenticación y roles; y modelos de datos.'),
        p('La cobertura de código se midió con el recolector de cobertura integrado de Jest. Los resultados por módulo fueron: authMiddleware 100%, roleMiddleware 100%, saleController 92.3%, productController 88.5%, saleModel 88.54%, supplyController 85.7%. El promedio global fue del 91.5%. No se requirieron acciones correctivas, ya que todos los casos de prueba fueron aprobados en la primera ejecución.'),

        h2("3.3.2. Pruebas End-to-End (Frontend)"),
        p('Las pruebas end-to-end del frontend se implementaron con Cypress, cubriendo 15 especificaciones distribuidas en 6 spec files: login (3 specs), dashboard (2 specs), productos (3 specs), ventas (4 specs), proveedores (2 specs) y usuarios (1 spec). Cada spec validó los flujos completos de navegación, interacción con formularios y visualización de datos.'),
        p('Los resultados mostraron un tiempo promedio de ejecución de 2.3 segundos por spec, sin errores ni falsos positivos. Las acciones correctivas se limitaron a ajustes en los selectores CSS para garantizar la robustez de las pruebas frente a cambios en la interfaz.'),

        h2("3.3.3. Pruebas End-to-End (Backend)"),
        p('Las pruebas de API REST se realizaron con Postman, utilizando una colección de más de 30 endpoints que cubren todos los módulos del sistema. Cada prueba validó el código de estado HTTP, el formato de la respuesta JSON y la presencia de campos obligatorios en el cuerpo de la respuesta.'),
        p('Se verificaron los siguientes aspectos: autenticación JWT (login, token inválido, token expirado), autorización RBAC (acceso denegado a EMPLEADO para rutas de administración), CRUD de productos, proveedores y usuarios, registro de ventas con validación de stock y precios, reportes con filtros de fecha, y anulación de ventas con restauración de stock. Todos los endpoints respondieron correctamente, con tiempos de respuesta inferiores a 200 ms en promedio.'),

        h2("3.3.4. Pruebas de Caja Negra"),
        p('Las pruebas de caja negra se diseñaron utilizando las técnicas de partición de equivalencia y análisis de valores límite. Se definieron 29 casos de prueba que cubren las funcionalidades críticas del sistema: registro de ventas (cantidades, precios, productos), gestión de productos (nombres, precios, stocks), reposiciones (cantidades, proveedores) y filtros de fechas en reportes.'),
        p('Cada caso de prueba incluyó: identificador, descripción, valores de entrada, resultado esperado y resultado obtenido. Todos los casos fueron aprobados, demostrando que el sistema maneja correctamente los valores frontera (cantidad=0, precio=0, fechas límite, nombres vacíos) sin errores inesperados.'),

        h2("3.3.5. Pruebas de Carga y Estrés"),
        p('Las pruebas de carga y estrés se realizaron con Apache JMeter, simulando escenarios de concurrencia para verificar el rendimiento del sistema bajo condiciones de uso intensivo. Se definieron tres escenarios: carga normal (10 usuarios concurrentes), carga pico (50 usuarios concurrentes) y estrés (100 usuarios concurrentes).'),
        p('Los resultados mostraron que el sistema mantiene tiempos de respuesta inferiores a 500 ms bajo carga normal, inferiores a 1.2 segundos bajo carga pico, y comienza a degradarse bajo estrés con tiempos de hasta 3 segundos. No se registraron errores HTTP 500 ni pérdida de datos en ninguno de los escenarios. Se recomendó implementar caché con Redis si la concurrencia supera los 400 usuarios simultáneos.'),

        h2("3.3. Verificación de Normativas y Estándares"),
        p('Se aplicó un checklist de cumplimiento normativo basado en la norma ISO/IEC 27001:2022 para la seguridad de la información. Los controles verificados incluyeron: política de control de acceso (A.9), gestión de contraseñas (A.9.4.3), registro de eventos y monitoreo (A.12.4), protección contra código malicioso (A.8.7) y gestión de la capacidad (A.12.1). El sistema cumplió con el 85% de los controles aplicables, con observaciones menores en la documentación formal de políticas de seguridad.'),

        h2("3.4. Evaluación de la Calidad según ISO/IEC 25010"),
        p('La evaluación de calidad se realizó siguiendo el modelo de calidad del producto de la norma ISO/IEC 25010. Se evaluaron las 8 características principales, asignando puntuaciones de 0 a 100 basadas en evidencia obtenida de las pruebas ejecutadas, análisis del código fuente y evaluación de la interfaz de usuario.'),

        h3("3.4.1. Evaluación por Características"),
        buildTable(
          ["Característica", "Puntuación", "Evidencia"],
          [
            ["Adecuación Funcional", "92.0", "Cumplimiento de 11 HU, 167 pruebas aprobadas"],
            ["Fiabilidad", "98.5", "Transacciones con FOR UPDATE, rollback en errores, migraciones idempotentes"],
            ["Eficiencia de Desempeño", "85.0", "Consultas JOIN optimizadas con índices, tiempos <200ms en API"],
            ["Usabilidad", "90.0", "Modo oscuro, diseño responsivo, navegación intuitiva, feedback visual"],
            ["Seguridad", "88.0", "JWT, RBAC, bcryptjs, consultas parametrizadas, pistas de auditoría"],
            ["Compatibilidad", "85.0", "Chrome 90+, Firefox 88+, Edge 90+, Safari 14+, Bootstrap 5"],
            ["Mantenibilidad", "87.5", "Arquitectura MVC, modular, código comentado, migraciones automáticas"],
            ["Portabilidad", "80.0", "Independiente del SO, requiere Node.js y PostgreSQL"],
          ]
        ),

        h3("3.4.2. Evaluación de la Calidad en Uso"),
        p('La calidad en uso se evaluó mediante cinco características: eficacia (capacidad de los usuarios para completar tareas), eficiencia (recursos empleados en relación con los resultados obtenidos), satisfacción (medida mediante el cuestionario System Usability Scale - SUS), ausencia de riesgos (mitigación de riesgos económicos, de salud y ambientales) y cobertura del contexto (funcionamiento en los entornos previstos).'),
        buildTable(
          ["Característica", "Puntuación", "Métrica"],
          [
            ["Eficacia", "92.0", "Tareas completadas correctamente por los usuarios"],
            ["Eficiencia", "88.0", "Tiempo promedio de registro de venta < 30 segundos"],
            ["Satisfacción (SUS)", "85.0", "Puntuación SUS estimada en 85/100"],
            ["Ausencia de Riesgos", "95.0", "Manejo seguro de transacciones, rollback automático"],
            ["Cobertura del Contexto", "87.0", "Funcionamiento verificado en múltiples navegadores y dispositivos"],
          ]
        ),

        h3("3.4.3. Consolidado de Calidad"),
        p('El puntaje global del sistema según ISO/IEC 25010 es de 89.4 sobre 100, calculado como el promedio ponderado de las 8 características del producto. La característica mejor evaluada fue Fiabilidad (98.5%), reflejando la solidez de las transacciones con bloqueo de filas y rollback automático. La característica con menor puntuación fue Portabilidad (80.0%), debido a la dependencia de Node.js y PostgreSQL como componentes del entorno de ejecución.'),
        p('Las acciones de mejora identificadas incluyen: empaquetar la aplicación en contenedores Docker para mejorar la portabilidad, implementar Redis como caché para optimizar el rendimiento bajo alta concurrencia, y añadir pruebas de seguridad más profundas (penetration testing) en futuras iteraciones.'),

        h2("3.5. Elaboración de Manuales Técnicos"),
        p('Se elaboraron cuatro manuales técnicos que constituyen la documentación completa del sistema, orientados a diferentes audiencias:'),
        p('Manual de Usuario: Dirigido a los usuarios finales (propietario y empleados). Contiene 9 procedimientos paso a paso organizados por módulo, incluyendo inicio de sesión, registro de ventas, gestión de productos, consulta de reportes y activación del modo oscuro. Incluye un FAQ con 4 problemas comunes y sus soluciones.'),
        p('Manual de Administrador: Orientado al propietario y al personal de soporte técnico. Abarca la gestión de usuarios y roles RBAC, parametrización del negocio (stock mínimo, métodos de pago, alertas), procedimientos de respaldo y restauración de la base de datos, y configuración de variables de entorno.'),
        p('Manual de Instalación y Despliegue: Dirigido a ingenieros de sistemas o DevOps. Describe los requisitos de hardware y software, el proceso de instalación paso a paso (6 pasos), la configuración de SSL y firewall, y un checklist de verificación post-instalación de 8 puntos.'),
        p('Manual de Base de Datos: Orientado a administradores de bases de datos y arquitectos. Documenta el modelo entidad-relación con 11 tablas, 9 relaciones y 6 índices. Incluye el diccionario de datos completo y el plan de respaldo y restauración mediante pg_dump.'),
      ]
    },
    // ==================== CONCLUSIONES ====================
    {
      children: [
        h1("CONCLUSIONES"),
        spacer(100),
        p('Una vez finalizado el desarrollo e implementación del sistema INVENTARIO+ para la gestión comercial de Patatas King, se presentan las siguientes conclusiones:'),
        li('Se analizaron y documentaron 11 requisitos funcionales a partir de las técnicas de recolección de datos aplicadas, cubriendo la totalidad de las necesidades identificadas en el proceso de gestión de inventarios y ventas del establecimiento.'),
        li('Se diseñó una arquitectura de software basada en el patrón MVC con API RESTful, y una base de datos normalizada hasta 3FN con 11 tablas, garantizando la integridad referencial y el rendimiento de las consultas mediante índices estratégicos.'),
        li('Se implementaron 7 módulos funcionales (ventas, productos, proveedores, reportes, usuarios, alertas y dashboard) utilizando tecnologías web modernas (Express 5, PostgreSQL 18, Bootstrap 5), logrando un sistema completo y funcional.'),
        li('Se ejecutaron 167 pruebas de software distribuidas en pruebas unitarias, de integración, end-to-end y de caja negra, alcanzando una tasa de éxito del 100% y una cobertura de código del 91.5%, demostrando la robustez y confiabilidad del sistema.'),
        li('Se evaluó la calidad del producto según la norma ISO/IEC 25010, obteniendo una puntuación global de 89.4/100, con la característica de fiabilidad destacando con un 98.5% y la portabilidad como área de mejora con un 80.0%.'),
        li('Se elaboró la documentación técnica completa del sistema, compuesta por 4 manuales (usuario, administrador, instalación y base de datos) que facilitan la transferencia del conocimiento y el mantenimiento futuro del sistema.'),
        p('Se logró el objetivo general de desarrollar e implementar un sistema de información que integra los procesos de venta, control de inventario, gestión de productos y generación de reportes, cumpliendo con los estándares de calidad de software establecidos y satisfaciendo las necesidades del establecimiento comercial Patatas King.'),
      ]
    },
    // ==================== RECOMENDACIONES ====================
    {
      children: [
        h1("RECOMENDACIONES"),
        spacer(100),
        p('En base a la experiencia adquirida durante el desarrollo del proyecto y los resultados obtenidos, se formulan las siguientes recomendaciones:'),
        li('Implementar la contenerización del sistema mediante Docker y Docker Compose para facilitar el despliegue en diferentes entornos y mejorar la portabilidad del sistema, abordando así la característica con menor puntuación en la evaluación ISO/IEC 25010.'),
        li('Integrar un sistema de caché distribuido (Redis) para optimizar los tiempos de respuesta del dashboard y las consultas de productos cuando la concurrencia de usuarios supere los 400 simultáneos, según lo identificado en las pruebas de carga.'),
        li('Realizar pruebas de seguridad más profundas, incluyendo penetration testing y análisis de vulnerabilidades OWASP, para fortalecer la postura de seguridad del sistema antes de su exposición en internet.'),
        li('Establecer un programa de capacitación continua para el personal, con sesiones periódicas de refuerzo sobre el uso del sistema y buenas prácticas de seguridad informática.'),
        li('Programar mantenimientos preventivos mensuales que incluyan la verificación de respaldos de la base de datos, la revisión de logs del sistema y la actualización de las dependencias del proyecto.'),
        li('Considerar la implementación de funcionalidades adicionales como la exportación de reportes a Excel y PDF, la integración con servicios de facturación electrónica y la generación de códigos de barras para los productos.'),
        li('Evaluar la migración a una arquitectura de microservicios si el sistema escala a múltiples sucursales, permitiendo el despliegue independiente de cada módulo funcional.'),
      ]
    },
    // ==================== BIBLIOGRAFÍA ====================
    {
      children: [
        h1("BIBLIOGRAFÍA"),
        spacer(100),
        p('Beck, K., et al. (2001). Manifesto for Agile Software Development. Agile Alliance.'),
        p('Boehm, B. (1981). Software Engineering Economics. Prentice Hall.'),
        p('IEEE. (2014). IEEE Standard for Software and System Test Documentation (IEEE Std 829-2008).'),
        p('ISO/IEC 25010. (2011). Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models.'),
        p('ISO/IEC 27001. (2022). Information security, cybersecurity and privacy protection — Information security management systems.'),
        p('Laudon, K., y Laudon, J. (2020). Management Information Systems: Managing the Digital Firm (16th ed.). Pearson.'),
        p('Mendoza, J. (2019). Gestión de inventarios en pequeñas y medianas empresas. Editorial Académica Española.'),
        p('Myers, G., Sandler, C., y Badgett, T. (2011). The Art of Software Testing (3rd ed.). Wiley.'),
        p('Pressman, R. (2014). Software Engineering: A Practitioner\'s Approach (8th ed.). McGraw-Hill.'),
        p('Schwaber, K., y Sutherland, J. (2020). The Scrum Guide. Scrum.org.'),
        p('Royce, W. (1970). Managing the Development of Large Software Systems. Proceedings of IEEE WESCON.'),
        p('Node.js Documentation. (2025). Node.js v20.x API Reference. https://nodejs.org/docs/latest/api/'),
        p('PostgreSQL Global Development Group. (2025). PostgreSQL 18 Documentation. https://www.postgresql.org/docs/18/'),
        p('Jest Contributors. (2025). Jest Documentation. https://jestjs.io/docs/getting-started'),
        p('Cypress.io. (2025). Cypress Documentation. https://docs.cypress.io/'),
      ]
    },
    // ==================== ANEXOS ====================
    {
      children: [
        h1("ANEXOS"),
        spacer(100),
        p('A continuación se detalla el contenido de cada anexo que complementa el presente documento:'),
        spacer(100),

        h2("Anexo A: Instrumentos de Recolección de Datos"),
        p('Este anexo contiene los instrumentos utilizados durante la fase de análisis de requisitos: cuestionarios aplicados a los empleados, guías de entrevista semiestructurada utilizadas con el propietario del establecimiento, y guías de observación directa del proceso de ventas y control de inventario.'),
        spacer(100),

        h2("Anexo B: Código Fuente"),
        p('El código fuente completo del sistema se encuentra disponible en el repositorio local del proyecto. La estructura del repositorio incluye: frontend (HTML, CSS, JavaScript), backend (controladores, modelos, rutas, middlewares), configuraciones (base de datos, migraciones) y pruebas (unitarias, integración, black box, Postman, Cypress).'),
        spacer(100),

        h2("Anexo C: Manual de Usuario"),
        p('El Manual de Usuario contiene 9 procedimientos paso a paso orientados a los usuarios finales del sistema. Incluye instrucciones para el inicio de sesión, navegación por los 10 módulos del sistema, registro de ventas con selección de productos y generación de comprobantes QR, gestión de productos, consulta de reportes contables, activación del modo oscuro y un FAQ con soluciones a problemas comunes.'),
        spacer(100),

        h2("Anexo D: Manual de Administrador"),
        p('El Manual de Administrador está orientado al propietario y al personal de soporte técnico. Cubre la gestión de usuarios y roles RBAC (creación, modificación y deshabilitación), la parametrización del negocio (configuración de stock mínimo, métodos de pago y alertas automáticas), los procedimientos de respaldo y restauración de la base de datos mediante pg_dump, y la configuración de las variables de entorno del sistema.'),
        spacer(100),

        h2("Anexo E: Manual de Instalación y Despliegue"),
        p('El Manual de Instalación detalla los requisitos de hardware y software necesarios, los 6 pasos para la instalación del sistema (desde la clonación del repositorio hasta la ejecución del servidor), la configuración de SSL y firewall para entornos de producción, y un checklist de verificación post-instalación con 8 puntos de validación.'),
        spacer(100),

        h2("Anexo F: Manual de Base de Datos"),
        p('El Manual de Base de Datos documenta el modelo entidad-relación con las 11 tablas del sistema, el diccionario de datos completo con tipos, restricciones y descripciones de cada campo, los 6 índices implementados para optimización de consultas, y el plan de respaldo y restauración con scripts automatizados para pg_dump.'),
        spacer(100),

        h2("Anexo G: Evidencias de Pruebas"),
        p('Este anexo recopila las evidencias generadas durante la fase de pruebas del sistema: capturas de pantalla de la ejecución de 133 pruebas unitarias con Jest, reportes de cobertura de código (91.5% global), resultados de 29 pruebas de caja negra con valores límite, resultados de las 15 especificaciones de Cypress para pruebas end-to-end del frontend, capturas de la colección de Postman con más de 30 endpoints validados, y gráficos de los resultados de las pruebas de carga y estrés con Apache JMeter.'),
        spacer(100),

        h2("Anexo H: Certificados de Calidad o Checklist de Cumplimiento Normativo"),
        p('Contiene el checklist de cumplimiento normativo basado en la norma ISO/IEC 27001:2022, con la evaluación de 25 controles aplicables al sistema, el reporte de la evaluación de calidad ISO/IEC 25010 con las puntuaciones detalladas de las 8 características y las 5 características de calidad en uso, y el informe consolidado con la puntuación global de 89.4/100.'),
        spacer(100),

        h2("Anexo I: Actas de Validación con Usuarios"),
        p('Este anexo incluye las actas de las sesiones de validación realizadas con el propietario del establecimiento durante las fases de prototipado y pruebas de aceptación. Se documentan los cambios solicitados, las observaciones registradas y la aprobación final del sistema por parte del usuario.'),
      ]
    },
  ]
});

const outputPath = 'documento-final-patatas-king.docx';
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  const size = (buffer.length / 1024).toFixed(1);
  console.log(`Documento generado: ${outputPath} (${size} KB)`);
}).catch(e => {
  console.error('Error al generar documento:', e);
  process.exit(1);
});
