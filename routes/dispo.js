var express = require("express");
var router = express.Router();
var path = require("path");

var pdfMakePrinter = require("../src/printer");

/* GET users listing. */
router.post("/", function (req, res) {
  const report = req.body;
  const dd = docDefinition(report);

  var fontDescriptors = {
    Roboto: {
      normal: path.join(__dirname, "..", "src", "/fonts/Roboto-Regular.ttf"),
      bold: path.join(__dirname, "..", "src", "/fonts/Roboto-Medium.ttf"),
      italics: path.join(__dirname, "..", "src", "/fonts/Roboto-Italic.ttf"),
      bolditalics: path.join(__dirname, "..", "src", "/fonts/Roboto-MediumItalic.ttf")
    }
  };

  var printer = new pdfMakePrinter(fontDescriptors);
  var doc = printer.createPdfKitDocument(dd);

  doc.pipe(res);
  doc.end();
});

/**
 * Create document definition from report object
 * @param {any} report 
 */
function docDefinition(report) {
  const instansi = "RUMAH SAKIT MUHAMMADIYAH LAMONGAN";
  // const contact = "Jl. Jaksa Agung Suprapto No. 76 RT 03 RW 03 Lamongan, Telp. 0322-322834 (Hunting) Fax. 0322-314048";

  const pertimbangan = [["Jabatan", "Usul / Pertimbangan", "Tanggal"]];
  const dipositions = [["Diteruskan Ke", "Isi Disposisi", "Tanggal"]];

  report.dispositions.forEach(element => {
    if (element.note && element.date) {
      if (element.level == 1) {
        dipositions.push(
          [element.from, element.note, element.date]
        );
      } else if (element.level > 1) {
        pertimbangan.push(
          [element.from, element.note, element.date]
        );
      }
    }
  });

  return {
    pageSize: "A4",
    pageOrientation: "portrait",
    content: [
      { text: report.title, style: "header" },
      { text: instansi, style: "subheader" },
      { text: `ID: ${report.id}` },
      {
        table: {
          widths: ["auto", "auto", "auto", "auto", "auto", "*"],
          body: [
            ["Tgl Terima", `: ${report.received}`, "Target Selesai", `: ${report.deadline}`, "Arsip", `: ${report.archive}`],
            ["No Agenda", `: ${report.agenda}`, "Nama File", `: ${report.filename}`, "Kode", `: ${report.archiveCode}`],
          ]
        },
        style: "sender",
        layout: {
          hLineWidth: (i) => (i + 1) % 2,
          vLineWidth: (i) => (i + 1) % 2,
        }
      },
      {
        table: {
          widths: ["auto", "auto", "*"],
          body: [
            ["Tanggal Surat", ":", report.sent],
            ["Nomor Surat", ":", report.refNumber],
            ["Pengirim", ":", report.sender],
            ["Isi Surat", ":", report.subject],
          ]
        },
        style: "table",
        layout: "noBorders"
      },
      {
        table: {
          widths: [100, "*", 70],
          body: pertimbangan
        },
        style: "table",
        layout: {
          hLineWidth: (i) => i > 1 ? 1 : 0,
          vLineWidth: () => 0,
          hLineColor: function () {
            return "#AAAAAA";
          },
          fillColor: function (row) {
            return (row === 0) ? "#CCCCCC" : null;
          }
        }
      },
      {
        text: "Hasil Disposisi",
        style: {
          fontSize: 13,
          bold: true,
          decoration: "underline",
        }
      },
      {
        table: {
          widths: [100, "*", 75],
          body: dipositions
        },
        style: "table",
        layout: {
          hLineWidth: (i) => i > 1 ? 1 : 0,
          vLineWidth: () => 0,
          hLineColor: function () {
            return "#AAAAAA";
          },
          fillColor: function (row) {
            return (row === 0) ? "#CCCCCC" : null;
          }
        }
      },
    ],

    styles: {
      header: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 0],
        alignment: "center"
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 20],
        alignment: "center"
      },
      sender: {
        margin: [0, 2, 0, 8]
      },
      table: {
        margin: [0, 5, 0, 15]
      },
    },
  };
}

module.exports = router;