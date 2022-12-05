const mongoose = require("mongoose");

mongoose
    .connect(`mongodb+srv://inftyMarket:${process.env.MONGODB_PASSWORD}@cluster0.bo5ay04.mongodb.net`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch((e) => {
        console.error("Connection error", e.message);
    });
mongoose.set("useFindAndModify", false);

const db = mongoose.connection;

module.exports = db;
