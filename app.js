const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

var pdfMakePrinter = require("./src/printer");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

function docDefinition() {
  var title = "DISPOSISI SURAT MASUK";
  var instansi = "RUMAH SAKIT MUHAMMADIYAH LAMONGAN";

  return {
    pageSize: "A4",
    pageOrientation: "portrait",
    content: [
      { text: title, style: "header" },
      { text: instansi, style: "subheader" },
      {
        table: {
          widths: ["auto", "*", "auto", "*", "auto", "*"],
          body: [
            ["Tgl. Terima", ": 17-Agus-20", "Target", ": 20-Des-20", "Arsip", ": 1Keperawatan"],
            ["No Agenda", ": 17220", "Nama File", ": 01021234.pdf", "Kode Arsip", ": 1"],
          ]
        },
        style: "table",
        layout: {
          hLineWidth: (i) => (i + 1) % 2,
          vLineWidth: (i) => (i + 1) % 2,
        }
      },
      {
        table: {
          widths: ["auto", "auto", "*"],
          body: [
            ["ID Surat", ":", "Target"],
            ["Tanggal Surat", ":", "Nama File"],
            ["Nomor Surat", ":", "Nama File"],
            ["Pengirim", ":", "Nama File"],
            ["Isi Surat", ":", "Nama File"],
          ]
        },
        style: "table",
        layout: "noBorders"
      },
      {
        table: {
          widths: [100, "*", 60],
          body: [
            ["Jabatan", "Usul / Pertimbangan", "Tanggal"],
            ["Tim Koordinator Pendidikan Surat", "Conceptually tables are similar to columns. They can however have headers, borders and cells spanning over multiple columns/rows.", "19-Des-20"],
          ]
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
          fontSize: 14,
          bold: true,
          decoration: "underline",
        }
      },
      {
        table: {
          widths: [100, "*", 60],
          body: [
            ["Jabatan", "Usul / Pertimbangan", "Tanggal"],
            ["Tim Koordinator Pendidikan Surat", "Conceptually tables are similar to columns. They can however have headers, borders and cells spanning over multiple columns/rows.", "19-Des-20"],
          ]
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
        margin: [0, 0, 0, 20],
        alignment: "center"
      },
      table: {
        margin: [0, 10, 0, 10]
      },
    },
  };
}

app.get("/", function (req, res) {
  const dd = docDefinition();

  var fontDescriptors = {
    Roboto: {
      normal: path.join(__dirname, ".", "src", "/fonts/Roboto-Regular.ttf"),
      bold: path.join(__dirname, ".", "src", "/fonts/Roboto-Medium.ttf"),
      italics: path.join(__dirname, ".", "src", "/fonts/Roboto-Italic.ttf"),
      bolditalics: path.join(__dirname, ".", "src", "/fonts/Roboto-MediumItalic.ttf")
    }
  };

  var printer = new pdfMakePrinter(fontDescriptors);

  var doc = printer.createPdfKitDocument(dd);

  // doc.pipe(fs.createWriteStream("./temp/file.pdf")); // write to PDF
  doc.pipe(res);                                       // HTTP response

  // add stuff to PDF here using methods described below...

  // finalize the PDF and end the stream
  doc.end();

  // createPdfBinary(dd, function (binary) {
  //   res.contentType("application/pdf");
  //   res.send(binary);
  // }, function (error) {
  //   res.send("ERROR:" + error);
  // });
});

app.listen(port, function () {
  console.log(`listening at http://localhost:${port}`);
});