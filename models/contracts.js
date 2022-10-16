const mongoose = require("mongoose");
const { Schema } = mongoose;

const contractSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;
