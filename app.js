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
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Global request logging
app.use((req, res, next) => {
  console.log("🔥 REQUEST HIT:", req.method, req.path);
  next();
});

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
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash messages middleware
// IMPORTANT: req.flash() returns an array, even when empty.
// We use [0] to get the first message, or undefined if empty.
// The EJS templates now check for array length > 0 to avoid empty array truthiness.
app.use((req, res, next) => {
    const successMessages = req.flash("success");
    const errorMessages = req.flash("error");
    
    // Store both the full array (for legacy compatibility) and the first message
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
  console.log("GLOBAL ERROR HANDLER:", err.name, err.message);
  let { statusCode = 500, message = "Something went wrong" } = err;
  console.log("Error:", statusCode, message);
  
  if (res.headersSent) {
    return next(err);
  }
  
  const isAjax = req.xhr || (req.headers && req.headers.accept && req.headers.accept.indexOf('json') > -1) || req.headers['content-type'] === 'application/json';
  
  if (isAjax) {
    return res.status(statusCode).json({ error: message });
  }
  
  res.status(statusCode).render("error.ejs", { message });
});

// Start server
app.listen(8081, () => {
    console.log("server is listening to port 8081");
});
