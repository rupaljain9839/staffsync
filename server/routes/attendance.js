const router = require("express").Router();
const Attendance = require("../models/Attendance");
const { protect, allow } = require("../middleware/auth");

const today = () => new Date().toISOString().slice(0, 10);
router.use(protect);

router.post("/checkin", async (req, res) => {
  if (await Attendance.findOne({ user: req.user._id, date: today() }))
    return res.status(400).json({ message: "Already checked in today" });
  res.status(201).json(await Attendance.create({ user: req.user._id, date: today(), checkIn: new Date() }));
});

router.post("/checkout", async (req, res) => {
  const rec = await Attendance.findOne({ user: req.user._id, date: today() });
  if (!rec) return res.status(400).json({ message: "Check in first" });
  if (rec.checkOut) return res.status(400).json({ message: "Already checked out today" });
  rec.checkOut = new Date();
  res.json(await rec.save());
});

router.get("/mine", async (req, res) => res.json(await Attendance.find({ user: req.user._id }).sort("-date")));

router.get("/", allow("hr"), async (req, res) =>
  res.json(await Attendance.find().populate("user", "name email").sort("-date").limit(500)));

module.exports = router;
