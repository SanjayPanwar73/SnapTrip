const cloudinary = require('cloudinary');
const {CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowerdformat: ["png","jpg,","jpeg","webp"], // supports promises as well
    public_id: (req, file) => 'computed-filename-using-request',
  },
});

module.exports={
    cloudinary,
    storage,
}