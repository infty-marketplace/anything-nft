const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const albumSchema = new Schema({
    title: { type: String, required: true },
    album_id: { type: String, required: true },
    description: { type: String，default: '' },
    file: { type: { data: Buffer, contentType: String } },
    status: { type: String, require: true },

    price: { type: Number, required: true },
    currency: { type: String, required: true },

    nft_ids: { type: [String], require: true },
    owner: { type: String, require: true },
}, {
    timestamps: {
        currentTime: () => Math.floor(Date.now() / 1000),
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Album = mongoose.model("Album", albumSchema, "albums");

module.exports = Album;