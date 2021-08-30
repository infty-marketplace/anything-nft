require("dotenv").config();
const { makeid } = require("./helpers");
const { Conflux } = require("js-conflux-sdk");
const s3 = require("../database/s3");

// cfx init
const cfx = new Conflux({
    url: "https://test.confluxrpc.com",
    networkId: 1,
});
const managerAccount = cfx.wallet.addPrivateKey(process.env.MANAGER_KEY);
const { minterAbi } = require("../assets/InftyNft.json");
const { raffleAbi } = require("../assets/Raffle.json");

const minterContract = cfx.Contract({ minterAbi, address: process.env.MINTER_ADDRESS });
const raffleCintract = cfx.Contract({ raffleAbi, address: process.env.MINTER_ADDRESS });

async function nextTokenId() {
    return (await minterContract.totalSupply()) + 1n;
}

async function mint(addr, uri) {
    return await minterContract.mint(addr, uri).sendTransaction({ from: process.env.MANAGER_ADDRESS }).executed();
}

async function createRaffle(details) {
    return await minterContract
        .createRaffle(details.quantity, details.unit_price, details.owner, details.nft_id)
        .sendTransaction({ from: process.env.MANAGER_ADDRESS })
        .executed();
}

async function generateUri(req, imageUri, sha) {
    const metaData = {
        title: "Asset Metadata",
        type: "object",
        properties: {
            name: {
                type: "string",
                description: req.body.title,
            },
            description: {
                type: "string",
                description: req.body.description,
            },
            image: {
                type: "string",
                description: imageUri,
            },
        },
    };
    const data = await s3
        .putObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: sha,
            Body: JSON.stringify(metaData),
            ContentType: "application/json",
        })
        .promise();
    return `https://conflux-infty.s3.amazonaws.com/${sha}`;
}

// TODO
function actualTokenId(addr, uri, guess) {
    return makeid(5);
}
module.exports = {
    nextTokenId,
    mint,
    actualTokenId,
    generateUri,
};
