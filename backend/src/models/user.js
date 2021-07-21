const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String },
    nft_ids: { type: [String] },
    album_ids: { type: [String] },
    profile_picture: { data: Buffer, contentType: String },

});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;