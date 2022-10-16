const express = require("express");
const mongoose = require("mongoose");
const Contract = require("./models/contracts");
const Track = require("./models/tracks");
const xlsx = require("xlsx");

const app = express();

const dbURI =
  "mongodb+srv://Admin:vEjVQ36L9BZBmto2@cluster0.3wegskq.mongodb.net/curve?retryWrites=true&w=majority";
mongoose
  .connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

const handleAliases = (aliasList) => {
  return aliasList.split(";");
};

const createTracksFromTable = (res, table) => {
  table.forEach((t, idx) => {
    console.log(t);
    console.log(idx);
    const newTrack = new Track({
      title: t.Title,
      version: t.Version,
      artist: t.Artist,
      ISRC: t.ISRC,
      pLine: t["P Line"],
      aliases: handleAliases(t.Aliases),
      contract: t.Contract,
    });
    newTrack
      .save()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => console.log(err));
  });
};

app.get("/", (req, res) => {
  const workbook = xlsx.readFile(__dirname + "/files/Track Import Test.xlsx");

  workbook.SheetNames.forEach((sheet) => {
    tableData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]).slice(1);

    createTracksFromTable(res, tableData);
  });
});

app.get("/add-contract", (req, res) => {
  const contract = new Contract({
    name: "Contract 1",
  });

  contract
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});
