const assert = require("assert");
const mongoose = require("mongoose");
const Contract = require("./models/contracts");
const Track = require("./models/tracks");
const { contractExists, trackExists } = require("./server");

const dbURI =
  "mongodb+srv://Admin:vEjVQ36L9BZBmto2@cluster0.3wegskq.mongodb.net/curve?retryWrites=true&w=majority";

const testContractName = "Contract Control";
const testTrackName = "Track Control";

describe("Contract Tests", () => {
  before((done) => {
    mongoose.connect(dbURI);
    mongoose.connection.collections.contracts?.deleteMany(
      { name: testContractName },
      done()
    );
  });

  it("Creates a New Contract", (done) => {
    const newContract = new Contract({
      name: testContractName,
    });
    newContract
      .save()
      .then((result) => {
        assert(!newContract.isNew);
        done();
      })
      .catch((err) => console.log(err));
  });

  it("should find contract control", async () => {
    const found = await contractExists(testContractName);
    assert.equal(found, true);
  });

  it("should not find unknown contract", async () => {
    const found = await contractExists("Contract fake name");
    assert.equal(found, false);
  });
});

describe("Track Tests", () => {
  before((done) => {
    mongoose.connect(dbURI);
    mongoose.connection.collections.contracts?.deleteMany(
      { name: testTrackName },
      done()
    );
  });

  it("Creates a New Track", (done) => {
    const newTrack = new Track({
      title: testTrackName,
      version: "v1",
      artist: "A1",
      ISRC: "ISRC21",
      pLine: "P1",
      aliases: ["aliases11 ", " aliases22"],
    });
    newTrack
      .save()
      .then((result) => {
        assert(!newTrack.isNew);
        done();
      })
      .catch((err) => console.log(err));
  });

  it("should find track control", async () => {
    const found = await trackExists(testTrackName);
    assert.equal(found, true);
  });

  it("should not find unknown track", async () => {
    const found = await trackExists("Track fake name");
    assert.equal(found, false);
  });
});
