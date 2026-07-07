const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, WidthType, BorderStyle, PageBreak,
  Header, Footer, TabStopPosition, TabStopType
} = require('docx');
const fs = require('fs');

const LINE = new Paragraph({ spacing: { after: 0 }, borders: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } } });

function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 200 }, children: [new TextRun({ text, bold: true, size: 32, color: "1E5FE0" })] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 250, after: 150 }, children: [new TextRun({ text, bold: true, size: 26, color: "1544D6" })] }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 }, children: [new TextRun({ text, bold: true, size: 22, color: "0D1B3E" })] }); }
function p(text, opts) { return new Paragraph({ spacing: { after: 100 }, ...opts, children: [new TextRun({ text, size: 20, ...(opts?.run || {}) })] }); }
function bold(text) { return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text, bold: true, size: 20 })] }); }
function spacer(h) { return new Paragraph({ spacing: { before: h || 200, after: 0 }, children: [] }); }

function cell(text, opts) {
  const children = [new TextRun({ text: text || '', size: 18, bold: opts?.bold, color: opts?.color })];
  return new TableCell({ children: [new Paragraph({ children, alignment: opts?.align || AlignmentType.LEFT })], width: opts?.width, shading: opts?.shading });
}

function headerRow(cells) { return new TableRow({ tableHeader: true, children: cells.map(c => cell(c, { bold: true, color: "FFFFFF", shading: { fill: "1E5FE0", type: "solid" }, width: { size: 100 / cells.length, type: WidthType.PERCENTAGE } })) }); }
function dataRow(cells) { return new TableRow({ children: cells.map((c, i) => cell(c, { width: { size: 100 / cells.length, type: WidthType.PERCENTAGE } })) }); }

function buildTable(headers, rows) { return new Table({ rows: [headerRow(headers), ...rows.map(r => dataRow(r))] }); }

const doc = new Document({
  styles: { default: { document: { run: { font: 'Calibri', size: 20 } } } },
  sections: [
    // ==================== PORTADA ====================
    {
      children: [
        spacer(3000),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "SISTEMA INTEGRAL DE CONTROL DE PERSONAL", bold: true, size: 48, color: "1E5FE0" })] }),
        spacer(200),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "SICP", size: 36, color: "1544D6" })] }),
        spacer(400),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Guía 7 — Fase Final de Implementación", size: 30, color: "2A3A5C" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Sprint Final & Release", size: 30, color: "2A3A5C" })] }),
        spacer(600),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Enfoque: Scrum + Metodología por Prototipos", size: 22, italics: true, color: "6B7B9A" })] }),
        spacer(200),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Equipo: 5 personas • 8 días hábiles • Factor enfoque: 0.7", size: 20, color: "6B7B9A" })] }),
        spacer(200),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Generado: ${new Date().toLocaleDateString("es-PE")}`, size: 18, color: "6B7B9A" })] }),
      ]
    },
    // ==================== SPRINT FINAL ====================
    {
      children: [
        h1("1. Objetivo del Sprint Final"),
        p('Completar la funcionalidad de reportes avanzados, gestión de horarios, historial de empleados y notificaciones, garantizando la integridad de los datos y la usabilidad para todos los roles. Dejar la integración biométrica como mejora post-release.'),
        spacer(),
        h1("2. Historias de Usuario Seleccionadas"),
        buildTable(
          ["Código", "Historia de Usuario", "Prioridad", "Story Points"],
          [
            ["HU-04", "Reporte mensual completo (Excel/PDF) con horas extras, feriados, desglose detallado", "Indispensable", "13"],
            ["HU-05", "Definir horarios fijos/rotativos por empleado y detectar tardanzas", "Importante", "8"],
            ["HU-06", "Historial de marcaciones y solicitudes para el empleado", "Deseable", "3"],
            ["HU-07", "Alertas al jefe si un empleado no marca entrada 30 min después de su hora", "Deseable", "5"],
          ]
        ),
        spacer(100),
        p("Total de Story Points: 29 SP (Capacidad del equipo: 80 SP)"),
        spacer(),
        h1("3. Plan de Actividades"),
        h2("3.1 Descomposición en Tareas"),
        buildTable(
          ["HU", "Tarea", "Responsable", "Estado"],
          [
            ["HU-04", "Diseño del esquema de datos (feriados, tipos de horas extras, configuración de nómina)", "Backend Dev", "Pendiente"],
            ["HU-04", "Implementar cálculo de horas extras y feriados", "Backend Dev", "Pendiente"],
            ["HU-04", "Crear endpoint /reporte/mensual", "Backend Dev", "Pendiente"],
            ["HU-04", "Desarrollar vista de reportes (frontend)", "Frontend Dev", "Pendiente"],
            ["HU-04", "Integrar exportación a Excel/PDF", "Frontend Dev", "Pendiente"],
            ["HU-04", "Pruebas unitarias y de integración", "QA", "Pendiente"],
            ["HU-05", "Crear interfaz para definir horarios por empleado", "Fullstack", "Pendiente"],
            ["HU-05", "Lógica de detección de tardanzas (comparar marcación con horario)", "Backend Dev", "Pendiente"],
            ["HU-06", "Vista de historial (calendario o lista) para el empleado", "Frontend Dev", "Pendiente"],
            ["HU-07", "Configurar sistema de notificaciones (email/push)", "Backend Dev", "Pendiente"],
          ]
        ),
        spacer(),
        h2("3.2 Entregables del Sprint"),
        p("• Incremento de software potencialmente entregable."),
        p("• Informe de pruebas (unitarias y de integración)."),
        p("• Documentación actualizada (README, manual de usuario)."),
        p("• Release Notes."),
        spacer(),
        h1("4. Avance de Interfaces Finales"),
        buildTable(
          ["Interfaz", "Roles", "Observaciones", "Estado"],
          [
            ["Marcación (entrada/salida)", "Empleado", "Con validación de horario", "Completado"],
            ["Solicitud de permiso", "Empleado, Jefe", "Flujo de aprobación completo", "Completado"],
            ["Lista de solicitudes (jefe)", "Jefe", "Filtros por equipo y estado", "Completado"],
            ["Reporte mensual", "RR.HH.", "Exporta Excel/PDF, incluye horas extras", "Completado"],
            ["Gestión de horarios", "Admin", "Asignación por empleado", "Completado"],
            ["Historial del empleado", "Empleado", "Vista por mes", "Completado"],
            ["Notificaciones", "Jefe, Empleado", "Email y dentro de la app", "Completado"],
            ["Panel de resumen diario", "Jefe, RR.HH.", "Presentes, ausentes, tardíos", "Completado"],
            ["Administración de usuarios", "Admin", "CRUD de usuarios y roles", "Completado"],
          ]
        ),
        spacer(),
        h1("5. Preparación del Release"),
        bold("Actividades previas al release:"),
        p("1. Integración continua (CI/CD con GitHub Actions o Jenkins) ejecuta pruebas y genera artefactos."),
        p("2. Despliegue en entorno de pre-producción idéntico a producción para pruebas de aceptación."),
        p("3. Pruebas de aceptación del Product Owner (PO)."),
        p("4. Capacitación a usuarios (talleres con empleados, jefes y RR.HH.)."),
        p("5. Cierre del Sprint: Incremento y preparación del Release Notes."),
        spacer(),
        h1("6. Release Notes"),
        h3("Versión 1.0.0"),
        bold("Nuevas funcionalidades:"),
        p("• Reporte mensual completo con exportación a Excel y PDF (HU-04)."),
        p("• Gestión de horarios fijos y rotativos por empleado (HU-05)."),
        p("• Detección automática de tardanzas (HU-05)."),
        p("• Historial de marcaciones y solicitudes para el empleado (HU-06)."),
        p("• Sistema de notificaciones por email y push (HU-07)."),
        p("• Alertas al jefe por inasistencia (HU-07)."),
        bold("Mejoras:"),
        p("• Refinamiento de UI/UX en todas las interfaces."),
        p("• Optimización de consultas SQL."),
        p("• Implementación de seguridad con roles reales."),
        bold("Nota:"),
        p("La integración con dispositivo biométrico ZKTeco vía API (HU-08) queda como mejora post-release."),
      ]
    }
  ]
});

const outPath = 'sprint-final-sicp.docx';
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log('Documento generado: ' + outPath);
});
