const express = require("express");
const router = express.Router();
const { upload, handleMulterError } = require("../multerDiskConfig.js");
const { isLoggedIn } = require("../middleware.js");
const Listing = require("../models/listing.js");
const Category = require("../models/category.js");

// GET /listings - Index page (all listings)
router.get("/", async (req, res) => {
  console.log("\n" + "=".repeat(60));
  console.log("GET /listings - INDEX");
  console.log("=".repeat(60));
  
  try {
    const { category, location, q, sort, minPrice, maxPrice } = req.query;
    let filter = {};

    // Category filter - use case-insensitive name matching
    if (category && category !== 'All') {
      // Find category by name (case-insensitive)
      const categoryDoc = await Category.findOne({ name: { $regex: new RegExp('^' + category + '$', 'i') } });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        // If category not found, return empty results
        filter.category = null;
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

    // Remove null filters
    Object.keys(filter).forEach(key => {
      if (filter[key] === null || filter[key] === undefined) {
        delete filter[key];
      }
    });

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
    const categories = await Category.find({ isActive: true });
    console.log("Found", allListings.length, "listings and", categories.length, "categories");
    console.log("Category filter:", category);
    
    // Set message for empty results
    let noResultsMessage = '';
    if (allListings.length === 0) {
     if (category) {
  noResultsMessage = `No listings found for category: ${category}`;
} else if (q) {
  noResultsMessage = `No listings found for search: "${q}"`;
} else {
  noResultsMessage = 'No listings found. Try adjusting your filters.';
}

    }
    
    res.render("listings/index.ejs", { 
      allListings, 
      category, 
      categories, 
      location, 
      q, 
      sort, 
      minPrice, 
      maxPrice,
      noResultsMessage
    });
  } catch (error) {
    console.error("ERROR loading listings:", error.message);
    res.status(500).render("error.ejs", { message: "Failed to load listings" });
  }
});

// GET /listings/new - Render the new listing form
router.get("/new", isLoggedIn, async (req, res) => {
  console.log("\n" + "=".repeat(60));
  console.log("GET /listings/new");
  console.log("User:", req.user ? { id: req.user._id, email: req.user.email } : "NOT LOGGED IN");
  console.log("=".repeat(60));
 
  try {
    const categories = await Category.find({ isActive: true });
    console.log("Found", categories.length, "categories");
    res.render("listings/new.ejs", { categories });
  } catch (error) {
    console.error("ERROR loading categories:", error.message);
    res.status(500).render("error.ejs", { message: "Failed to load form" });
  }
});

// GET /listings/:id - Show individual listing
router.get("/:id", async (req, res) => {
  console.log("\n" + "=".repeat(60));
  console.log("GET /listings/:id");
  console.log("Listing ID:", req.params.id);
  console.log("=".repeat(60));
   
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("reviews")
      .populate("owner")
      .populate("category");
     
    if (!listing) {
      console.log("Listing not found");
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }
     
    console.log("Found listing:", listing.title);
    console.log("Image URL:", listing.image?.url);
    res.render("listings/show.ejs", { listing });
  } catch (error) {
    console.error("ERROR loading listing:", error.message);
    req.flash("error", "Failed to load listing");
    res.redirect("/listings");
  }
});

// POST /listings - Create new listing with file upload
router.post("/", isLoggedIn, upload.single("image"), handleMulterError, async (req, res) => {
  console.log("\n" + "=".repeat(60));
  console.log("POST /listings - NEW LISTING REQUEST");
  console.log("=".repeat(60));

  // 1. Log all headers
  console.log("\n--- REQ.HEADERS ---");
  console.log("content-type:", req.get("content-type"));
  console.log("origin:", req.get("origin"));
  console.log("user-agent:", req.get("user-agent"));
  console.log("authorization:", req.get("authorization") ? "PRESENT" : "ABSENT");

  // 2. Log user info
  console.log("\n--- USER INFO ---");
  if (req.user) {
    console.log("user._id:", req.user._id);
    console.log("user.email:", req.user.email);
  } else {
    console.error("ERROR: User not logged in!");
    return res.status(401).json({ error: "You must be logged in to create a listing" });
  }

  // 3. Log body (all fields)
  console.log("\n--- REQ.BODY ---");
  console.log("req.body:", JSON.stringify(req.body, null, 2));
  
  console.log("\n--- FORM FIELD VALUES ---");
  if (req.body.listing) {
    console.log("listing[title]:", req.body.listing.title);
    console.log("listing[description]:", req.body.listing.description);
    console.log("listing[price]:", req.body.listing.price);
    console.log("listing[country]:", req.body.listing.country);
    console.log("listing[location]:", req.body.listing.location);
    console.log("listing[category]:", req.body.listing.category);
  } else {
    console.log("WARNING: req.body.listing is undefined!");
    console.log("Form fields should use name='listing[fieldname]'");
  }

  // 4. Log file info
  console.log("\n--- REQ.FILE ---");
  if (req.file) {
    console.log("fieldname:", req.file.fieldname);
    console.log("originalname:", req.file.originalname);
    console.log("mimetype:", req.file.mimetype);
    console.log("size:", req.file.size, "bytes");
    console.log("destination:", req.file.destination);
    console.log("filename:", req.file.filename);
    console.log("path:", req.file.path);
  } else {
    console.log("WARNING: req.file is undefined - no file uploaded");
  }

  // 5. Validate required fields
  console.log("\n--- VALIDATION ---");
  const listingData = req.body.listing;
  
  if (!listingData) {
    console.error("ERROR: No listing data in request body");
    return res.status(400).json({ error: "No listing data - form must use name='listing[fieldname]'" });
  }

  const requiredFields = ["title", "price", "location", "country", "category"];
  for (const field of requiredFields) {
    if (!listingData[field]) {
      console.error(`ERROR: Missing required field: ${field}`);
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }
  console.log("All required fields present");

  // 6. Build listing object
  console.log("\n--- BUILDING LISTING OBJECT ---");
  const listingObj = {
    title: listingData.title,
    description: listingData.description || "",
    price: parseInt(listingData.price, 10),
    location: listingData.location,
    country: listingData.country,
    category: listingData.category,
    owner: req.user._id,
  };

  // Handle image if uploaded
  if (req.file) {
    listingObj.image = {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename
    };
    console.log("Image added to listing:", listingObj.image);
  } else {
    listingObj.image = {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      filename: "placeholder"
    };
    console.log("No image uploaded, using placeholder");
  }

  console.log("listingObj:", JSON.stringify(listingObj, null, 2));

  // 7. Save to MongoDB
  console.log("\n--- SAVING TO MONGODB ---");
  try {
    const newListing = new Listing(listingObj);
    await newListing.save();
    
    console.log("\n--- DB SAVE SUCCESS ---");
    console.log("newListing._id:", newListing._id);
    console.log("newListing.title:", newListing.title);
    console.log("newListing.price:", newListing.price);
    console.log("newListing.location:", newListing.location);
    console.log("newListing.country:", newListing.country);
    console.log("newListing.image:", newListing.image);
    
    // 8. Send success response and redirect
    console.log("\n--- SENDING RESPONSE ---");
    console.log("Redirecting to: /listings/" + newListing._id);
    
    req.flash("success", "New listing created successfully!");
    res.redirect(`/listings/${newListing._id}`);
    
  } catch (error) {
    console.error("\n--- DB SAVE ERROR ---");
    console.error("error.name:", error.name);
    console.error("error.message:", error.message);
    console.error("error.code:", error.code);
    
    if (error.errors) {
      console.error("Validation errors:");
      for (const key in error.errors) {
        console.error(`  ${key}:`, error.errors[key].message);
      }
    }
    
    console.error("error.stack:", error.stack);
    
    res.status(500).json({
      error: "Failed to save listing to database",
      details: error.message,
      validationErrors: error.errors ? Object.keys(error.errors).map(k => ({ field: k, message: error.errors[k].message })) : []
    });
  }
});

// GET /listings/:id/edit - Render edit form
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  console.log("\n" + "=".repeat(60));
  console.log("GET /listings/:id/edit");
  console.log("Listing ID:", req.params.id);
  console.log("=".repeat(60));
  
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }
    
    const categories = await Category.find({ isActive: true });
    console.log("Found listing:", listing.title);
    res.render("listings/edit.ejs", { listing, categories });
  } catch (error) {
    console.error("ERROR loading edit form:", error.message);
    req.flash("error", "Failed to load edit form");
    res.redirect("/listings");
  }
});

// PUT /listings/:id - Update listing
router.put("/:id", isLoggedIn, upload.single("image"), handleMulterError, async (req, res) => {
  console.log("\n" + "=".repeat(60));
  console.log("PUT /listings/:id");
  console.log("Listing ID:", req.params.id);
  console.log("=".repeat(60));
  
  try {
    const listingData = req.body.listing;
    if (!listingData) {
      throw new Error("No listing data in request body");
    }
    
    // Parse price
    if (listingData.price) {
      listingData.price = parseInt(listingData.price, 10);
    }
    
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    
    // Update fields
    Object.assign(listing, listingData);
    
    // Handle new image if uploaded
    if (req.file) {
      listing.image = {
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename
      };
      console.log("Updated image:", listing.image);
    }
    
    await listing.save();
    console.log("Listing updated successfully:", listing._id);
    
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
  } catch (error) {
    console.error("ERROR updating listing:", error.message);
    req.flash("error", error.message || "Failed to update listing");
    res.redirect(`/listings/${req.params.id}/edit`);
  }
});

// DELETE /listings/:id - Delete listing
router.delete("/:id", isLoggedIn, async (req, res) => {
  console.log("\n" + "=".repeat(60));
  console.log("DELETE /listings/:id");
  console.log("Listing ID:", req.params.id);
  console.log("=".repeat(60));
  
  try {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);
    if (deletedListing) {
      console.log("Listing deleted:", deletedListing._id);
    } else {
      console.log("Listing not found");
    }
    
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  } catch (error) {
    console.error("ERROR deleting listing:", error.message);
    req.flash("error", "Failed to delete listing");
    res.redirect("/listings");
  }
});

module.exports = router;