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
const { abi: minterAbi } = require("../assets/InftyNft.json");
const { abi: raffleAbi } = require("../assets/Raffle.json");

const minterContract = cfx.Contract({ abi: minterAbi, address: process.env.MINTER_ADDRESS });
const raffleContract = cfx.Contract({ abi: raffleAbi, address: process.env.RAFFLE_ADDRESS });

async function nextTokenId() {
    return (await minterContract.totalSupply());
}

// Mint NFT on chain.
async function mint(addr, uri) {
    return await minterContract.mint(addr, uri).sendTransaction({ from: process.env.MANAGER_ADDRESS }).executed();
}

// Estimate how much gas will cost if mint
async function mintEstimate(addr, uri) {
    const estimate = await minterContract.mint(addr, uri).estimateGasAndCollateral();
    return estimate.gasLimit + estimate.storageCollateralized;
}

async function createRaffle(details) {
    return await raffleContract
        .createRaffle(
            details.quantity,
            details.unit_price * 1e18,
            details.owner,
            details.nft_id.split("-")[0],
            details.nft_id.split("-")[1]
        )
        .sendTransaction({ from: process.env.MANAGER_ADDRESS })
        .executed();
}

async function drawRaffle(minter, tokenId) {
    return await raffleContract.draw(minter, tokenId).sendTransaction({ from: process.env.MANAGER_ADDRESS }).executed();
}

function decodeRaffleLog(log) {
    return raffleContract.abi.decodeLog(log);
}

async function getOwnerOnChain(tokenId) {
    return await minterContract.ownerOf(tokenId);
}

async function transferOwnershipOnChain(fromAddr, toAddr, tokenID) {
    return await minterContract
        .transferFrom(fromAddr, toAddr, tokenID)
        .sendTransaction({ from: process.env.MANAGER_ADDRESS })
        .executed();
}

async function transferCfxTo(toAddr, price) {
    const tx = {
        from: process.env.MANAGER_ADDRESS,
        to: toAddr,
        value: 1e18 * price,
        chainId: 1,
    };
    const hash = await cfx.sendTransaction(tx).executed();
}

async function generateUri(req, imageUri, sha) {
    const metaData = {
        name: req.body.title,
        description: req.body.description,
        image: imageUri,
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
    mintEstimate,
    actualTokenId,
    generateUri,
    transferOwnershipOnChain,
    transferCfxTo,
    createRaffle,
    getOwnerOnChain,
    drawRaffle,
    decodeRaffleLog,
};
