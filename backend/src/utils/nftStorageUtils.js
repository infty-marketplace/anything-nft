const fs = require('fs');
const mime = require('mime');
const path = require('path');
const axios = require('axios');
const { NFTStorage, File } = require('nft.storage');

function ipfsToHttps(url) {
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
}

function urlToCid(url) {
    const regex = new RegExp('https://ipfs.io/ipfs/([a-z0-9]+)/', 'g');
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
    await nftstorage.delete(urlToCid(url)).catch((e) => {
        // if it does not exist, we can ignore the error and move on
        if (e.message === 'NFT not found') return;
        throw e;
    });
}

async function getImageUrl(metadataUrl) {
    for (let i = 0; i < 10; i++) {
        const res = await axios.get(metadataUrl);
        if (res && res.data.image) {
            return ipfsToHttps(res.data.image);
        }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
}
module.exports = { upload, getImageUrl, burn };
