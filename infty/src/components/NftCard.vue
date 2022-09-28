<template>
    <div>
        <b-card class="user-card">
            <template #header>
                <el-dropdown v-if="!card.enableLike" class="dropdown">
                    <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <a v-if="!listing_status" @click="listNftClicked"
                            ><el-dropdown-item v-if="card.status == 'private'" >List Item</el-dropdown-item></a>
                        <a @click="setAvatar"
                            ><el-dropdown-item>Set Avatar</el-dropdown-item></a>
                        <a @click="deleteNftClicked"
                            ><el-dropdown-item v-if="card.status == 'private'">Delete It</el-dropdown-item></a
                        >
                        <a @click="delistNft"
                            ><el-dropdown-item v-if="card.status == 'sale'">Delist</el-dropdown-item></a
                        >
                    </el-dropdown-menu>
                </el-dropdown>
                <div v-else class="like-container">
                    <heart-btn :nftId="card.nft_id" :isLiked="card.isLiked" />
                </div>
            </template>

            <img @click="cardClicked" :src="card.url" class="nft-img" />
            <!-- <router-link :to="{ path:'/card/:id', name: 'card-detail', params: { id: card.nft_id || 'default_id', card: card } }"> -->
            <b-card-text class="card-detail">
                <p>{{ card.title }}</p>
                <p>{{ card.collection }}</p>
                <b class="card-owner" @click="handleRedirectToOwner">{{ card.ownerName || card.ownerAddress }}</b>
            </b-card-text>
            <template #footer>
                <div v-if="card.status == 'sale'">
                    <!-- <span class="text-muted-left"
                        ><small class="text-muted"
                            ><b-icon icon="clock"></b-icon>&nbsp;{{ card.expirationDate }} {{ $t('daysLeft') }}</small
                        ></span
                    > -->
                    <span class="text-muted-right"
                        ><small class="text-muted"
                            ><b-icon icon="suit-diamond-fill"></b-icon>&nbsp;{{ $t('price') }}: {{ card.price }}</small
                        ></span
                    >
                </div>

                <div v-if="card.status == 'private'">
                    <small class="text-muted">Currently Unlisted</small>
                    <el-tooltip
                        effect="dark"
                        class="ml-2 mt-1"
                        style="cursor:help; float:right"
                        content="This is a fragment of the NFT."
                        placement="bottom"
                    >
                        <b-icon v-if="isPiece" b-icon icon="layout-wtf" />
                    </el-tooltip>
                    <b-modal ref="list-modal" title="List Item" @ok="handleListNft">
                        <div style="display:block;width:100%;" class="mb-2">
                            <label
                                >Settlement Currency:
                                <el-tooltip
                                    effect="dark"
                                    class="ml-2"
                                    style="cursor:help"
                                    content="The commission fee will be waived if you choose INFT as your settlement currency."
                                    placement="right"
                                >
                                    <i class="el-icon-warning-outline" /> </el-tooltip
                            ></label>
                            <el-select
                                style="float:right;width:40%"
                                v-model="currencyValue"
                                placeholder="Settlement Currency"
                            >
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </div>

                        <label>Price</label>
                        <b-form-input
                            class="mb-4"
                            v-model="listing_price"
                            :state="isListingPrice"
                            :placeholder="`How much in ${currencyValue}...`"
                            aria-describedby="input-live-feedback"
                        />
                        <b-form-invalid-feedback id="input-live-feedback">
                            Your input should be a number with a maximum of 18 decimal places.
                        </b-form-invalid-feedback>
                        <div v-if="currencyValue != 'inft'">
                            <label
                                >Commision Fee
                                <el-tooltip
                                    effect="dark"
                                    class="ml-2"
                                    style="cursor:help"
                                    content="Minimum is 2.5% of the price, or 10 cfx."
                                    placement="right"
                                >
                                    <i class="el-icon-warning-outline" />
                                </el-tooltip>
                            </label>
                            <b-form-input
                                class="mb-4"
                                v-model="listing_commision"
                                :state="isListingCommision"
                                aria-describedby="input-live-feedback"
                                :placeholder="`How much in ${currencyValue}... `"
                            />
                            <b-form-invalid-feedback id="input-live-feedback">
                                Your input should be a number with a maximum of 18 decimal places.
                            </b-form-invalid-feedback>
                        </div>
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
import axios from 'axios';
import { eventBus } from '../main';
import { Notification } from 'element-ui';
import HeartBtn from './HeartBtn.vue';

export default {
    name: 'Card',
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
        deadline: null,
        fractionStatus: "no",
        currencyValue: "cfx",
        listing_status : false,
        options: [
            {
                label: "CFX",
                value: "cfx",
            },
            /* {
                label: "INFT",
                value: "inft",
            },
            {
                label: "USDT",
                value: "usdt",
            }, */
        ],
    }),
    computed: {
        isPiece: function() {
            return this.card.owner.length > 1;
        },
        isListingPrice() {
            if (typeof this.listing_price === "undefined" || this.listing_price.length == 0) return null;
            var converted = parseFloat(this.listing_price);
            if (converted > 0.0) {
                if (this.listing_price.includes(".")) {
                    return this.listing_price.split(".")[1].length < 19;
                }
                return true;
            }
            return false;
        },
        isListingCommision() {
            if (typeof this.listing_commision === "undefined" || this.listing_commision.length == 0) return null;
            var converted = parseFloat(this.listing_commision);
            if (converted > 0.0) {
                if (this.listing_commision.includes(".")) {
                    return this.listing_commision.split(".")[1].length < 19;
                }
                return true;
            }
            return false;
        },
    },
    methods: {
        listNftClicked(e) {
            e.preventDefault();
            this.$refs['list-modal'].show();
        },
        async deleteNftClicked(e) {
            e.preventDefault();
            await axios.post(`${this.$store.getters.getApiUrl}/delete-nft`, {
                nft_id: this.card.nft_id,
            });
            eventBus.$emit("Card.statusChanged", this.card.nft_id);
        },
        handleListNft_NotifyHelper() {
            Notification.closeAll();
            this.$notify.error({
                title: "Missing Required Information",
                message: "Please fill all fields correctly.",
                duration: 3000,
            });
        },
        handleListNft_Validation(list_item) {
            var converted = parseFloat(list_item);
            if (
                converted <= 0.0 ||
                Number.isNaN(converted) ||
                typeof converted !== "number" ||
                (list_item.includes(".") && list_item.split(".")[1].length > 18)
            ) {
                this.handleListNft_NotifyHelper();
                return false;
            }
            return true;
        },
        async handleListNft() {
            if (!this.listing_price || !this.listing_commision) {
                this.handleListNft_NotifyHelper();
                return;
            } else if (this.handleListNft_Validation(this.listing_price) == false) {
                return;
            } else if (this.handleListNft_Validation(this.listing_commision) == false) {
                return;
            }
            this.listing_status = true;
            console.log('processing');
            try{
                // const params = [{
                //     from: (await window.conflux.request({method:"cfx_requestAccounts"}))[0],
                //     to: this.$store.getters.getManagerAddr,
                //     gasPrice: '0x'+this.$store.getters.getGasPrice.toString(16),
                //     value: '0x'+(1e18 * this.listing_commision).toString(16),
                // }]
                // this.$store.dispatch("notifyLoading", { msg: "Paying commission now." });
                // const tx = await window.conflux.request({
                //     method: 'cfx_sendTransaction',
                //     params
                // })
                // // TODO: wait the transaction with hash tx to finish
                // console.dir(tx)
                const tx = this.$store.getters.getCfx.sendTransaction({
                    from: (await window.conflux.request({method:"cfx_requestAccounts"}))[0],
                    to: this.$store.getters.getManagerAddr,
                    gasPrice: this.$store.getters.getGasPrice,
                    value: 1e18 * this.listing_commision,
                });
                this.$store.dispatch("notifyLoading", { msg: "Paying commission now." });
                await tx.executed();
                Notification.closeAll();
            }catch(error){
                console.log(1)
                console.log(error)
                Notification.closeAll();
                this.$store.dispatch("notifyErr");
                this.listing_status = false;
                return;
            }
            const getters = this.$store.getters;
            if (this.card.owner.length == 1) {
                this.$store.dispatch("notifyLoading", { msg: "Approving platform to operate the NFT on your behalf." });
                const tokenId = this.card.nft_id.split("-")[1];
                try{
                    await getters.getMinterContract
                        .approve(getters.getManagerAddr, tokenId)
                        .sendTransaction({ from: getters.getAddress, to: getters.getMinterAddress, gasPrice: getters.getGasPrice })
                        .executed();
                }catch(error){
                    console.log(error)
                    Notification.closeAll();
                    this.$store.dispatch("notifyErr");
                    this.listing_status = false;
                    return;
                }
            }
            axios
                .post(`${this.$store.getters.getApiUrl}/list-nft`, {
                    price: this.listing_price,
                    comission: this.listing_commision,
                    currency: 'cfx',
                    nft_id: this.card.nft_id,
                    owner: getters.getAddress,
                    fractional: this.fractionStatus == "yes" ? true : false,
                })
                .then(() => {
                    Notification.closeAll();
                    this.$notify({
                        title: 'Congrats',
                        message: 'NFT listed successfully',
                        duration: 3000,
                        type: 'success',
                    });

                    eventBus.$emit('Card.statusChanged', this.card.nft_id);
                })
                .catch((err) => {
                    console.log(err);
                    this.$bvToast.toast('Listing Failed', {
                        title: 'Error',
                        autoHideDelay: 3000,
                        appendToast: false,
                    });
                    this.listing_status = false;
                });
        },
        delistNft(e) {
            e.preventDefault();
            axios
                .post(`${this.$store.getters.getApiUrl}/delist-nft`, {
                    nft_id: this.card.nft_id,
                    owner: this.$store.getters.getAddress,
                })
                .then((res) => {
                    this.$bvToast.toast('Delisted Successfully', {
                        title: 'Info',
                        autoHideDelay: 3000,
                        appendToast: false,
                    });
                    eventBus.$emit('Card.statusChanged', this.card.nft_id);
                    console.log(res);
                });
        },
        cardClicked(e) {
            if (!['BUTTON', 'LABEL', 'INPUT'].includes(e.srcElement.nodeName))
                this.$router.push({
                    path: '/nft/:id',
                    name: 'nft-detail',
                    params: { id: this.card.nft_id || 'default_id', card: this.card },
                });
        },

        handleRedirectToOwner() {
            const path = this.$route.path;
            if (path.includes("profile") && path.split("profile/")[1] != this.card.ownerAddress) {
                window.location.pathname = `/profile/${this.card.ownerAddress}`;
            } else {
                this.$router.push(`/profile/${this.card.ownerAddress}`);
            }
        },
        setAvatar() {
            // TODO: should get signature from wallet to verify the ownership
            console.log(this.card.nft_id)
            axios.post(`${this.$store.getters.getApiUrl}/profile/set-avatar`, {
                address: this.$store.getters.getAddress,
                nft_id: this.card.nft_id
            }).then(() => {
                this.$notify({
                    title: 'Congrats',
                    message: 'Avatar Updated',
                    duration: 3000,
                    position: "top-left",
                    type: 'success',
                });
                this.$store.commit("setProfilePic");
            })
            // TODO: error checking
        }
    },
};
</script>

<style scoped>
.user-card {
    width: 250px;
    transition: all 0.15s ease-in-out;
}
.text-muted-right {
    float: right;
}
.card-detail {
    margin-top: 5px;
    font-size: 0.875em;
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
