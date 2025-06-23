const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const categories  = [
  "Trending",
  "Room",
  "Iconic cities",
  "Mountains",
  "Amazing pools",
  "Camping",
  "Farms",
  "Artic",
  "Domes",
  "Boats"
];


// middleware function for Index Route
module.exports.index = async (req, res) => {
  const { category,location,q } = req.query;
  const filter = category ? { category } : {};

  // const allListings = await Listing.find(filter);
  // let filter = {};
  
//     if (category) {
//   filter.category = category;
// }
//  if (location) {
//     filter.location = new RegExp(location, "i");
//   }
  if (q) {
    filter.$or = [
      { title: new RegExp(q, "i") },
      { location: new RegExp(q, "i") },
      { description: new RegExp(q, "i") },
      { country: new RegExp(q,"i")}
    ];
  }

   
 
  const allListings = await Listing.find(filter);
     
   if (!allListings.length) {
    req.flash('error', 'No listings available');
    // return res.redirect('/listings');
  }
  

// const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings,category,categories,location,q }); 
};



// middleware function for New Route
module.exports.renderNewForm = (req,res)=>{
 res.render("listings/new.ejs",{categories });
};

// middleware function for Show Route
module.exports.showListing = (async (req,res) =>{
  let {id} = req.params;
  const listing = await Listing.findById(id)
  .populate({path: "reviews",populate:{path:"author"}})
  .populate("owner");
  if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
  }
  // console.log(listing);
  res.render("listings/show.ejs",{listing});

});


// middleware function for Create Route
module.exports.createListing = async(req,res) =>{
let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
}).send()
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing =new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image ={url,filename};
  newListing.geometry = response.body.features[0].geometry;

 let savedListing =  await newListing.save();
 console.log(savedListing);
//  console.log(req.body)
 
  req.flash("success","New Listing Created!");
  res.redirect("/listings");

};

// middleware function for Edit Route
module.exports.renderEditForm = async(req,res) =>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs",{listing,originalImageUrl,categories});  
};

// middleware function for Update Route

module.exports.updateListing = async (req, res) => {
  console.log("PUT /listings/:id body:", req.body);
  const { id } = req.params;

  // Fetch the full listing
  const listing = await Listing.findById(id);

  // Update fields
  Object.assign(listing, req.body.listing);

  // If a new image is uploaded, replace the old one
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  // Save the updated document
  await listing.save();

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};


// middleware function for Delete Route
module.exports.destroyListing = async(req,res) =>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","Listing Deleted!");
  res.redirect("/listings");
};



