const Myth = require("../models/Myth");
const Submission = require("../models/Submission");
const User = require("../models/User");

const listMyths = async (req, res) => {
    console.log("GET /api/myths called");
    try {
        const { q, category, tag, status, createdBy } = req.query;
        const limit = Math.max(1, Math.min(parseInt(req.query.limit || 20, 10), 1000));
        const page = Math.max(1, parseInt(req.query.page || 1, 10));
        const filter = {};
        if (q) filter.$or = [
            { title: { $regex: q, $options: "i" } },
            { content: { $regex: q, $options: "i" } },
            { tags: { $regex: q, $options: "i" } }
        ];
        if (category) filter.category = category;
        if (tag) filter.tags = tag;
        if (status) filter.status = status;
        if (createdBy) filter.createdBy = createdBy;
        const skip = (page - 1) * limit;
        const [total, myths] = await Promise.all([
            Myth.countDocuments(filter),
            Myth.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'fullName username email role')
        ]);
        const pages = Math.max(1, Math.ceil(total / limit));
        res.json({ count: myths.length, total, page, pages, limit, data: myths });
    } catch (err) {
        console.error("Controller error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const getMyth = async (req, res) => {
    try {
        const myth = await Myth.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!myth) return res.status(404).json({ message: "Myth not found" });
        res.json(myth);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const createMyth = async (req, res) => {
    try {
        const payload = req.body;
        // Map frontend fields to backend schema
        if (payload.shortDescription && !payload.excerpt) {
            payload.excerpt = payload.shortDescription;
        }
        if (payload.fullStory && !payload.content) {
            payload.content = payload.fullStory;
        }
        if (payload.imageUrl && !payload.image) {
            payload.image = payload.imageUrl;
        }
        // If user is authenticated, attach createdBy; otherwise leave undefined
        if (req.user && req.user.id) {
            payload.createdBy = req.user.id;
        }
        // If no authenticated user, allow client to provide createdBy (e.g., from session)
        // This is safe for now since myths are pending by default and admin approves.
        const newMyth = new Myth(payload);
        await newMyth.save();

        // Also create a submission entry so admins can review in submissions collection
        try {
            let submitterName = "Anonymous";
            let submitterEmail = "unknown@example.com";

            if (req.user?.id) {
                // Load full user to ensure we have correct email/name
                const submitter = await User.findById(req.user.id);
                if (submitter) {
                    submitterName = submitter.fullName || submitter.username || submitter.email || submitterName;
                    submitterEmail = submitter.email || submitterEmail;
                }
            } else if (payload?.submittedBy) {
                // Optional: allow client to provide submitter info when not authenticated
                submitterName = payload.submittedBy.name || submitterName;
                submitterEmail = payload.submittedBy.email || submitterEmail;
            }

            await Submission.create({
                title: newMyth.title,
                content: newMyth.content,
                mythId: newMyth._id,
                submittedBy: { name: submitterName, email: submitterEmail },
                status: "pending"
            });
        } catch (submissionErr) {
            console.warn("Could not create submission record:", submissionErr.message);
        }
        res.status(201).json(newMyth);
    } catch (err) {
        res.status(400).json({ message: err.message || "Invalid data" });
    }
};

const approveMyth = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    try {
        const myth = await Myth.findById(req.params.id);
        if (!myth) return res.status(404).json({ message: "Myth not found" });
        myth.status = "approved";
        myth.approvedBy = req.user.id;
        await myth.save();
        res.json({ message: "Myth approved", myth });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


const rejectMyth = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    try {
        const myth = await Myth.findById(req.params.id);
        if (!myth) return res.status(404).json({ message: "Myth not found" });
        myth.status = "rejected";
        myth.approvedBy = req.user.id;
        await myth.save();
        res.json({ message: "Myth rejected", myth });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateMyth = async (req, res) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    try {
        const updatedMyth = await Myth.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedMyth) {
            return res.status(404).json({ message: "Myth not found" });
        }
        res.json(updatedMyth);
    } catch (err) {
        console.error("Update error:", err);
        res.status(400).json({ message: err.message || "Invalid data" });
    }
};


// const deleteMyth = async (req, res) => {
//     if (req.user.role !== "admin") {
//         return res.status(403).json({ message: "Admin access only" });
//     }
//     try {
//         const myth = await Myth.findByIdAndDelete(req.params.id);
//         if (!myth) return res.status(404).json({ message: "Myth not found" });
//         res.json({ message: "Myth deleted" });
//     } catch (err) {
//         res.status(500).json({ message: "Server error" });
//     }
// };



const deleteMyth = async (req, res) => {
    // Debug: Log current authenticated user
    console.log("Authenticated user object:", req.user);

    // Admin-only check
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    try {
        const myth = await Myth.findByIdAndDelete(req.params.id);
        if (!myth) {
            return res.status(404).json({ message: "Myth not found" });
        }
        res.json({ message: "Myth deleted" });
    } catch (err) {
        console.error("Error deleting myth:", err);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    listMyths,
    getMyth,
    createMyth,
    updateMyth,
    deleteMyth,
    approveMyth,
    rejectMyth,
    voteMyth
};

// Handle voting on myths (upvote/downvote)
async function voteMyth(req, res) {
    try {
        const { id } = req.params;
        const { vote } = req.body; // 1 for upvote, -1 for downvote
        const userId = req.user.id;

        if (![1, -1].includes(vote)) {
            return res.status(400).json({ message: 'Invalid vote value. Use 1 for upvote or -1 for downvote.' });
        }

        const myth = await Myth.findById(id);
        if (!myth) {
            return res.status(404).json({ message: 'Myth not found' });
        }

        // Check if user has already voted
        const existingVoteIndex = myth.voters.findIndex(v => v.user.equals(userId));
        
        if (existingVoteIndex >= 0) {
            // User has already voted
            const existingVote = myth.voters[existingVoteIndex];
            
            // If same vote, remove the vote
            if (existingVote.vote === vote) {
                // Remove the vote
                myth.voters.splice(existingVoteIndex, 1);
                // Update vote counts
                if (vote === 1) {
                    myth.upvotes--;
                } else {
                    myth.downvotes--;
                }
            } else {
                // Change the vote
                // First, remove the previous vote count
                if (existingVote.vote === 1) {
                    myth.upvotes--;
                } else {
                    myth.downvotes--;
                }
                // Then add the new vote
                if (vote === 1) {
                    myth.upvotes++;
                } else {
                    myth.downvotes++;
                }
                // Update the vote
                myth.voters[existingVoteIndex].vote = vote;
            }
        } else {
            // New vote
            myth.voters.push({ user: userId, vote });
            if (vote === 1) {
                myth.upvotes++;
            } else {
                myth.downvotes++;
            }
        }

        await myth.save();
        
        // Populate the voters array with user details for the response
        await myth.populate('voters.user', 'username fullName');
        
        res.json({
            success: true,
            upvotes: myth.upvotes,
            downvotes: myth.downvotes,
            userVote: myth.voters.find(v => v.user._id.equals(userId))?.vote || 0,
            message: 'Vote recorded successfully'
        });

    } catch (error) {
        console.error('Error voting on myth:', error);
        res.status(500).json({ message: 'Server error while processing vote' });
    }
}
