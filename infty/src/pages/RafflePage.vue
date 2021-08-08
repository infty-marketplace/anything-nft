<template>
  <div class="raffle-page">
    <Navbar active-index="1" />
    <div>
      <div id="sidebar" style="width: 20%">
        <b-card nobody id="sidebar-card">
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
                    v-model="text"
                    placeholder="Min"
                    class="price-range"
                  ></b-form-input>
                  <span>to</span>
                  <b-form-input
                    v-model="text"
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
        :title="modalTitle"
        class="ticket-modal"
      >
        <div>
          <div class="ticketInfo-form">
            <p class="ticketInfo-label">Ticket Number:</p>
            <b-form-spinbutton v-model="ticketNum" min="1" max="100">
            </b-form-spinbutton>
          </div>
          <p>
            <span class="ticketInfo-label">Total Price:</span>
            {{ ticketNum * 10 }} USD
          </p>
        </div>
        <b-button
          class="buy-btn"
          id="modal-buy"
          variant="primary"
          @click="hideModal"
          >Buy Now</b-button
        >
      </b-modal>

      <div class="pool">
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
        <div class="mt-4" v-for="card in usersCards" :key="card.url">
          <b-card
            :img-src="card.url"
            img-alt="Card image"
            img-left
            class="mb-3 pool-card"
          >
            <div class="pool-card-primary">
              <div class="card-primary">
                <p>{{ card.title }}</p>
                <p>Owner: {{ card.owner }}</p>
                <p>Discription: {{ card.description }}</p>
              </div>
              <div class="transaction-primary">
                <div class="price">
                  <b-badge
                    class="price-item"
                    style="background-color: rgb(236, 105, 166)"
                    >20%</b-badge
                  >
                  <b-badge
                    class="price-item"
                    style="background-color: rgb(236, 105, 166)"
                    >10USD</b-badge
                  >
                </div>
                <b-button
                  class="buy-btn"
                  variant="primary"
                  @click="buyNft(card)"
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
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "RafflePage",
  components: {
    Navbar,
    Footer,
  },
  async mounted() {
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
    modalTitle: function () {
      if (!this.nftToBuy) {
        return "nftCardTitle";
      }
      return this.nftToBuy.title;
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
      usersCards: [
        {
          id: 1,
          title: "my NFT",
          description: "good",
          owner: "cfx:dsfawe",
          collection: "SupDucks",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          id: 2,
          title: "my NFT",
          description: "good",
          owner: "cfx:dsfawe",
          collection: "Art Blocks Curated",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          id: 3,
          title: "my NFT",
          description: "good",
          owner: "cfx:dsfawe",
          collection: "Bored Ape Kennel Club",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          id: 4,
          title: "my NFT",
          description: "good",
          owner: "cfx:dsfawe",
          collection: "Cool Cats",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
      ],
      ticketNum: 1,
      nftToBuy: null,
    };
  },
  methods: {
    async loadNfts() {
      // const getters = this.$store.getters;
      // const res = await axios.get(
      //   `${getters.getApiUrl}/profile/${getters.getAddress}`
      // );
      // const nft_promises = res.data.nft_ids.map((nid) =>
      //   axios.get(`${getters.getApiUrl}/nft/${nid}`)
      // );
      // const nft_promises_result = await Promise.allSettled(nft_promises);
      // let nfts = nft_promises_result.map((p) => {
      //   if (p.status == "fulfilled") {
      //     return p.value.data;
      //   }
      // });
      // nfts = nfts.map((n) => {
      //   n.url = n.file;
      //   n.author = n.owner[0].address;
      //   return n;
      // });
      // this.nfts = nfts;
    },
    showModal() {
      this.$refs["my-modal"].show();
    },
    hideModal() {
      this.nftTicketToBuy = null;
      this.$refs["my-modal"].hide();
    },
    buyNft(card) {
      this.showModal();
      this.nftToBuy = card;
      // if (this.nftTicketToBuy) {
      //   this.showModal();
      // }
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
  width: 60%;
  margin-left: 5%;
  display: inline-block;
  vertical-align: top;
}
.pool-card {
  /* background-color: rgb(38, 38, 38); */
  /* color: white; */
  /* padding: 4px; */
}
.pool-card-primary {
  display: flex;
  height: 90%;
  margin-top: 5%;
}
.card-primary {
  width: 70%;
  /* display: inline-block; */
}
.price {
  padding: 10px;
  /* display: flex; */
  /* justify-content: space-evenly; */
  text-align: center;
}
.price-item {
  width: 80px;
  height: 40px;
  text-align: center;
  line-height: 37px;
  margin-right: 8px;
}
.buy-btn {
  color: rgb(38, 38, 38);
  font-weight: bold;
  width: 80%;
  margin-left: 10%;
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
.ticket-modal {
  margin: auto;
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