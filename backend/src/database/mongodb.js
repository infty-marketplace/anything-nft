const mongoose = require("mongoose");

mongoose
    .connect("mongodb+srv://admin:admin@cluster0.q6hzh.mongodb.net/infty", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch((e) => {
        console.error("Connection error", e.message);
    });
mongoose.set("useFindAndModify", false);

const db = mongoose.connection;

module.exports = db;
