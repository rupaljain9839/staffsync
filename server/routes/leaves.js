const router = require("express").Router();
const Leave = require("../models/LeaveRequest");
const { protect, allow } = require("../middleware/auth");

router.use(protect);

router.post("/", async (req, res) => {
  const { type, fromDate, toDate, reason } = req.body;
  if (new Date(toDate) < new Date(fromDate)) return res.status(400).json({ message: "End date is before start date" });
  res.status(201).json(await Leave.create({ type, fromDate, toDate, reason, user: req.user._id }));
});

router.get("/mine", async (req, res) => res.json(await Leave.find({ user: req.user._id }).sort("-createdAt")));

router.get("/", allow("hr", "manager"), async (req, res) =>
  res.json(await Leave.find().populate("user", "name email role").sort("-createdAt")));

router.put("/:id/status", allow("hr", "manager"), async (req, res) => {
  const { status } = req.body;
  if (!["Approved", "Rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Leave request not found" });
  if (String(leave.user) === String(req.user._id)) return res.status(403).json({ message: "You cannot review your own leave" });
  leave.status = status;
  leave.reviewedBy = req.user._id;
  res.json(await leave.save());
});

module.exports = router;
