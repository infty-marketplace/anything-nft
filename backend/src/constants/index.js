const NFT_STATUS = Object.freeze({
    PRIVATE: "private",
    SALE: "sale",
    RAFFLE: "raffle",
});

const TRANSACTION_TYPE = Object.freeze({
    PURCHASE_NFT: "purchase nft",
});

const COLLECTION_TYPE = Object.freeze({
    NFT: "nft",
});

function constructTransactionTypeToCollectionTypeMap() {
    let temp = {};
    temp[TRANSACTION_TYPE.PURCHASE_NFT] = COLLECTION_TYPE.NFT;
    return Object.freeze(temp);
}

const TRANSACTION_TYPE_TO_COLLECTION_TYPE = constructTransactionTypeToCollectionTypeMap();

module.exports = {
    NFT_STATUS,
    TRANSACTION_TYPE,
    COLLECTION_TYPE,
    TRANSACTION_TYPE_TO_COLLECTION_TYPE,
};
