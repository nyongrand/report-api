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
  const [considerations, dispositions] = filterDispositions(
    report.dispositions
  );

  // ekspedisi list
  const [, internals] = filterExpeditions(report.expeditions, false);

  // report details
  const layoutDetails = {
    table: {
      widths: [90, "auto", "*"],
      body: [
        ["Nomor Memo", ":", report.refNumber],
        ["Tanggal Memo", ":", report.sent],
        ["Pengirim", ":", report.sender],
        ["Jabatan", ":", report.function],
        ["Perihal", ":", report.subject],
      ],
    },
    margin: [0, 5, 0, 20],
    layout: {
      hLineWidth: function (i, node) {
        return i === node.table.body.length ? 1 : 0;
      },
      vLineWidth: () => 0,
    },
  };

  // consideration list
  const layoutConsiderations = {
    table: {
      widths: [100, "*", 75],
      body: considerations,
    },
    margin: [0, 5, 0, 15],
    layout: {
      hLineWidth: (i) => (i > 1 ? 1 : 0),
      vLineWidth: () => 0,
      hLineColor: () => "#AAAAAA",
      fillColor: function (row) {
        return row === 0 ? "#CCCCCC" : null;
      },
      paddingTop: () => 5,
      paddingBottom: () => 2,
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
      hLineWidth: (i) => (i > 1 ? 1 : 0),
      vLineWidth: () => 0,
      hLineColor: () => "#AAAAAA",
      fillColor: function (row) {
        return row === 0 ? "#CCCCCC" : null;
      },
      paddingTop: () => 5,
      paddingBottom: () => 2,
    },
    pageBreak: "after",
  };

  const layoutInternals = {
    table: {
      widths: ["auto", "auto", "*", "auto"],
      body: internals,
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
      { text: `LEMBAR DISPOSISI ${report.title}`, style: "header" },
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
        text: "Hasil Disposisi",
        style: {
          fontSize: 12,
          bold: true,
          decoration: "underline",
        },
      },
      layoutConsiderations,
      layoutDispositions,

      { text: `LEMBAR PENGIRIMAN ${report.title}`, style: "header" },
      { text: instansi, style: "subheader" },
      { text: contact, style: "contact" },

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
      {
        text: "Ekspedisi Intern",
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

/**
 * Separate considerations & dispositions
 * @param {*} reportDispositions
 */
function filterDispositions(reportDispositions) {
  const considerations = [["Jabatan", "Usul / Pertimbangan", "Tanggal"]];
  const dispositions = [["Diteruskan Ke", "Isi Disposisi", "Tanggal"]];

  reportDispositions.forEach((element) => {
    if (element.level != 1) {
      considerations.push([element.name, element.note, element.date]);
    } else {
      dispositions.push([element.name, element.note, element.date]);
    }
  });

  return [considerations, dispositions];
}

/**
 * Separate expeditions, return equal list if separate = false
 * @param {*} reportExpeditions
 * @param {*} separate
 */
function filterExpeditions(reportExpeditions, separate) {
  const externals = [["No", "Tgl Kirim", "Pengirim"]];
  const internals = [["No", "Tgl Kirim", "Penerima", "Dibaca"]];

  reportExpeditions.forEach((element) => {
    if (element.type == 1)
      externals.push([externals.length, element.date, element.name]);

    if (!separate || element.type == 2)
      internals.push([
        internals.length,
        element.date,
        element.name,
        element.read,
      ]);
  });

  return [externals, internals];
}

module.exports = router;
