const Submission = require("../models/Submission");
const Myth = require("../models/Myth");

const createSubmission = async (req, res) => {
    try {
        const submission = new Submission(req.body);
        const created = await submission.save();
        res.status(201).json(created);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find();
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const reviewSubmission = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);
        if (!submission) return res.status(404).json({ message: 'Not found' });

        // Update submission review fields
        submission.status = req.body.status;
        if (req.user?.id) submission.reviewedBy = req.user.id;
        submission.reviewedAt = new Date();
        if (typeof req.body.reviewComment === 'string') {
            submission.reviewComment = req.body.reviewComment;
        }

        // Sync myth status with submission
        const applyStatusToMyth = async (myth) => {
            if (!myth) return;
            if (submission.status === 'approved' || submission.status === 'rejected') {
                myth.status = submission.status;
                if (req.user?.id) myth.approvedBy = req.user.id;
                await myth.save();
            }
        };

        let mythToUpdate = null;
        if (submission.mythId) {
            mythToUpdate = await Myth.findById(submission.mythId);
        }
        // Fallback: try to locate a matching myth if mythId is missing or invalid
        if (!mythToUpdate) {
            mythToUpdate = await Myth.findOne({
                title: submission.title,
                content: submission.content,
            });
        }
        await applyStatusToMyth(mythToUpdate);

        const updated = await submission.save();
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    createSubmission,
    getSubmissions,
    reviewSubmission,
};
