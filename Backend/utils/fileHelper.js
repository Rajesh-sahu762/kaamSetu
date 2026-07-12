const fs = require("fs");
const path = require("path");


// =========================================
// Generate Unique File Name
// =========================================

const generateFileName = (folderPath, originalName) => {

    const extension = path.extname(originalName);

    const baseName = path.basename(originalName, extension);

    let fileName = `${baseName}${extension}`;

    let counter = 1;

    while (fs.existsSync(path.join(folderPath, fileName))) {

        fileName = `${baseName}-${counter}${extension}`;

        counter++;
    }

    return fileName;
};


// =========================================
// Delete Old File
// =========================================

const deleteFile = (filePath) => {

    if (!filePath) return;

    if (fs.existsSync(filePath)) {

        fs.unlinkSync(filePath);

    }

};


module.exports = {

    generateFileName,

    deleteFile

};