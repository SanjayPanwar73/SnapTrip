const Newsletter = require("../models/newsletter.js");
const wrapAsync = require("../utils/wrapAsync.js");

// Handle newsletter subscription
module.exports.subscribe = wrapAsync(async (req, res) => {
    const { email } = req.body;

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (existingSubscriber) {
        if (existingSubscriber.isActive) {
            req.flash("error", "This email is already subscribed to our newsletter!");
            return res.redirect("back");
        } else {
            // Reactivate subscription
            existingSubscriber.isActive = true;
            existingSubscriber.subscribedAt = new Date();
            await existingSubscriber.save();
            req.flash("success", "Welcome back! Your newsletter subscription has been reactivated.");
            return res.redirect("back");
        }
    }

    // Create new subscription
    const newSubscriber = new Newsletter({
        email: email.toLowerCase()
    });

    await newSubscriber.save();

    req.flash("success", "Thank you for subscribing! You'll receive our latest travel deals and destination guides.");
    res.redirect("back");
});

// Handle newsletter unsubscription (for future use)
module.exports.unsubscribe = wrapAsync(async (req, res) => {
    const { email } = req.body;

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
        req.flash("error", "This email is not subscribed to our newsletter.");
        return res.redirect("back");
    }

    subscriber.isActive = false;
    await subscriber.save();

    req.flash("success", "You have been successfully unsubscribed from our newsletter.");
    res.redirect("back");
});
