let chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/index");
const User = require("../src/models/user");
const Nft = require("../src/models/nft");
const Transaction = require("../src/models/transaction");
const Album = require("../src/models/album");
const Draw = require("../src/models/draw");
const constants = require("../src/constants");
const expect = chai.expect;
chai.use(chaiHttp);

function getMockData() {
    const seller1 = {
        first_name: "seller1",
        address: "seller_address1",
        nft_ids: ["nft_id1", "nft_id2", "nft_id3", "nft_id4", "nft_id5", "nft_id6", "nft_id7", "nft_id8", "nft_id9"],
        album_ids: ["album_id1", "album_id2", "album3", "album_id4", "album_id5"],
    };
    const buyer1 = { first_name: "buyer1", address: "buyer_address1", nft_ids: ["nft_id5", "nft_id6", "nft_id9"] };
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
    const album4 = {
        title: "album4",
        album_id: "album_id4",
        status: constants.STATUS_SALE,
        file: "file4",
        price: 100,
        currency: "cfx",
        nft_ids: ["nft_id5"],
        owner: seller1.address,
    };
    const album5 = {
        title: "album5",
        album_id: "album_id5",
        status: constants.STATUS_SALE,
        file: "file5",
        price: 100,
        currency: "cfx",
        nft_ids: ["nft_id6", "nft_id7"],
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
        author: seller1.address,
        file_hash: "0101",
    };
    const nft2 = {
        title: "nft2",
        nft_id: "nft_id2",
        album_id: "album_id3",
        status: constants.STATUS_SALE,
        file: "file3",
        price: 100,
        currency: "cfx",
        owner: [
            { address: seller1.address, percentage: 1 },
            { address: buyer1.address, percentage: 0.5 },
        ],
        author: seller1.address,
        file_hash: "0101",
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
        author: seller1.address,
        file_hash: "0101",
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
        author: seller1.address,
        file_hash: "0101",
    };

    const nft5 = {
        title: "nft5",
        nft_id: "nft_id5",
        album_id: "",
        status: constants.STATUS_SALE,
        file: "file5",
        price: 100,
        currency: "cfx",
        owner: [
            { address: seller1.address, percentage: 0.3 },
            { address: buyer1.address, percentage: 0.7 },
        ],
        author: seller1.address,
        file_hash: "0101",
    };

    const nft6 = {
        title: "nft6",
        nft_id: "nft_id6",
        album_id: "album_id5",
        status: constants.STATUS_SALE,
        file: "file6",
        price: 100,
        currency: "cfx",
        owner: [
            { address: seller1.address, percentage: 0.3 },
            { address: buyer1.address, percentage: 0.7 },
        ],
        author: seller1.address,
        file_hash: "0101",
    };
    const nft7 = {
        title: "nft7",
        nft_id: "nft_id7",
        album_id: "album_id5",
        status: constants.STATUS_SALE,
        file: "file7",
        price: 100,
        currency: "cfx",
        owner: [{ address: seller1.address, percentage: 1 }],
        author: seller1.address,
        file_hash: "0101",
    };
    const nft8 = {
        title: "nft8",
        nft_id: "nft_id8",
        status: constants.STATUS_DRAW,
        file: "file8",
        price: 100,
        currency: "cfx",
        owner: [{ address: seller1.address, percentage: 1 }],
        author: seller1.address,
        file_hash: "0101",
    };
    const nft9 = {
        title: "nft9",
        nft_id: "nft_id9",
        status: constants.STATUS_DRAW,
        file: "file9",
        price: 100,
        currency: "cfx",
        owner: [
            { address: seller1.address, percentage: 0.3 },
            { address: buyer1.address, percentage: 0.7 },
        ],
        author: seller1.address,
        file_hash: "0101",
    };
    const draw1 = {
        title: "draw1",
        draw_id: "draw_id1",
        unit_price: 1,
        quantity: 100,
        currency: "cfx",
        nft_id: nft8.nft_id,
        owner: seller1.address,
    };
    const draw2 = {
        title: "draw2",
        draw_id: "draw_id2",
        unit_price: 1,
        quantity: 100,
        currency: "cfx",
        nft_id: "",
        owner: seller1.address,
    };
    const draw3 = {
        title: "draw3",
        draw_id: "draw_id3",
        unit_price: 1,
        quantity: 100,
        currency: "cfx",
        nft_id: nft1.nft_id,
        owner: seller1.address,
    };
    const draw4 = {
        title: "draw4",
        draw_id: "draw_id4",
        unit_price: 1,
        quantity: 100,
        currency: "cfx",
        nft_id: nft9.nft_id,
        owner: seller1.address,
    };
    return {
        users: { seller1, buyer1, buyer2 },
        nfts: { nft1, nft2, nft3, nft4, nft5, nft6, nft7, nft7, nft8, nft9 },
        albums: { album1, album2, album3, album4, album5 },
        draws: { draw1, draw2, draw3, draw4 },
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
        } else if (entry[0] === "draws") {
            for (const data of Object.values(entry[1])) {
                await new Draw(data).save();
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
        } else if (entry[0] === "draws") {
            for (const data of Object.values(entry[1])) {
                await Draw.deleteMany({ draw_id: data.draw_id });
            }
        }
    }
}

describe("POST /api/purchase-nft", function () {
    const {
        seller1,
        buyer1,
        buyer2,
        nft1,
        nft2,
        nft3,
        nft4,
        nft5,
        nft6,
        nft7,
        album1,
        album2,
        album3,
        album4,
        album5,
    } = getMockDataObject();

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

    it("should transfer the nft and album from seller to buyer if nft is not completely funded", async () => {
        const payload = {
            nft_id: nft2.nft_id,
            buyer: buyer2.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/purchase-nft").send(payload);
        expect(res.status).to.equal(200);

        const nft = await Nft.findOne({ nft_id: nft2.nft_id });
        expect(nft.owner[0].address).to.equal(buyer2.address);

        const album = await Album.findOne({ album_id: album3.album_id });
        expect(album.owner).to.equal(buyer2.address);

        const seller = await User.findOne({ address: seller1.address });
        expect(seller.nft_ids).not.to.contains(nft2.nft_id);
        expect(seller.album_ids).not.to.contains(album3.album_id);

        const buyer = await User.findOne({ address: buyer2.address });
        expect(buyer.nft_ids).to.contains(nft2.nft_id);
        expect(buyer.album_ids).to.contains(album3.album_id);
    });

    it("should result in error if nft is completely funded", async () => {
        const payload = {
            nft_id: nft5.nft_id,
            buyer: buyer2.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/purchase-nft").send(payload);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("nft is completely funded");
    });

    it("should only trsander nft from seller to buyer if album contains funded nft", async () => {
        const payload = {
            nft_id: nft7.nft_id,
            buyer: buyer1.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/purchase-nft").send(payload);
        expect(res.status).to.equal(200);

        const nft = await Nft.findOne({ nft_id: nft7.nft_id });
        expect(nft.owner[0].address).to.equal(buyer1.address);

        const album = await Album.findOne({ album_id: album5.album_id });
        expect(album.owner).not.to.equal(buyer1.address);

        const seller = await User.findOne({ address: seller1.address });
        expect(seller.nft_ids).not.to.contains(nft7.nft_id);
        expect(seller.album_ids).to.contains(album5.album_id);

        const buyer = await User.findOne({ address: buyer1.address });
        expect(buyer.nft_ids).to.contains(nft7.nft_id);
        expect(buyer.album_ids).not.to.contains(album5.album_id);
    });
});

describe("POST /api/fund-nft", function () {
    const { seller1, buyer1, buyer2, nft1, nft2, nft3, nft4, album1, album2, album3, album4 } = getMockDataObject();

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
    const { seller1, buyer1, buyer2, nft1, nft2, nft3, nft4, album1, album2, album3, album4, album5 } =
        getMockDataObject();

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
            album_id: album4.album_id,
            buyer: buyer1.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/purchase-album").send(payload);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("album contains funded nft");
    });

    it("should result in an error if album contains funded and none funded nft", async () => {
        const payload = {
            album_id: album5.album_id,
            buyer: buyer1.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/purchase-album").send(payload);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("album contains funded nft");
    });

    it("should transfer from seller to buyer if album contains halfway funded nft", async () => {
        const payload = {
            album_id: album3.album_id,
            buyer: buyer1.address,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/purchase-album").send(payload);
        expect(res.status).to.equal(200);

        const album = await Album.findOne({ album_id: album3.album_id });
        expect(album.owner).to.equal(buyer1.address);
        // 2 funders

        const seller = await User.findOne({ address: seller1.address });
        expect(seller.album_ids).not.to.contains(album3.album_id);
        expect(seller.nft_ids).not.to.contains(nft2.nft_id);

        const buyer = await User.findOne({ address: buyer1.address });
        expect(buyer.album_ids).to.contains(album3.album_id);
        expect(buyer.nft_ids).to.contains(nft2.nft_id);
    });
});

describe("POST /api/draw-nft", function () {
    const { seller1, buyer1, buyer2, draw1, draw2, draw3, draw4 } = getMockDataObject();

    before(async () => {
        await mock(getMockData());
    });

    after(async () => {
        await unmock(getMockData());
    });

    it("should result in an error if draw not found", async () => {
        const payload = {
            draw_id: "",
            buyer: seller1.address,
            quantity: 1,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/draw-nft").send(payload);
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("draw not found");
    });

    it("should result in an error if nft not found", async () => {
        const payload = {
            draw_id: draw2.draw_id,
            buyer: buyer1.address,
            quantity: 1,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/draw-nft").send(payload);
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal("nft not found");
    });

    it("should result in an error if nft is not for draw", async () => {
        const payload = {
            draw_id: draw3.draw_id,
            buyer: buyer1.address,
            quantity: 1,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/draw-nft").send(payload);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("nft is not for draw");
    });

    it("should result in an error if nft is funded", async () => {
        const payload = {
            draw_id: draw4.draw_id,
            buyer: buyer1.address,
            quantity: 1,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/draw-nft").send(payload);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("nft is completely funded");
    });

    it("should result in an error if participant is the owner", async () => {
        const payload = {
            draw_id: draw1.draw_id,
            buyer: seller1.address,
            quantity: 1,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/draw-nft").send(payload);
        expect(res.status).to.equal(400);
        expect(res.body.error).to.equal("participant is the owner");
    });

    it("should add the participant to the participants list", async () => {
        const payload = {
            draw_id: draw1.draw_id,
            buyer: buyer1.address,
            quantity: 1,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/draw-nft").send(payload);
        expect(res.status).to.equal(200);

        const draw = await Draw.findOne({ draw_id: draw1.draw_id });
        expect(draw.participants[0].address).to.equals(buyer1.address);
        expect(draw.participants[0].quantity).to.equals(payload.quantity);
    });

    it("should increase the quantity for the participant in the participants list", async () => {
        const payload = {
            draw_id: draw1.draw_id,
            buyer: buyer1.address,
            quantity: 9,
            commission: 1,
            commission_currency: "cfx",
        };
        const res = await chai.request(server).post("/api/draw-nft").send(payload);
        expect(res.status).to.equal(200);

        const draw = await Draw.findOne({ draw_id: draw1.draw_id });
        expect(draw.participants.length).to.equals(1);
        expect(draw.participants[0].address).to.equals(buyer1.address);
        expect(draw.participants[0].quantity).to.equals(1 + payload.quantity);
    });
});
