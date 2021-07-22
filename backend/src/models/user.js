const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    description: { type: String },
    nft_ids: { type: [String] },
    album_ids: { type: [String] },
    profile_picture: { data: Buffer, contentType: String },
});

/**
 * Check if address is taken
 * @param {string} address - The user's address
 * @returns {Promise<boolean>}
 */
userSchema.statics.isAddressTaken = async function (address) {
    const user = await this.findOne({ address });
    return !!user;
};

const User = mongoose.model("User", userSchema, "users");

module.exports = User;