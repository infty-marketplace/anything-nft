const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const albumSchema = new Schema({
    title: { type: String, required: true },
    album_id: { type: String, required: true },
    description: { type: String },
    file: { data: Buffer, contentType: String },
    status: { type: String },

    price: { type: Number, required: true },
    currency: { type: String, required: true },

    nft_ids: { type: [String] },
    owner: { type: String },
});

const Album = mongoose.model("Album", albumSchema, "albums");

module.exports = Album;
