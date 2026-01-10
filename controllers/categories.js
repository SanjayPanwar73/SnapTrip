const Category = require("../models/category.js");

// middleware function for Index Route - Show all categories
module.exports.index = async (req, res) => {
  const allCategories = await Category.find({}).sort({ name: 1 });
  res.render("categories/index.ejs", { allCategories });
};

// middleware function for New Route - Show new category form
module.exports.renderNewForm = (req, res) => {
  res.render("categories/new.ejs");
};

// middleware function for Show Route - Show single category
module.exports.showCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    req.flash("error", "Category you requested for does not exist!");
    res.redirect("/categories");
  }
  res.render("categories/show.ejs", { category });
};

// middleware function for Create Route - Create new category
module.exports.createCategory = async (req, res) => {
  try {
    const { name, icon, isActive } = req.body;
    
    // Check if category with same name already exists
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCategory) {
      req.flash("error", "Category with this name already exists!");
      return res.redirect("/categories/new");
    }

    const newCategory = new Category({
      name,
      icon,
      isActive: isActive === 'on' || isActive === true
    });

    await newCategory.save();
    req.flash("success", "New category created!");
    res.redirect("/categories");
  } catch (error) {
    console.error("Error creating category:", error);
    req.flash("error", error.message || "Failed to create category");
    res.redirect("/categories/new");
  }
};

// middleware function for Edit Route - Show edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    req.flash("error", "Category you requested for does not exist!");
    res.redirect("/categories");
  }
  res.render("categories/edit.ejs", { category });
};

// middleware function for Update Route - Update category
module.exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, icon, isActive } = req.body;

  try {
    // Check if another category with same name exists
    if (name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: id }
      });
      if (existingCategory) {
        req.flash("error", "Category with this name already exists!");
        return res.redirect(`/categories/${id}/edit`);
      }
    }

    const category = await Category.findById(id);
    if (!category) {
      req.flash("error", "Category not found!");
      return res.redirect("/categories");
    }

    // Update fields
    if (name) category.name = name;
    if (icon) category.icon = icon;
    category.isActive = isActive === 'on' || isActive === true;

    await category.save();
    req.flash("success", "Category updated!");
    res.redirect("/categories");
  } catch (error) {
    console.error("Error updating category:", error);
    req.flash("error", error.message || "Failed to update category");
    res.redirect(`/categories/${id}/edit`);
  }
};

// middleware function for Delete Route - Delete category
module.exports.destroyCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      req.flash("error", "Category not found!");
      return res.redirect("/categories");
    }
    req.flash("success", "Category deleted!");
    res.redirect("/categories");
  } catch (error) {
    console.error("Error deleting category:", error);
    req.flash("error", error.message || "Failed to delete category");
    res.redirect("/categories");
  }
};

// Toggle category active status
module.exports.toggleActive = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      req.flash("error", "Category not found!");
      return res.redirect("/categories");
    }

    category.isActive = !category.isActive;
    await category.save();
    
    const status = category.isActive ? "activated" : "deactivated";
    req.flash("success", `Category ${status}!`);
    res.redirect("/categories");
  } catch (error) {
    console.error("Error toggling category status:", error);
    req.flash("error", error.message || "Failed to toggle category status");
    res.redirect("/categories");
  }
};
