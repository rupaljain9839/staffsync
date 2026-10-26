const router = require("express").Router();
const Announcement = require("../models/Announcement");
const { protect, allow } = require("../middleware/auth");

router.use(protect);
router.get("/", async (req, res) => res.json(await Announcement.find().populate("postedBy", "name").sort("-createdAt")));
router.post("/", allow("hr"), async (req, res) => {
  const { title, message } = req.body;
  res.status(201).json(await Announcement.create({ title, message, postedBy: req.user._id }));
});
router.delete("/:id", allow("hr"), async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
