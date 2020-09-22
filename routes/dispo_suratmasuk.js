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
  const contact = "Jl. Jaksa Agung Suprapto No. 76 RT 03 RW 03 Lamongan, Telp. 0322-322834 (Hunting) Fax. 0322-314048";


  // pertimbangan & disposisi list
  const pertimbangan = [["Jabatan", "Usul / Pertimbangan", "Tanggal"]];
  const dispositions = [["Diteruskan Ke", "Isi Disposisi", "Tanggal"]];
  report.dispositions.forEach(element => {
    if (element.note && element.date) {
      if (element.level != 1) {
        pertimbangan.push(
          [element.from, element.note, element.date]
        );
      } else {
        dispositions.push(
          [element.from, element.note, element.date]
        );
      }
    }
  });

  // ekspedisi list
  const expeditions = [["No", "Tgl Kirim", "Penerima", "Dibaca"]];
  report.expeditions.forEach((element, index) => {
    expeditions.push([index + 1, element.date, element.name, element.read]);
  });

  // report sender
  const layoutSender = {
    table: {
      widths: ["auto", "auto", "auto", "auto", "auto", "*"],
      body: [
        [
          "Tgl Terima", `: ${report.received}`,
          "Target Selesai", `: ${report.deadline}`,
          "Arsip", `: ${report.archive}`
        ],
        [
          "No Agenda", `: ${report.agenda}`,
          "Nama File", `: ${report.filename}`,
          "Kode", `: ${report.archiveCode}`
        ],
      ]
    },
    style: {
      margin: [0, 2, 0, 8],
    },
    layout: {
      hLineWidth: (i) => (i + 1) % 2,
      vLineWidth: (i) => (i + 1) % 2,
    }
  };

  const layoutDetails = {
    table: {
      widths: ["auto", "auto", "*"],
      body: [
        ["Tanggal Surat", ":", report.sent],
        ["Nomor Surat", ":", report.refNumber],
        ["Pengirim", ":", report.sender],
        ["Isi Surat", ":", report.subject],
      ]
    },
    style: {
      margin: [0, 5, 0, 15],
    },
    layout: "noBorders"
  };

  const layoutPertimbangan = {
    table: {
      widths: [100, "*", 75],
      body: pertimbangan
    },
    style: {
      margin: [0, 5, 0, 15],
    },
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
  };

  const layoutDisposisi = {
    table: {
      widths: [100, "*", 75],
      body: dispositions
    },
    style: {
      margin: [0, 5, 0, 15],
    },
    layout: {
      hLineWidth: (i) => i > 1 ? 1 : 0,
      vLineWidth: () => 0,
      hLineColor: function () {
        return "#AAAAAA";
      },
      fillColor: function (row) {
        return (row === 0) ? "#CCCCCC" : null;
      }
    },
    pageBreak: "after",
  };

  const layoutExpeditions = {
    table: {
      widths: ["auto", "auto", "*", "auto"],
      body: expeditions
    },
    style: {
      margin: [0, 5, 0, 15],
    },
    layout: {
      vLineWidth: () => 0,
      hLineWidth: function (i) {
        var firsOrLast = i % 6 === 0 ? 0.5 : 0;
        if (i === 3) firsOrLast += 2;
        return firsOrLast;
      }
    }
  };

  return {
    pageSize: "A4",
    pageOrientation: "portrait",
    content: [
      { text: report.title, style: "header" },
      { text: instansi, style: "subheader" },
      { text: `ID: ${report.id}` },
      layoutSender,
      layoutDetails,
      layoutPertimbangan,
      {
        text: "Hasil Disposisi",
        style: {
          fontSize: 13,
          bold: true,
          decoration: "underline",
        }
      },
      layoutDisposisi,

      { text: report.title, style: "header" },
      { text: instansi, style: "subheader" },
      { text: contact, style: "contact" },
      layoutSender,
      {
        text: "Hasil Pengiriman",
        style: {
          fontSize: 13,
          bold: true,
          decoration: "underline",
        }
      },
      layoutExpeditions,
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
      contact: {
        fontSize: 10,
        italics: true,
        margin: [0, 0, 0, 0],
        alignment: "center"
      },
    },
  };
}

module.exports = router;