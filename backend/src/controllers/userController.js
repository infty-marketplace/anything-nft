const User = require("../models/user");
const Nft = require("../models/nft");
const Transaction = require("../models/transaction");
const {format, sign, PersonalMessage} = require("js-conflux-sdk");
const Support = require("../models/support");

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

    if (!body.sig || !body.msg) {
        return res.status(400).json({error: "invalid request"});
    }

    let publicKey;
    try {
        publicKey = PersonalMessage.recover(
            body.sig,
            body.msg,
        );
    } catch (e) {
        return res.status(401).json({error: "invalid request"});
    }

    const timestamp = parseInt(body.msg.substring(body.msg.search(/[0-9]/)));

    if (Date.now() - timestamp > 60000) {
        return res.status(425).json({error: "possible replay attack"});
    }

    const testnet = format.address(sign.publicKeyToAddress(publicKey), 1);
    const mainnet = format.address(sign.publicKeyToAddress(publicKey), 1029);
    if (body.address != testnet && body.address != mainnet) {
        return res.status(500).send("recovered address doens't match");
    }
    req.session.address = mainnet;
    res.status(200).send();
};

const getUser = async (req, res) => {
    if (!req.params.address) {
        return res.status(400).json({error: "invalid request"});
    }

    const user = await User.findOne({address: req.params.address});
    if (!user) {
        return res.status(404).json({error: "user not found"});
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
            profile_picture:
                "https://bafybeiasgari2dccg4fcgrkbluberhlhmaq4noxhndz4ktn7pfdiakpp5m.ipfs.nftstorage.link/undraw_profile_pic_ic5t.png",
        });
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
                profile_picture: req.body.profile_picture,
            },
            (err) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.send("User profile updated.");
                }
            }
        );
    }
};

const getTransactions = async (req, res) => {
    if (!req.params.address) {
        return res.status(400).json({error: "Invalid request"});
    }
    const transactions = await Transaction.find({
        $or: [{buyer: req.params.address}, {seller: req.params.address}],
    }).sort({created_at: "desc"});
    res.send(transactions);
};

const setAvatarToNft = async (req, res) => {
    // TODO: validate input, return status code correspondingly
    const url = (await Nft.findOne({nft_id: req.body.nft_id})).file;
    await User.findOneAndUpdate({address: req.body.address}, {profile_picture: url});
    res.status(200).send({url});
};

const supportUser = async (req, res) => {
    new Support(req.body).save((err) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).send();
    });
};

const getSupports = async (req, res) => {
    const [direction, address] = [req.params.direction, req.params.address];
    if (!direction || !address) {
        return res.status(400).json({error: "Invalid request"});
    }
    let query = {};
    query[direction + "Address"] = address;
    const data = await Support.find(query).sort({created_at: "desc"});
    return res.send(data);
};

module.exports = {
    authUser,
    getUser,
    updateProfile,
    getTransactions,
    setAvatarToNft,
    supportUser,
    getSupports,
};
