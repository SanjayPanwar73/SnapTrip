const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsletter.js");

// Newsletter subscription route
router.post("/subscribe", newsletterController.subscribe);

// Newsletter unsubscription route (for future use)
router.post("/unsubscribe", newsletterController.unsubscribe);

module.exports = router;
