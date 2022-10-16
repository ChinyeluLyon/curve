const assert = require("assert");
const { contractExists, trackExists } = require("./server");

describe("Contract search", () => {
  it("should find contract control", async () => {
    const found = await contractExists("Contract Control");
    assert.equal(found, true);
  });

  it("should not find unknown contract", async () => {
    const found = await contractExists("Contract fake name");
    assert.equal(found, false);
  });
});

describe("Track search", () => {
  it("should find track control", async () => {
    const found = await trackExists("Track Control");
    assert.equal(found, true);
  });

  it("should not find unknown track", async () => {
    const found = await trackExists("Track fake name");
    assert.equal(found, false);
  });
});
