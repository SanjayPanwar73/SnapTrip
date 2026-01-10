const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const Category = require("./category.js");
const { required } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
},
);


listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } })
  }
});

// Add indexes for better query performance
listingSchema.index({ location: 1 });
listingSchema.index({ category: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ owner: 1 });
listingSchema.index({ "geometry.coordinates": "2dsphere" }); // For geospatial queries
listingSchema.index({ title: "text", description: "text" }); // For text search

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
