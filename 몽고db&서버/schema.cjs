const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VSchema = new Schema({
  topo: String,
  weightD: String,
  weightS: String,
  info: String,
  meta: String,
});

module.exports = mongoose.model("test", VSchema, "test");
