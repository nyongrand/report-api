module.exports = {
  considerationRow: function (items) {
    const row = [["Jabatan", "Usul / Pertimbangan", "Tanggal"]];
    items
      .filter((element) => element.level !== 1)
      .forEach((element) => {
        row.push([element.name, element.note, element.date]);
      });

    return row;
  },

  dispositionsRow: function (items) {
    const row = [["Jabatan", "Isi Disposisi", "Tanggal"]];
    items
      .filter((element) => element.level === 1)
      .forEach((element) => {
        row.push([element.name, element.note, element.date]);
      });

    return row;
  },

  dispositionsAllRow: function (items) {
    const row = [["Jabatan", "Isi Disposisi", "Tanggal"]];
    items.forEach((element) => {
      row.push([element.name, element.note, element.date]);
    });

    return row;
  },

  followupsRow: function (items) {
    const row = [];
    items.forEach((element, index) => {
      row.push([index + 1, { colSpan: 2, text: element.name, bold: true }, ""]);
      row.push(["", `Tgl. Kirim ${element.date}`, element.read]);
      row.push([
        "",
        { colSpan: 2, text: "Isi Tindak Lanjut:", margin: [0, 5, 0, 0] },
        "",
      ]);
      row.push(["", { colSpan: 2, text: element.note }, ""]);
    });

    return row;
  },

  expeditionsExtRow: function (items) {
    const row = [["No", "Tgl Kirim", "Penerima"]];
    items
      .filter((element) => element.type === 1)
      .forEach((element) => {
        row.push([row.length, element.date, element.name]);
      });

    return row;
  },

  expeditionsIntRow: function (items) {
    const row = [["No", "Tgl Kirim", "Penerima", "Dibaca"]];
    items
      .filter((element) => element.type === 2)
      .forEach((element) => {
        row.push([row.length, element.date, element.name, element.read]);
      });

    return row;
  },

  expeditionsAllRow: function (items) {
    const row = [["No", "Tgl Kirim", "Penerima", "Dibaca"]];
    items.forEach((element) => {
      row.push([row.length, element.date, element.name, element.read]);
    });

    return row;
  },
};
