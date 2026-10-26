const mongoose = require("mongoose");
module.exports = mongoose.model("Employee", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["hr", "manager", "employee"], default: "employee" },
  phone: String,
  department: String,
  designation: String,
  joiningDate: Date,
  address: String
}, { timestamps: true }));
