const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const supportSchema = new Schema(
    {
        from: { type: String, required: true },
        to: { type: String, required: true },
        amount: { type: Number, required: true },
        message: { type: String },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const Support = mongoose.model("Support", supportSchema, "supports");

module.exports = Support;
