// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register
router.post("/register", async (req, res) => {
    console.log('BODY:', req.body);
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Assign role; only allow admin for designated admin email
        let role = "user";
        if (req.body.role === "admin" && (email === "admin@satyaved.com" || email === "admin@gmail.com")) {
            role = "admin";
        }

        const user = new User({ fullName, email, password, role });
        await user.save();

        const safeUser = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role
        };

        const token = generateToken(user);
        res.status(201).json({ message: "User registered successfully", user: safeUser, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Normalize legacy records: if fullName is missing but username exists, persist fullName
        if (!user.fullName && user.username) {
            user.fullName = user.username;
            try {
                await user.save();
            } catch (_) {
                // ignore persistence error, still return computed name below
            }
        }

        // Build response compatible with frontend expectations
        const safeUser = {
            _id: user._id,
            fullName: user.fullName || user.username || "",
            email: user.email,
            role: user.role
        };

        const token = generateToken(user);
        res.json({ message: "Login successful", user: safeUser, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
