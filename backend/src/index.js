const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database/mongodb");
const userRouter = require("./routes/userRouter");
const collectionRouter = require("./routes/collectionRouter");
const cors = require("cors");

require("dotenv").config();

const app = express();
const apiPort = process.env.PORT || 3001;

let session = require("express-session")({
    secret: "HeyWhatIsC",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 24,
    },
});
app.use(session);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", userRouter);
app.use("/api", collectionRouter);

db.on("error", (error) => console.error("MongoDB connection error: " + error.message));
db.once("open", () => console.log("Connected to database"));

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));

module.exports = app;
