const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    feedback: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Add indexes for better query performance
feedbackSchema.index({ email: 1 });
feedbackSchema.index({ rating: 1 });
feedbackSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
