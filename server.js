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

const contractExists = (contractName) => {
  return new Promise(async (resolve, reject) => {
    Contract.find({ name: contractName })
      .then((result) => {
        if (result.length > 0) {
          resolve(true);
          console.log(`${contractName} found`);
        } else {
          resolve(false);
          console.log(`${contractName} not found`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const trackExists = (trackTitle) => {
  return new Promise(async (resolve, reject) => {
    Track.find({ title: trackTitle })
      .then((result) => {
        if (result.length > 0) {
          resolve(true);
          console.log(`${trackTitle} found`);
        } else {
          resolve(false);
          console.log(`${trackTitle} not found`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const createTracksFromTable = async (table) => {
  table.forEach(async (t) => {
    const contractFound = await contractExists(t.Contract);

    let contractName;

    if (contractFound) {
      contractName = t.Contract;
    }

    const trackFound = await trackExists(t.Title);

    if (!trackFound) {
      const newTrack = new Track({
        title: t.Title,
        version: t.Version,
        artist: t.Artist,
        ISRC: t.ISRC,
        pLine: t["P Line"],
        aliases: t.Aliases.split(";"),
        contract: contractName,
      });
      newTrack
        .save()
        .then((result) => {
          console.log("Saved Track!");
        })
        .catch((err) => console.log(err));
    }
  });
};

app.get("/", async (req, res) => {
  const contractName = "Contract 1";

  const found = await contractExists(contractName);

  if (!found) {
    const contract = new Contract({
      name: contractName,
    });

    contract
      .save()
      .then(() => {
        console.log("All good");
      })
      .catch((err) => console.log(err));
  }

  const workbook = xlsx.readFile(__dirname + "/files/Track Import Test.xlsx");

  workbook.SheetNames.forEach((sheet) => {
    tableData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]).slice(1);

    createTracksFromTable(tableData);
    res.send("Date: " + new Date());
  });
});

app.get("/clear", async (req, res) => {
  mongoose.connection.collections.contracts?.deleteMany();
  mongoose.connection.collections.tracks?.deleteMany();
  res.send("Cleared");
});

app.get("/contracts", async (req, res) => {
  Contract.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/tracks", async (req, res) => {
  Track.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = { contractExists, trackExists };
