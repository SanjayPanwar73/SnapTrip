const Contact = require("../models/contact.js");

module.exports.renderContactForm = (req, res) => {
    // Clear any flash messages to prevent them from showing on contact page
    res.render("contact.ejs");
};

module.exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        // Clear flash messages before rendering
        req.flash("success");
        res.render("contact.ejs");
    } catch (e) {
        // Clear flash messages before rendering
        req.flash("error");
        res.render("contact.ejs");
    }
};
