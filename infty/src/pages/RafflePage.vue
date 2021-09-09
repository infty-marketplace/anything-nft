<template>
    <div class="raffle-page">
        <Navbar active-index="1" />

        <div id="sidebar" style="width: 20%">
            <b-card id="sidebar-card">
                <template #header>
                    <h4 class="mb-0 filter-header"><b-icon icon="filter-circle"></b-icon>&nbsp;Filter</h4>
                </template>
                <b-list-group id="list-group" flush>
                    <b-list-group-item>
                        <b-button pill v-b-toggle.collapse-0 variant="outline-secondary" class="category-button">
                            Sort By
                        </b-button>
                        <b-collapse id="collapse-0" class="mt-2">
                            <b-card>
                                <b-form-group v-slot="{ ariaDescribedby }">
                                    <b-form-radio-group
                                        id="radio-group-1"
                                        v-model="sortBySelected"
                                        :options="sortByOptions"
                                        :aria-describedby="ariaDescribedby"
                                        @change="handleFilter"
                                        name="flavour-0"
                                    ></b-form-radio-group>
                                </b-form-group>
                            </b-card>
                        </b-collapse>
                    </b-list-group-item>
                    <b-list-group-item>
                        <b-button pill v-b-toggle.collapse-1 variant="outline-secondary" class="category-button">
                            Raffle Type
                        </b-button>
                        <b-collapse id="collapse-1" class="mt-2">
                            <b-card>
                                <b-form-group v-slot="{ ariaDescribedby }">
                                    <b-form-checkbox-group
                                        id="checkbox-group-1"
                                        v-model="raffleTypeSelected"
                                        :options="raffleTypeOptions"
                                        :aria-describedby="ariaDescribedby"
                                        @change="handleFilter"
                                        name="flavour-1"
                                    ></b-form-checkbox-group>
                                </b-form-group>
                            </b-card>
                        </b-collapse>
                    </b-list-group-item>
                    <b-list-group-item>
                        <b-button pill v-b-toggle.collapse-2 variant="outline-secondary" class="category-button">
                            Price
                        </b-button>
                        <b-collapse id="collapse-2" class="mt-2">
                            <b-card>
                                <b-form-select v-model="priceTypeSelected" :options="priceTypeOptions"></b-form-select>
                                <b-form-input placeholder="Min" class="price-range" v-model="minPrice"></b-form-input>
                                <span>to</span>
                                <b-form-input placeholder="Max" class="price-range" v-model="maxPrice"></b-form-input>
                                <b-button id="price-apply-btn" variant="outline-primary" @click="handleFilter"
                                    >Apply</b-button
                                >
                            </b-card>
                        </b-collapse>
                    </b-list-group-item>
                </b-list-group>
            </b-card>
        </div>

        <b-modal
            ref="my-modal"
            hide-footer
            centered
            no-close-on-backdrop
            :title="raffleToBuy.title"
            class="ticket-modal"
            @close="hideModal"
        >
            <div>
                <div class="ticketInfo-form">
                    <p class="ticketInfo-label">Ticket Number:</p>
                    <b-form-spinbutton v-model="ticketNum" min="1" :max="raffleToBuy.available"> </b-form-spinbutton>
                </div>
                <p>
                    <span class="ticketInfo-label">Total Price:</span>
                    {{ ticketNum * raffleToBuy.unit_price }}
                    {{ raffleToBuy.currency }}
                </p>
            </div>
            <b-button v-if="raffleToBuy.owner == $store.getters.getAddress" disabled class="btn-disabled"
                >You own this raffle</b-button
            >
            <b-button v-else class="buy-btn" id="modal-buy" variant="primary" @click="buyNowClicked">Buy Now</b-button>
        </b-modal>

        <div class="pool" v-if="$store.getters.getAddress">
            <div id="banner">
                <img src="@/assets/imgs/currency.png" alt="currency" width="100" height="100" />
                <!-- <div>
            Icons made by
            <a href="https://www.freepik.com" title="Freepik">Freepik</a> from
            <a href="https://www.flaticon.com/" title="Flaticon"
              >www.flaticon.com</a
            >
          </div> -->
                <h2 id="banner-content">Currently {{ this.currentParticipantsNumber }} people participated!</h2>
            </div>
            <div class="mt-4" v-for="raffle in this.displayedRaffles" :key="raffle.nft_id">
                <b-card class="mb-3 pool-card">
                    <img :src="raffle.url" class="raffle-image" @click="onClickImage(raffle.nft_id)" />
                    <div class="pool-card-primary">
                        <div><b>Title:</b> {{ raffle.title }}</div>
                        <div class="raffle-owner" @click="handleRedirectToProfile(raffle.owner_url)">
                            <b>Owner:</b> {{ raffle.owner }}
                        </div>
                        <div><b>Discription:</b> {{ raffle.description }}</div>
                    </div>
                    <div class="transaction-primary">
                        <div class="price">
                            <b-badge v-if="raffle.deadline" class="price-item date">
                                {{ new Date(raffle.deadline * 1000).toLocaleDateString() }}
                            </b-badge>
                            <b-badge v-else class="price-item until-soldout">Until Tickets Soldout</b-badge>
                            <b-badge class="price-item price-badge">
                                {{ raffle.unit_price }} {{ raffle.currency }}
                            </b-badge>
                        </div>
                        <b-progress :max="raffle.max" variant="info" :animated="animate" class="mt-3">
                            <b-progress-bar :value="raffle.current">
                                <span>
                                    Progress:
                                    <strong>
                                        {{ raffle.deadline ? `${raffle.current / 360} hours` : raffle.current }} /
                                        {{ raffle.deadline ? `${raffle.max / 360} hours` : raffle.max }}
                                    </strong>
                                </span>
                            </b-progress-bar>
                        </b-progress>
                        <b-button class="buy-btn" variant="primary" @click="OpenBuyRaffleModal(raffle)">Buy</b-button>
                    </div>
                </b-card>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script>
import axios from "axios";

import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";

export default {
    name: "RafflePage",
    components: {
        Navbar,
        Footer,
    },
    mounted() {
        if (!this.$store.getters.getAddress) {
            this.$store.dispatch("connectWallet");
        }
    },
    created() {
        this.loadRaffles();
    },
    computed: {
        raffleToBuy: function() {
            if (!this.nftRaffleToBuy) {
                return "nftCardTitle";
            }
            return this.nftRaffleToBuy;
        },
    },
    data() {
        return {
            sortBySelected: "create time",
            sortByOptions: [
                { text: "Create Time", value: "create time" },
                { text: "End Time", value: "end time" },
                { text: "Price", value: "price" },
            ],
            raffleTypeSelected: ["limited tickets", "limited time"],
            raffleTypeOptions: [
                { text: "Limited Tickets", value: "limited tickets" },
                { text: "Limited Time", value: "limited time" },
            ],
            priceTypeSelected: "cfx",
            priceTypeOptions: [
                { value: "cfx", text: "CFX" },
                { value: "usdt", text: "USDT" },
                { value: "inft", text: "INFT" },
            ],
            minPrice: 0,
            maxPrice: Number.MAX_SAFE_INTEGER,
            raffles: [],
            displayedRaffles: [],
            ticketNum: 1,
            nftRaffleToBuy: null,
            animate: true,
            currentParticipantsNumber: 0,
        };
    },
    methods: {
        async loadRaffles() {
            const getters = this.$store.getters;
            const res = await axios.post(`${getters.getApiUrl}/market/`, { limit: Number.MAX_SAFE_INTEGER });

            const draw_ids = res.data.draw_ids;
            const draw_promises = draw_ids.map((draw_id) => axios.get(`${getters.getApiUrl}/draw/${draw_id}`));

            const draw_promises_result = await Promise.allSettled(draw_promises);
            let draws = draw_promises_result.map((p) => {
                if (p.status == "fulfilled") {
                    return p.value.data;
                }
            });

            const raffles_promises = draws.map((draw) => {
                return axios.get(`${getters.getApiUrl}/nft/${draw.nft_id}`).then((res) => {
                    draw.url = res.data.file;
                    if (draw.deadline) {
                        draw.max = parseFloat(draw.deadline) - Math.floor(Date.now(draw.created_at) / 1000);
                        draw.current = Math.floor(Date.now() / 1000) - Math.floor(Date.now(draw.created_at) / 1000);
                        draw.available = draw.quantity;
                    } else {
                        draw.max = draw.quantity;
                        draw.current = draw.participants.reduce(
                            (total, participant) => total + participant.quantity,
                            0
                        );
                        draw.available = draw.max - draw.current;
                    }
                    this.currentParticipantsNumber += draw.participants.reduce(
                        (total, participant) => total + participant.quantity,
                        0
                    );
                    return draw;
                });
            });

            await Promise.all(raffles_promises).then((results) => {
                this.raffles = results.filter((draw) => {
                    return draw.max - draw.current > 0;
                });
            });

            for (const raffle of this.raffles) {
                axios
                    .get(`${getters.getApiUrl}/profile/${raffle.owner}`)
                    .then((res) => {
                        raffle.owner_url = raffle.owner;
                        raffle.owner = `${res.data.first_name} ${res.data.last_name}`;
                    })
                    .catch((e) => {
                        return;
                    });
            }

            this.displayedRaffles = this.raffles;
            this.displayedRaffles.sort((a, b) => {
                return new Date(b.created_at) - new Date(a.created_at);
            });
        },
        showModal() {
            this.$refs["my-modal"].show();
        },
        hideModal() {
            this.nftTicketToBuy = null;
            this.ticketNum = 1;
            this.$refs["my-modal"].hide();
        },
        OpenBuyRaffleModal(card) {
            this.nftRaffleToBuy = card;
            this.showModal();
        },
        buyNowClicked() {
            this.buyRaffle(this.nftRaffleToBuy);
            this.hideModal();
        },
        async buyRaffle(nftRaffleToBuy) {
            const getters = this.$store.getters;
            const address = getters.getAddress;
            const raffleContract = getters.getRaffleContract;
            const minter = nftRaffleToBuy.nft_id.split("-")[0];
            const tokenId = nftRaffleToBuy.nft_id.split("-")[1];
            const quantity = this.ticketNum;

            try {
                await raffleContract
                    .joinRaffle(minter, tokenId, quantity)
                    .sendTransaction({
                        from: getters.getAddress,
                        to: getters.getRaffleAddress,
                        value: 1e18 * nftRaffleToBuy.unit_price * quantity,
                    })
                    .executed();
            } catch (e) {
                if (e.code == 4001) {
                    this.$bvToast.toast("User cancelled transaction", {
                        title: "Transaction Cancellation",
                        autoHideDelay: 3000,
                        appendToast: false,
                    });
                }
                return;
            }

            axios
                .post(`${getters.getApiUrl}/draw-nft/`, {
                    draw_id: nftRaffleToBuy.draw_id,
                    buyer: address,
                    quantity: quantity,
                    commission: 0,
                    commission_currency: "cfx",
                })
                .then(() => {
                    this.$bvToast.toast("Purchase Tickets Successfully", {
                        title: "Congrats",
                        autoHideDelay: 3000,
                        appendToast: false,
                    });
                })
                .catch((err) => {
                    console.log(err);
                    this.$bvToast.toast("Purchase Failed", {
                        title: "Error",
                        autoHideDelay: 3000,
                        appendToast: false,
                    });
                });
            this.loadRaffles();
        },
        handleFilter() {
            let result = [];
            // filter raffle type
            if (this.raffleTypeSelected.includes("limited tickets")) {
                result.push(...this.raffles.filter((r) => !r.deadline));
            }
            if (this.raffleTypeSelected.includes("limited time")) {
                result.push(...this.raffles.filter((r) => r.deadline));
            }

            // filter price
            result = result.filter((r) => r.currency === this.priceTypeSelected);
            result = result.filter((r) => r.unit_price >= this.minPrice && r.unit_price <= this.maxPrice);

            this.displayedRaffles = result;
            if (this.sortBySelected === "create time") {
                this.displayedRaffles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            } else if (this.sortBySelected === "end time") {
                this.displayedRaffles.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
            } else if (this.sortBySelected === "price") {
                this.displayedRaffles.sort((a, b) => b.unit_price - a.unit_price);
            }
        },
        onClickImage(nftId) {
            this.$router.push({
                path: "/nft/" + nftId,
            });
        },
        handleRedirectToProfile(owner) {
            this.$router.push({
                path: "/profile/" + owner,
            });
        },
    },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Palette+Mosaic&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap");
* {
    font-family: "Montserrat", sans-serif;
}
.raffle-page {
    /* background: #0082c8; */
    /* background: linear-gradient(to right, #667db6, #0082c8, #0082c8, #667db6); */
    /* background: rgb(18, 18, 18); */
    /* background: linear-gradient(to right, rgb(38, 38, 38), rgb(18, 18, 18)); /* W3C, IE 10+/ Edge,  */
}
#sidebar {
    margin-top: 2em;
    display: inline-block;
    text-align: left;
    vertical-align: top;
    border-radius: 10px;
}
.filter-header {
    text-align: left;
}
#sidebar-card,
.list-group-item {
}
.category-button {
    width: 100%;
}
#banner {
    margin-top: 2em;
    border-radius: 10px;
    /* background-image: linear-gradient(-20deg, rgb(38, 38, 38), rgb(18, 18, 18)); */
    background: linear-gradient(-20deg, #434343, #000000);
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    flex-basis: 20px;
}
#banner-content {
    margin-left: 5px;
    /* width: 70%; */
    color: white;
    font-family: "Palette Mosaic", cursive;
}
.pool {
    width: 70%;
    margin-left: 5%;
    display: inline-block;
    vertical-align: top;
}

.raffle-image {
    height: 10vh;
    float: left;
    width: 10vh;
    cursor: pointer;
}
.pool-card-primary {
    float: left;
    width: 75%;
    padding-left: 5%;
}

.transaction-primary {
    float: left;
    width: 100%;
    padding-top: 5%;
}
.price {
    /* width: 180px; */
    /* padding: 10px; */
    display: flex;
    justify-content: space-between;
    text-align: center;
}
.price-item {
    /* width: 120px; */
    height: 40px;
    text-align: center;
    line-height: 37px;
    background-color: rgb(236, 105, 166);
    /* margin-right: 8px; */
}
.date {
    width: 100px;
}
.price-badge {
    width: 60px;
}

.buy-btn {
    color: rgb(38, 38, 38);
    font-weight: bold;
    width: 100%;
    /* margin-left: 10%; */
    height: 40px;
    text-align: center;
    margin-top: 2em;
    background-color: rgb(107, 232, 170);
    border: none;

    /* line-height: 40px; */
}
.buy-btn:hover {
    background: #383;
    animation: rotate 0.7s ease-in-out both;
}
.buy-btn:active,
.buy-btn:visited,
.buy-btn:focus,
.buy-btn:active.buy-btn,
.buy-btn:active:hover {
    background: #383;
}

#sidebar-card .collapse .card {
    /* border: none; */
}
#sidebar-card {
    /* border-radius: 25px; */
    height: 100%;
}

.b-form-spinbutton {
    display: inline;
    width: 30%;
    margin-left: 1em;
}
.ticketInfo-form {
    display: flex;
    height: 50px;
}
.ticketInfo-label {
    /* vertical-align: middle; */
    text-align: center;
    line-height: 35px;
    font-weight: bold;
}
.modal-header {
    background: rgb(107, 232, 170) !important;
}
#modal-buy {
    width: 60%;
    margin-left: 20%;
}
.btn-disabled {
    width: 60%;
    margin-left: 20%;
}
.ticket-modal {
    margin: auto;
}
.card-img-left {
    width: 300px;
}

.raffle-owner {
    cursor: pointer;
}

.raffle-owner:hover {
    color: #0088a9;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg) translate3d(0, 0, 0);
    }
    25% {
        transform: rotate(3deg) translate3d(0, 0, 0);
    }
    50% {
        transform: rotate(-3deg) translate3d(0, 0, 0);
    }
    75% {
        transform: rotate(1deg) translate3d(0, 0, 0);
    }
    100% {
        transform: rotate(0deg) translate3d(0, 0, 0);
    }
}
</style>
