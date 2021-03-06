const express = require("express");

// router file export
var dispoSuratMasukRouter = require("./routes/dispo_suratmasuk");
var dispoMemoInternRouter = require("./routes/dispo_memointern");

var follupSuratMasukRouter = require("./routes/follup_suratmasuk");
var follupMemoInternRouter = require("./routes/follup_memointern");

var dispoSuratUmumRouter = require("./routes/dispo_suratumum");
var dispoSuratKhususRouter = require("./routes/dispo_suratkhusus");
var dispoProtapRouter = require("./routes/dispo_protap");
var dispoDokumenPentingRouter = require("./routes/dispo_dokumenpenting");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// router descriptions
app.use("/dispo/suratmasuk", dispoSuratMasukRouter);
app.use("/dispo/memointern", dispoMemoInternRouter);

app.use("/follup/suratmasuk", follupSuratMasukRouter);
app.use("/follup/memointern", follupMemoInternRouter);

app.use("/dispo/suratumum", dispoSuratUmumRouter);
app.use("/dispo/suratkhusus", dispoSuratKhususRouter);
app.use("/dispo/protap", dispoProtapRouter);
app.use("/dispo/dokumenpenting", dispoDokumenPentingRouter);

app.listen(3000);
