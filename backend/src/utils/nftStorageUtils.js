const fs = require("fs");
const mime = require("mime");
const path = require("path");
const axios = require("axios");
const { NFTStorage, File } = require("nft.storage");

function ipfsToHttps(url) {
    return url.replace("ipfs://", "https://ipfs.io/ipfs/");
}

function urlToCid(url) {
    const regex = new RegExp("https://ipfs.io/ipfs/([a-z0-9]+)/", "g");
    const matches = regex.exec(url);
    return matches[1];
}

async function upload(filePath, name, description) {
    const content = await fs.promises.readFile(filePath);
    const type = mime.getType(filePath);
    const image = new File([content], path.basename(filePath), { type });

    const nftstorage = new NFTStorage({ token: process.env.NFT_STORAGE_KEY });
    const receipt = await nftstorage.store({ image, name, description });
    const metadataUrl = ipfsToHttps(receipt.url);
    return metadataUrl;
}

async function burn(url) {
    const nftstorage = new NFTStorage({ token: process.env.NFT_STORAGE_KEY });
    await nftstorage.delete(urlToCid(url));
}

async function getImageUrl(metadataUrl) {
    const res = await axios.get(metadataUrl);
    return ipfsToHttps(res.data.image);
}
module.exports = { upload, getImageUrl };
