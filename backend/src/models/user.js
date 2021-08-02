const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String },
    address: { type: String, required: true },
    description: { type: String, default: '' },
    nft_ids: { type: [String], default: [] },
    album_ids: { type: [String], default: [] },
    profile_picture: { data: Buffer, contentType: String },

}, {
    timestamps: {
        currentTime: () => Math.floor(Date.now() / 1000),
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
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
