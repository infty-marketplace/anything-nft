<template>
    <div class="marketplace flex-wrapper">
        <Navbar active-index="0" />
        <div>
            <div id="sidebar" style="width: 25%" class="mr-2 mb-4">
                <b-card no-body class="filter-card">
                    <template #header>
                        <h4 class="mb-0"><b-icon icon="filter-circle"></b-icon>&nbsp;Filter</h4>
                    </template>
                    <b-list-group flush>
                        <b-list-group-item>
                            <b-button pill v-b-toggle.collapse-1 variant="outline-secondary" class="category-button"
                                >Status</b-button
                            >
                            <b-collapse id="collapse-1" class="mt-2">
                                <b-card>
                                    <b-form-checkbox @change="filterNotMine">Not Mine</b-form-checkbox>
                                </b-card>
                            </b-collapse>
                        </b-list-group-item>
                        <b-list-group-item>
                            <b-button pill v-b-toggle.collapse-2 variant="outline-secondary" class="category-button"
                                >Price (in CFX)</b-button
                            >
                            <b-collapse id="collapse-2" class="mt-2">
                                <b-card>
                                    <!-- <b-form-select
                    v-model="priceTypeSelected"
                    :options="priceTypeOptions"
                  ></b-form-select> -->
                                    <b-form-input v-model="text" placeholder="Min" class="price-range"></b-form-input>
                                    <span>to</span>
                                    <b-form-input v-model="text" placeholder="Max" class="price-range"></b-form-input>
                                    <b-button id="price-apply-btn" variant="outline-primary">Apply</b-button>
                                </b-card>
                            </b-collapse>
                        </b-list-group-item>
                        <b-list-group-item>
                            <b-button pill v-b-toggle.collapse-3 variant="outline-secondary" class="category-button"
                                >Collections</b-button
                            >
                            <b-collapse id="collapse-3" class="mt-2">
                                <b-card>
                                    <b-input-group size="sm" class="mb-2">
                                        <b-input-group-prepend is-text>
                                            <b-icon icon="search"></b-icon> </b-input-group-prepend
                                        ><b-form-input placeholder="Filter"></b-form-input>
                                    </b-input-group>

                                    <b-list-group id="collections-group">
                                        <b-list-group-item>Bored Ape Yacht Club</b-list-group-item>
                                        <b-list-group-item>CrptoPunks</b-list-group-item>
                                        <b-list-group-item>Art Blocks Curated</b-list-group-item>
                                        <b-list-group-item>Bored Ape Kennel Club</b-list-group-item>
                                        <b-list-group-item>SupDucks</b-list-group-item>
                                        <b-list-group-item>Cool Cat</b-list-group-item>
                                        <b-list-group-item>ZED RUN</b-list-group-item>
                                        <b-list-group-item>Famelady</b-list-group-item>
                                    </b-list-group>
                                </b-card>
                            </b-collapse>
                        </b-list-group-item>

                        <b-list-group-item>
                            <b-button pill v-b-toggle.collapse-5 variant="outline-secondary" class="category-button"
                                >Categories</b-button
                            >
                            <b-collapse id="collapse-5" class="mt-2">
                                <b-card>
                                    <b-list-group>
                                        <b-list-group-item>Art</b-list-group-item>
                                        <b-list-group-item>Music</b-list-group-item>
                                        <b-list-group-item>Domain Names</b-list-group-item>
                                        <b-list-group-item>Virtual Worlds</b-list-group-item>
                                        <b-list-group-item>Trading Cards</b-list-group-item>
                                        <b-list-group-item>Collectibles</b-list-group-item>
                                    </b-list-group>
                                </b-card>
                            </b-collapse>
                        </b-list-group-item>
                    </b-list-group>
                </b-card>
            </div>

            <div class="content">
                <div class="search-bar-container">
                    <div id="search-bar">
                        <b-input-group size="md" class="mb-2">
                            <b-form-input
                                type="search"
                                placeholder="Search..."
                                @keyup.enter="$store.dispatch('notifyWIP')"
                            ></b-form-input>
                            <b-input-group-prepend is-text>
                                <b-icon
                                    icon="search"
                                    style="cursor:pointer"
                                    @click="$store.dispatch('notifyWIP')"
                                ></b-icon>
                            </b-input-group-prepend>
                        </b-input-group>
                    </div>
                </div>
                <div id="tab">
                    <b-tabs class="main-content" content-class="ml-5 mt-3" v-model="tabIndex">
                        <b-tab title="NFT">
                            <div class="nft-container">
                                <transition name="fade">
                                    <div class="loading" v-show="loadingNft">
                                        <span class="fa fa-spinner fa-spin"></span> Loading
                                    </div>
                                </transition>
                                <el-empty class="flex-wrapper-row" v-if="nftCards.length == 0" description="Nothing" />
                                <NftCard v-for="card in nftCards" :card="card" :key="card.url" class="mr-5 mb-4" />
                            </div>
                            <p
                                v-if="noMoreNft && nftCards.length != 0"
                                style="border-bottom: 1px solid grey; line-height: 0.1rem;text-align:center"
                            >
                                <span style="padding: 0px 20px;background-color:white;color:grey;">End of Market</span>
                            </p>
                        </b-tab>
                    </b-tabs>
                </div>

                <!-- <b-button variant="primary" class='load-more' @click='loadMarket'>Load More</b-button> -->
            </div>
        </div>

        <Footer />
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import NftCard from "../components/NftCard.vue";
import axios from "axios";

const throttle = require("lodash.throttle");
var handler;
export default {
    name: "Marketplace",
    components: {
        Navbar,
        Footer,
        NftCard,
    },

    beforeMount() {
        this.user = this.$store.getters.getAddress;
        this.loadNftMarket();
    },

    mounted() {
        handler = throttle(this.getMore, 1000);
        window.addEventListener("scroll", handler);
    },

    destroyed() {
        window.removeEventListener("scroll", handler);
    },

    data() {
        return {
            offsetNft: 0,
            limit: 6,
            statusSelected: [],
            // statusOptions: [
            //   { text: "Buy Now", value: "buyNow" },
            //   { text: "On Auction", value: "onAuction" },
            //   { text: "New", value: "new" },
            //   { text: "Has Offers", value: "hasOffers" },
            // ],
            // TODO: add support for other currencies in the future.
            // priceTypeSelected: "usd",
            // priceTypeOptions: [
            //   { value: "usd", text: "United States Dollar(USD)" },
            //   { value: "eth", text: "Ether(ETH)" },
            // ],
            nftCards: [],
            loadingNft: false,
            noMoreNft: false,
            user: undefined,
            filter: { notMine: false },
        };
    },

    methods: {
        getMore() {
            let bottomOfWindow =
                Math.abs(
                    document.documentElement.scrollTop + window.innerHeight - document.documentElement.offsetHeight
                ) < 400;
            if (bottomOfWindow && !this.noMoreNft) {
                this.loadNftMarket();
            }
        },
        getOwnerAddress(owners) {
            return owners.find((owner) => owner.percentage === 1).address;
        },
        async proccessNft(nftIds) {
            this.user = this.$store.getters.getAddress;
            // remove duplicates
            nftIds = nftIds.filter((v, i, a) => a.indexOf(v) === i);
            const promises = nftIds.map((nid) => axios.get(`${this.$store.getters.getApiUrl}/nft/${nid}`));
            const results = await Promise.allSettled(promises);
            let nfts = results.map((p) => {
                if (p.status == "fulfilled") return p.value.data;
            });

            // set up NFTs, including retriving owner's name...
            nfts = await Promise.all(
                nfts.map(async (nft) => {
                    const ownerAddress = this.getOwnerAddress(nft.owner);
                    const owner = (await axios.get(`${this.$store.getters.getApiUrl}/profile/${ownerAddress}`)).data;
                    nft.ownerName = owner.first_name + " " + owner.last_name;
                    nft.ownerAddress = ownerAddress;
                    nft.url = nft.file;
                    nft.isLiked = nft.liked_users.includes(this.user);
                    nft.enableLike = true;
                    if (nft.fragmented && this.fragments.some((f) => f.nft_id == nft.nft_id && f.status == "sale")) {
                        nft.status = "sale";
                    }
                    return nft;
                })
            );

            // apply filter
            nfts.forEach((nft) => {
                if (this.filter.notMine && this.getOwnerAddress(nft.owner) === this.user) {
                    return;
                }
                this.nftCards.push(nft);
            });
        },

        loadNftMarket() {
            this.loadingNft = true;
            setTimeout(() => {
                const body = {
                    offset: this.offsetNft,
                    limit: this.limit,
                };
                axios.post(this.$store.getters.getApiUrl + "/market", body).then((res) => {
                    const nft_ids = res.data.nft_ids;
                    this.proccessNft(nft_ids);
                    this.offsetNft += nft_ids.length;
                    this.noMoreNft = nft_ids.length < this.limit;
                    this.loadingNft = false;
                });
            }, 200);
        },

        filterNotMine(checked) {
            this.filter.notMine = checked;
            this.offsetNft = 0;
            this.nftCards = [];
            this.loadNftMarket();
        },
    },
};
</script>

<style scoped>
.marketplace {
    text-align: left;
    /* height: 100vh; */
}
.category-button {
    width: 100%;
}
#sidebar {
    margin-top: 2em;
    display: inline-block;
    /* height: 100%; */
    text-align: left;
    vertical-align: top;
    /* border: 1px solid #f00; */
}
.price-range {
    width: 40%;
    display: inline-block;
    margin-right: 3%;
    margin-left: 2%;
}
#price-apply-btn {
    margin-top: 1em;
    width: 40%;
    margin-right: 30%;
    margin-left: 30%;
}
#collections-group {
    margin-top: 1em;
}
.content {
    width: 70%;
    margin-left: 10px;
    /* float: left; */
    /* margin-top: 0; */
    display: inline-block;
    /* top: 0%; */
    /* left: 0; */
    vertical-align: top;
    position: relative;
}

#search-bar {
    width: 50%;
    display: inline-block;
    margin-top: 2em;
    position: absolute;
    width: 50%;
    right: 0;
}
#tab {
    width: 100%;
    display: inline-block;
    margin-top: 2em;
}
.nft-container {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
}

.search-bar-container {
    width: 100%;
    display: flex;
    /* justify-content:center; */
}
.filter-card {
    width: 20rem;
    float: right;
}
.loading {
    text-align: center;
    position: absolute;
    color: #fff;
    z-index: 9;
    background: rgb(0, 0, 0);
    padding: 8px 18px;
    border-radius: 5px;
    left: calc(50% - 45px);
    top: calc(50% - 18px);
}

.alb-card {
    width: 250px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
.main-content {
    width: 100%;
}
</style>

<style></style>
