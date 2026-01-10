const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const categoryController = require("../controllers/categories.js");
const { isLoggedIn } = require("../middleware.js");

// Index Route - Show all categories
router.get("/", wrapAsync(categoryController.index));

// New Route - Show new category form
router.get("/new", isLoggedIn, categoryController.renderNewForm);

// Create Route - Create new category
router.post("/", isLoggedIn, wrapAsync(categoryController.createCategory));

// Show Route - Show single category
router.get("/:id", wrapAsync(categoryController.showCategory));

// Edit Route - Show edit form
router.get("/:id/edit", isLoggedIn, wrapAsync(categoryController.renderEditForm));

// Update Route - Update category
router.put("/:id", isLoggedIn, wrapAsync(categoryController.updateCategory));

// Delete Route - Delete category
router.delete("/:id", isLoggedIn, wrapAsync(categoryController.destroyCategory));

// Toggle active status
router.put("/:id/toggle", isLoggedIn, wrapAsync(categoryController.toggleActive));

module.exports = router;
