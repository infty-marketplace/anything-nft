const { Nft, Draw, Album } = require("../models");

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
    

}

module.exports = {
    getNft,
    getAlbum,
    getDraw,
    getMarket
};
