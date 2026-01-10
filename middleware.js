const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next) =>{
    console.log("\n--- MIDDLEWARE: isLoggedIn ---");
    console.log("req.isAuthenticated():", req.isAuthenticated());
    console.log("req.user:", req.user);
    console.log("Session ID:", req.sessionID);
    
    if(!req.isAuthenticated()){
        console.log("ISLOGGEDIN: User NOT authenticated, redirecting to login");
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create listing!");
        return res.redirect("/login");
    }
    console.log("ISLOGGEDIN: User authenticated, proceeding...");
    next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};


module.exports.isOwner =async(req,res,next) =>{
 let {id} = req.params;
 let listing = await Listing.findById(id);
 if(!listing.owner.equals(res.locals.currUser._id)){
  req.flash("error","You are not the owner of this listing");
  return res.redirect(`/listings/${id}`);
 }
 next();
};


module.exports.validateListing = (req, res, next) => {
    console.log("VALIDATION: checking req.body");
    let { error } = listingSchema.validate(req.body);
    if (error) {
        console.log("VALIDATION FAILED:", error.details[0].message);
        return res.status(400).json({ error: "Validation error: " + error.details[0].message });
    }
    console.log("VALIDATION PASSED");
    next();
};


module.exports.validateReview =(req,res,next) =>{
let {error} = reviewSchema.validate(req.body);
 if(error){
  let errMsg =error.details.map((el) => el.message).join(",");
  throw new ExpressError(404,errMsg);
 }else{
  next();
 }
};


module.exports.isReviewAuthor =async(req,res,next) =>{
 let {id,reviewId} = req.params;
 let review = await Review.findById(reviewId);
 if(!review.author.equals(res.locals.currUser._id)){
  req.flash("error","You are not the author of this review");
  return res.redirect(`/listings/${id}`);
 }
 next();
};