
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

// Routes
const listingRouter = require("./routes/listing.js");
const categoryRouter = require("./routes/category.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const contactRouter = require("./routes/contact.js");
const newsletterRouter = require("./routes/newsletter.js");
const feedbackRouter = require("./routes/feedback.js");
const staticRouter = require("./routes/static.js");

// Database connection
const DB_URL = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(DB_URL);
}

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Session configuration
const store = MongoStore.create({
    mongoUrl: DB_URL,
    // Removed crypto configuration to prevent encryption errors
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// Session error handling middleware
app.use((req, res, next) => {
    if (req.session && req.session.error) {
        console.error('Session error:', req.session.error);
        req.session.destroy();
        req.flash('error', 'Session error. Please log in again.');
        return res.redirect('/login');
    }
    next();
});

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    console.log('Login attempt:', { username, passwordProvided: !!password });
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return done(null, false, { message: 'Incorrect username.' });
    }
    console.log('User found:', { hasPassword: !!user.password });
    if (!password || password.trim() === '' || !user.password) {
      console.log('Password missing or empty, or user has no password');
      return done(null, false, { message: 'Password is required.' });
    }
    const bcrypt = require('bcrypt');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (isMatch) return done(null, user);
    return done(null, false, { message: 'Incorrect password.' });
  } catch (err) {
    console.log('Login error:', err);
    return done(err);
  }
}));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Flash messages middleware
app.use((req, res, next) => {
    const successMessages = req.flash("success");
    const errorMessages = req.flash("error");
    
    res.locals.success = successMessages;
    res.locals.error = errorMessages;
    res.locals.successMessage = successMessages[0];
    res.locals.errorMessage = errorMessages[0];
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use("/listings", listingRouter);
app.use("/categories", categoryRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/contact", contactRouter);
app.use("/newsletter", newsletterRouter);
app.use("/feedback", feedbackRouter);
app.use("/", staticRouter);

// Error handling
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Error handling for listing routes
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  
  if (res.headersSent) {
    console.error('Headers already sent, cannot send error response', err);
    return;
  }
  
  const isAjax = req.xhr || (req.headers && req.headers.accept && req.headers.accept.indexOf('json') > -1) || req.headers['content-type'] === 'application/json';

  if (isAjax) {
    return res.status(statusCode).json({ error: message });
  }

  try {
    res.status(statusCode).render("error.ejs", { message });
  } catch (renderErr) {
    console.error('Error rendering error page:', renderErr);
    res.status(500).send('Internal Server Error');
  }
});

// Start server
app.listen(8082, () => {
    console.log("server is listening to port 8081");
});
 
