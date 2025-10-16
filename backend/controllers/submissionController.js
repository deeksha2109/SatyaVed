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

        // If linked to a myth, sync myth status/approvedBy
        if (submission.mythId) {
            const myth = await Myth.findById(submission.mythId);
            if (myth) {
                // Only update to approved/rejected; leave content intact
                if (submission.status === 'approved' || submission.status === 'rejected') {
                    myth.status = submission.status;
                    if (req.user?.id) myth.approvedBy = req.user.id;
                    await myth.save();
                }
            }
        }

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
