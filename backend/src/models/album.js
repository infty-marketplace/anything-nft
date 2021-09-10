const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const albumSchema = new Schema(
    {
        title: { type: String, required: true },
        album_id: { type: String, required: true },
        description: { type: String, default: "" },
        file: { type: String },
        status: { type: String, require: true },

        price: { type: Number },
        currency: { type: String },

        nft_ids: { type: [String], require: true },
        owner: { type: String, require: true },
        author: { type: String, required: true },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const Album = mongoose.model("Album", albumSchema, "albums");

module.exports = Album;
