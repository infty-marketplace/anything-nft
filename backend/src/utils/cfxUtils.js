require("dotenv").config();
const { Conflux, Drip } = require("js-conflux-sdk");
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

// Mint NFT on chain.
async function mint(addr, uri) {
    return await minterContract.mint(addr, uri).sendTransaction({ from: process.env.MANAGER_ADDRESS }).executed();
}

//TODO: the burn function is currently internal in our nft contract, make it public, redeploy it so we can use it here
async function burn(tokenId) {
    return;
    // return await minterContract.burn(tokenId).sendTransaction({ from: process.env.MANAGER_ADDRESS }).executed();
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
        from: managerAccount.address,
        to: toAddr,
        value: Drip.fromCFX(price),
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

// return the tokenId among the nfts of owner and has URI = uri.
async function actualTokenId(ownerAddr, uri) {
    const ownerBalance = await minterContract.balanceOf(ownerAddr);
    for (let i = ownerBalance - 1n; i >= 0; i--) {
        const currTokenId = await minterContract.tokenOfOwnerByIndex(ownerAddr, i);
        // if the metadata matches given uri, then return currTokenId
        if ((await minterContract.tokenURI(currTokenId)) == uri) {
            return currTokenId;
        }
    }
    return -1;
}

module.exports = {
    mint,
    burn,
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
