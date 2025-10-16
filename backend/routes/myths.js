const express = require("express");
const router = express.Router();
const mythController = require("../controllers/mythController");
const { protect } = require("../middleware/auth"); // Use destructuring!

router.get("/", mythController.listMyths);

// User stats should be BEFORE dynamic :id route
router.get("/me/stats", protect, mythController.userStats);

router.get("/:id", mythController.getMyth);

// Require auth so server uses token to set createdBy
router.post("/", protect, mythController.createMyth);

router.post("/approve/:id", protect, mythController.approveMyth);
router.post("/reject/:id", protect, mythController.rejectMyth);
router.delete("/:id", protect, mythController.deleteMyth);


router.put("/:id", protect, mythController.updateMyth);

// Voting routes
router.post("/:id/vote", protect, mythController.voteMyth);

module.exports = router;
