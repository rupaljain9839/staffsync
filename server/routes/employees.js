const router = require("express").Router();
const Employee = require("../models/Employee");
const User = require("../models/User");
const { protect, allow } = require("../middleware/auth");

router.use(protect);

// Employee: own record
router.get("/me", async (req, res) => res.json(await Employee.findOne({ user: req.user._id })));
router.put("/me", async (req, res) => {
  const { phone, address } = req.body;
  res.json(await Employee.findOneAndUpdate({ user: req.user._id }, { phone, address }, { new: true }));
});

// HR / Manager: list
router.get("/", allow("hr", "manager"), async (req, res) => res.json(await Employee.find().sort("-createdAt")));

// HR: create (also creates a login account; default password Welcome@123)
router.post("/", allow("hr"), async (req, res) => {
  const { name, email, role = "employee", password = "Welcome@123", ...rest } = req.body;
  if (await User.findOne({ email })) return res.status(400).json({ message: "Email already exists" });
  const user = await User.create({ name, email, password, role });
  delete rest.user;
  res.status(201).json(await Employee.create({ ...rest, user: user._id, name, email, role }));
});

// HR: update
router.put("/:id", allow("hr"), async (req, res) => {
  delete req.body.user;
  const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!emp) return res.status(404).json({ message: "Employee not found" });
  await User.findByIdAndUpdate(emp.user, { name: emp.name, email: emp.email, role: emp.role });
  res.json(emp);
});

// HR: delete
router.delete("/:id", allow("hr"), async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (!emp) return res.status(404).json({ message: "Employee not found" });
  if (String(emp.user) === String(req.user._id)) return res.status(400).json({ message: "You cannot delete yourself" });
  await emp.deleteOne();
  await User.findByIdAndDelete(emp.user);
  res.json({ message: "Employee deleted" });
});

module.exports = router;
