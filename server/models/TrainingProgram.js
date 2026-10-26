const mongoose = require("mongoose");
module.exports = mongoose.model("TrainingProgram", new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  trainer: String,
  startDate: Date,
  endDate: Date,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true }));
