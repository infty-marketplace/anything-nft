const Nft = require("../models/nft");
const Album = require("../models/album");
const Draw = require("../models/draw");
const constants = require("../constants");

const getNft = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }

    const nft = await Nft.findOne(body.nft_id);
    if (!nft) {
        return res.status(404).json({ error: "nft not found" });
    }
    res.send(nft);
};

const getAlbum = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }

    const album = await Album.findOne(body.album_id);
    if (!album) {
        return res.status(404).json({ error: "album not found" });
    }
    res.send(album);
};

const getDraw = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }

    const draw = await Draw.findOne(body.draw_id);
    if (!draw) {
        return res.status(404).json({ error: "draw not found" });
    }
    res.send(draw);
};

// return a list of on sale NFT's id from cursor position, limit amount
const getMarket = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }

    const limit = body.limit;
    const offset = body.offset;

    const nftQuery = Nft.find({ status: constants.STATUS_SALE });
    const albumQuery = Album.find({ status: constants.STATUS_SALE });
    nftQuery.sort({ updatedAt: "desc" }).skip(offset);
    albumQuery.sort({ updatedAt: "desc" }).skip(offset);

    if (limit) {
        nftQuery.limit(limit + 1);
        albumQuery.limit(limit + 1);
    }

    let nftIds = [];
    nftQuery.exec((error, doc) => {
        if (error) {
            res.status(500).json(error);
            return;
        }
        nftIds.push(doc);
    });

    let albumIds = [];
    albumQuery.exec((error, doc) => {
        if (error) {
            res.status(500).json(error);
            return;
        }
        albumIds.push(doc);
    });

    res.send({ nft_ids: nftIds, album_ids: albumIds });
};

module.exports = {
    getNft,
    getAlbum,
    getDraw,
    getMarket,
};
