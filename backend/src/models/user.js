const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        first_name: {type: String, required: true},
        last_name: {type: String},
        address: {type: String, required: true},
        description: {type: String, default: ""},
        nft_ids: {type: [{address: String, percentage: Number}], default: []},
        album_ids: {type: [{address: String, percentage: Number}], default: []},
        profile_picture: {type: String},
        liked_nfts: {type: [String], default: []},
        used_commission_hash: {type: [{epochNumber: Number, hash: String}]},
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
