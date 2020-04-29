var express = require("express");
var router = express.Router();
var path = require("path");

var pdfMakePrinter = require("../src/printer");

/* GET users listing. */
router.post("/", function (req, res) {
  const mail = req.body;
  const dd = docDefinition(mail);

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

function docDefinition(mail) {
  const title = "DISPOSISI SURAT MASUK";
  const instansi = "RUMAH SAKIT MUHAMMADIYAH LAMONGAN";

  const pertimbangan = [["Jabatan", "Usul / Pertimbangan", "Tanggal"]];
  const dipositions = [["Diteruskan Ke", "Isi Disposisi", "Tanggal"]];

  mail.dispositions.forEach(element => {
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
      { text: title, style: "header" },
      { text: instansi, style: "subheader" },
      { text: `ID: ${mail.id}` },
      {
        table: {
          widths: ["auto", "auto", "auto", "auto", "auto", "*"],
          body: [
            ["Tgl Terima", `: ${mail.received}`, "Target Selesai", `: ${mail.deadline}`, "Arsip", `: ${mail.archive}`],
            ["No Agenda", `: ${mail.agenda}`, "Nama File", `: ${mail.filename}`, "Kode", `: ${mail.archiveCode}`],
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
            ["Tanggal Surat", ":", mail.sent],
            ["Nomor Surat", ":", mail.refNumber],
            ["Pengirim", ":", mail.sender],
            ["Isi Surat", ":", mail.subject],
          ]
        },
        style: "table",
        layout: "noBorders"
      },
      {
        table: {
          widths: [100, "*", 65],
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
          fontSize: 3,
          bold: true,
          decoration: "underline",
        }
      },
      {
        table: {
          widths: [100, "*", 65],
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