const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const drawSchema = new Schema({
    title: { type: String, required: true },
    draw_id: { type: String, required: true },
    description: { type: String },

    unit_price: { type: Number, required: true },
    quantity: { type: Number },
    currency: { type: String, required: true },
    deadline: { type: Number },

    nft_id: { type: String },
    owner: { type: String },
});

const Draw = mongoose.model("Draw", drawSchema, "draws");

module.exports = Draw;
