const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType } = require('docx');
const fs = require('fs');
const path = require('path');

// ===== HELPERS =====
const H1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 350, after: 200 }, pageBreakBefore: true, children: [new TextRun({ text: t, bold: true, size: 32 })] });
const H2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 150 }, children: [new TextRun({ text: t, bold: true, size: 26 })] });
const H3 = t => new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 }, children: [new TextRun({ text: t, bold: true, size: 22 })] });
const P = t => new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.JUSTIFIED, children: [new TextRun({ text: t, size: 20 })] });
const B = t => new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: t, bold: true, size: 20 })] });
const LI = t => new Paragraph({ spacing: { after: 60 }, bullet: { level: 0 }, children: [new TextRun({ text: t, size: 20 })] });
const CX = (t, s) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: t, size: s||20 })] });

// ===== READ CONTENT =====
const contentFile = path.join(__dirname, 'contenido-informe.txt');
const raw = fs.readFileSync(contentFile, 'utf8');
const lines = raw.split('\n');

// ===== PARSE INTO CHILDREN =====
const children = [];
function addItem(item) { if (item) children.push(item); }

// Parse portada first
let mode = 'doc';
let portadaDone = false;

for (const line of lines) {
  const tr = line.trim();
  if (!tr) continue;

  if (tr === '/// PORTADA') { mode = 'portada'; portadaDone = false; continue; }
  if (tr === '/// DOC') { mode = 'doc'; portadaDone = true; continue; }

  if (mode === 'portada') {
    // portada is handled separately
    continue;
  }

  if (tr.startsWith('### ')) { addItem(H3(tr.slice(4))); }
  else if (tr.startsWith('## ')) { addItem(H2(tr.slice(3))); }
  else if (tr.startsWith('# ')) { addItem(H1(tr.slice(2))); }
  else if (tr.startsWith('- ')) { addItem(LI(tr.slice(2))); }
  else if (tr.startsWith('* ')) { addItem(B(tr.slice(2))); }
  else if (tr.startsWith('TBL:')) {
    // Parse table: TBL: col1|col2|col3 then rows: val1|val2|val3
    const parts = tr.slice(4).trim();
    const headers = parts.split('|');
    const rows = [];
    // Read subsequent lines for rows
    let j = lines.indexOf(line) + 1;
    while (j < lines.length && lines[j].trim().startsWith('|')) {
      rows.push(lines[j].trim().slice(1).split('|'));
      j++;
    }
    const cls = (t, o) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: t||'', size: 18, bold: o?.b, color: o?.c })], alignment: o?.a||AlignmentType.LEFT })], width: o?.w, shading: o?.s });
    const hdr = cs => new TableRow({ tableHeader: true, children: cs.map(c => cls(c, { b:true, c:"FFFFFF", s:{ fill:"2C2C2C", type:"solid" }, w:{ size:100/cs.length, type:WidthType.PERCENTAGE } })) });
    const dtr = cs => new TableRow({ children: cs.map(c => cls(c, { w:{ size:100/cs.length, type:WidthType.PERCENTAGE } })) });
    addItem(new Table({ rows: [hdr(headers), ...rows.map(r=>dtr(r))] }));
  }
  else { addItem(P(tr)); }
}

// ===== PORTADA =====
const portada = [
  new Paragraph({ spacing: { before: 2500, after: 0 }, children: [] }),
  CX("UNIVERSIDAD AUT\u00d3NOMA TOM\u00c1S FR\u00cdAS", 32),
  CX("CARRERA DE INGENIER\u00cdA DE SISTEMAS", 28),
  new Paragraph({ spacing: { before: 800, after: 200 }, children: [] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "SISTEMA DE INVENTARIO Y VENTAS (INVENTARIO+)", bold: true, size: 36 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: "PARA LA GESTI\u00d3N COMERCIAL DE PATATAS KING", bold: true, size: 30 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "DE LA CIUDAD DE POTOS\u00cd", bold: true, size: 28 })] }),
  new Paragraph({ spacing: { before: 800, after: 200 }, children: [] }),
  CX("INFORME FINAL", 24),
  new Paragraph({ spacing: { before: 500, after: 200 }, children: [] }),
  CX("Autor:", 22),
  CX("Benjamin Olmedo", 22),
  new Paragraph({ spacing: { before: 200, after: 0 }, children: [] }),
  CX("Tutor:", 22),
  CX("Doc. Erick Sierra Caballero", 22),
  new Paragraph({ spacing: { before: 500, after: 0 }, children: [] }),
  CX("Potos\u00ed \u2013 Bolivia", 22),
  CX("2026", 22),
];

// ===== DOCUMENT =====
const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Times New Roman', size: 20 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', run: { font: 'Times New Roman', bold: true, size: 28 } },
      { id: 'Heading2', name: 'Heading 2', run: { font: 'Times New Roman', bold: true, size: 24 } },
      { id: 'Heading3', name: 'Heading 3', run: { font: 'Times New Roman', bold: true, size: 22 } },
    ]
  },
  sections: [{ children: portada }, { children }]
});

Packer.toBuffer(doc).then(buf => {
  const out = path.join(__dirname, '..', 'final_informe.docx');
  fs.writeFileSync(out, buf);
  // Estimate: based on compression ratio ~6.8x, XML ~10KB/page
  console.log('OK: ' + (buf.length/1024).toFixed(1) + ' KB, ~' + Math.round(buf.length/1500) + ' pags estimadas');
});
