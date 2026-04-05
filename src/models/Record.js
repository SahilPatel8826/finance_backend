
const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  amount: Number,
  type: {
    type: String,
    enum: ["income", "expense"],
  },
  category: String,
  date: {
    type:Date,
    default:Date.now()},
  note: String,
 
}, { timestamps: true });

module.exports = mongoose.model("Record", recordSchema); 