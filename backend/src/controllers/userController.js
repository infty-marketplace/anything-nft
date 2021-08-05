const User = require("../models/user");

function logout(req, res, success, error) {
    try {
        req.session.username = null;
        success();
    } catch (e) {
        error("Error logging out.");
    }
}

const authUser = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }

    const address = req.body.address;
    const user = await User.findOne({ address });

    if (!!user) {
        onSuccessLogin();
    } else {
        onErrorLogin();
    }

    function onSuccessLogin() {
        req.session.username = address;
        req.session.loggedInCode = 5;
        res.json({ success: true });
    }

    function onErrorLogin() {
        res.json({ success: false, error: "Invalid address" });
    }
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
