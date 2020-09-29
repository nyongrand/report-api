var express = require("express");
var router = express.Router();

var PdfPrinter = require("pdfmake");

router.post("/", function (req, res) {
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };

  const printer = new PdfPrinter(fonts);
  const docDefinition = getDocDefinition(req.body);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  pdfDoc.pipe(res);
  pdfDoc.end();
});

/**
 * Create document definition from report object
 * @param {any} report
 */
function getDocDefinition(report) {
  const instansi = "RUMAH SAKIT MUHAMMADIYAH LAMONGAN";
  const contact =
    "Jl. Jaksa Agung Suprapto No. 76 RT 03 RW 03 Lamongan, Telp. 0322-322834 (Hunting) Fax. 0322-314048";

  // considerations & disposisi list
  const dispositions = filterDispositions(report.dispositions);

  // follow ups
  const followups = filterFollowups(report.followups);

  // ekspedisi list
  const expeditions = filterExpeditions(report.expeditions);

  // report details
  const layoutDetails = {
    table: {
      widths: [90, "*"],
      body: [
        ["Nomor Surat", `: ${report.refNumber}`],
        ["Tanggal Surat", `: ${report.sent}`],
        ["Pengirim", `: ${report.sender}`],
        ["Isi Surat", `: ${report.subject}`],
      ],
    },
    margin: [0, 5, 0, 20],
    layout: {
      hLineWidth: function (i, node) {
        if (i === 0 || i === node.table.body.length) return 1;
        if (i === 1 || i === node.table.body.length - 1) return 2;
        return 0;
      },
      paddingBottom: function (i, node) {
        if (i === 1 || i === node.table.body.length - 2) return 3;
        return 1;
      },
      paddingTop: function (i, node) {
        if (i === 1 || i === node.table.body.length - 2) return 3;
        return 1;
      },
      vLineWidth: () => 0,
    },
  };

  // disposition list
  const layoutDispositions = {
    table: {
      widths: [100, "*", 75],
      body: dispositions,
    },
    margin: [0, 5, 0, 15],
    layout: {
      fillColor: (row) => (row === 0 ? "#CCCCCC" : null),
      hLineWidth: (i) => (i > 1 ? 1 : 0),
      vLineWidth: () => 0,
      hLineColor: () => "#AAAAAA",
      hLineStyle: () => ({ dash: { length: 2 } }),
      paddingTop: () => 5,
      paddingBottom: () => 2,
    },
  };

  // follow up list
  const layoutFollowups = {
    table: {
      widths: ["auto", "auto", "*", "auto"],
      body: followups,
    },
    margin: [0, 5, 0, 15],
    layout: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      hLineColor: () => "#AAAAAA",
      fillColor: function (row) {
        return row === 0 ? "#CCCCCC" : null;
      },
      paddingTop: () => 5,
      paddingBottom: () => 2,
    },
  };

  // expedition list
  const layoutInternals = {
    table: {
      widths: ["auto", "auto", "*", "auto"],
      body: expeditions,
    },
    margin: [0, 5, 0, 15],
    layout: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      hLineColor: () => "#AAAAAA",
      fillColor: function (row) {
        return row === 0 ? "#CCCCCC" : null;
      },
      paddingTop: () => 5,
      paddingBottom: () => 2,
    },
  };

  return {
    pageSize: "A4",
    pageOrientation: "portrait",
    defaultStyle: {
      font: "Helvetica",
      lineHeight: 1.15,
    },

    content: [
      { text: `LEMBAR ${report.title}`, style: "header" },
      { text: instansi, style: "subheader" },
      { text: contact, style: "contact" },

      { text: `ID: ${report.id}` },
      {
        table: {
          widths: ["auto", "auto", "auto", "auto", "auto", "*"],
          body: [
            [
              "Tgl Terima",
              `: ${report.received}`,
              "Target Selesai",
              `: ${report.deadline}`,
              "Arsip",
              `: ${report.archive}`,
            ],
            [
              "No Agenda",
              `: ${report.agenda}`,
              "Nama File",
              `: ${report.filename}`,
              "Kode",
              `: ${report.archiveCode}`,
            ],
          ],
        },
        margin: [0, 2, 0, 15],
        layout: {
          hLineWidth: (i) => (i + 1) % 2,
          vLineWidth: (i) => (i + 1) % 2,
          paddingTop: () => 3,
          paddingBottom: () => 0,
        },
      },
      layoutDetails,

      {
        text: "Disposisi",
        style: {
          fontSize: 12,
          bold: true,
          decoration: "underline",
        },
      },
      layoutDispositions,

      {
        text: "Tindak Lanjut",
        style: {
          fontSize: 12,
          bold: true,
          decoration: "underline",
        },
      },
      layoutFollowups,

      {
        text: "Ekspedisi",
        style: {
          fontSize: 12,
          bold: true,
          decoration: "underline",
        },
      },
      layoutInternals,
    ],

    styles: {
      header: {
        alignment: "center",
        fontSize: 14,
        bold: true,
      },
      subheader: {
        alignment: "center",
        fontSize: 14,
        bold: true,
      },
      contact: {
        alignment: "center",
        fontSize: 10,
        italics: true,
        margin: [0, 0, 0, 20],
      },
    },
  };
}

function filterDispositions(items) {
  const row = [["Diteruskan Ke", "Isi Disposisi", "Tanggal"]];
  items.forEach((element) => {
    row.push([element.name, element.note, element.date]);
  });

  return row;
}

function filterFollowups(items) {
  const row = [["No", "Tgl Kirim", "Penerima", "Dibaca"]];
  items.forEach((element) => {
    row.push([row.length, element.date, element.name, element.read]);
  });

  return row;
}

function filterExpeditions(items) {
  const row = [["No", "Tgl Kirim", "Penerima", "Dibaca"]];
  items.forEach((element) => {
    row.push([row.length, element.date, element.name, element.read]);
  });

  return row;
}

module.exports = router;
