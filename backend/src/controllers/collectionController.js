const { Nft, Draw, Album } = require("../models");
const ApiError = require("../utils/ApiError");

const getNft = async (req, res) => {
    const nft = await Nft.findOne(req.params.nft_id);
    if (!nft) {
        throw new ApiError(httpStatus.NOT_FOUND, "NFT not found");
    }
    res.send(nft);
};

const getAlbum = async (req, res) => {
    const album = await Album.findOne(req.params.album_id);
    if (!album) {
        throw new ApiError(httpStatus.NOT_FOUND, "Album not found");
    }
    res.send(album);
};

const getDraw = async (req, res) => {
    const draw = await Draw.findOne(req.params.draw_id);
    if (!draw) {
        throw new ApiError(httpStatus.NOT_FOUND, "Draw not found");
    }
    res.send(draw);
};

module.exports = {
    getNft,
    getAlbum,
    getDraw,
};
