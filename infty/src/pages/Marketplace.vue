<template>
    <div class="marketplace flex-wrapper">
        <Navbar active-index="0"/>
        <div>
            <div id="sidebar" class="mr-2 ml-2 mb-4" style="width: 25%">
                <b-card class="filter-card" no-body>
                    <template #header>
                        <h4 class="m-0" style="width: 50%; float:left">
                            <b-icon icon="filter-circle"></b-icon>&nbsp;{{ $t("filter") }}
                        </h4>
                        <div id="clearAll" style="display:none; float:right; cursor: pointer; margin-top: 5px;"
                             @click="reset">
                            <a style="text:center"><u>clear filter</u></a>
                        </div>
                    </template>
                    <b-list-group flush>
                        <b-list-group-item>
                            <b-button v-b-toggle.collapse-2 class="category-button" pill variant="outline-secondary"
                            >{{ $t("filterOption.price") }}
                            </b-button
                            >
                            <b-collapse id="collapse-2" class="mt-2">
                                <b-card>
                                    <!-- <b-form-select
                    v-model="priceTypeSelected"
                    :options="priceTypeOptions"
                  ></b-form-select> -->
                                    <b-form-input v-model="price_from" class="price-range" placeholder="Min"
                                                  type="number"></b-form-input>
                                    <span>to</span>
                                    <b-form-input v-model="price_to" class="price-range" placeholder="Max"
                                                  type="number"></b-form-input>
                                </b-card>
                            </b-collapse>
                        </b-list-group-item>
                        <!--<b-list-group-item>
                            <b-button pill v-b-toggle.collapse-3 variant="outline-secondary" class="category-button"
                                >{{ $t("collections") }}</b-button
                            >
                            <b-collapse id="collapse-3" class="mt-2">
                                <b-form-group>
                                    <b-form-checkbox-group id="collection-selection" v-model="filter.selectedCollection">
                                        <b-list-group-item v-for="(item, index) in collections" :key="'col'+index">
                                            <b-form-checkbox :value="item">
                                            {{ collections[index] }}
                                            </b-form-checkbox>
                                        </b-list-group-item>
                                    </b-form-checkbox-group>
                                </b-form-group>

                            </b-collapse>
                        </b-list-group-item>-->

                        <b-list-group-item>
                            <b-button v-b-toggle.collapse-5 class="category-button" pill variant="outline-secondary">{{
                                $t("categories")
                                }}
                            </b-button>
                            <b-collapse id="collapse-5" class="mt-2">
                                <b-form-group>
                                    <b-form-checkbox-group id="category-selection" v-model="selectedCategory">
                                        <b-list-group-item v-for="(item, index) in categories" :key="'cat'+index">
                                            <b-form-checkbox :value="item">
                                                {{ categories[index] }}
                                            </b-form-checkbox>
                                        </b-list-group-item>
                                    </b-form-checkbox-group>
                                </b-form-group>
                            </b-collapse>
                        </b-list-group-item>
                    </b-list-group>
                    <div>
                        <b-button id="price-apply-btn" variant="outline-primary" @click="applyFilter">Apply</b-button>
                    </div>
                </b-card>
            </div>

            <div class="content">
                <div class="search-bar-container">
                    <div id="search-bar">
                        <b-input-group class="mb-2" size="md">
                            <b-form-input
                                    v-model="searchText"
                                    placeholder="Search..."
                                    type="search"
                                    @keyup.enter="instantSearch"
                            ></b-form-input>
                            <b-input-group-prepend is-text>
                                <b-icon
                                        icon="search"
                                        style="cursor:pointer"
                                        @click="instantSearch"
                                ></b-icon>
                            </b-input-group-prepend>
                        </b-input-group>
                    </div>
                </div>
                <div id="tab">
                    <b-tabs class="main-content" content-class="ml-5 mt-3">
                        <b-tab title="NFT">
                            <div class="nft-container">
                                <transition name="fade">
                                    <div v-show="loadingNft" class="loading">
                                        <span class="fa fa-spinner fa-spin"></span> {{ $t("loading") }}
                                    </div>
                                </transition>
                                <el-empty v-if="nftCards.length == 0" class="flex-wrapper-row" description="Nothing"/>
                                <NftCard v-for="card in nftCards" :key="card.url" :card="card" class="mr-5 mb-4"/>
                            </div>
                            <p
                                    v-if="noMoreNft"
                                    style="border-bottom: 1px solid grey; line-height: 0.1rem;text-align:center"
                            >
                                <span style="padding: 0px 20px;background-color:white;color:grey;">{{
                                    $t("endOfMarket")
                                    }}</span>
                            </p>
                            <div v-else-if="!loadingNft" class="load-bar">
                                <span class="btn-bg">
                                    <button class="load-btn" @click="getMore">{{ $t("loadmore") }}</button>
                                </span>
                            </div>
                        </b-tab>
                    </b-tabs>
                </div>

                <!-- <b-button variant="primary" class='load-more' @click='loadMarket'>Load More</b-button> -->
            </div>
        </div>

        <Footer/>
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import NftCard from "../components/NftCard.vue";
import axios from "axios";
import constant from "../constants/index.js";


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
    mounted(){
        this.selectedCategory = !this.$route.query.category? []: [this.$route.query.category]
        this.applyFilter()
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
            filter: {notMine: false,},
            categories: constant.LABELS,
            price_from: "",
            price_to: "",
            filtermode: null,
            selectedCategory: [],
            searchText: ""
        };
    },
    watch: {
        '$route' (to, from) {
            console.log(`the route is changed to ${this.$route.fullPath}`)
            this.selectedCategory = !this.$route.query.category? []: [this.$route.query.category]
            this.applyFilter()
        }
    },

    methods: {
        getMore() {
            if (!this.noMoreNft) {
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
            let nfts = results.filter((result) => result.status === "fulfilled").map((result) => result.value.data);

            // set up NFTs, including retriving owner's name...
            nfts = await Promise.all(
                nfts.map(async (nft) => {
                    const ownerAddress = this.getOwnerAddress(nft.owner);

                    await axios
                        .get(`${this.$store.getters.getApiUrl}/profile/${ownerAddress}`)
                        .then((res) => {
                            nft.ownerName = res.data.first_name + " " + res.data.last_name;
                        })
                        .catch(() => {
                            nft.ownerName = "Unregistered User";
                        });

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
                    selectedCategory: this.selectedCategory,
                    price_from: this.price_from,
                    price_to: this.price_to,
                    filtermode: this.filtermode,
                    text: this.searchText,
                };
                axios.post(this.$store.getters.getApiUrl + "/market", body).then(async (res) => {
                    const nft_ids = res.data.nft_ids;
                    await this.proccessNft(nft_ids);
                    this.offsetNft += nft_ids.length;
                    this.noMoreNft = nft_ids.length < this.limit;
                    this.loadingNft = false;
                });
            }, 200);
        },

        instantSearch() {
            this.price_from = "";
            this.price_to = "";
            this.selectedCategory = [],
                this.filtermode = "searchText";
            this.offsetNft = 0;
            this.nftCards = [];
            this.noMoreNft = false;
            document.getElementById("clearAll").style.display = "block";
            this.loadNftMarket();
        },

        filterNotMine(checked) {
            this.filter.notMine = checked;
            this.offsetNft = 0;
            this.nftCards = [];
            this.loadNftMarket();
        },

        applyFilter() {
            console.log("apply filter")
            // if the user doesn't select any filter category or price range, do not reload the market page
            if (!this.selectedCategory.length && !this.price_to && !this.price_from) {
                return;
            }

            // otherwise, reload the market page
            this.filtermode = "filter";
            this.offsetNft = 0;
            this.nftCards = [];
            this.noMoreNft = false;
            document.getElementById("clearAll").style.display = "block";
            this.loadNftMarket();
        },

        reset() {
            this.offsetNft = 0;
            this.nftCards = [];
            this.noMoreNft = false;
            this.price_from = "";
            this.price_to = "";
            this.selectedCategory = [],
                this.filtermode = null;
            this.searchText = "";
            document.getElementsByClassName("price-range");
            document.getElementById("clearAll").style.display = "none";
            this.loadNftMarket();
        }
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
    margin-bottom: 1em;
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
    width: 100%;
    max-width: 20rem;
    float: right;
}

.loading {
    text-align: center;
    position: fixed;
    color: #f8f8f9;
    z-index: 9;
    background: rgb(0, 0, 0);
    padding: 8px 18px;
    border-radius: 5px;
    left: 55vw;
    top: 40vh;
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

.load-bar {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid grey;
    line-height: 0.1rem;
    height: 1rem;
    margin-bottom: 2rem;
    margin-top: 2rem;
}

.load-btn {
    font-size: 0.8rem;
    height: 2rem;
    padding: 1rem;
    background-color: black;
    color: white;
    border: 1px solid grey;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
}

.btn-bg {
    padding: 0rem 1rem;
    height: 2rem;
    background-color: white;
}
</style>
