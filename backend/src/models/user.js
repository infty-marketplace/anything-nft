const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
<<<<<<< HEAD
    address: { type: String, required: true },
=======
>>>>>>> 17a243c88ae3af3df708f20dbe917771211dcbbb
    description: { type: String },
    nft_ids: { type: [String] },
    album_ids: { type: [String] },
    profile_picture: { data: Buffer, contentType: String },

});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;