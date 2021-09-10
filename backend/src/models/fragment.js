const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../constants");

const nftSchema = new Schema(
    {
        nft_id: { type: String, required: true },

        status: {
            type: String,
            required: true,
            enum: [constants.STATUS_PRIVATE, constants.STATUS_SALE, constants.STATUS_DRAW],
        },

        price: { type: Number },
        currency: { type: String, enum: ["cfx"] },
        percentage: { type: Number, required: true },
        owner: { type: String, required: true },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const Fragment = mongoose.model("Fragment", nftSchema, "fragments");

module.exports = Fragment;
