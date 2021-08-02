const { User } = require("../models");

function logout(req, res, success, error) {
    try {
        req.session.username = null;
        success();
    } catch (e) {
        error("Error logging out.");
    }
}

function login(req, res, success, error) {
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
        success();
    }

    function onErrorLogin() {
        error("Invalid address");
    }
}

const authUser = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }

    login(
        req,
        res,
        () => {
            res.json({ success: true });
        },
        (error) => {
            res.json({ success: false, errorMessage: error });
        }
    );
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
