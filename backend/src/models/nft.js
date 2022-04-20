const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../constants");

const nftSchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
        nft_id: { type: String, required: true },
        description: { type: String, default: "" },
        file: { type: String, required: true },
        metadata: { type: String, required: true },
        file_hash: { type: String, required: true },

        status: {
            type: String,
            required: true,
            enum: [constants.STATUS_PRIVATE, constants.STATUS_SALE, constants.STATUS_DRAW],
        },

        price: { type: Number },
        currency: { type: String, enum: ["cfx"] },

        album_id: { type: String },
        author: { type: String, required: true },
        owner: { type: [{ address: String, percentage: Number }], required: true },

        draw_smart_contract_address: { type: String },
        share_smart_contract_address: { type: String },
        fractional: { type: Boolean, default: false },
        fragmented: { type: Boolean },
        views: { type: Number, required: true, default: 0 },
        labels: { type: [String], default: [] },
        liked_users: { type: [String], default: [] },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const Nft = mongoose.model("Nft", nftSchema, "nfts");

module.exports = Nft;
