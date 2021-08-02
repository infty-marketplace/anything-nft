let chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/index");
const User = require("../src/models/user");
const Nft = require("../src/models/nft");
const Transaction = require("../src/models/transaction");
const Album = require("../src/models/album");
const constants = require("../src/constants");
const expect = chai.expect;
chai.use(chaiHttp);

function getMockData() {
    const seller1 = {
        first_name: "seller1",
        address: "seller_address1",
        nft_ids: ["nft_id1", "nft_id2", "nft_id3", "nft_id4"],
        album_id: ["album_id1", "album_id2", "album3"],
    };
    const buyer1 = { first_name: "buyer1", address: "buyer_address1", nft_ids: ["nft_id2"] };
    const buyer2 = { first_name: "buyer2", address: "buyer_address2" };
    const album1 = {
        title: "album1",
        album_id: "album_id1",
        status: constants.STATUS_SALE,
        file: "file1",
        price: 100,
        currency: "cfx",
        nft_ids: ["nft_id1", "nft_id3"],
        owner: seller1.address,
    };
    const album2 = {
        title: "album2",
        album_id: "album_id2",
        status: constants.STATUS_PRIVATE,
        file: "file2",
        price: 100,
        currency: "cfx",
        nft_ids: [],
        owner: seller1.address,
    };
    const album3 = {
        title: "album3",
        album_id: "album_id3",
        status: constants.STATUS_SALE,
        file: "file3",
        price: 100,
        currency: "cfx",
        nft_ids: ["nft_id2"],
        owner: seller1.address,
    };
    const nft1 = {
        title: "nft1",
        nft_id: "nft_id1",
        album_id: "album_id1",
        status: constants.STATUS_SALE,
        file: "file1",
        price: 100,
        currency: "cfx",
        owner: [{ address: seller1.address, percentage: 1 }],
    };
    const nft2 = {
        title: "nft2",
        nft_id: "nft_id2",
        status: constants.STATUS_SALE,
        file: "file3",
        price: 100,
        currency: "cfx",
        owner: [
            { address: seller1.address, percentage: 1 },
            { address: buyer1.address, percentage: 0.5 },
        ],
    };
    const nft3 = {
        title: "nft3",
        nft_id: "nft_id3",
        album_id: "album_id1",
        status: constants.STATUS_SALE,
        file: "file3",
        price: 100,
        currency: "cfx",
        owner: [{ address: seller1.address, percentage: 1 }],
    };
    const nft4 = {
        title: "nft4",
        nft_id: "nft_id4",
        album_id: "",
        status: constants.STATUS_PRIVATE,
        file: "file4",
        price: 100,
        currency: "cfx",
        owner: [{ address: seller1.address, percentage: 1 }],
    };
    return {
        users: { seller1, buyer1, buyer2 },
        nfts: { nft1, nft2, nft3, nft4 },
        albums: { album1, album2, album3 },
    };
}

function getMockDataObject() {
    const mockDataList = [].concat.apply([], Object.entries(getMockData()));
    const mockDataObject = mockDataList.reduce((result, current) => Object.assign(result, current), {});
    return mockDataObject;
}

async function mock(mockData) {
    const entries = Object.entries(mockData);
    for (const entry of entries) {
        if (entry[0] === "users") {
            for (const data of Object.values(entry[1])) {
                await new User(data).save();
            }
        } else if (entry[0] === "nfts") {
            for (const data of Object.values(entry[1])) {
                await new Nft(data).save();
            }
        } else if (entry[0] === "albums") {
            for (const data of Object.values(entry[1])) {
                await new Album(data).save();
            }
        }
    }
}

async function unmock(mockData) {
    const entries = Object.entries(mockData);
    for (const entry of entries) {
        if (entry[0] === "users") {
            for (const data of Object.values(entry[1])) {
                await User.deleteMany({ address: data.address });
            }
        } else if (entry[0] === "nfts") {
            for (const data of Object.values(entry[1])) {
                await Nft.deleteMany({ nft_id: data.nft_id });
            }
        } else if (entry[0] === "albums") {
            for (const data of Object.values(entry[1])) {
                await Album.deleteMany({ album_id: data.album_id });
            }
        }
    }
}

describe("POST /api/purchase-nft", function () {
    const { seller1, buyer1, buyer2, nft1, nft2, nft3, nft4, album1, album2, album3 } = getMockDataObject();

    before(async () => {
        await mock(getMockData());
    });

    after(async () => {
        await unmock(getMockData());
    });

    it("should result in an error if the buyer is the owner", async () => {
        const payload = {
            nft_id: nft1.nft_id,
            buyer: seller1.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/purchase-nft").send(payload);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("buyer is the owner");
    });

    it("should transfer nft from seller1 to buyer1", async () => {
        const payload = {
            nft_id: nft1.nft_id,
            buyer: buyer1.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/purchase-nft").send(payload);
        expect(res.status).to.equal(200);
        const nft = await Nft.findOne({ nft_id: nft1.nft_id });
        expect(nft.owner[0].address).to.equal(buyer1.address);

        const seller = await User.findOne({ address: seller1.address });
        expect(seller.nft_ids).not.to.contains(nft1.nft_id);

        const buyer = await User.findOne({ address: buyer1.address });
        expect(buyer.nft_ids).to.contains(nft1.nft_id);
    });

    it("should transfer nft and album from seller1 to buyer1", async () => {
        const payload = {
            nft_id: nft3.nft_id,
            buyer: buyer1.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/purchase-nft").send(payload);
        expect(res.status).to.equal(200);
        const nft = await Nft.findOne({ nft_id: nft3.nft_id });
        expect(nft.owner[0].address).to.equal(buyer1.address);

        const album = await Album.findOne({ album_id: nft3.album_id });
        expect(album.owner).to.equal(buyer1.address);

        const seller = await User.findOne({ address: seller1.address });
        expect(seller.nft_ids).not.to.contains(nft3.nft_id);
        expect(seller.album_ids).not.to.contains(album1.album_id);

        const buyer = await User.findOne({ address: buyer1.address });
        expect(buyer.nft_ids).to.contains(nft3.nft_id);
        expect(buyer.album_ids).to.contains(album1.album_id);
    });

    it("should result in an error if nft_id not provided", async () => {
        const res = await chai.request(server).post("/api/purchase-nft").send();
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("nft not found");
    });

    it("should result in an error if nft is not for sale", async () => {
        const payload = {
            nft_id: nft1.nft_id,
            buyer: buyer1.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/purchase-nft").send(payload);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("ntf is not for sale");
    });

    it("should result in an error if the nft is funded", async () => {
        const payload = {
            nft_id: nft2.nft_id,
            buyer: buyer2.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/purchase-nft").send(payload);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("nft is not owned by a single owner");
    });
});

describe("POST /api/fund-nft", function () {
    const { seller1, buyer1, buyer2, nft1, nft2, nft3, nft4, album1, album2, album3 } = getMockDataObject();

    before(async () => {
        await mock(getMockData());
    });

    after(async () => {
        await unmock(getMockData());
    });

    it("should result in an error if the new funder funds more than available percentages", async () => {
        const payload = {
            nft_id: nft2.nft_id,
            buyer: buyer2.address,
            percentage: 0.8,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/fund-nft").send(payload);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("exceed maximum percentage");
    });

    it("should result in an error if the funder is the seller", async () => {
        const payload = {
            nft_id: nft2.nft_id,
            buyer: seller1.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/fund-nft").send(payload);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("funder is the owner");
    });

    it("should add the buyer as a funder to the nft's owner list", async () => {
        const payload = {
            nft_id: nft2.nft_id,
            buyer: buyer2.address,
            percentage: 0.1,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/fund-nft").send(payload);
        expect(res.status).to.equal(200);
        const nft = await Nft.findOne({ nft_id: nft2.nft_id });
        expect(nft.owner.length).to.equal(3);
        // new funder
        expect(nft.owner[nft.owner.length - 1].address).to.equal(buyer2.address);
        expect(nft.owner[nft.owner.length - 1].percentage).to.equal(payload.percentage);
        // original seller
        expect(nft.owner[0].address).to.equal(seller1.address);
        expect(nft.owner[0].percentage).to.equal(1);

        const seller = await User.findOne({ address: seller1.address });
        expect(seller.nft_ids).to.contains(nft2.nft_id);

        const buyer = await User.findOne({ address: buyer2.address });
        expect(buyer.nft_ids).not.to.contains(nft2.nft_id);
    });

    it("should increases the funder's percentage", async () => {
        const payload = {
            nft_id: nft2.nft_id,
            buyer: buyer2.address,
            percentage: 0.1,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/fund-nft").send(payload);
        expect(res.status).to.equal(200);
        const nft = await Nft.findOne({ nft_id: nft2.nft_id });
        expect(nft.owner.length).to.equal(3);
        // new funder
        expect(nft.owner[nft.owner.length - 1].address).to.equal(buyer2.address);
        expect(nft.owner[nft.owner.length - 1].percentage).to.equal(0.1 + payload.percentage);
        // original seller
        expect(nft.owner[0].address).to.equal(seller1.address);
        expect(nft.owner[0].percentage).to.equal(1);

        const seller = await User.findOne({ address: seller1.address });
        expect(seller.nft_ids).to.contains(nft2.nft_id);

        const buyer = await User.findOne({ address: buyer2.address });
        expect(buyer.nft_ids).not.to.contains(nft2.nft_id);
    });

    it("should transfer the nft from the seller to funders", async () => {
        const payload = {
            nft_id: nft2.nft_id,
            buyer: buyer2.address,
            percentage: 0.3,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/fund-nft").send(payload);
        expect(res.status).to.equal(200);
        const nft = await Nft.findOne({ nft_id: nft2.nft_id });
        expect(nft.owner.length).to.equal(2);
        // 2 funders
        expect(nft.owner[nft.owner.length - 1].address).to.equal(buyer2.address);
        expect(nft.owner[nft.owner.length - 1].percentage).to.equal(0.5);
        expect(nft.owner[0].address).to.equal(buyer1.address);
        expect(nft.owner[0].percentage).to.equal(0.5);

        const seller = await User.findOne({ address: seller1.address });
        expect(seller.nft_ids).not.to.contains(nft2.nft_id);

        const funder1 = await User.findOne({ address: buyer1.address });
        expect(funder1.nft_ids).to.contains(nft2.nft_id);

        const funder2 = await User.findOne({ address: buyer2.address });
        expect(funder2.nft_ids).to.contains(nft2.nft_id);
    });

    it("should result in an error if nft_id not provided", async () => {
        const res = await chai.request(server).post("/api/fund-nft").send();
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("nft not found");
    });

    it("should result in an error if nft is not for sale", async () => {
        const payload = {
            nft_id: nft4.nft_id,
            buyer: buyer1.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/fund-nft").send(payload);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("ntf is not for sale");
    });
});

describe("POST /api/purchase-album", function () {
    const { seller1, buyer1, buyer2, nft1, nft2, nft3, nft4, album1, album2, album3 } = getMockDataObject();

    before(async () => {
        await mock(getMockData());
    });

    after(async () => {
        await unmock(getMockData());
    });
    it("should result in an error if the buyer is the owner", async () => {
        const payload = {
            album_id: album1.album_id,
            buyer: seller1.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/purchase-album").send(payload);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("buyer is the owner");
    });

    it("should transfer the album from the seller to buyer", async () => {
        const payload = {
            album_id: album1.album_id,
            buyer: buyer1.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/purchase-album").send(payload);
        expect(res.status).to.equal(200);
        const album = await Album.findOne({ album_id: album1.album_id });
        expect(album.owner).to.equal(buyer1.address);
        // 2 funders

        const seller = await User.findOne({ address: seller1.address });
        expect(seller.album_ids).not.to.contains(album1.album_id);
        expect(seller.nft_ids).not.to.contains(nft1.nft_id);
        expect(seller.nft_ids).not.to.contains(nft3.nft_id);

        const buyer = await User.findOne({ address: buyer1.address });
        expect(buyer.album_ids).to.contains(album1.album_id);
        expect(buyer.nft_ids).to.contains(nft1.nft_id);
        expect(buyer.nft_ids).to.contains(nft3.nft_id);
    });

    it("should result in an error if album_id not provided", async () => {
        const res = await chai.request(server).post("/api/purchase-album").send();
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("album not found");
    });

    it("should result in an error if album is not for sale", async () => {
        const payload = {
            album_id: album2.album_id,
            buyer: buyer1.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/purchase-album").send(payload);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("album is not for sale");
    });

    it("should result in an error if album contains funded nft", async () => {
        const payload = {
            album_id: album3.album_id,
            buyer: buyer1.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/purchase-album").send(payload);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("album contains funded nft");
    });
});
