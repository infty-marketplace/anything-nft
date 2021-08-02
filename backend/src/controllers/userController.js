const { User } = require("../models");

const authUser = async (req, res) => {
    return res.status(200).send();
};

const getUser = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }

    const user = await User.findOne(body.address);
    if (!user) {
        return res.status(404).json({ error: "user not found" });
    }
    res.send(user);
};

module.exports = {
    authUser,
    getUser,
};
