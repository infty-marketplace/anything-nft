<template>
  <div class="raffle-page">
    <Navbar active-index="1" />

    <div>
      <div id="sidebar" style="width: 20%">
        <b-card id="sidebar-card">
          <template #header>
            <h4 class="mb-0 filter-header">
              <b-icon icon="filter-circle"></b-icon>&nbsp;Filter
            </h4>
          </template>
          <b-list-group id="list-group" flush>
            <b-list-group-item>
              <b-button
                pill
                v-b-toggle.collapse-1
                variant="outline-secondary"
                class="category-button"
                >Status</b-button
              >
              <b-collapse id="collapse-1" class="mt-2">
                <b-card>
                  <b-form-group v-slot="{ ariaDescribedby }">
                    <b-form-checkbox-group
                      id="checkbox-group-1"
                      v-model="statusSelected"
                      :options="statusOptions"
                      :aria-describedby="ariaDescribedby"
                      name="flavour-1"
                    ></b-form-checkbox-group>
                  </b-form-group>
                </b-card>
              </b-collapse>
            </b-list-group-item>
            <b-list-group-item>
              <b-button
                pill
                v-b-toggle.collapse-2
                variant="outline-secondary"
                class="category-button"
                >Price</b-button
              >
              <b-collapse id="collapse-2" class="mt-2">
                <b-card>
                  <b-form-select
                    v-model="priceTypeSelected"
                    :options="priceTypeOptions"
                  ></b-form-select>
                  <b-form-input
                    placeholder="Min"
                    class="price-range"
                  ></b-form-input>
                  <span>to</span>
                  <b-form-input
                    placeholder="Max"
                    class="price-range"
                  ></b-form-input>
                  <b-button id="price-apply-btn" variant="outline-primary"
                    >Apply</b-button
                  >
                </b-card>
              </b-collapse>
            </b-list-group-item>
            <b-list-group-item>
              <b-button
                pill
                v-b-toggle.collapse-3
                variant="outline-secondary"
                class="category-button"
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
              <b-button
                pill
                v-b-toggle.collapse-4
                variant="outline-secondary"
                class="category-button"
                >Chains</b-button
              >
              <b-collapse id="collapse-4" class="mt-2">
                <b-card>
                  <b-list-group>
                    <b-list-group-item>Ethereum</b-list-group-item>
                    <b-list-group-item>Polygon</b-list-group-item>
                    <b-list-group-item>Klaytn</b-list-group-item>
                  </b-list-group>
                </b-card>
              </b-collapse>
            </b-list-group-item>
            <b-list-group-item>
              <b-button
                pill
                v-b-toggle.collapse-5
                variant="outline-secondary"
                class="category-button"
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
            <b-form-spinbutton
              v-model="ticketNum"
              min="1"
              :max="raffleToBuy.quantity"
            >
            </b-form-spinbutton>
          </div>
          <p>
            <span class="ticketInfo-label">Total Price:</span>
            {{ ticketNum * raffleToBuy.unit_price }}
            {{ raffleToBuy.currency }}
          </p>
        </div>
        <b-button
          v-if="raffleToBuy.owner == $store.getters.getAddress"
          disabled
          class="btn-disabled"
          >You own this raffle</b-button
        >
        <b-button
          v-else
          class="buy-btn"
          id="modal-buy"
          variant="primary"
          @click="buyNowClicked"
          >Buy Now</b-button
        >
      </b-modal>

      <div class="pool" v-if="$store.getters.getAddress">
        <div id="banner">
          <img
            src="@/assets/imgs/currency.png"
            alt="currency"
            width="100"
            height="100"
          />
          <!-- <div>
            Icons made by
            <a href="https://www.freepik.com" title="Freepik">Freepik</a> from
            <a href="https://www.flaticon.com/" title="Flaticon"
              >www.flaticon.com</a
            >
          </div> -->
          <h2 id="banner-content">Currently 175 people participated!</h2>
        </div>
        <div class="mt-4" v-for="raffle in raffles" :key="raffle.nft_id">
          <b-card
            :img-src="raffle.url"
            img-alt="Card image"
            img-left
            class="mb-3 pool-card"
          >
            <div class="pool-card-primary">
              <div class="card-primary">
                <p><b>Title:</b> {{ raffle.title }}</p>
                <p><b>Owner:</b> {{ raffle.owner }}</p>
                <p><b>Discription:</b> {{ raffle.description }}</p>
              </div>
              <div class="transaction-primary">
                <div class="price">
                  <b-badge
                    v-if="raffle.deadline"
                    class="price-item date"
                    style="background-color: rgb(236, 105, 166)"
                    >{{
                      new Date(raffle.deadline * 1000).toLocaleDateString()
                    }}</b-badge
                  >
                  <b-badge
                    v-else
                    class="price-item until-soldout"
                    style="background-color: rgb(236, 105, 166)"
                    >Until Tickets Soldout</b-badge
                  >

                  <b-badge
                    class="price-item price-badge"
                    style="background-color: rgb(236, 105, 166)"
                    >{{ raffle.unit_price }} {{ raffle.currency }}</b-badge
                  >
                </div>
                <b-progress
                  :value="20"
                  variant="info"
                  :animated="animate"
                  class="mt-3"
                ></b-progress>
                <b-button
                  class="buy-btn"
                  variant="primary"
                  @click="OpenBuyRaffleModal(raffle)"
                  >Buy</b-button
                >
              </div>
            </div>
          </b-card>
        </div>
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
    // if (this.$store.getters.getAddress) {
    //   this.loadRaffles();
    // }
    this.loadRaffles();
    // if (this.$store.getters.getAddress) this.loadNfts();
    // this.$store.dispatch("connectWallet");
    // eventBus.$on("Collections.loadNfts", () => this.loadNfts());
    // eventBus.$on("Card.statusChanged", (nid) => {
    //   axios.get(`${this.$store.getters.getApiUrl}/nft/${nid}`).then((res) => {
    //     const newNft = res.data;
    //     newNft.url = newNft.file;
    //     newNft.author = newNft.owner[0].address;
    //     this.$set(
    //       this.nfts,
    //       this.nfts.findIndex((n) => n.nft_id == nid),
    //       newNft
    //     );
    //   });
    // });
  },
  computed: {
    raffleToBuy: function () {
      if (!this.nftRaffleToBuy) {
        return "nftCardTitle";
      }
      return this.nftRaffleToBuy;
    },
  },
  data() {
    return {
      statusSelected: [],
      statusOptions: [
        { text: "today", value: "today" },
        { text: "this week", value: "thisWeek" },
        { text: "this month", value: "thisMonth" },
        // { text: "Has Offers", value: "hasOffers" },
      ],
      priceTypeSelected: "usd",
      priceTypeOptions: [
        { value: "usd", text: "United States Dollar(USD)" },
        { value: "eth", text: "Ether(ETH)" },
      ],
      raffles: [],
      ticketNum: 1,
      nftRaffleToBuy: null,
      animate: true,
    };
  },
  methods: {
    async loadRaffles() {
      console.log("enter");
      const getters = this.$store.getters;
      const res = await axios.post(`${getters.getApiUrl}/market/`);
      const draw_ids = res.data.draw_ids;
      console.log("draw_ids", draw_ids);
      const draw_promises = draw_ids.map((draw_id) =>
        axios.get(`${getters.getApiUrl}/draw/${draw_id}`)
      );

      const draw_promises_result = await Promise.allSettled(draw_promises);
      let draws = draw_promises_result.map((p) => {
        if (p.status == "fulfilled") {
          console.log("p.value.data", p.value.data);
          return p.value.data;
        }
      });

      const raffles_promises = draws.map((draw) => {
        const nft_promise = axios.get(
          `${getters.getApiUrl}/nft/${draw.nft_id}`
        );
        return nft_promise.then((res) => {
          draw.url = res.data.file;
          return draw;
        });
      });

      Promise.all(raffles_promises).then((results) => {
        this.raffles = results;
        console.log("this.raffles", this.raffles);
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
      console.log(this.nftRaffleToBuy);
      this.buyRaffle(this.nftRaffleToBuy);
    },
    async buyRaffle(nftRaffleToBuy) {
      const getters = this.$store.getters;
      const address = getters.getAddress;
      console.log("nftRaffleToBuy", nftRaffleToBuy);
      console.log("address", address);
      console.log("ticket quantity", this.ticketNum);
      const raffleContract = getters.getRaffleContract;
      const tokenId = nftRaffleToBuy.nft_id.split("-")[1];
      console.log("pricetype", typeof nftRaffleToBuy.unit_price);

      try {
        await raffleContract
          .joinRaffle(tokenId, this.ticketNum)
          .sendTransaction({
            from: getters.getAddress,
            to: getters.getRaffleContractAddress,
            value: 1e18 * nftRaffleToBuy.unit_price * this.ticketNum,
          })
          .executed();
      } catch (e) {
        console.log(e);
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
          quantity: this.ticketNum,
          commission: 0,
          commission_currency: "cfx",
        })
        .then((res) => {
          this.$bvToast.toast("Purchase Tickets Successfully", {
            title: "Congrats",
            autoHideDelay: 3000,
            appendToast: false,
          });
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
          this.$bvToast.toast("Purchase Failed", {
            title: "Error",
            autoHideDelay: 3000,
            appendToast: false,
          });
        });

      this.hideModal();
    },
  },
};
</script>
<style  scoped>
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
  width: 65%;
  margin-left: 5%;
  display: inline-block;
  vertical-align: top;
}
.pool-card {
  /* background-color: rgb(38, 38, 38); */
  /* color: white; */
  /* padding: 4px; */
  height: 300px;
}
.pool-card-primary {
  display: flex;
  height: 90%;
  margin-top: 5%;
}
.card-primary {
  width: 80%;
  /* display: inline-block; */
}
.transaction-primary {
  width: 30%;
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

.card.pool-card {
  /* border: none;
  border-radius: 10px; */
}
#sidebar-card .collapse .card {
  /* border: none; */
}
#sidebar-card {
  /* border-radius: 25px; */
  height: 100%;
}
.card-img-left {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
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