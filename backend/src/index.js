const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database/mongodb");
const userRouter = require("./routes/userRouter");
const nftRouter = require("./routes/nftRouter");
const cors = require("cors");
const helmet = require("helmet");

require("dotenv").config();

const app = express();

app.use(helmet());

const apiPort = process.env.PORT || 3001;

let session = require("express-session")({
    secret: "InftySecret",
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, //testing
        // maxAge: 1000 * 60 * 60 * 24 * 30, // one month
        maxAge: 1000 * 60 * 3, // testing: 3 minute
    },
});
app.use(session);

if (!process.env.PORT) {
    app.use(cors());
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", userRouter);
app.use("/api", nftRouter);

app.use("/", express.static("src/views"));
app.use("*", express.static("src/views"));

db.on("error", (error) => console.error("MongoDB connection error: " + error.message));
db.once("open", () => console.log("Connected to database"));

app.use("/*", express.static("src/views"));

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));

module.exports = app;
