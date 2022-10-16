const mongoose = require("mongoose");
const { Schema } = mongoose;

const trackSchema = new Schema(
  {
    id: String,
    title: { type: String, required: true },
    version: String,
    artist: String,
    ISRC: { type: String, required: true },
    pLine: String,
    aliases: Array,
    contract: String,
  },
  { timestamps: true }
);

const Track = mongoose.model("Track", trackSchema);

module.exports = Track;
