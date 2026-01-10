const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const feedbackController = require("../controllers/feedback.js");

router.route("/")
    .get(feedbackController.renderFeedbackForm)
    .post(wrapAsync(feedbackController.submitFeedbackForm));

module.exports = router;
