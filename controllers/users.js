const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to SnapTrip!");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

};


module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to SnapTrip!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

};


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })
};

// Add to favorites
module.exports.addToFavorites = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);

        if (!user.favorites.includes(id)) {
            user.favorites.push(id);
            await user.save();
            req.flash("success", "Added to favorites!");
        } else {
            req.flash("info", "Already in favorites!");
        }

        res.redirect(`/listings/${id}`);
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/listings");
    }
};

// Remove from favorites
module.exports.removeFromFavorites = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);

        user.favorites = user.favorites.filter(fav => fav.toString() !== id);
        await user.save();

        req.flash("success", "Removed from favorites!");
        res.redirect(`/listings/${id}`);
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/listings");
    }
};

// View favorites
module.exports.viewFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');
        res.render("users/favorites.ejs", { favorites: user.favorites });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/listings");
    }
};

// View bookings
module.exports.viewBookings = async (req, res) => {
    try {
        // For now, show empty bookings page - can be extended with booking model
        res.render("users/bookings.ejs", { bookings: [] });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/listings");
    }
};
