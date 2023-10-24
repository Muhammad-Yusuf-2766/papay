const path = require("path");
const multer = require("multer");
const uuid = require("uuid");
const { uuidV4 } = require("mongodb/lib/core/utils");

const product_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/products');
    },
    filename: function(req, file, cb) {
        console.log("New file is uploaded:", file);
        const extension = path.parse(file.originalname).ext;
        const random_name = uuid.v4() + extension;

        cb(null, random_name)
    },
});

module.exports.uploadProductImage = multer({storage: product_storage})
