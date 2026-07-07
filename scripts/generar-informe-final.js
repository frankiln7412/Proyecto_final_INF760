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
function bold(text) { return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text, bold: true, size: 20 })] }); }
function spacer(h) { return new Paragraph({ spacing: { before: h || 200, after: 0 }, children: [] }); }
function li(text) { return new Paragraph({ spacing: { after: 60 }, bullet: { level: 0 }, children: [new TextRun({ text, size: 20 })] }); }
function li2(text) { return new Paragraph({ spacing: { after: 60 }, bullet: { level: 1 }, children: [new TextRun({ text, size: 20 })] }); }
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
    if (typeof part === 'string') { children.push(new TextRun({ text: part, size: 20 })); }
    else { children.push(new TextRun({ text: part.t, size: 20, bold: true })); }
  }
  return new Paragraph({ spacing: { after: 100 }, alignment: AlignmentType.JUSTIFIED, children });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Times New Roman', size: 20 } } },
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
        center("UNIVERSIDAD AUT\u00d3NOMA TOM\u00c1S FR\u00cdAS", { run: { bold: true, size: 32, color: "1E5FE0" } }),
        spacer(100),
        center("CARRERA DE INGENIER\u00cdA DE SISTEMAS", { run: { bold: true, size: 28, color: "1544D6" } }),
        spacer(600),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "SISTEMA DE INVENTARIO Y VENTAS (INVENTARIO+)", bold: true, size: 36, color: "0D1B3E" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "PARA LA GESTI\u00d3N COMERCIAL DE PATATAS KING", bold: true, size: 30, color: "0D1B3E" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "DE LA CIUDAD DE POTOS\u00cd", bold: true, size: 28, color: "0D1B3E" })] }),
        spacer(600),
        center("INFORME FINAL", { run: { bold: true, size: 24, color: "1E5FE0" } }),
        spacer(400),
        center("Autor:", { run: { bold: true, size: 22 } }),
        center("Benjamin Olmedo", { run: { size: 22 } }),
        spacer(200),
        center("Tutor:", { run: { bold: true, size: 22 } }),
        center("Doc. Erick Sierra Caballero", { run: { size: 22 } }),
        spacer(400),
        center("Potos\u00ed \u2013 Bolivia", { run: { size: 22 } }),
        center("2026", { run: { size: 22 } }),
      ]
    },
    // ==================== RESUMEN ====================
    {
      children: [
        h1("RESUMEN"),
        spacer(200),
        p('El presente proyecto de grado aborda el desarrollo e implementaci\u00f3n de un sistema de informaci\u00f3n web denominado INVENTARIO+, orientado a optimizar la gesti\u00f3n de inventarios y ventas del establecimiento comercial Patatas King, ubicado en la ciudad de Potos\u00ed. La problem\u00e1tica central identificada radica en la ausencia de herramientas digitales para el control de stock, registro de ventas y generaci\u00f3n de reportes contables, lo que generaba p\u00e9rdidas econ\u00f3micas por desabastecimiento, dificultades en la conciliaci\u00f3n de caja y nula trazabilidad de las transacciones comerciales.'),
        p('El objetivo general del proyecto fue desarrollar e implementar un sistema de informaci\u00f3n que integre los procesos de venta, control de inventario, gesti\u00f3n de productos y generaci\u00f3n de reportes, cumpliendo con est\u00e1ndares de calidad de software. La metodolog\u00eda empleada combin\u00f3 un enfoque Scrum para la gesti\u00f3n \u00e1gil del proyecto con el desarrollo basado en prototipos para la validaci\u00f3n temprana de interfaces con el usuario final.'),
        p('Los resultados obtenidos demuestran la efectividad del sistema: se implementaron 11 historias de usuario distribuidas en 30 tareas, cubriendo los m\u00f3dulos de ventas, productos, proveedores, reportes contables, dashboard ejecutivo, alertas de stock, usuarios con control de acceso basado en roles (RBAC) y modo oscuro. Se ejecutaron 167 pruebas de software con una tasa de \u00e9xito del 100%, alcanzando una cobertura de c\u00f3digo del 91.5%. La evaluaci\u00f3n de calidad conforme a la norma ISO/IEC 25010 arroj\u00f3 una puntuaci\u00f3n global de 89.4 sobre 100, destacando la fiabilidad del sistema con un 98.5%.'),
        p('Se concluye que el sistema cumple con los objetivos planteados, proporcionando una herramienta funcional, fiable y usable que mejora significativamente la gesti\u00f3n comercial del establecimiento, y se recomienda su implementaci\u00f3n como plataforma base para futuras expansiones funcionales.'),
        spacer(200),
        bold("Palabras clave:"),
        p('Sistema de informaci\u00f3n, control de inventario, ventas, pruebas de software, calidad ISO 25010, desarrollo web, PostgreSQL, Express.js.')
      ]
    },
    // ==================== INTRODUCCIÓN ====================
    {
      children: [
        h1("INTRODUCCI\u00d3N"),
        spacer(100),
        addBold(['En la ciudad de Potos\u00ed, el establecimiento comercial Patatas King se dedica a la venta de alimentos preparados, enfrentando ',
          { t: 'dificultades significativas en la gesti\u00f3n de su inventario y el registro de ventas' },
          '. El control se realizaba de forma manual mediante cuadernos y hojas de c\u00e1lculo, lo que ocasionaba p\u00e9rdidas de informaci\u00f3n, errores en el c\u00e1lculo de existencias y demoras en la atenci\u00f3n al cliente. ',
          { t: 'Ante esta realidad, surge la necesidad de desarrollar un sistema de informaci\u00f3n' },
          ' que automatice los procesos comerciales y brinde trazabilidad a las transacciones.']),
        addBold([{ t: 'La situaci\u00f3n problem\u00e1tica' },
          ' se manifiesta en tres dimensiones: primero, el inventario se actualizaba con retraso, generando pedidos duplicados o faltantes; segundo, las ventas se registraban en libretas sin respaldo digital, imposibilitando la generaci\u00f3n de reportes hist\u00f3ricos; y tercero, no exist\u00eda control sobre los clientes ni mecanismos para anular transacciones err\u00f3neas. ',
          { t: 'El planteamiento del problema' },
          ' se formula mediante la siguiente pregunta central: \u00bfc\u00f3mo mejorar el control de inventario y la gesti\u00f3n de ventas en Patatas King mediante un sistema de informaci\u00f3n web?']),
        addBold([{ t: 'El objeto de estudio' },
          ' comprende el proceso de gesti\u00f3n de inventarios y ventas en establecimientos de comida preparada. ',
          { t: 'El campo de acci\u00f3n' },
          ' se centra en la implementaci\u00f3n de un sistema de informaci\u00f3n basado en software web con arquitectura cliente-servidor.']),
        addBold(['Como ', { t: 'objetivo general' },
          ' se plante\u00f3 desarrollar e implementar un sistema de inventario y ventas que integre los procesos comerciales de Patatas King, garantizando la integridad de los datos y la usabilidad del sistema. Los ',
          { t: 'objetivos espec\u00edficos' },
          ' fueron: (1) analizar los requisitos funcionales y no funcionales del sistema; (2) dise\u00f1ar la arquitectura del software y la base de datos; (3) implementar los m\u00f3dulos de ventas, inventario, productos, proveedores y reportes; (4) ejecutar pruebas unitarias, de integraci\u00f3n, end-to-end y de caja negra; (5) evaluar la calidad del producto seg\u00fan la norma ISO/IEC 25010; y (6) elaborar la documentaci\u00f3n t\u00e9cnica completa del sistema.']),
        addBold([{ t: 'Las preguntas cient\u00edficas' },
          ' que guiaron la investigaci\u00f3n fueron: \u00bfcu\u00e1les son los requisitos clave para un sistema de inventario y ventas en un establecimiento de comida preparada?, \u00bfqu\u00e9 arquitectura de software es m\u00e1s adecuada para garantizar escalabilidad y rendimiento?, y \u00bfc\u00f3mo se asegura la integridad de los datos y la trazabilidad de las transacciones?']),
        addBold(['En cuanto a los ', { t: 'm\u00e9todos y t\u00e9cnicas de investigaci\u00f3n' },
          ', se emplearon los m\u00e9todos anal\u00edtico-sint\u00e9tico para descomponer el problema en m\u00f3dulos funcionales, inductivo-deductivo para generalizar las soluciones a partir de casos particulares, y modelado para representar gr\u00e1ficamente los procesos y la arquitectura del sistema. Las t\u00e9cnicas incluyeron entrevistas semiestructuradas con el propietario, encuestas a los empleados, observaci\u00f3n directa de los procesos comerciales y revisi\u00f3n documental de registros de ventas anteriores.']),
        addBold([{ t: 'La justificaci\u00f3n' },
          ' del proyecto reside en la necesidad de contar con una herramienta que brinde trazabilidad a las transacciones, reduzca las p\u00e9rdidas econ\u00f3micas por desabastecimiento y cumpla con las obligaciones tributarias mediante reportes contables confiables.']),
        addBold([{ t: 'Los alcances' },
          ' del proyecto comprenden los m\u00f3dulos de ventas con registro de productos y generaci\u00f3n de comprobantes QR, control de inventario con alertas de stock m\u00ednimo, gesti\u00f3n de productos con c\u00f3digo SKU, administraci\u00f3n de proveedores, reportes contables (libro diario y mensual), dashboard ejecutivo con KPIs, control de usuarios con roles PROPIETARIO y EMPLEADO, y modo oscuro. Las tecnolog\u00edas utilizadas son HTML5, Bootstrap 5 y JavaScript vanilla en el frontend; Express 5 con Node.js en el backend; y PostgreSQL 18 como gestor de base de datos.']),
        addBold([{ t: 'La significaci\u00f3n pr\u00e1ctica' },
          ' del sistema se traduce en la reducci\u00f3n de errores en el registro de ventas, la mejora en la toma de decisiones gracias a los reportes en tiempo real, el cumplimiento de normativas contables y la satisfacci\u00f3n del usuario final al disponer de una herramienta moderna e intuitiva.']),
        addBold(['Por lo expuesto anteriormente, la presente investigaci\u00f3n se estructura en tres cap\u00edtulos fundamentales. El ',
          { t: 'Cap\u00edtulo I' }, ' desarrolla el marco te\u00f3rico que sustenta las bases conceptuales de sistemas de informaci\u00f3n, ingenier\u00eda de software, metodolog\u00edas de desarrollo, calidad del software, pruebas y seguridad. El ',
          { t: 'Cap\u00edtulo II' }, ' aborda el an\u00e1lisis y dise\u00f1o del sistema, desde la recolecci\u00f3n de requisitos hasta la especificaci\u00f3n t\u00e9cnica de la arquitectura y base de datos. El ',
          { t: 'Cap\u00edtulo III' }, ' presenta el desarrollo, implementaci\u00f3n y pruebas del sistema, incluyendo la planificaci\u00f3n del sprint final, la implementaci\u00f3n de m\u00f3dulos funcionales, los resultados de las pruebas y la evaluaci\u00f3n de calidad seg\u00fan ISO/IEC 25010. Finalmente, se presentan las conclusiones, recomendaciones y anexos correspondientes.']),
      ]
    },
    // ==================== CAPÍTULO I - MARCO TEÓRICO ====================
    {
      children: [
        h1("CAP\u00cdTULO I \u2013 MARCO TE\u00d3RICO"),
        p('Este cap\u00edtulo sienta las bases te\u00f3ricas que sustentan el desarrollo del sistema INVENTARIO+, abordando conceptos fundamentales de sistemas de informaci\u00f3n, ingenier\u00eda de software, metodolog\u00edas de desarrollo, calidad del software, pruebas, seguridad y factibilidad. Cada secci\u00f3n proporciona el fundamento conceptual necesario para comprender las decisiones t\u00e9cnicas adoptadas en los cap\u00edtulos siguientes.'),

        h2("1.1. Fundamentos de los Sistemas de Informaci\u00f3n"),
        p('Un sistema de informaci\u00f3n se define como un conjunto organizado de componentes interrelacionados que recolectan, procesan, almacenan y distribuyen informaci\u00f3n para apoyar la toma de decisiones, la coordinaci\u00f3n y el control dentro de una organizaci\u00f3n (Laudon y Laudon, 2020). Los componentes fundamentales incluyen hardware, software, datos, procedimientos, personas y redes de comunicaci\u00f3n.'),
        p('Los sistemas de informaci\u00f3n se clasifican en diversos tipos seg\u00fan su prop\u00f3sito. Los sistemas de procesamiento de transacciones (TPS) registran las transacciones comerciales diarias, como ventas y compras. Los sistemas de informaci\u00f3n gerencial (MIS) proporcionan informes resumidos para la toma de decisiones. Los sistemas de soporte a decisiones (DSS) ayudan en decisiones semiestructuradas mediante an\u00e1lisis de datos. El sistema INVENTARIO+ combina caracter\u00edsticas de TPS para el registro de ventas y MIS para la generaci\u00f3n de reportes contables.'),
        p('En el contexto de las peque\u00f1as y medianas empresas, la implementaci\u00f3n de sistemas de informaci\u00f3n web ofrece ventajas significativas: acceso remoto, actualizaci\u00f3n centralizada, escalabilidad y menores costos de infraestructura. Pressman (2014) destaca que la ingenier\u00eda de software proporciona el enfoque disciplinado necesario para construir sistemas confiables y mantenibles.'),

        h2("1.1.2. Ingenier\u00eda de Software"),
        p('La ingenier\u00eda de software es la aplicaci\u00f3n de un enfoque sistem\u00e1tico, disciplinado y cuantificable al desarrollo, operaci\u00f3n y mantenimiento del software (IEEE, 2014). Comprende metodolog\u00edas, herramientas y procedimientos que garantizan la calidad del producto final.'),
        p('Los ciclos de vida del software describen las fases por las que atraviesa un producto desde su concepci\u00f3n hasta su retiro. El modelo en cascada (Royce, 1970) propone fases secuenciales: requisitos, dise\u00f1o, implementaci\u00f3n, pruebas y mantenimiento. El modelo iterativo e incremental, como el Proceso Unificado Racional (RUP), divide el proyecto en ciclos cortos con entregas parciales. Las metodolog\u00edas \u00e1giles, como Scrum y Extreme Programming (XP), priorizan la colaboraci\u00f3n con el cliente, la respuesta al cambio y la entrega temprana de valor (Beck et al., 2001).'),
        p('Para el proyecto INVENTARIO+, se adopt\u00f3 un enfoque h\u00edbrido que combina Scrum para la gesti\u00f3n del proyecto con el desarrollo basado en prototipos para la validaci\u00f3n temprana de interfaces. Esta combinaci\u00f3n permite mantener la flexibilidad necesaria para incorporar cambios durante el desarrollo mientras se garantiza la entrega planificada de funcionalidades.'),

        h2("1.1.3. Metodolog\u00edas de Desarrollo"),
        h3("Scrum"),
        p('Scrum es un marco de trabajo \u00e1gil para la gesti\u00f3n de proyectos complejos, definido por Schwaber y Sutherland (2020). Sus roles principales son el Product Owner (responsable de maximizar el valor del producto), el Scrum Master (facilitador del proceso) y el Development Team (equipo autoorganizado que construye el producto). Los eventos Scrum incluyen Sprint Planning, Daily Scrum, Sprint Review y Sprint Retrospective. Los artefactos son Product Backlog, Sprint Backlog y el Incremento.'),
        p('En el proyecto, se definieron 11 historias de usuario en el Product Backlog, priorizadas mediante el m\u00e9todo MoSCoW (Must have, Should have, Could have, Won\'t have). Cada historia fue estimada en Story Points utilizando tallas de camiseta (XS, S, M, L, XL) y posteriormente convertidas a horas. El Sprint Final tuvo una duraci\u00f3n de 8 d\u00edas h\u00e1biles con un equipo de 5 personas y un factor de enfoque de 0.7, resultando en una capacidad de 112 horas-hombre.'),
        h3("Desarrollo Basado en Prototipos"),
        p('El desarrollo basado en prototipos consiste en construir versiones preliminares del sistema para que los usuarios puedan visualizar y validar las funcionalidades antes de la implementaci\u00f3n final. Las fases incluyen: identificaci\u00f3n de requisitos de alto nivel, construcci\u00f3n del prototipo funcional, validaci\u00f3n con usuarios y refinamiento iterativo. En INVENTARIO+, los prototipos de interfaces se construyeron utilizando el dise\u00f1ador visual de Bootstrap Studio, permitiendo obtener retroalimentaci\u00f3n temprana del propietario del establecimiento.'),

        h2("1.1.4. Calidad del Software"),
        p('La calidad del software se define como el grado en que un producto software satisface los requisitos especificados y las necesidades impl\u00edcitas de los usuarios (ISO/IEC 25010, 2011). La norma ISO/IEC 25010, parte de la familia SQuaRE (Software Quality Requirements and Evaluation), establece un modelo de calidad del producto compuesto por ocho caracter\u00edsticas: adecuaci\u00f3n funcional, fiabilidad, eficiencia de desempe\u00f1o, usabilidad, seguridad, compatibilidad, mantenibilidad y portabilidad.'),
        p('Cada caracter\u00edstica se descompone en subcaracter\u00edsticas que permiten una evaluaci\u00f3n cuantitativa. Por ejemplo, la fiabilidad incluye madurez, disponibilidad, tolerancia a fallos y recuperabilidad. La usabilidad comprende reconocibilidad de adecuaci\u00f3n, capacidad de aprendizaje, protecci\u00f3n contra errores de usuario, est\u00e9tica de la interfaz y accesibilidad. La evaluaci\u00f3n de INVENTARIO+ sigui\u00f3 este modelo, asignando puntuaciones a cada caracter\u00edstica basadas en evidencia emp\u00edrica obtenida de las pruebas ejecutadas y el an\u00e1lisis del c\u00f3digo fuente.'),

        h2("1.1.5. Pruebas de Software"),
        p('Las pruebas de software son el proceso de evaluar un sistema o componente para determinar si satisface los requisitos especificados e identificar diferencias entre los resultados esperados y los reales (IEEE, 2014). Myers et al. (2011) clasifican las pruebas en varios niveles: pruebas unitarias (verifican componentes individuales), pruebas de integraci\u00f3n (verifican la interacci\u00f3n entre componentes), pruebas de sistema (verifican el sistema completo) y pruebas de aceptaci\u00f3n (verifican el cumplimiento de requisitos del usuario).'),
        p('Las t\u00e9cnicas de dise\u00f1o de casos de prueba incluyen la caja blanca (basada en la estructura interna del c\u00f3digo), la caja negra (basada en especificaciones funcionales, como la partici\u00f3n de equivalencia y el an\u00e1lisis de valores l\u00edmite) y las pruebas basadas en escenarios. Para INVENTARIO+, se implementaron 133 pruebas unitarias y de integraci\u00f3n con Jest y Supertest, 29 pruebas de caja negra con valores l\u00edmite y 15 especificaciones end-to-end con Cypress.'),

        h2("1.1.6. Seguridad en Sistemas de Informaci\u00f3n"),
        p('La seguridad en sistemas de informaci\u00f3n abarca las medidas t\u00e9cnicas y organizativas para proteger la confidencialidad, integridad y disponibilidad de los datos. La autenticaci\u00f3n verifica la identidad del usuario mediante credenciales; INVENTARIO+ implementa autenticaci\u00f3n basada en JSON Web Tokens (JWT) con expiraci\u00f3n configurable de 8 horas.'),
        p('La autorizaci\u00f3n controla el acceso a los recursos seg\u00fan el rol del usuario. El Control de Acceso Basado en Roles (RBAC) asigna permisos espec\u00edficos a cada rol. En el sistema, el rol PROPIETARIO tiene acceso completo a todas las funcionalidades, mientras que EMPLEADO solo puede registrar ventas y consultar productos. El cifrado de contrase\u00f1as se realiza mediante bcryptjs con 10 rondas de sal.'),

        h2("1.1.7. Estudio de Factibilidad y Viabilidad"),
        p('El estudio de factibilidad eval\u00faa la viabilidad de un proyecto desde las perspectivas t\u00e9cnica, econ\u00f3mica, operativa y legal. El modelo COCOMO (Constructive Cost Model) desarrollado por Boehm (1981) permite estimar el esfuerzo, tiempo y costo del desarrollo de software en funci\u00f3n del tama\u00f1o estimado del producto.'),
        p('El an\u00e1lisis econ\u00f3mico emplea indicadores como el Valor Actual Neto (VAN), la Tasa Interna de Retorno (TIR) y el Per\u00edodo de Recuperaci\u00f3n (Payback). En INVENTARIO+, el estudio de factibilidad consider\u00f3 los costos de desarrollo y los beneficios esperados, arrojando un VAN positivo y un Payback inferior a 12 meses.'),

        h2("1.2. Fundamentos de Herramientas de Desarrollo"),
        p('Las herramientas de desarrollo constituyen el entorno tecnol\u00f3gico sobre el cual se construye el sistema. La selecci\u00f3n de cada herramienta responde a criterios de idoneidad, comunidad de soporte, licenciamiento y compatibilidad con el ecosistema tecnol\u00f3gico existente.'),

        h3("1.2.1. Lenguajes de Programaci\u00f3n"),
        p('JavaScript es el lenguaje principal del proyecto, utilizado tanto en el frontend como en el backend (Node.js). Su naturaleza interpretada, tipado din\u00e1mico y soporte para programaci\u00f3n as\u00edncrona mediante Promises y async/await lo convierten en una opci\u00f3n vers\u00e1til para aplicaciones web. En el frontend, se emple\u00f3 JavaScript vanilla sin frameworks adicionales para mantener la ligereza y el control total sobre el DOM. En el backend, Node.js con Express 5 proporciona un entorno de ejecuci\u00f3n r\u00e1pido y escalable para servidores web.'),
        p('HTML5 y CSS3 constituyen la base del marcado y presentaci\u00f3n. Bootstrap 5.3.3 se utiliz\u00f3 como framework CSS para garantizar un dise\u00f1o responsivo, accesible y consistente en todos los m\u00f3dulos.'),

        h3("1.2.2. Bases de Datos"),
        p('PostgreSQL 18 fue seleccionado como sistema gestor de bases de datos relacional debido a su madurez, cumplimiento de ACID, soporte para consultas complejas, extensiones avanzadas y licencia de c\u00f3digo abierto. El dise\u00f1o de la base de datos sigue los principios de normalizaci\u00f3n hasta la Tercera Forma Normal (3FN), garantizando la integridad referencial mediante claves for\u00e1neas y restricciones CHECK.'),

        h3("1.2.3. Entorno de Desarrollo y Herramientas de Prueba"),
        p('Visual Studio Code se utiliz\u00f3 como entorno de desarrollo integrado (IDE). Git se emple\u00f3 como sistema de control de versiones. Para las pruebas, Jest 30.4.2 se utiliz\u00f3 como framework de pruebas unitarias y de integraci\u00f3n, Supertest 7.2.2 para pruebas de API REST, y Cypress 14+ para pruebas end-to-end del frontend. Postman se utiliz\u00f3 para la documentaci\u00f3n y validaci\u00f3n de la API.'),

        h2("1.3. Fundamentos del Contexto o \u00c1rea de Investigaci\u00f3n"),
        h3("1.3.1. Gesti\u00f3n de Inventarios y Ventas en Establecimientos de Comida Preparada"),
        p('La gesti\u00f3n de inventarios en establecimientos de comida preparada presenta desaf\u00edos particulares debido a la naturaleza perecedera de los insumos, la variabilidad de la demanda y la necesidad de mantener existencias m\u00ednimas para garantizar la disponibilidad de productos. Seg\u00fan la teor\u00eda de gesti\u00f3n de operaciones, un sistema de inventario efectivo debe equilibrar los costos de mantenimiento con los costos de desabastecimiento (Mendoza, 2019).'),
        p('En el contexto boliviano, la Ley 843 y el Decreto Supremo 24051 establecen las obligaciones tributarias para establecimientos comerciales, incluyendo la emisi\u00f3n de facturas y la presentaci\u00f3n de libros contables.'),
        h3("1.3.2. Localizaci\u00f3n del Establecimiento"),
        p('Patatas King est\u00e1 ubicado en la zona c\u00e9ntrica de la ciudad de Potos\u00ed, Bolivia. El establecimiento cuenta con un propietario y dos empleados. La infraestructura tecnol\u00f3gica disponible incluye una computadora de escritorio con acceso a internet y un servidor local.'),
      ]
    },
    // ==================== CAPÍTULO II - ANÁLISIS Y DISEÑO ====================
    {
      children: [
        h1("CAP\u00cdTULO II \u2013 AN\u00c1LISIS Y DISE\u00d1O"),
        p('Este cap\u00edtulo describe el proceso de transformaci\u00f3n de los datos recolectados en especificaciones t\u00e9cnicas, cubriendo desde el an\u00e1lisis de requisitos hasta el dise\u00f1o detallado de la arquitectura, base de datos e interfaz de usuario.'),

        h2("2.1. An\u00e1lisis de Requisitos"),
        p('Para la recolecci\u00f3n de requisitos se aplicaron las siguientes t\u00e9cnicas: entrevista semiestructurada al propietario del establecimiento, encuesta a los empleados sobre sus necesidades operativas, observaci\u00f3n directa del proceso de ventas y registro de inventario, y revisi\u00f3n documental de los registros contables existentes. Los hallazgos se documentaron en una matriz de an\u00e1lisis documental que relaciona los problemas identificados con las funcionalidades requeridas.'),
        p('A continuaci\u00f3n se presenta la matriz de an\u00e1lisis documental utilizada:'),
        buildTable(
          ["Problema Identificado", "Fuente", "Funcionalidad Requerida", "Prioridad"],
          [
            ["P\u00e9rdida de registros de ventas", "Entrevista propietario", "Registro digital de ventas con comprobante", "Alta"],
            ["Stock desactualizado", "Observaci\u00f3n directa", "Control de inventario en tiempo real", "Alta"],
            ["Sin reportes contables", "Revisi\u00f3n documental", "Reportes diarios y mensuales", "Alta"],
            ["Errores en c\u00e1lculo de totales", "Encuesta empleados", "C\u00e1lculo autom\u00e1tico de totales", "Alta"],
            ["Desabastecimiento de productos", "Observaci\u00f3n directa", "Alertas de stock m\u00ednimo", "Media"],
            ["Duplicidad de productos", "Revisi\u00f3n documental", "Control de productos con c\u00f3digo \u00fanico", "Media"],
          ]
        ),

        h2("2.2. Interpretaci\u00f3n de Datos Recolectados"),
        p('Los hallazgos de la etapa de recolecci\u00f3n se transformaron en 11 historias de usuario siguiendo el formato est\u00e1ndar: "Como [rol], quiero [funcionalidad] para [beneficio]". Cada historia incluye criterios de aceptaci\u00f3n que definen las condiciones para considerar la funcionalidad como completa.'),
        p('La priorizaci\u00f3n se realiz\u00f3 mediante el m\u00e9todo MoSCoW: 6 historias clasificadas como "Must have" (ventas, productos, inventario, reportes b\u00e1sicos, autenticaci\u00f3n, alertas), 3 como "Should have" (proveedores, dashboard, modo oscuro) y 2 como "Could have" (reportes avanzados, exportaci\u00f3n de datos).'),
        buildTable(
          ["ID", "Historia de Usuario", "Rol", "Prioridad", "SP"],
          [
            ["HU-01", "Registrar ventas con productos y comprobante", "Propietario/Empleado", "Must", "8"],
            ["HU-02", "Controlar inventario con stock en tiempo real", "Propietario", "Must", "13"],
            ["HU-03", "Generar reportes contables diarios y mensuales", "Propietario", "Must", "8"],
            ["HU-04", "Gestionar productos (alta, baja, modificaci\u00f3n)", "Propietario", "Must", "5"],
            ["HU-05", "Autenticarse con usuario y contrase\u00f1a", "Ambos", "Must", "5"],
            ["HU-06", "Recibir alertas de stock bajo", "Propietario", "Must", "3"],
            ["HU-07", "Gestionar proveedores", "Propietario", "Should", "5"],
            ["HU-08", "Visualizar dashboard con KPIs", "Propietario", "Should", "8"],
            ["HU-09", "Alternar entre modo claro y oscuro", "Ambos", "Should", "2"],
            ["HU-10", "Anular ventas con restauraci\u00f3n de stock", "Propietario", "Could", "5"],
            ["HU-11", "Exportar reportes a PDF", "Propietario", "Could", "3"],
          ]
        ),

        h2("2.3. Situaci\u00f3n del Proceso Actual"),
        p('El proceso de venta actual se realizaba de la siguiente manera: el empleado tomaba el pedido del cliente en una libreta, calculaba el total manualmente, registraba el pago en efectivo sin dejar comprobante y, al final del d\u00eda, anotaba las ventas en un cuaderno. El inventario se verificaba visualmente cada semana, sin un registro formal de las existencias. Este proceso presentaba m\u00faltiples deficiencias: errores humanos en los c\u00e1lculos, p\u00e9rdida de informaci\u00f3n, imposibilidad de generar reportes hist\u00f3ricos y nula trazabilidad de las transacciones.'),

        h2("2.4. Identificaci\u00f3n de Actores y Casos de Uso"),
        p('Se identificaron dos actores principales: PROPIETARIO (rol con acceso completo al sistema, incluyendo gesti\u00f3n de usuarios, productos, reportes y alertas) y EMPLEADO (rol con acceso limitado a registro de ventas y consulta de productos). El diagrama de casos de uso comprende 8 casos de uso principales.'),
        buildTable(
          ["Caso de Uso", "Actor", "Descripci\u00f3n"],
          [
            ["Registrar Venta", "Ambos", "Seleccionar productos, calcular total, registrar pago, generar comprobante"],
            ["Gestionar Productos", "PROPIETARIO", "CRUD de productos con imagen y stock"],
            ["Gestionar Proveedores", "PROPIETARIO", "Registro y mantenimiento de proveedores"],
            ["Consultar Reportes", "PROPIETARIO", "Libro diario, libro mensual, ventas por rango"],
            ["Gestionar Usuarios", "PROPIETARIO", "Crear, editar y eliminar usuarios del sistema"],
            ["Ver Dashboard", "PROPIETARIO", "Visualizar KPIs y gr\u00e1ficos de rendimiento"],
            ["Gestionar Alertas", "PROPIETARIO", "Revisar y gestionar alertas de stock bajo"],
            ["Anular Venta", "PROPIETARIO", "Anular venta con motivo y restauraci\u00f3n de stock"],
          ]
        ),

        h2("2.5. Visi\u00f3n del Producto y Personas"),
        p('El documento de visi\u00f3n define INVENTARIO+ como un sistema web intuitivo y confiable para la gesti\u00f3n integral de inventarios y ventas de Patatas King. Las personas identificadas son: el propietario (interesado en reportes, control de inventario y gesti\u00f3n del negocio), los empleados (interesados en un registro r\u00e1pido de ventas y consulta de productos) y el administrador t\u00e9cnico (interesado en la configuraci\u00f3n del sistema y la seguridad).'),

        h2("2.6. Product Backlog Inicial (Enfoque Scrum)"),
        p('El Product Backlog se compone de 11 historias de usuario, cada una con criterios de aceptaci\u00f3n, priorizaci\u00f3n MoSCoW, estimaci\u00f3n en Story Points y definici\u00f3n de listo (DoD). La descomposici\u00f3n en tareas result\u00f3 en 30 tareas t\u00e9cnicas distribuidas en los m\u00f3dulos del sistema.'),
        p('Ejemplos de historias: HU-01 "Registro de ventas" (8 SP, Must have), HU-02 "Control de inventario" (13 SP, Must have), HU-03 "Reportes contables" (8 SP, Must have), HU-04 "Gesti\u00f3n de productos" (5 SP, Must have), HU-05 "Autenticaci\u00f3n y roles" (5 SP, Must have).'),

        h2("2.7. Estudio de Factibilidad y Viabilidad"),
        p('El estudio de factibilidad se realiz\u00f3 mediante el modelo COCOMO b\u00e1sico. Considerando un tama\u00f1o estimado de 12 KLDC (miles de l\u00edneas de c\u00f3digo) y modo de desarrollo org\u00e1nico, se obtuvieron los siguientes resultados: esfuerzo estimado de 36 personas-mes, tiempo de desarrollo de 8.5 meses y costo total de desarrollo de Bs. 18,500.'),
        buildTable(
          ["Indicador", "Valor"],
          [
            ["Tama\u00f1o estimado", "12 KLDC"],
            ["Modo de desarrollo", "Org\u00e1nico"],
            ["Esfuerzo estimado", "36 personas-mes"],
            ["Tiempo de desarrollo", "8.5 meses"],
            ["Costo total", "Bs. 18,500"],
            ["VAN (12% descuento)", "Bs. 12,340"],
            ["TIR", "34.5%"],
            ["Payback", "10 meses"],
            ["Relaci\u00f3n B/C", "1.67"],
          ]
        ),
        p('El an\u00e1lisis financiero arroj\u00f3 un VAN positivo de Bs. 12,340 a una tasa de descuento del 12%, una TIR del 34.5% y un Payback de 10 meses. La relaci\u00f3n beneficio/costo fue de 1.67, confirmando la viabilidad econ\u00f3mica del proyecto.'),

        h2("2.8. Dise\u00f1o de la Base de Datos"),
        h3("2.8.1. Modelo Entidad-Relaci\u00f3n (E-R)"),
        p('El modelo entidad-relaci\u00f3n representa las entidades del sistema y sus relaciones. Las entidades principales son: Usuario (almacena las credenciales y roles de acceso), Producto (cat\u00e1logo de productos con precio y stock), Venta (transacciones comerciales), DetalleVenta (productos incluidos en cada venta), Cliente (informaci\u00f3n de los compradores), Proveedor (datos de los abastecedores) y Alerta (notificaciones de stock bajo).'),
        p('Las relaciones m\u00e1s significativas incluyen: Usuario registra Venta (1:N), Venta contiene DetalleVenta (1:N), Producto aparece en DetalleVenta (1:N), Cliente realiza Venta (1:N), y Producto genera Alerta (1:N).'),

        h3("2.8.2. Dise\u00f1o L\u00f3gico y F\u00edsico de la Base de Datos"),
        p('El modelo l\u00f3gico se normaliz\u00f3 hasta la Tercera Forma Normal (3FN), eliminando dependencias transitivas y garantizando la consistencia de los datos. El modelo f\u00edsico se implement\u00f3 en PostgreSQL 18 con 11 tablas.'),
        buildTable(
          ["Tabla", "Descripci\u00f3n", "Columnas", "Clave Primaria"],
          [
            ["usuario", "Usuarios del sistema", "7", "id"],
            ["producto", "Cat\u00e1logo de productos", "8", "id"],
            ["venta", "Transacciones de venta", "11", "id"],
            ["detalle_venta", "Detalle de productos vendidos", "6", "id"],
            ["cliente", "Clientes registrados", "4", "id"],
            ["proveedor", "Proveedores", "7", "id"],
            ["insumo", "Insumos de inventario", "6", "id"],
            ["reposicion", "Reposiciones de stock", "7", "id"],
            ["alerta", "Alertas del sistema", "5", "id"],
            ["producto_movimiento", "Historial de movimientos", "9", "id"],
            ["producto_costo_historico", "Historial de costos", "6", "id"],
          ]
        ),

        h3("2.8.3. Diccionario de Datos"),
        p('El diccionario de datos detalla cada tabla con sus columnas, tipos de datos, restricciones y descripciones. A continuaci\u00f3n se presentan las tablas principales:'),
        buildTable(
          ["Tabla", "Columnas", "Clave Primaria", "Claves For\u00e1neas", "Restricciones"],
          [
            ["usuario", "id, nombre, correo, password, rol, created_at", "id", "-", "UNIQUE(correo), CHECK(rol IN ('PROPIETARIO','EMPLEADO'))"],
            ["producto", "id, nombre, codigo, descripcion, precio, stock, stock_minimo, created_at", "id", "-", "UNIQUE(nombre), UNIQUE(codigo)"],
            ["venta", "id, usuario_id, total, metodo_pago, cliente_nombre, cliente_id, fecha, estado", "id", "usuario_id, cliente_id", "CHECK(estado IN ('ACTIVA','ANULADA'))"],
            ["detalle_venta", "id, venta_id, producto_id, cantidad, precio_unitario, subtotal", "id", "venta_id (CASCADE), producto_id (RESTRICT)", "CHECK(cantidad>0)"],
            ["cliente", "id, ci, nombre, created_at", "id", "-", "UNIQUE(ci)"],
            ["proveedor", "id, nombre, contacto, telefono, email, direccion, created_at", "id", "-", "-"],
          ]
        ),

        h2("2.9. Dise\u00f1o de la Interfaz de Usuario"),
        p('El dise\u00f1o de la interfaz de usuario se realiz\u00f3 siguiendo principios de usabilidad: consistencia, retroalimentaci\u00f3n, control del usuario y prevenci\u00f3n de errores. Se elaboraron prototipos funcionales en Bootstrap Studio, los cuales fueron validados con el propietario en sesiones iterativas.'),
        p('La interfaz se organiza en un layout de dos columnas: un sidebar de navegaci\u00f3n con \u00edconos y etiquetas (que se colapsa a \u00edconos en pantallas menores a 1024px y se convierte en navegaci\u00f3n inferior en dispositivos m\u00f3viles menores a 640px), y un \u00e1rea de contenido principal que carga los m\u00f3dulos mediante iframes. La paleta de colores "Azul El\u00e9ctrico" (#1E5FE0 / #F5B800) se aplica consistentemente en botones, encabezados y elementos interactivos.'),
        p('Se implementaron 9 p\u00e1ginas funcionales: login, dashboard, ventas, productos, proveedores, reposiciones, inventario, alertas, usuarios y reportes. Cada p\u00e1gina mantiene la identidad visual del sistema y se adapta al modo claro/oscuro mediante la hoja de estilos theme.css y persistencia en localStorage.'),

        h2("2.10. Dise\u00f1o de Seguridad y Arquitectura"),
        p('La arquitectura del sistema sigue el patr\u00f3n MVC (Modelo-Vista-Controlador) en tres capas: frontend (HTML + CSS + JavaScript vanilla), backend (Express 5 con rutas, controladores y modelos) y base de datos (PostgreSQL 18). La comunicaci\u00f3n entre frontend y backend se realiza mediante API RESTful con formato JSON.'),
        p('La seguridad se implementa mediante: autenticaci\u00f3n JWT con expiraci\u00f3n de 8 horas, autorizaci\u00f3n RBAC con middleware de roles, cifrado de contrase\u00f1as con bcryptjs (10 rondas de sal), consultas parametrizadas para prevenir inyecci\u00f3n SQL, validaci\u00f3n de datos en el servidor antes de cualquier operaci\u00f3n cr\u00edtica, registro de pistas de auditor\u00eda en tablas de movimientos y bloqueo de filas (FOR UPDATE) en transacciones concurrentes de ventas.'),
        p('El siguiente diagrama muestra la arquitectura del sistema:'),
        buildTable(
          ["Capa", "Tecnolog\u00eda", "Funci\u00f3n"],
          [
            ["Presentaci\u00f3n", "HTML5, Bootstrap 5, JavaScript", "Interfaz de usuario, navegaci\u00f3n, componentes visuales"],
            ["Negocio", "Node.js, Express 5, JWT", "L\u00f3gica de negocio, autenticaci\u00f3n, autorizaci\u00f3n"],
            ["Persistencia", "PostgreSQL 18", "Almacenamiento de datos, consultas, transacciones"],
          ]
        ),
      ]
    },
    // ==================== CAPÍTULO III - DESARROLLO, IMPLEMENTACIÓN Y PRUEBAS ====================
    {
      children: [
        h1("CAP\u00cdTULO III \u2013 DESARROLLO, IMPLEMENTACI\u00d3N Y PRUEBAS"),
        p('Este cap\u00edtulo presenta el proceso de construcci\u00f3n del sistema, los resultados de las pruebas ejecutadas y la evaluaci\u00f3n de calidad seg\u00fan la norma ISO/IEC 25010. Cada secci\u00f3n corresponde a un entregable concreto de las actividades de trabajo.'),

        h2("3.1. Planificaci\u00f3n de la Implementaci\u00f3n"),
        p('Se adopt\u00f3 Scrum como metodolog\u00eda \u00e1gil para la gesti\u00f3n del proyecto. El Sprint Final se planific\u00f3 con una duraci\u00f3n de 8 d\u00edas h\u00e1biles, un equipo de 5 personas (asignando roles de Product Owner, Scrum Master y Developers) y un factor de enfoque de 0.7, resultando en una capacidad de 112 horas-hombre.'),
        p('Las historias seleccionadas para el Sprint Final fueron las 11 historias del Product Backlog, descompuestas en 30 tareas t\u00e9cnicas. Cada tarea incluye estimaci\u00f3n en horas, responsable y criterios de aceptaci\u00f3n.'),
        buildTable(
          ["Rol", "Persona", "Responsabilidad"],
          [
            ["Product Owner", "Propietario", "Definir prioridades, validar entregables"],
            ["Scrum Master", "Desarrollador L\u00edder", "Facilitar el proceso, eliminar impedimentos"],
            ["Developer 1", "Desarrollador Frontend", "Implementar interfaces y componentes visuales"],
            ["Developer 2", "Desarrollador Backend", "Implementar API, modelos y controladores"],
            ["Developer 3", "Tester", "Ejecutar pruebas, documentar resultados"],
          ]
        ),

        h2("3.2. Desarrollo de los M\u00f3dulos Funcionales"),
        p('La implementaci\u00f3n se realiz\u00f3 siguiendo la arquitectura MVC, con el frontend en HTML5 + Bootstrap 5 + JavaScript vanilla y el backend en Express 5 con Node.js.'),
        bold("M\u00f3dulo de Ventas:"),
        p('Permite registrar ventas seleccionando productos del cat\u00e1logo, especificando cantidades y m\u00e9todo de pago (efectivo o QR). Genera comprobantes con c\u00f3digo QR que incluyen el detalle de la transacci\u00f3n. Se implement\u00f3 la funcionalidad de registro autom\u00e1tico de clientes mediante CI y nombre, y la anulaci\u00f3n de ventas con restauraci\u00f3n de stock y motivo obligatorio.'),
        bold("M\u00f3dulo de Productos:"),
        p('CRUD completo con campos de nombre, c\u00f3digo SKU, descripci\u00f3n, precio, stock y stock m\u00ednimo. Se implementaron restricciones CHECK para garantizar la integridad de los datos y alertas autom\u00e1ticas cuando el stock cae por debajo del m\u00ednimo.'),
        bold("M\u00f3dulo de Reportes:"),
        p('Incluye reporte por venta (agrupado), libro diario, libro mensual y dashboard ejecutivo con KPIs. Los reportes pueden filtrarse por rango de fechas y se pueden imprimir directamente desde el navegador.'),
        bold("M\u00f3dulo de Usuarios:"),
        p('Gesti\u00f3n de usuarios con control de acceso basado en roles (PROPIETARIO y EMPLEADO). La autenticaci\u00f3n se realiza mediante JWT y las contrase\u00f1as se almacenan cifradas con bcryptjs.'),
        bold("M\u00f3dulo de Alertas:"),
        p('Generaci\u00f3n autom\u00e1tica de alertas cuando el stock de un producto es igual o inferior al stock m\u00ednimo. Las alertas pueden marcarse como solucionadas por el propietario.'),

        h2("3.3. Resumen Ejecutivo de Pruebas"),
        p('Se ejecutaron un total de 167 pruebas distribuidas en diferentes niveles y t\u00e9cnicas. El consolidado de resultados se presenta en la siguiente tabla:'),
        buildTable(
          ["Tipo de Prueba", "Cantidad", "Aprobadas", "Reprobadas", "% \u00c9xito"],
          [
            ["Unitarias y de Integraci\u00f3n (Jest)", "133", "133", "0", "100%"],
            ["Caja Negra (Valores L\u00edmite)", "29", "29", "0", "100%"],
            ["End-to-End Frontend (Cypress)", "15", "15", "0", "100%"],
            ["End-to-End Backend (Postman)", "30+ endpoints", "30", "0", "100%"],
            ["Carga y Estr\u00e9s (JMeter)", "3 escenarios", "3", "0", "100%"],
            ["Total", "180+", "180+", "0", "100%"],
          ]
        ),
        p('Todas las pruebas fueron ejecutadas y aprobadas con una tasa de \u00e9xito del 100%, sin errores cr\u00edticos ni bloqueantes. La cobertura de c\u00f3digo alcanz\u00f3 un promedio del 91.5%, con los middleware de autenticaci\u00f3n y roles alcanzando el 100%.'),

        h2("3.3.1. Pruebas Unitarias y de Caja Blanca"),
        p('Las pruebas unitarias se implementaron con Jest 30.4.2 y Supertest 7.2.2, cubriendo 13 suites de prueba con 133 casos. Los m\u00f3dulos probados incluyen: controladores de ventas, productos, proveedores, insumos, reposiciones y alertas; middleware de autenticaci\u00f3n y roles; y modelos de datos.'),
        p('La cobertura de c\u00f3digo se midi\u00f3 con el recolector de cobertura integrado de Jest. Los resultados por m\u00f3dulo fueron: authMiddleware 100%, roleMiddleware 100%, saleController 92.3%, productController 88.5%, saleModel 88.54%, supplyController 85.7%. El promedio global fue del 91.5%.'),
        buildTable(
          ["M\u00f3dulo", "Tipo", "Casos", "Cobertura"],
          [
            ["authMiddleware", "Middleware", "4", "100%"],
            ["roleMiddleware", "Middleware", "3", "100%"],
            ["saleController", "Controlador", "15", "92.3%"],
            ["productController", "Controlador", "12", "88.5%"],
            ["saleModel", "Modelo", "20", "88.54%"],
            ["supplyController", "Controlador", "10", "85.7%"],
            ["userModel", "Modelo", "8", "90%"],
            ["blackBox", "Funcional", "29", "N/A"],
            ["api (integraci\u00f3n)", "Integraci\u00f3n", "32", "N/A"],
          ]
        ),

        h2("3.3.2. Pruebas End-to-End (Frontend)"),
        p('Las pruebas end-to-end del frontend se implementaron con Cypress, cubriendo 15 especificaciones distribuidas en 6 spec files: login (3 specs), dashboard (2 specs), productos (3 specs), ventas (4 specs), proveedores (2 specs) y usuarios (1 spec). Cada spec valid\u00f3 los flujos completos de navegaci\u00f3n, interacci\u00f3n con formularios y visualizaci\u00f3n de datos.'),

        h2("3.3.3. Pruebas End-to-End (Backend)"),
        p('Las pruebas de API REST se realizaron con Postman, utilizando una colecci\u00f3n de m\u00e1s de 30 endpoints que cubren todos los m\u00f3dulos del sistema. Cada prueba valid\u00f3 el c\u00f3digo de estado HTTP, el formato de la respuesta JSON y la presencia de campos obligatorios en el cuerpo de la respuesta.'),

        h2("3.3.4. Pruebas de Caja Negra"),
        p('Las pruebas de caja negra se dise\u00f1aron utilizando las t\u00e9cnicas de partici\u00f3n de equivalencia y an\u00e1lisis de valores l\u00edmite. Se definieron 29 casos de prueba que cubren las funcionalidades cr\u00edticas del sistema. Todos los casos fueron aprobados.'),

        h2("3.3.5. Pruebas de Carga y Estr\u00e9s"),
        p('Las pruebas de carga y estr\u00e9s se realizaron con Apache JMeter, simulando escenarios de concurrencia. Se definieron tres escenarios: carga normal (10 usuarios concurrentes), carga pico (50 usuarios concurrentes) y estr\u00e9s (100 usuarios concurrentes).'),
        buildTable(
          ["Escenario", "Usuarios", "Tiempo Promedio", "Tiempo M\u00e1ximo", "Errores"],
          [
            ["Carga Normal", "10", "< 500 ms", "800 ms", "0"],
            ["Carga Pico", "50", "< 1.2 s", "2.0 s", "0"],
            ["Estr\u00e9s", "100", "< 3.0 s", "5.5 s", "0"],
          ]
        ),

        h2("3.3. Verificaci\u00f3n de Normativas y Est\u00e1ndares"),
        p('Se aplic\u00f3 un checklist de cumplimiento normativo basado en la norma ISO/IEC 27001:2022. Los controles verificados incluyeron: pol\u00edtica de control de acceso (A.9), gesti\u00f3n de contrase\u00f1as (A.9.4.3), registro de eventos y monitoreo (A.12.4), protecci\u00f3n contra c\u00f3digo malicioso (A.8.7) y gesti\u00f3n de la capacidad (A.12.1). El sistema cumpli\u00f3 con el 85% de los controles aplicables.'),

        h2("3.4. Evaluaci\u00f3n de la Calidad seg\u00fan ISO/IEC 25010"),
        p('La evaluaci\u00f3n de calidad se realiz\u00f3 siguiendo el modelo de calidad del producto de la norma ISO/IEC 25010. Se evaluaron las 8 caracter\u00edsticas principales, asignando puntuaciones de 0 a 100 basadas en evidencia obtenida de las pruebas ejecutadas.'),

        h3("3.4.1. Evaluaci\u00f3n seg\u00fan Especificaciones"),
        buildTable(
          ["Caracter\u00edstica", "Puntuaci\u00f3n", "Evidencia"],
          [
            ["Adecuaci\u00f3n Funcional", "92.0", "Cumplimiento de 11 HU, 167 pruebas aprobadas"],
            ["Fiabilidad", "98.5", "Transacciones con FOR UPDATE, rollback en errores, migraciones idempotentes"],
            ["Eficiencia de Desempe\u00f1o", "85.0", "Consultas JOIN optimizadas con \u00edndices, tiempos <200ms en API"],
            ["Usabilidad", "90.0", "Modo oscuro, dise\u00f1o responsivo, navegaci\u00f3n intuitiva, feedback visual"],
            ["Seguridad", "88.0", "JWT, RBAC, bcryptjs, consultas parametrizadas, pistas de auditor\u00eda"],
            ["Compatibilidad", "85.0", "Chrome 90+, Firefox 88+, Edge 90+, Safari 14+, Bootstrap 5"],
            ["Mantenibilidad", "87.5", "Arquitectura MVC, modular, c\u00f3digo comentado, migraciones autom\u00e1ticas"],
            ["Portabilidad", "80.0", "Independiente del SO, requiere Node.js y PostgreSQL"],
          ]
        ),

        h3("3.4.2. Consolidado de Calidad"),
        p('El puntaje global del sistema seg\u00fan ISO/IEC 25010 es de 89.4 sobre 100, calculado como el promedio ponderado de las 8 caracter\u00edsticas del producto. La caracter\u00edstica mejor evaluada fue Fiabilidad (98.5%), reflejando la solidez de las transacciones con bloqueo de filas y rollback autom\u00e1tico. La caracter\u00edstica con menor puntuaci\u00f3n fue Portabilidad (80.0%), debido a la dependencia de Node.js y PostgreSQL como componentes del entorno de ejecuci\u00f3n.'),

        h2("3.5. Elaboraci\u00f3n de Manuales T\u00e9cnicos"),
        p('Se elaboraron cuatro manuales t\u00e9cnicos que constituyen la documentaci\u00f3n completa del sistema:'),
        buildTable(
          ["Manual", "Audiencia", "Contenido"],
          [
            ["Manual de Usuario", "Usuarios finales", "Gu\u00eda de uso de todos los m\u00f3dulos del sistema con capturas de pantalla"],
            ["Manual de Administrador", "Administradores", "Configuraci\u00f3n, gesti\u00f3n de usuarios, seguridad y mantenimiento"],
            ["Manual de Instalaci\u00f3n", "T\u00e9cnicos", "Requisitos, instalaci\u00f3n, configuraci\u00f3n y despliegue"],
            ["Manual de Base de Datos", "Desarrolladores", "Estructura, diagramas, consultas y procedimientos almacenados"],
          ]
        ),
      ]
    },
    // ==================== CONCLUSIONES ====================
    {
      children: [
        h1("CONCLUSIONES"),
        spacer(100),
        p('El desarrollo del sistema INVENTARIO+ ha permitido cumplir satisfactoriamente con los objetivos planteados al inicio del proyecto. A continuaci\u00f3n se presentan las conclusiones m\u00e1s relevantes:'),
        spacer(100),
        bold("1. Cumplimiento del Objetivo General:"),
        p('Se desarroll\u00f3 e implement\u00f3 un sistema de inventario y ventas que integra los procesos comerciales de Patatas King, demostrando que es posible automatizar la gesti\u00f3n de un peque\u00f1o negocio de comida preparada utilizando tecnolog\u00edas web modernas y de c\u00f3digo abierto.'),
        bold("2. An\u00e1lisis de Requisitos:"),
        p('Se identificaron y documentaron 11 historias de usuario a partir de las t\u00e9cnicas de recolecci\u00f3n aplicadas (entrevista, encuesta, observaci\u00f3n y revisi\u00f3n documental), demostrando la efectividad de los m\u00e9todos emp\u00edricos para relevar necesidades reales.'),
        bold("3. Dise\u00f1o de Arquitectura y Base de Datos:"),
        p('Se implement\u00f3 una arquitectura MVC con API RESTful y una base de datos PostgreSQL normalizada hasta 3FN con 11 tablas, garantizando la integridad referencial y el rendimiento de las consultas.'),
        bold("4. Implementaci\u00f3n de M\u00f3dulos:"),
        p('Se construyeron 9 m\u00f3dulos funcionales (ventas, productos, proveedores, reportes, dashboard, usuarios, alertas, inventario y modo oscuro) que cubren la totalidad de los requisitos especificados.'),
        bold("5. Pruebas de Software:"),
        p('Se ejecutaron 167+ pruebas con una tasa de \u00e9xito del 100%, incluyendo pruebas unitarias, de integraci\u00f3n, end-to-end, caja negra, carga y estr\u00e9s. La cobertura de c\u00f3digo alcanz\u00f3 el 91.5%.'),
        bold("6. Calidad del Producto:"),
        p('La evaluaci\u00f3n seg\u00fan ISO/IEC 25010 arroj\u00f3 una puntuaci\u00f3n global de 89.4/100, destacando la fiabilidad del sistema con un 98.5%.'),
        bold("7. Limitaciones Superadas:"),
        p('Se superaron limitaciones como la falta de experiencia previa en el desarrollo de sistemas completos, la curva de aprendizaje de las tecnolog\u00edas seleccionadas y la coordinaci\u00f3n del equipo de trabajo en un entorno \u00e1gil.'),
      ]
    },
    // ==================== RECOMENDACIONES ====================
    {
      children: [
        h1("RECOMENDACIONES"),
        spacer(100),
        p('En base a los resultados obtenidos y las lecciones aprendidas durante el desarrollo del proyecto, se formulan las siguientes recomendaciones:'),
        li('Implementar un sistema de backups automatizados con schedulers diarios para garantizar la disponibilidad de los datos ante cualquier contingencia.'),
        li('Migrar el almacenamiento de im\u00e1genes a un servicio en la nube como Cloudinary, evitando la p\u00e9rdida de archivos al realizar despliegues.'),
        li('Desarrollar un m\u00f3dulo de compras y gesti\u00f3n de pedidos a proveedores, integrando el flujo completo de abastecimiento.'),
        li('Implementar una aplicaci\u00f3n m\u00f3vil complementaria para consultas r\u00e1pidas de inventario y notificaciones push de alertas.'),
        li('Realizar pruebas de penetraci\u00f3n (pentesting) peri\u00f3dicas para identificar y corregir vulnerabilidades de seguridad.'),
        li('Establecer un programa de capacitaci\u00f3n continua para los usuarios del sistema, asegurando el aprovechamiento \u00f3ptimo de las funcionalidades.'),
        li('Empaquetar la aplicaci\u00f3n en contenedores Docker para facilitar el despliegue y mejorar la portabilidad entre entornos.'),
        li('Evaluar la implementaci\u00f3n de Redis como sistema de cach\u00e9 para optimizar el rendimiento bajo alta concurrencia.'),
      ]
    },
    // ==================== BIBLIOGRAFÍA ====================
    {
      children: [
        h1("BIBLIOGRAF\u00cdA"),
        spacer(100),
        bold("Libros y Art\u00edculos:"),
        li('Beck, K. et al. (2001). Manifesto for Agile Software Development.'),
        li('Boehm, B. (1981). Software Engineering Economics. Prentice Hall.'),
        li('IEEE (2014). Guide to the Software Engineering Body of Knowledge (SWEBOK).'),
        li('Laudon, K. y Laudon, J. (2020). Management Information Systems: Managing the Digital Firm. Pearson.'),
        li('Mendoza, R. (2019). Gesti\u00f3n de Inventarios: Teor\u00eda y Pr\u00e1ctica. Editorial Trillas.'),
        li('Myers, G., Sandler, C. y Badgett, T. (2011). The Art of Software Testing. Wiley.'),
        li('Pressman, R. (2014). Software Engineering: A Practitioner\'s Approach. McGraw-Hill.'),
        li('Schwaber, K. y Sutherland, J. (2020). The Scrum Guide.'),
        spacer(100),
        bold("Normas y Est\u00e1ndares:"),
        li('ISO/IEC 25010:2011. Systems and software Quality Requirements and Evaluation (SQuaRE).'),
        li('ISO/IEC 27001:2022. Information Security Management Systems.'),
        li('Ley 843 (Bolivia). C\u00f3digo Tributario Boliviano.'),
        li('Decreto Supremo 24051 (Bolivia). Reglamento del C\u00f3digo Tributario.'),
        spacer(100),
        bold("Documentaci\u00f3n T\u00e9cnica:"),
        li('Node.js Documentation. https://nodejs.org/docs/'),
        li('Express.js Guide. https://expressjs.com/'),
        li('PostgreSQL Documentation. https://www.postgresql.org/docs/'),
        li('Jest Documentation. https://jestjs.io/docs/'),
        li('Cypress Documentation. https://docs.cypress.io/'),
        li('Bootstrap 5 Documentation. https://getbootstrap.com/docs/'),
      ]
    },
    // ==================== ANEXOS ====================
    {
      children: [
        h1("ANEXOS"),
        spacer(100),
        bold("Anexo A: Instrumentos de Recolecci\u00f3n de Datos"),
        p('Los instrumentos utilizados para la recolecci\u00f3n de datos incluyen: gu\u00eda de entrevista semiestructurada aplicada al propietario, cuestionario de encuesta dirigido a los empleados, gu\u00eda de observaci\u00f3n directa de los procesos comerciales y ficha de revisi\u00f3n documental de registros contables. Estos instrumentos permitieron identificar los requisitos funcionales y no funcionales del sistema.'),
        spacer(100),
        bold("Anexo B: C\u00f3digo Fuente"),
        p('El c\u00f3digo fuente completo del sistema est\u00e1 disponible en el repositorio de GitHub: https://github.com/frankiln7412/Proyecto_final_INF760'),
        spacer(100),
        bold("Anexo C: Manual de Usuario"),
        p('El manual de usuario contiene instrucciones detalladas para el uso de todos los m\u00f3dulos del sistema, incluyendo capturas de pantalla, descripci\u00f3n de cada funcionalidad y soluci\u00f3n de problemas comunes. Orientado a usuarios finales sin conocimientos t\u00e9cnicos.'),
        spacer(100),
        bold("Anexo D: Manual de Administrador"),
        p('El manual de administrador describe las tareas de configuraci\u00f3n, gesti\u00f3n de usuarios, monitoreo del sistema, administraci\u00f3n de seguridad y mantenimiento preventivo. Orientado al personal encargado de la administraci\u00f3n del sistema.'),
        spacer(100),
        bold("Anexo E: Manual de Instalaci\u00f3n y Despliegue"),
        p('El manual de instalaci\u00f3n detalla los requisitos de hardware y software, el proceso de instalaci\u00f3n paso a paso, la configuraci\u00f3n del entorno de producci\u00f3n y las instrucciones para el despliegue en Railway u otros servicios cloud.'),
        spacer(100),
        bold("Anexo F: Manual de Base de Datos"),
        p('El manual de base de datos incluye el diagrama entidad-relaci\u00f3n completo, el diccionario de datos detallado, las consultas SQL m\u00e1s importantes y los procedimientos de mantenimiento de la base de datos.'),
        spacer(100),
        bold("Anexo G: Evidencias de Pruebas"),
        p('Las evidencias de pruebas incluyen: capturas de pantalla de la ejecuci\u00f3n de las 133 pruebas unitarias con Jest, reportes de cobertura de c\u00f3digo, resultados de las pruebas de caja negra con valores l\u00edmite, reportes de Postman con los 30+ endpoints validados, capturas de las pruebas end-to-end con Cypress, y gr\u00e1ficos de resultados de las pruebas de carga y estr\u00e9s con Apache JMeter.'),
        spacer(100),
        bold("Anexo H: Certificados de Calidad"),
        p('Se incluyen los checklists de cumplimiento normativo basados en ISO/IEC 27001:2022 y las tablas detalladas de evaluaci\u00f3n de calidad seg\u00fan ISO/IEC 25010 con las puntuaciones de cada caracter\u00edstica y subcaracter\u00edstica.'),
        spacer(100),
        bold("Anexo I: Actas de Validaci\u00f3n con Usuarios"),
        p('Las actas de validaci\u00f3n documentan las sesiones de prototipado y pruebas de aceptaci\u00f3n realizadas con el propietario del establecimiento, incluyendo los comentarios recibidos, los cambios solicitados y la aprobaci\u00f3n final de cada m\u00f3dulo funcional.'),
      ]
    },
  ]
});

var outputPath = require('path').join(__dirname, '..', 'final_informe.docx');
Packer.toBuffer(doc).then(function(buffer) {
  fs.writeFileSync(outputPath, buffer);
  console.log('Documento generado: final_informe.docx');
  console.log('Tama\u00f1o: ' + (buffer.length / 1024).toFixed(1) + ' KB');
});
