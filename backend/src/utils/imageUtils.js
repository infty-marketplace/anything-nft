const fs = require("fs");
const blockhash = require("blockhash-core");
const {imageFromBuffer, getImageData} = require("@canvas/image");

async function hash(imgPath) {
    try {
        const data = await readFile(imgPath);
        const hash = await blockhash.bmvbhash(getImageData(data), 8);
        return hexToBin(hash);
    } catch (error) {
        console.log(error);
    }
}

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) reject(err);
            resolve(imageFromBuffer(data));
        });
    });
}

function hexToBin(hexString) {
    const hexBinLookup = {
        0: "0000",
        1: "0001",
        2: "0010",
        3: "0011",
        4: "0100",
        5: "0101",
        6: "0110",
        7: "0111",
        8: "1000",
        9: "1001",
        a: "1010",
        b: "1011",
        c: "1100",
        d: "1101",
        e: "1110",
        f: "1111",
        A: "1010",
        B: "1011",
        C: "1100",
        D: "1101",
        E: "1110",
        F: "1111",
    };
    let result = "";
    for (i = 0; i < hexString.length; i++) {
        result += hexBinLookup[hexString[i]];
    }
    return result;
}

function calculateSimilarity(hash1, hash2) {
    let similarity = 0;
    hash1Array = hash1.split("");
    hash1Array.forEach((bit, index) => {
        hash2[index] === bit ? similarity++ : null;
    });
    return similarity / hash1.length;
}

async function compareImages(imgPath1, imgPath2) {
    const hash1 = await hash(imgPath1);
    const hash2 = await hash(imgPath2);
    return calculateSimilarity(hash1, hash2);
}

module.exports = {hash, calculateSimilarity, compareImages};
