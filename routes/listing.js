const express = require("express");
const router = express.Router();
const { upload, handleMulterError } = require("../multerDiskConfig.js");
const { isLoggedIn } = require("../middleware.js");
const Listing = require("../models/listing.js");
const Category = require("../models/category.js");

// GET /listings - Index page (all listings)
router.get("/", async (req, res) => {
  try {
    const { category, location, q, sort, minPrice, maxPrice } = req.query;
    let filter = {};

    // Category filter - use case-insensitive name matching
    if (category && category !== 'All') {
      const categoryDoc = await Category.findOne({ name: { $regex: new RegExp('^' + category + '$', 'i') } });
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
    res.status(500).render("error.ejs", { message: "Failed to load listings" });
  }
});

// GET /listings/new - Render the new listing form
router.get("/new", isLoggedIn, async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.render("listings/new.ejs", { categories });
  } catch (error) {
    res.status(500).render("error.ejs", { message: "Failed to load form" });
  }
});

// GET /listings/:id - Show individual listing
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("reviews")
      .populate("owner")
      .populate("category");
      
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }
      
    res.render("listings/show.ejs", { listing });
  } catch (error) {
    req.flash("error", "Failed to load listing");
    res.redirect("/listings");
  }
});

// POST /listings - Create new listing with file upload
router.post("/", isLoggedIn, upload.single("image"), handleMulterError, async (req, res) => {
  try {
    const listingData = req.body.listing;
    
    if (!listingData) {
      return res.status(400).json({ error: "No listing data - form must use name='listing[fieldname]'" });
    }

    const requiredFields = ["title", "price", "location", "country", "category"];
    for (const field of requiredFields) {
      if (!listingData[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    const listingObj = {
      title: listingData.title,
      description: listingData.description || "",
      price: parseInt(listingData.price, 10),
      location: listingData.location,
      country: listingData.country,
      category: listingData.category,
      owner: req.user._id,
    };

    if (req.file) {
      listingObj.image = {
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename
      };
    } else {
      listingObj.image = {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        filename: "placeholder"
      };
    }

    const newListing = new Listing(listingObj);
    await newListing.save();
    
    req.flash("success", "New listing created successfully!");
    res.redirect(`/listings/${newListing._id}`);
    
  } catch (error) {
    res.status(500).json({
      error: "Failed to save listing to database",
      details: error.message,
      validationErrors: error.errors ? Object.keys(error.errors).map(k => ({ field: k, message: error.errors[k].message })) : []
    });
  }
});

// GET /listings/:id/edit - Render edit form
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }
    
    const categories = await Category.find({ isActive: true });
    res.render("listings/edit.ejs", { listing, categories });
  } catch (error) {
    req.flash("error", "Failed to load edit form");
    res.redirect("/listings");
  }
});

// PUT /listings/:id - Update listing
router.put("/:id", isLoggedIn, upload.single("image"), handleMulterError, async (req, res) => {
  try {
    const listingData = req.body.listing;
    if (!listingData) {
      throw new Error("No listing data in request body");
    }
    
    if (listingData.price) {
      listingData.price = parseInt(listingData.price, 10);
    }
    
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }
    
    Object.assign(listing, listingData);
    
    if (req.file) {
      listing.image = {
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename
      };
    }
    
    await listing.save();
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
  } catch (error) {
    req.flash("error", error.message || "Failed to update listing");
    res.redirect(`/listings/${req.params.id}/edit`);
  }
});

// DELETE /listings/:id - Delete listing
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  } catch (error) {
    req.flash("error", "Failed to delete listing");
    res.redirect("/listings");
  }
});

module.exports = router;