const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Myth = require("../models/Myth");
const { protect } = require("../middleware/auth");

// Require admin
const requireAdmin = [protect, (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin access only" });
  next();
}];

// Platform analytics
router.get("/analytics", requireAdmin, async (req, res) => {
  try {
    const [totalMyths, approvedMyths, pendingMyths, aggViews] = await Promise.all([
      Myth.countDocuments({}),
      Myth.countDocuments({ status: "approved" }),
      Myth.countDocuments({ status: "pending" }),
      Myth.aggregate([
        { $group: { _id: null, totalViews: { $sum: { $ifNull: ["$views", 0] } } } }
      ])
    ]);

    const totalViews = (aggViews[0]?.totalViews) || 0;
    res.json({ totalMyths, approvedMyths, pendingMyths, totalViews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List users with myths count
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "fullName email status createdAt role").lean();
    const counts = await Myth.aggregate([
      { $group: { _id: "$createdBy", mythsCount: { $sum: 1 } } }
    ]);
    const countMap = new Map(counts.map(c => [String(c._id), c.mythsCount]));
    const data = users.map(u => ({
      _id: u._id,
      name: u.fullName,
      email: u.email,
      status: u.status,
      mythsCount: countMap.get(String(u._id)) || 0,
      joinDate: u.createdAt,
      role: u.role
    }));
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle user status
router.post("/users/:id/toggle", requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();
    res.json({ message: "Status updated", status: user.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;










