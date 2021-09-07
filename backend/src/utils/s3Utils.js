const s3 = require("../database/s3");
const fs = require("fs");
require("dotenv").config();

async function uploadImage(path, key) {
    const fileToUpload = fs.createReadStream(path);
    const s3UploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: fileToUpload,
    };
    const stored = await s3.upload(s3UploadParams).promise();
    return stored.Location
}

module.exports = {
    uploadImage
}