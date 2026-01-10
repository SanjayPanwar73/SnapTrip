const express = require("express");
const router = express.Router();
const staticController = require("../controllers/static.js");

// Static pages routes
router.get("/about", staticController.about);
router.get("/help", staticController.help);
router.get("/faq", staticController.faq);
router.get("/safety", staticController.safety);
router.get("/cancellation", staticController.cancellation);
router.get("/privacy", staticController.privacy);
router.get("/terms", staticController.terms);
router.get("/cookies", staticController.cookies);
router.get("/disclaimer", staticController.disclaimer);
router.get("/blog", staticController.blog);
router.get("/sitemap", staticController.sitemap);
router.get("/accessibility", staticController.accessibility);

module.exports = router;
