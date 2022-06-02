<template>
    <div class="marketplace flex-wrapper">
        <Navbar active-index="0" />
        <div>
            <div id="sidebar" style="width: 25%" class="mr-2 ml-2 mb-4">
                <b-card no-body class="filter-card">
                    <template #header>
                        <h4 class="mb-0"><b-icon icon="filter-circle"></b-icon>&nbsp;{{ $t('filter') }}</h4>
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
                                    <b-form-input type="number" v-model="price_from" placeholder="Min" class="price-range"></b-form-input>
                                    <span>to</span>
                                    <b-form-input type="number" v-model="price_to" placeholder="Max" class="price-range"></b-form-input>
                                </b-card>
                            </b-collapse>
                        </b-list-group-item>
                        <b-list-group-item>
                            <b-button pill v-b-toggle.collapse-3 variant="outline-secondary" class="category-button"
                                >Collections</b-button
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
                        </b-list-group-item>

                        <b-list-group-item>
                            <b-button pill v-b-toggle.collapse-5 variant="outline-secondary" class="category-button"
                                >Categories</b-button
                            >
                            <b-collapse id="collapse-5" class="mt-2">
                                <b-form-group>
                                    <b-form-checkbox-group id="category-selection" v-model="filter.selectedCategory">
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
                            <div class="load-bar" v-else-if="!loadingNft">
                              <span class='btn-bg'>
                              <button class="load-btn" @click="getMore">Load More</button>
                              </span>
                            </div>
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
import constant from "../constants/index.js";

const throttle = require("lodash.throttle");
var price_range;
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
        let query = new URLSearchParams((new URL(window.location)).search);
        this.filter.selectedCategory = query.getAll('category');
        this.filter.selectedCategory.forEach( cat => {
                this.currentQuery.append('category', cat)
            })
        this.loadNftMarket();
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
            filter: {   notMine: false, 
                        price: price_range, 
                        selectedCollection: [],
                        selectedCategory: [],},
            collections: constant.COLLECTIONS,
            categories: constant.LABELS,
            currentQuery: new URLSearchParams(),
            price_from: '',
            price_to: '',
        };
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
                    query: this.currentQuery.toString(),
                    price_from: this.price_from,
                    price_to: this.price_to,
                };
                axios.post(this.$store.getters.getApiUrl + `/market`, body).then((res) => {
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

        applyFilter() {
            // reset when click on button
            this.currentQuery = new URLSearchParams();

            if(this.price_from) {
                this.currentQuery.append('min', this.price_from);
            }
            if (this.price_to) {
                this.currentQuery.append('max', this.price_to);
            }
            this.filter.selectedCategory.forEach( cat => {
                this.currentQuery.append('category', cat)
            })

            this.$router.push({ path: `/marketplace?${this.currentQuery}`});

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

.load-bar {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid grey; line-height: 0.1rem;
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
