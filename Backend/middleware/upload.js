const multer = require("multer");

const path = require("path");

const fs = require("fs");

const { generateFileName } = require("../utils/fileHelper");



const upload = (folder) => {

    const uploadPath = path.join(__dirname, "..", "uploads", folder);


    // Folder automatically create ho jayega

    if (!fs.existsSync(uploadPath)) {

        fs.mkdirSync(uploadPath, { recursive: true });

    }


    const storage = multer.diskStorage({

        destination: (req, file, cb) => {

            cb(null, uploadPath);

        },

        filename: (req, file, cb) => {

            const fileName = generateFileName(

                uploadPath,

                file.originalname

            );

            cb(null, fileName);

        },

    });


    const fileFilter = (req, file, cb) => {

        const allowedTypes = [

            "image/jpeg",

            "image/jpg",

            "image/png",

            "image/webp",

        ];


        if (allowedTypes.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(

                new Error(

                    "Only JPG, JPEG, PNG and WEBP images are allowed."

                ),

                false

            );

        }

    };


    return multer({

        storage,

        fileFilter,

        limits: {

            fileSize: 2 * 1024 * 1024,

        },

    });

};


module.exports = upload;