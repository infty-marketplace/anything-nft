const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");
const userRouter = require("./routes/userRouter");
const collectionRouter = require("./routes/collectionRouter");
const cors = require('cors')

const app = express();
const apiPort = process.env.PORT || 3001;

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api", userRouter);
app.use("/api", collectionRouter);

db.on("error", (error) =>
    console.error("MongoDB connection error: " + error.message)
);
db.once("open", () => console.log("Connected to database"));

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
