<template>
    <div>
        <b-card class="user-card">
            <template #header>
                <el-dropdown v-if="!onMarket" class="dropdown">
                    <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <a @click="listNftClicked"
                            ><el-dropdown-item v-if="card.status == 'private'">List Item</el-dropdown-item></a
                        >
                        <a @click="raffleNftClicked"
                            ><el-dropdown-item v-if="card.status == 'private'">Raffle It</el-dropdown-item></a
                        >
                        <a @click="delistNft"
                            ><el-dropdown-item v-if="card.status == 'sale'">Delist</el-dropdown-item></a
                        >
                    </el-dropdown-menu>
                </el-dropdown>
                <div v-else class="like-container">
                    <heart-btn />
                </div>
            </template>
            <b-form-checkbox
                v-bind:class="{ checkbox: !checkState, 'checkbox-active': checkState }"
                v-model="checkState"
                :value="true"
                :unchecked-value="false"
                v-if="card.status == 'private'"
                @change="checkBox"
            />
            <img @click="cardClicked" :src="card.url" class="nft-img" />
            <!-- <router-link :to="{ path:'/card/:id', name: 'card-detail', params: { id: card.nft_id || 'default_id', card: card } }"> -->
            <b-card-text class="card-detail">
                <p>{{ card.title }}</p>
                <p>{{ card.collection }}</p>
                <b class="card-owner" @click="handleRedirectToProfile">{{ card.author }}</b>
            </b-card-text>
            <template #footer>
                <div v-if="card.status == 'sale'">
                    <span class="text-muted-left"
                        ><small class="text-muted"
                            ><b-icon icon="clock"></b-icon>&nbsp;{{ card.expirationDate }} X days left</small
                        ></span
                    >
                    <span class="text-muted-right"
                        ><small class="text-muted"
                            ><b-icon icon="suit-diamond-fill"></b-icon>&nbsp;Price: {{ card.price }}</small
                        ></span
                    >
                </div>

                <div v-if="card.status == 'draw'">
                    <span class="text-muted-left"><small class="text-muted">Currently Raffling</small></span>
                    <span class="text-muted-right card-owner" @click="handleRedirectToRaffle">
                        <small class="text-muted"><b-icon icon="cash"></b-icon>&nbsp;Entry Raffle</small></span
                    >
                </div>

                <div v-if="card.status == 'private'">
                    <small class="text-muted">Currently Unlisted</small>
                    <el-tooltip effect="dark" class='ml-2' style='cursor:help' content="This is a fragment of the NFT." placement="bottom">
                    <b-icon v-if='isPiece' b-icon icon='layout-wtf'/>
                    </el-tooltip>
                    <b-modal ref="list-modal" title="List Item" @ok="handleListNft">
                        <div style='display:block;width:100%;' class='mb-2'>
                        
                        <label>Settlement Currency:
                            <el-tooltip effect="dark" class='ml-2' style='cursor:help' content="The commission fee will be waived if you choose INFT as your settlement currency." placement="right">
                            <i class='el-icon-warning-outline'/>
                            </el-tooltip></label>
                        <el-select style='float:right;width:40%' v-model="currencyValue" placeholder="Settlement Currency">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        </div>
                        <label>Price</label>
                        <b-form-input class="mb-4" v-model="listing_price" :placeholder="`How much in ${currencyValue}...`" />
                        <div v-if='currencyValue!="inft"'>
                        <label>Commision Fee
                            <el-tooltip effect="dark" class='ml-2' style='cursor:help' content="Minimum is 2.5% of the price, or 10 cfx." placement="right">
                            <i class='el-icon-warning-outline'/>
                            </el-tooltip>
                        </label>
                        <b-form-input
                            class="mb-4"
                            v-model="listing_commision"
                            :placeholder='`How much in ${currencyValue}... `'
                        />
                        </div>
                        <div v-if="!card.fragmented">
                        <b-form-checkbox
                        style="display: inline"
                        id="fraction"
                        v-model="fractionStatus"
                        name="fraction"
                        value="yes"
                        unchecked-value="no"
                        >
                        
                        Allow Fractional Trading
                        
                        </b-form-checkbox>
                        <el-tooltip effect="dark" class='ml-2' style='cursor:help' content="Your NFT will be divided into 100 shares." placement="right">
                            <i class='el-icon-warning-outline'/>
                        </el-tooltip>
                        </div>
                    </b-modal>
                    <b-modal ref="raffle-modal" title="Raffle It" @ok="handleRaffleNft">
                        <label>Ticket Price</label>
                        <b-form-input class="mb-4" v-model="raffle_price" placeholder="How much in cfx..." />
                        <label>Number of Tickets</label>
                        <b-form-input class="mb-4" v-model="raffle_tickets" placeholder="How many tickets..." />
                        <label>Commision</label>
                        <b-form-input
                            class="mb-4"
                            v-model="raffle_commision"
                            placeholder="How much in cfx... (Minimum 5%)"
                        />
                        <label for="example-datepicker">Deadline</label>
                        <b-form-datepicker id="example-datepicker" v-model="deadline" class="mb-2"></b-form-datepicker>
                        <b-form-checkbox
                            id="checkbox-1"
                            v-model="oneticketStatus"
                            name="checkbox-1"
                            value="accepted"
                            unchecked-value="not_accepted"
                        >
                            One Ticket Per Address
                        </b-form-checkbox>
                    </b-modal>
                </div>
                <!-- <b-btn
          v-if="card.status == 'sale'"
          variant="info"
          class="text-muted-right"
          @click="delistNft"
          >Delist</b-btn
        > -->
            </template>
            <!-- </router-link> -->
        </b-card>
    </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";
import { Notification } from "element-ui";
import HeartBtn from "./HeartBtn.vue";

export default {
    name: "Card",
    props: {
        card: Object,
    },
    components: {
        HeartBtn,
    },
    data: () => ({
        oneticketStatus: undefined,
        listing_price: undefined,
        listing_commision: undefined,
        raffle_price: undefined,
        raffle_tickets: undefined,
        raffle_commision: undefined,
        checkState: false,
        deadline: null,
        fractionStatus: 'no',
        currencyValue: 'cfx',
        options: [
            {
                label: 'CFX',
                value: 'cfx'
            },
            {
                label: 'INFT',
                value: 'inft'
            },
            {
                label: "USDT",
                value: 'usdt'
            }
        ]
    }),
    computed: {
        onMarket: function() {
            return this.$route.path.includes("marketplace");
        },
        isPiece: function() {
            return this.card.owner.length > 1;
        }
    },
    methods: {
        listNftClicked(e) {
            e.preventDefault();
            this.$refs["list-modal"].show();
        },
        raffleNftClicked(e) {
            e.preventDefault();
            this.$refs["raffle-modal"].show();
        },
        async handleListNft() {
            const tx = window.confluxJS.sendTransaction({
                from: (await window.conflux.send("cfx_requestAccounts"))[0],
                to: this.$store.getters.getManagerAddr,
                gasPrice: 1,
                value: 1e18 * this.listing_commision,
            });
            this.$store.dispatch("notifyCommission");
            const res = await tx.executed();
            Notification.closeAll();
            const getters = this.$store.getters;
            if (this.card.owner.length == 1) {
                this.$notify({
                    title: "Notification",
                    message: "Approving platform to operate the NFT on your behalf.",
                    duration: 0,
                });
                console.log(res);
                
                const tokenId = this.card.nft_id.split("-")[1];

                await getters.getMinterContract
                    .approve(getters.getManagerAddr, tokenId)
                    .sendTransaction({ from: getters.getAddress, to: getters.getMinterAddress, gasPrice: 1 })
                    .executed();
            }
            console.log(this.fractionStatus)
            axios
                .post(`${this.$store.getters.getApiUrl}/list-nft`, {
                    price: this.listing_price,
                    comission: this.listing_commision,
                    currency: "cfx",
                    nft_id: this.card.nft_id,
                    owner: getters.getAddress,
                    fractional: this.fractionStatus == 'yes' ? true : false
                })
                .then((res) => {
                    Notification.closeAll();
                    this.$notify({
                        title: "Congrats",
                        message: "NFT listed successfully",
                        duration: 3000,
                        type: "success",
                    });
                    console.log(res.data);
                    eventBus.$emit("Card.statusChanged", this.card.nft_id);
                })
                .catch((err) => {
                    console.log(err);
                    this.$bvToast.toast("Listing Failed", {
                        title: "Error",
                        autoHideDelay: 3000,
                        appendToast: false,
                    });
                });
        },
        async handleRaffleNft() {
            const getters = this.$store.getters;
            const tokenId = this.card.nft_id.split("-")[1];
            try {
                await getters.getMinterContract
                    .approve(getters.getManagerAddr, tokenId)
                    .sendTransaction({ from: getters.getAddress, to: getters.getMinterAddress, gasPrice: 1 })
                    .executed();
            } catch (e) {
                return;
            }
            await axios
                .post(`${getters.getApiUrl}/list-nft-draw`, {
                    title: this.card.title,
                    description: this.card.description,
                    unit_price: this.raffle_price,
                    quantity: this.raffle_tickets,
                    currency: "cfx",
                    deadline: new Date(this.deadline).getTime() / 1000,
                    nft_id: this.card.nft_id,
                    owner: this.card.owner[0].address,
                })
                .then(() => {
                    this.$bvToast.toast("Raffling Successfully", {
                        title: "Congrats",
                        autoHideDelay: 3000,
                        appendToast: false,
                    });
                    eventBus.$emit("Card.statusChanged", this.card.nft_id);
                })
                .catch(() => {
                    this.$bvToast.toast("Raffling Failed", {
                        title: "Error",
                        autoHideDelay: 3000,
                        appendToast: false,
                    });
                });
        },
        delistNft(e) {
            e.preventDefault();
            axios
                .post(`${this.$store.getters.getApiUrl}/delist-nft`, {
                    nft_id: this.card.nft_id,
                    owner: this.$store.getters.getAddress
                })
                .then((res) => {
                    this.$bvToast.toast("Delisted Successfully", {
                        title: "Info",
                        autoHideDelay: 3000,
                        appendToast: false,
                    });
                    eventBus.$emit("Card.statusChanged", this.card.nft_id);
                    console.log(res);
                });
        },
        checkBox() {
            if (this.checkState) {
                eventBus.$emit("Card.addAlbumCandidate", this.card.nft_id);
            } else {
                eventBus.$emit("Card.delAlbumCandidate", this.card.nft_id);
            }
        },
        cardClicked(e) {
            if (!["BUTTON", "LABEL", "INPUT"].includes(e.srcElement.nodeName))
                this.$router.push({
                    path: "/nft/:id",
                    name: "nft-detail",
                    params: { id: this.card.nft_id || "default_id", card: this.card },
                });
        },
        handleRedirectToRaffle() {
            this.$router.push({
                path: "/raffles/",
            });
        },
        handleRedirectToProfile() {
            this.$router.push({
                path: "/profile/" + this.card.owner[0].address,
            });
        },
    },
};
</script>

<style scoped>
.user-card {
    width: 250px;
    transition: all 0.15s ease-in-out;
}
/* .user-card:hover {
  transform: scale(1.02);
  box-shadow: 0 0 5px rgba(33, 33, 33, 0.2);
} */
.text-muted-right {
    float: right;
}
.card-detail {
    margin-top: 5px;
    font-size: 0.875em;
}
.checkbox {
    position: absolute;
    left: 10px;
    top: 5px;
    z-index: 0;
}

.checkbox-active {
    display: block;
    position: absolute;
    left: 10px;
    top: 5px;
    z-index: 0;
}
.checkbox:hover {
    display: block;
}

.user-card:hover .checkbox {
    display: block;
}

.nft-img {
    width: 100%;
    height: 250px;
    object-fit: contain;
    cursor: pointer;
    border-radius: 15px;
}
.dropdown {
    float: right;
}
.like-container {
    float: right;
    margin-top: -60px;
    margin-right: -80px;
    margin-bottom: -60px;
    transform: scale(0.15);
}
.card-owner {
    cursor: pointer;
}

.card-owner:hover {
    color: #0088a9;
}
</style>

