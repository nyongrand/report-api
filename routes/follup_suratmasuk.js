"use strict";
var methods = require("../commons/methods.js");
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
  const address = "Jl. Jaksa Agung Suprapto No. 76 RT 03 RW 03 Lamongan";
  const phone = "Telp. 0322-322834 (Hunting) Fax. 0322-314048";

  const dispositions = methods.dispositionsAllRow(report.dispositions);
  const followups = methods.followupsRow(report.followups);
  const expeditions = methods.expeditionsIntRow(report.expeditions);

  // report details
  const layoutDetails = {
    table: {
      widths: [90, "auto", "*"],
      body: [
        ["", "", ""],
        ["", "", ""],
        ["Nomor Surat", ":", report.refNumber],
        ["Tanggal Surat", ":", report.sent],
        ["Pengirim", ":", report.sender],
        ["Isi Surat", ":", report.subject],
        ["", "", ""],
        ["", "", ""],
      ],
    },
    layout: {
      hLineWidth: function (i) {
        if (i % 7 === 0) return 1;
        if (i % 5 === 1) return 2;
        return 0;
      },
      vLineWidth: () => 0,
      paddingTop: (i) => (i === 2 ? 5 : 1),
      paddingBottom: (i) => (i === 5 ? 4 : 1),
    },
    margin: [0, 10, 0, 10],
  };

  // disposition list
  const layoutDispositions = {
    table: {
      widths: [100, "*", 75],
      body: dispositions,
    },
    layout: {
      fillColor: (row) => (row === 0 ? "#CCCCCC" : null),
      hLineColor: () => "#AAAAAA",
      hLineStyle: () => ({ dash: { length: 2 } }),
      hLineWidth: (i) => (i > 1 ? 1 : 0),
      vLineWidth: () => 0,
      paddingTop: () => 5,
      paddingBottom: () => 2,
    },
    margin: [0, 5, 0, 15],
  };

  // follow up list
  const layoutFollowups = {
    table: {
      widths: ["auto", "*", "auto"],
      body: followups,
    },
    layout: {
      hLineWidth: (i) => (i % 4 == 0 ? 1 : 0),
      vLineWidth: () => 0,
      hLineColor: () => "#AAAAAA",
      paddingTop: (i) => (i % 4 === 0 ? 4 : 0),
      paddingBottom: (i) => (i % 4 === 3 ? 2 : 0),
    },
    margin: [0, 5, 0, 15],
  };

  // expedition list
  const layoutExpeditions = {
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
      { text: `${report.title}`, style: "header" },
      { text: instansi, style: "header" },
      { text: `${address}, ${phone}`, style: "contact" },

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
        layout: {
          hLineWidth: (i) => (i + 1) % 2,
          vLineWidth: (i) => (i + 1) % 2,
          paddingTop: () => 3,
          paddingBottom: () => 0,
        },
      },

      layoutDetails,

      { text: "Disposisi", style: "subheader" },
      layoutDispositions,

      { text: "Tindak Lanjut", style: "subheader" },
      layoutFollowups,

      { text: "Ekspedisi", style: "subheader" },
      layoutExpeditions,
    ],

    styles: {
      header: {
        alignment: "center",
        fontSize: 14,
        bold: true,
      },
      subheader: {
        fontSize: 12,
        bold: true,
        decoration: "underline",
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

module.exports = router;
