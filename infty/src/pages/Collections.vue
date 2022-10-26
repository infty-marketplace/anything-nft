<template>
    <div class="flex-wrapper" id="collections-page">
        <Navbar active-index="3" />
        <div class="flex-wrapper-row mt-3" v-if="$store.getters.getLogInStatus">
            <el-tabs class="main-content">
                <el-tab-pane label="NFT">
                    <p>Unlisted</p>
                    <div class="cards-container p-2">
                        <NftCard class="mb-4 card" v-for="nft in private_nfts" :card="nft" :key="nft.url" />
                        <p class="mb-4" v-if="private_nfts.length == 0"><el-empty description="Nothing"></el-empty></p>
                    </div>
                    <p>On Sale</p>
                    <div class="cards-container p-2">
                        <NftCard class="mb-4 card" v-for="nft in sale_nfts" :card="nft" :key="nft.url" />
                        <p class="mb-4" v-if="sale_nfts.length == 0"><el-empty description="Nothing"></el-empty></p>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <a href="/mine/create">
                <b-btn variant="primary" class="add-btn"> <b-icon icon="plus-circle-fill"></b-icon> </b-btn
            ></a>
        </div>
        <div v-else class="flex-wrapper-row" style="height: auto;">
            <ConnectWallet />
        </div>
        <Footer style="z-index: 0" />
    </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import NftCard from "../components/NftCard.vue";
import ConnectWallet from "../components/ConnectWallet.vue";

export default {
    name: "Collections",
    components: {
        Navbar,
        Footer,
        NftCard,
        ConnectWallet,
    },
    data: () => ({
        nfts: [],
    }),
    computed: {
        private_nfts: function() {
            const nfts = this.nfts.filter((n) => n.status == "private");
            const res = [];
            nfts.forEach((n) => {
                const nclone = JSON.parse(JSON.stringify(n));
                nclone.status = "private";
                res.push(nclone);
            });

            return res;
        },
        sale_nfts: function() {
            return this.nfts.filter((n) => n.status == "sale");
        },
    },

    async mounted() {
        const getters = this.$store.getters;
        if (getters.getAddress) this.loadCollections();
        eventBus.$on("Collections.loadCollections", () => this.loadCollections());
        eventBus.$on("Card.statusChanged", (nid) => {
            axios
                .get(`${getters.getApiUrl}/nft/${nid}`)
                .then(async (res) => {
                    const newNft = res.data;
                    newNft.url = newNft.file;

                    this.$set(
                        this.nfts,
                        this.nfts.findIndex((n) => n.nft_id == nid),
                        newNft
                    );
                })
                .finally(() => {
                    // expensive, but couldn't only change one, needs enhancement
                    this.loadCollections();
                });
        });
    },
    beforeDestroy() {
        eventBus.$off("Collections.loadCollections");
        eventBus.$off("Collections.receiveImage");
        eventBus.$off("Card.statusChanged");
    },
    methods: {
        async loadNfts(nft_ids) {
            const api = this.$store.getters.getApiUrl;
            const nft_promises = nft_ids.map((nid) => axios.get(`${api}/nft/${nid}`));
            const nft_promises_result = await Promise.allSettled(nft_promises);
            let nfts = nft_promises_result.map((p) => {
                if (p.status == "fulfilled") return p.value.data;
            });
            nfts = nfts.filter((n) => !!n && !!n.file);
            this.nfts = nfts.map((n) => {
                n.url = n.file;
                n.author = "";
                return n;
            });
        },
        async loadCollections() {
            const getters = this.$store.getters;
            const res = await axios.get(`${getters.getApiUrl}/profile/${getters.getAddress}`);
            let nft_ids = res.data.nft_ids;
            // new database schema
            nft_ids = nft_ids.map((id) => {
                if (Object.prototype.hasOwnProperty.call(id, "address")) {
                    return id.address;
                }
                return Object.keys(id)
                    .map((i) => id[i])
                    .join("");
            });
            this.loadNfts(nft_ids);
        },
    },
};
</script>

<style scoped>
.main-content {
    width: 100%;
    max-width: 80vw;
}

.add-btn {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 5vh;
    right: 5vw;
    height: 4vh;
    box-shadow: 0 0 5px rgba(33, 33, 33, 0.2);
    z-index: 1;
}

.cards-container {
    display: flex;
    flex-wrap: wrap;
    row-gap: 10px;
    column-gap: 40px;
    align-items: flex-start;
}

.card {
    height: 100%;
}
.alb-card {
    width: 300px;
}

.file-uploader {
    width: 80%;
    height: 450px;
}
</style>

<style>
#collections-page .el-tabs__item.is-top {
    font-size: 28px;
}

#collections-page {
    background-color: #f8f8f9;
}
</style>
