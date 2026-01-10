const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Add indexes for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Contact", contactSchema);
