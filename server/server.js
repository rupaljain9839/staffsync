require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/employees", require("./routes/employees"));
app.use("/api/leaves", require("./routes/leaves"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/announcements", require("./routes/announcements"));
app.use("/api/training", require("./routes/training"));

// Central error handler (catches async errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(e => { console.error("DB connection failed:", e.message); process.exit(1); });
