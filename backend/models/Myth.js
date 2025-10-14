const mongoose = require("mongoose");

const mythSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    // Accepts either `content` or alias `fullStory` from frontend
    content: { type: String, required: true, alias: "fullStory" },
    // Accepts either `excerpt` or alias `shortDescription` from frontend
    excerpt: { type: String, trim: true, alias: "shortDescription" },
    // Accepts either `image` or alias `imageUrl` from frontend
    image: { type: String, trim: true, alias: "imageUrl" },
    category: { type: String, required: true, trim: true },
    // Optional legacy fields; safe to omit from frontend
    tags: [{ type: String, trim: true }],
    references: [{ type: String, trim: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Voting fields
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    voters: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        vote: { type: Number, enum: [1, -1] } // 1 for upvote, -1 for downvote
    }]
}, { timestamps: true });

mythSchema.pre("save", async function (next) {
    if (this.isModified("title") && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        const existing = await mongoose.models.Myth.findOne({ slug: this.slug, _id: { $ne: this._id } });
        if (existing) {
            this.slug = `${this.slug}-${Date.now()}`;
        }
    }
    next();
});

mythSchema.index({ title: "text", content: "text" });
mythSchema.index({ tags: 1 });
mythSchema.index({ category: 1 });

module.exports = mongoose.model("Myth", mythSchema);
