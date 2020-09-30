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

  const internals = methods.expeditionsAllRow(report.expeditions);

  // report details
  const layoutDetails = {
    table: {
      widths: [90, "auto", "*"],
      body: [
        ["", "", ""],
        ["", "", ""],
        ["No Agenda", ":", report.agenda],
        ["Revisi Ke", ":", report.refNumber],
        ["Tanggal Terbit", ":", report.sent],
        ["Penyusun", ":", report.sender],
        ["Judul", ":", report.subject],
        ["", "", ""],
        ["", "", ""],
      ],
    },
    layout: {
      hLineWidth: function (i) {
        if (i % 8 === 0) return 1;
        if (i % 6 === 1) return 2;
        return 0;
      },
      vLineWidth: () => 0,
      paddingTop: (i) => (i === 2 ? 5 : 1),
      paddingBottom: (i) => (i === 6 ? 4 : 1),
    },
    margin: [0, 5, 0, 20],
  };

  // eksternal expeditions list
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
      { text: `LEMBAR EKSPEDISI ${report.title}`, style: "header" },
      { text: instansi, style: "header" },
      { text: `${address}, ${phone}`, style: "contact" },

      layoutDetails,

      { text: "Ekspedisi Intern", style: "subheader" },
      layoutInternals,
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
