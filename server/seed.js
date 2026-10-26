require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Employee = require("./models/Employee");
const Announcement = require("./models/Announcement");

const people = [
  { name: "Hannah HR", email: "hr@staffsync.com", password: "hr123456", role: "hr", department: "Human Resources", designation: "HR Manager" },
  { name: "Mike Manager", email: "manager@staffsync.com", password: "manager123", role: "manager", department: "Engineering", designation: "Engineering Manager" },
  { name: "Eva Employee", email: "employee@staffsync.com", password: "employee123", role: "employee", department: "Engineering", designation: "Software Engineer" }
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Employee.deleteMany(), Announcement.deleteMany()]);
  let hrUser;
  for (const p of people) {
    const { department, designation, ...u } = p;
    const user = await User.create(u);
    if (p.role === "hr") hrUser = user;
    await Employee.create({ user: user._id, name: p.name, email: p.email, role: p.role, department, designation, joiningDate: new Date() });
  }
  await Announcement.create({ title: "Welcome to StaffSync", message: "Apply for leave, mark attendance and stay updated here.", postedBy: hrUser._id });
  console.log("Seeded demo users:\n hr@staffsync.com / hr123456\n manager@staffsync.com / manager123\n employee@staffsync.com / employee123");
  process.exit(0);
})();
