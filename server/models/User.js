const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["hr", "manager", "employee"], default: "employee" }
}, { timestamps: true });

schema.pre("save", async function () {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 10);
});
schema.methods.matchPassword = function (plain) { return bcrypt.compare(plain, this.password); };

module.exports = mongoose.model("User", schema);
