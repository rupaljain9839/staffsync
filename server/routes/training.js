const router = require("express").Router();
const Training = require("../models/TrainingProgram");
const { protect, allow } = require("../middleware/auth");

router.use(protect);

// Employees see only programs they are enrolled in; HR/Manager see all
router.get("/", async (req, res) => {
  const filter = req.user.role === "employee" ? { participants: req.user._id } : {};
  res.json(await Training.find(filter).populate("participants", "name").sort("-createdAt"));
});
router.post("/", allow("manager", "hr"), async (req, res) =>
  res.status(201).json(await Training.create({ ...req.body, createdBy: req.user._id })));
router.put("/:id", allow("manager", "hr"), async (req, res) =>
  res.json(await Training.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete("/:id", allow("manager", "hr"), async (req, res) => {
  await Training.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
