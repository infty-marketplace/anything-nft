const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    description: { type: String },
    nft_ids: { type: [String] },
    album_ids: { type: [String] },
    profilePicture: { data: Buffer, contentType: String },

});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;