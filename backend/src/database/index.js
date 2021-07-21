const mongoose = require("mongoose");

mongoose
    .connect(
        "mongodb+srv://cluster0.q6hzh.mongodb.net/myFirstDatabase",
        {useNewUrlParser: true, useUnifiedTopology: true}
    )
    .catch(e => {
        console.error("Connection error", e.message);
    });
const db = mongoose.connection;

module.exports = db;