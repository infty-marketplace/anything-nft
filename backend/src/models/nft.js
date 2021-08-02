const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nftSchema = new Schema({
    title: { type: String, required: true },
    nft_id: { type: String, required: true },
    description: { type: String, default: '' },
    file: { type: { data: Buffer, contentType: String }, required: true },

    status: { type: String, required: true },

    price: { type: Number, required: true },
    currency: { type: String, required: true },

    album_id: { type: String },
    owner: { type: [{ address: String, percentage: Number }], required: true },

    draw_smart_contract_address: { type: String },
    share_smart_contract_address: { type: String },

}, {
    timestamps: {
        currentTime: () => Math.floor(Date.now() / 1000),
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const Nft = mongoose.model("Nft", nftSchema, "nfts");

module.exports = Nft;
