const wrapAsync = require("../utils/wrapAsync.js");

// Static pages controller
module.exports = {
    // About Us page
    about: wrapAsync(async (req, res) => {
        res.render("about.ejs");
    }),

    // Help Center page
    help: wrapAsync(async (req, res) => {
        res.render("help.ejs");
    }),

    // FAQ page
    faq: wrapAsync(async (req, res) => {
        res.render("faq.ejs");
    }),

    // Safety Tips page
    safety: wrapAsync(async (req, res) => {
        res.render("safety.ejs");
    }),

    // Cancellation Policy page
    cancellation: wrapAsync(async (req, res) => {
        res.render("cancellation.ejs");
    }),

    // Privacy Policy page
    privacy: wrapAsync(async (req, res) => {
        res.render("privacy.ejs");
    }),

    // Terms of Service page
    terms: wrapAsync(async (req, res) => {
        res.render("terms.ejs");
    }),

    // Cookie Policy page
    cookies: wrapAsync(async (req, res) => {
        res.render("cookies.ejs");
    }),

    // Disclaimer page
    disclaimer: wrapAsync(async (req, res) => {
        res.render("disclaimer.ejs");
    }),

    // Travel Blog page
    blog: wrapAsync(async (req, res) => {
        res.render("blog.ejs");
    }),

    // Sitemap page
    sitemap: wrapAsync(async (req, res) => {
        res.render("sitemap.ejs");
    }),

    // Accessibility page
    accessibility: wrapAsync(async (req, res) => {
        res.render("accessibility.ejs");
    })
};
