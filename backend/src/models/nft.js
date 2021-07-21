const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nftSchema = new Schema({
    title: { type: String, required: true },
    nft_id: { type: String, required: true },
    description: { type: String },
    file: { data: Buffer, contentType: String, required: true },

<<<<<<< HEAD
    status: {type: String},

    price: { type: Number, required: true },
    currency: { type: String, required: true },

    album_id: { type: String },
    owner: { type: [{address: String, percentage: Number}] },
=======
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    percentage: { type: Number, required: true },

    album_id: { type: String },
    owner: { type: String },
>>>>>>> 17a243c88ae3af3df708f20dbe917771211dcbbb

    draw_smart_contract_address: { type: String },
    share_smart_contract_address: { type: String },

});

const Nft = mongoose.model("Nft", nftSchema, "nfts");

module.exports = Nft;