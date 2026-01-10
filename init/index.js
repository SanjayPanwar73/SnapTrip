const mongoose = require("mongoose");
const initData = require("./data.js");
const sampleData = require("./sampleData.js");
const Listing = require("../models/listing.js");
const Category = require("../models/category.js");

if(process.env.NODE_ENV != "production"){ require('dotenv').config(); } const MONGO_URL = process.env.ATLASDB_URL;


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Category.deleteMany({});

  // Seed categories first with slugs generated
  const categoriesToSeed = sampleData.categories.map(cat => ({
    ...cat,
    slug: cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }));
  
  const categories = await Category.insertMany(categoriesToSeed);
  console.log("Categories seeded:", categories.length);

  // Create a map of category names to their ObjectIds
  const categoryMap = {};
  categories.forEach(cat => {
    categoryMap[cat.name] = cat._id;
  });

  // Define coordinates for each location
  const locationCoordinates = {
    "Malibu": [-118.7798, 34.0259],
    "New York City": [-74.0060, 40.7128],
    "Aspen": [-106.8175, 39.1911],
    "Florence": [11.2558, 43.7696],
    "Portland": [-122.6784, 45.5152],
    "Cancun": [-86.8515, 21.1619],
    "Lake Tahoe": [-120.0324, 39.0968],
    "Los Angeles": [-118.2437, 34.0522],
    "Verbier": [7.2286, 46.0964],
    "Serengeti National Park": [34.8333, -2.3333],
    "Amsterdam": [4.9041, 52.3676],
    "Fiji": [178.0650, -17.7134],
    "Cotswolds": [-1.7073, 51.8331],
    "Boston": [-71.0589, 42.3601],
    "Bali": [115.1889, -8.3405],
    "Banff": [-115.5708, 51.1784],
    "Miami": [-80.1918, 25.7617],
    "Phuket": [98.3923, 7.8804],
    "Scottish Highlands": [-4.2026, 57.4778],
    "Dubai": [55.2708, 25.2048],
    "Montana": [-110.3626, 46.8797],
    "Mykonos": [25.3287, 37.4467],
    "Costa Rica": [-83.7534, 9.7489],
    "Charleston": [-79.9311, 32.7765],
    "Tokyo": [139.6917, 35.6895],
    "New Hampshire": [-71.5724, 43.1939],
    "Maldives": [73.2207, 3.2028]
  };

  // Map old category names to new category ObjectIds
  const categoryNameMapping = {
    "Trending": "Cities",
    "Room": "Hotels",
    "Iconic cities": "Cities",
    "Mountains": "Mountains",
    "Amazing pools": "Hotels",
    "Camping": "Adventure",
    "Farms": "Villages",
    "Artic": "Adventure",
    "Domes": "Hotels",
    "Boats": "Hotels"
  };

  initData.data = initData.data.map((obj) => {
    const coordinates = locationCoordinates[obj.location] || [-118.2437, 34.0522];
    const newCategoryName = categoryNameMapping[obj.category] || "Hotels";
    return {
      ...obj,
      owner: "6958c19d1cad90757a1112e0",
      category: categoryMap[newCategoryName],
      geometry: { type: "Point", coordinates: coordinates }
    };
  });

  await Listing.insertMany(initData.data);
  console.log("Listings initialized with category references");
  console.log("Database initialization complete!");
};

initDB();
