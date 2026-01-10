const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const contactController = require("../controllers/contact.js");

router.route("/")
    .get(contactController.renderContactForm)
    .post(wrapAsync(contactController.submitContactForm));

module.exports = router;
