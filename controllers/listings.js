const Listing = require("../models/listing.js");
const Category = require("../models/category.js");
const { cloudinary } = require("../cloudConfig.js");


// middleware function for Index Route
module.exports.index = async (req, res) => {
  try {
    const { category, location, q, sort, minPrice, maxPrice } = req.query;
    let filter = {};

    // Category filter
    if (category && category !== 'All') {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    // Search filter
    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { location: new RegExp(q, "i") },
        { description: new RegExp(q, "i") },
        { country: new RegExp(q, "i") }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Sorting
    let sortOption = {};
    switch (sort) {
      case 'price-low':
        sortOption.price = 1;
        break;
      case 'price-high':
        sortOption.price = -1;
        break;
      case 'popular':
        sortOption.createdAt = -1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    const allListings = await Listing.find(filter).populate('category').sort(sortOption);
    const categories = await Category.find({ isActive: true }).maxTimeMS(5000);
    console.log(`Fetched ${allListings.length} listings for /listings`);



    res.render("listings/index.ejs", { allListings, category, categories, location, q, sort, minPrice, maxPrice });
  } catch (error) {
 
      allListings: [], 
      category: '', 
      categories: [], 
      location: '', 
      q: '', 
      sort: '', 
      minPrice: '', 
      maxPrice: '' 
    });
  }
};



// middleware function for New Route
module.exports.renderNewForm = async (req,res)=>{
  const categories = await Category.find({ isActive: true });
  res.render("listings/new.ejs",{categories });
};

// middleware function for Show Route
module.exports.showListing = (async (req,res) =>{
  let {id} = req.params;
  const listing = await Listing.findById(id)
  .populate({path: "reviews",populate:{path:"author"}})
  .populate("owner")
  .populate("category");
  
  if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
  }
  
  // Debug: Log image data to help diagnose display issues
  console.log("=== Show Listing Debug ===");
  console.log("Listing ID:", id);
  console.log("Listing title:", listing.title);
  console.log("Image object:", JSON.stringify(listing.image));
  console.log("Image URL:", listing.image?.url);
  console.log("Image filename:", listing.image?.filename);
  
  // Check if image URL is valid
  if (listing.image && listing.image.url) {
    console.log("Image URL is present:", listing.image.url);
    // Log first 50 chars to avoid cluttering logs
    console.log("Image URL preview:", listing.image.url.substring(0, 50) + "...");
  } else {
    console.log("WARNING: Image URL is missing or invalid!");
  }
  
  res.render("listings/show.ejs",{listing});

});


// Create Listing
module.exports.createListing = async (req, res, next) => {
  console.log("\n===========================================");
  console.log("=== NEW LISTING FORM DATA RECEIVED ===");
  console.log("===========================================");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  
  console.log("\n--- FORM DATA ---");
  console.log("req.body:", req.body);
  console.log("listing[title]:", req.body.listing?.title);
  console.log("listing[description]:", req.body.listing?.description);
  console.log("listing[category]:", req.body.listing?.category);
  console.log("listing[price]:", req.body.listing?.price);
  console.log("listing[country]:", req.body.listing?.country);
  console.log("listing[location]:", req.body.listing?.location);
  
  console.log("\n--- FILE DATA ---");
  if (req.file) {
    console.log("File name:", req.file.originalname);
    console.log("File size:", req.file.size);
    console.log("File path:", req.file.path);
    console.log("File filename:", req.file.filename);
  } else {
    console.log("No file uploaded - will use placeholder");
  }
  
  console.log("\n--- USER DATA ---");
  console.log("User ID:", req.user ? req.user._id : "Not logged in!");
  console.log("User email:", req.user ? req.user.email : "N/A");
  console.log("===========================================\n");

  try {
    console.log("STEP 1: Starting create listing process");
    const listingData = req.body.listing;

    if (!listingData) {
      console.error("No listing data in body");
      throw new Error("No listing data received");
    }

    console.log("Listing data received:", JSON.stringify(listingData, null, 2));
    
    // Validate required fields
    const requiredFields = ['title', 'price', 'location', 'country', 'category'];
    for (const field of requiredFields) {
      if (!listingData[field]) {
        console.error(`Missing required field: ${field}`);
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    console.log("STEP 2: All required fields present");

    // Parse price to number
    if (listingData.price) {
      listingData.price = parseInt(listingData.price, 10);
      if (isNaN(listingData.price) || listingData.price < 0) {
        throw new Error("Invalid price value");
      }
    }

    console.log("STEP 3: Processing image upload");
    // Handle image upload - make it optional
    if (req.file) {
      console.log("=== Image Upload Debug ===");
      console.log("File uploaded:", req.file.originalname);
      console.log("File path:", req.file.path);
      console.log("File filename:", req.file.filename);
      console.log("File public_id:", req.file.public_id);
      
      listingData.image = {
        url: req.file.path,
        filename: req.file.filename || req.file.public_id
      };
      console.log("Image data set:", JSON.stringify(listingData.image));
    } else {
      // Set a default placeholder image if no file uploaded
      listingData.image = {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        filename: "placeholder"
      };
      console.log("No image uploaded, using placeholder");
    }
    console.log("STEP 4: Image processed");

    // Set owner to current user
    if (req.user && req.user._id) {
      listingData.owner = req.user._id;
    } else {
      throw new Error("User not authenticated");
    }
    console.log("STEP 5: Owner set, ready to save");
    console.log("Owner ID:", listingData.owner);
    console.log("Listing data to save:", JSON.stringify(listingData, null, 2));
    console.log("STEP 6: Creating new Listing object");

    // Create and save the listing
    const newListing = new Listing(listingData);
    console.log("STEP 7: About to save to database");
    console.log("newListing object:", JSON.stringify(newListing.toObject(), null, 2));
    
    try {
      await newListing.save();
      console.log("STEP 8: Database save successful");
      console.log("New listing ID:", newListing._id);
      req.flash("success", "Listing created successfully!");
    } catch (saveError) {
      console.error("STEP 8 ERROR: Database save failed");
      console.error("Save error message:", saveError.message);
      console.error("Save error code:", saveError.code);
      console.error("Save error name:", saveError.name);
      
      // Log validation errors if any
      if (saveError.errors) {
        console.error("Validation errors:");
        for (const key in saveError.errors) {
          console.error(`  ${key}:`, saveError.errors[key].message);
        }
      }
      
      throw saveError;
    }

    res.redirect(`/listings/${newListing._id}`);
  } catch (error) {
    console.error("=== Create Listing Error ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Stack:", error.stack);
    
    if (res.headersSent) {
      console.error("Response already sent, cannot redirect");
      return;
    }
    res.redirect("/listings/new");
  }
};

// middleware function for Edit Route
module.exports.renderEditForm = async(req,res) =>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
  }
  const categories = await Category.find({ isActive: true });
  return res.render("listings/edit.ejs", { listing, categories });
}

// middleware function for Update Route
module.exports.updateListing = async (req, res) => {
  console.log("=== Update Listing Request ===");
  console.log("Listing ID:", req.params.id);
  console.log("Body:", JSON.stringify(req.body, null, 2));
  console.log("File:", req.file ? { originalname: req.file.originalname, filename: req.file.filename } : "No file");

  try {
    const { id } = req.params;
    const listingData = req.body.listing;

    if (!listingData) {
      throw new Error("No listing data received");
    }

    if (listingData.price) {
      listingData.price = parseInt(listingData.price, 10);
      if (isNaN(listingData.price) || listingData.price < 0) {
        throw new Error("Invalid price value");
      }
    }

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.redirect("/listings");
    }

    Object.assign(listing, listingData);

    // Handle image upload - check req.file first
    if (req.file) {
      console.log("=== Update Image Upload Debug ===");
      console.log("File uploaded:", req.file.originalname);
      console.log("path:", req.file.path);
      console.log("filename:", req.file.filename);
      
      // Delete old image from Cloudinary
      if (listing.image && listing.image.filename) {
        try {
          await cloudinary.uploader.destroy(listing.image.filename);
          console.log("Old image deleted:", listing.image.filename);
        } catch (deleteError) {
          console.error("Failed to delete old image:", deleteError.message);
        }
      }
      
      // Save new image from multer-storage-cloudinary
      listing.image = {
        url: req.file.path,
        filename: req.file.filename || req.file.public_id
      };
      console.log("New image saved:", JSON.stringify(listing.image));
    }

    await listing.save();
    console.log("Listing updated successfully:", id);


  } catch (error) {
    console.error("=== Update Listing Error ===");
    console.error("Error:", error.message);
    // Prevent ERR_HTTP_HEADERS_SENT by checking if response already sent
    if (res.headersSent) {
      console.error("Response already sent, cannot redirect");
      return;

  }
};


// middleware function for Delete Route
module.exports.destroyListing = async(req,res) =>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  if (deletedListing) {
    req.flash("success", "Listing deleted successfully!");
  }
  if (deletedListing && deletedListing.image && deletedListing.image.filename) {
    try {
      await cloudinary.uploader.destroy(deletedListing.image.filename);
      console.log("Image deleted from Cloudinary:", deletedListing.image.filename);
    } catch (deleteError) {
      console.error("Failed to delete image from Cloudinary:", deleteError.message);
    }
  }

};





