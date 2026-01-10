const Feedback = require("../models/feedback.js");

module.exports.renderFeedbackForm = (req, res) => {
    res.render("feedback.ejs");
};

module.exports.submitFeedbackForm = async (req, res) => {
    try {
        const { name, email, rating, feedback } = req.body;
        const newFeedback = new Feedback({ name, email, rating, feedback });
        await newFeedback.save();
        req.flash("success", "Thank you for your feedback!");
        res.redirect("/feedback");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/feedback");
    }
};
