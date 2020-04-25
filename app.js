global.window = { document: { createElementNS: function () { return {}; } } };
global.navigator = {};
global.html2pdf = {};
global.btoa = function () { };

const express = require("express");
const jsPDF = require("jspdf");
const app = express();
const port = 3000;

app.get("/disposisi/:id", function (req, res) {
  const doc = create();
  const filename = `disposisi-${req.params.id}.pdf`;

  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", "application/pdf");

  res.send(doc.output());
});

app.listen(port, function () {
  console.log(`listening at http://localhost:${port}`);
});

function create() {
  var title = "DISPOSISI SURAT MASUK";
  var instansi = "RUMAH SAKIT MUHAMMADIYAH LAMONGAN";
  var pertimbangan =
    "A HTML5 client-side solution for generating PDFs. Perfect for event tickets, reports, certificates, you name it!";

  var doc = new jsPDF();

  var p1 = Math.ceil(doc.getStringUnitWidth(pertimbangan) * 0.0257028);
  var p1Height = p1 * 5.675;

  doc
    .setFont("times")
    .setFontSize(18)
    .text(title, 105, 25, null, null, "center")
    .text(instansi, 105, 33, null, null, "center")

    // box
    .rect(15, 45, 60, 18)
    .rect(75, 45, 60, 18)
    .rect(135, 45, 60, 18);

  doc.setFontSize(13);

  // box label left
  doc.text("Tgl. Terima", 18, 52);
  doc.text("No. Agenda", 18, 59);
  doc.text(":", 43, 52);
  doc.text(":", 43, 59);

  // box label right
  doc.text("Trgt Selesai", 78, 52);
  doc.text("Nama File", 78, 59);
  doc.text(":", 103, 52);
  doc.text(":", 103, 59);

  // box label center
  doc.text("Arsip", 138, 52);
  doc.text("Kode Arsip", 138, 59);
  doc.text(":", 163, 52);
  doc.text(":", 163, 59);

  doc.setFontSize(14);
  doc.text("ID Surat", 15, 72);
  doc.text("Tanggal Surat", 15, 80);
  doc.text("Nomor Surat", 15, 88);
  doc.text("Pengirim", 15, 96);
  doc.text("Isi Surat", 15, 104);
  doc.text(":", 50, 72);
  doc.text(":", 50, 80);
  doc.text(":", 50, 88);
  doc.text(":", 50, 96);
  doc.text(":", 50, 104);

  doc.text("Kabag. Sekretariat dan Umum", 15, 120);
  doc.text("31-Jan-2020", 195, 120, null, null, "right");
  doc.text(pertimbangan, 15, 127, { maxWidth: 190 });

  doc.setFontSize(16);
  doc.setFontStyle("bold");
  doc.text("Hasil Disposisi", 15, 134 + p1Height);
  doc.line(15, 136 + p1Height, 51, 136 + p1Height);

  doc.setFontSize(14);
  doc.setFontStyle("normal");
  doc.text("Kabag. Sekretariat dan Umum", 15, 143 + p1Height);
  doc.text("31-Jan-2020", 195, 143 + p1Height, null, null, "right");
  doc.text(pertimbangan, 15, 150 + p1Height, { maxWidth: 190 });

  //doc.line(15, 72, 195, 72);
  doc.line(15, 110, 195, 110);
  doc.setLineWidth(1);
  //doc.line(15, 70, 195, 70);
  //doc.line(15, 112, 195, 112);

  doc.setLineWidth(0.2);

  return doc;
}

delete global.window;
delete global.html2pdf;
delete global.navigator;
delete global.btoa;