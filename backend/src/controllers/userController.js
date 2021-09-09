const User = require("../models/user");
const Transaction = require("../models/transaction");
const s3Utils = require("../utils/s3Utils")
const { makeid } = require("../utils/helpers");

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
    if (!req.params.address) {
        return res.status(400).json({ error: "invalid request" });
    }

    const user = await User.findOne({address:req.params.address});
    if (!user) {
        return res.status(404).json({ error: "user not found" });
    }
    res.send(user);
};

const updateProfile = async (req, res) => {
    // if not exist, create one
    const user = await User.findOne({address: req.body.address});
    if (!user) {
        const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address,
            description: req.body.description,
            profile_picture: 'https://ipfs.io/ipfs/QmR9aGP1cQ13sapFBfFLiuhRVSGcrMYvZPmKXNNrobwtFZ?filename=undraw_male_avatar_323b.png',
        })
        newUser.save((err) => {
            if (err) {
                return res.status(500).send(err);
            }
            return res.send("User profile created.");
        });
    } else {
        User.findOneAndUpdate(
            {address: req.body.address},
            {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                address: req.body.address,
                description: req.body.description,
                profile_picture: req.body.profile_picture
            },
            (err) => {
                if (err) {
                    res.status(500).send(err)
                } else {
                    res.send('User profile updated.')
                }
            }
        )
    }
}

const getTransactions = async (req, res) => {
    if (!req.params.address) {
        return res.status(400).json({ error: "Invalid request" });
    }

    const transactions = await Transaction.find({buyer: req.params.address});
    res.send(transactions);
}

const updateAvatar = async (req, res) => {
    const url = await s3Utils.uploadImage(req.files.file.path, makeid(16))
    await User.findOneAndUpdate({address: req.body.address}, {
        profile_picture: url
    })
    res.status(200).send({url});
}
module.exports = {
    authUser,
    getUser,
    updateProfile,
    getTransactions,
    updateAvatar
};
