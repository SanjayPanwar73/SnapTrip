const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  icon: {
    type: String,
    required: true, // FontAwesome class or image URL
  },
  slug: {
    type: String,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Create slug from name before saving
categorySchema.pre('save', async function() {
  // Generate slug if name is modified OR if this is a new document
  if ((this.isModified('name') || this.isNew) && this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  // Fallback slug if name is empty
  if (!this.slug) {
    this.slug = 'category-' + Date.now();
  }
  // No next() needed for async pre hooks
});

// Note: slug and name already have indexes from unique: true
categorySchema.index({ isActive: 1 });

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
