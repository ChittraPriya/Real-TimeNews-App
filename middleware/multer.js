const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "news-images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],

    // 🔥 IMPORTANT FIX
    resource_type: "image",

    // optional but recommended
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});
const upload = multer({ storage });

module.exports = upload;