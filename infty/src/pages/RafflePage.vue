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
                variant="info"
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
                variant="info"
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
                  <b-button id="price-apply-btn" variant="outline-info"
                    >Apply</b-button
                  >
                </b-card>
              </b-collapse>
            </b-list-group-item>
            <b-list-group-item>
              <b-button
                pill
                v-b-toggle.collapse-3
                variant="info"
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
                variant="info"
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
                variant="info"
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
      <div class="pool">
        <div id="banner">
          <img
            src="@/assets/imgs/currency.png"
            alt="Girl in a jacket"
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
            <div class="pool-card-info">
              <div class="card-info">
                <p>{{ card.title }}</p>
                <p>Owner: {{ card.owner }}</p>
                <p>Discription: {{ card.description }}</p>
              </div>
              <div class="transaction-info">
                <div class="price">
                  <b-badge class="price-item" style="background-color: #6be8aa"
                    >20%</b-badge
                  >
                  <b-badge class="price-item" style="background-color: #f669a6"
                    >10USD</b-badge
                  >
                </div>
                <b-button class="buy-btn" pill variant="primary">Buy</b-button>
              </div>
            </div>

            <!-- <b-card-text>
              Some quick example text to build on the card and make up the bulk
              of the card's content.
            </b-card-text> -->
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
    };
  },
  methods() {
    // sidebarHeight(){
    // }
  },
};
</script>
<style  scoped>
@import url("https://fonts.googleapis.com/css2?family=Palette+Mosaic&display=swap");
.raffle-page {
  background-color: black;
}
#sidebar {
  margin-top: 2em;
  display: inline-block;
  text-align: left;
  vertical-align: top;
  border-radius: 10px;
}
.filter-header {
  text-align: center;
  font-family: "Palette Mosaic", cursive;
  color: white;
}
#sidebar-card,
.list-group-item {
  background-color: #96cace;
}
.category-button {
  width: 100%;
}
#banner {
  margin-top: 2em;
  border-radius: 10px;
  background-image: linear-gradient(-20deg, #6e45e2 0%, #88d3ce 100%);
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
  background-color: rgb(122, 128, 213);
  color: white;
}
.pool-card-info {
  display: flex;
  height: 90%;
  margin-top: 5%;
}
.card-info {
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
  margin-left: 8px;
}
.buy-btn {
  width: 60%;
  height: 40px;
  text-align: center;
  margin-top: 2em;
  margin-left: 20%;
  background-color: #2b2fb5;
  border: rgb(122, 128, 213);
  /* line-height: 40px; */
}
.card.pool-card {
  border: none;
  border-radius: 10px;
}
#sidebar-card .collapse .card {
  border: none;
  background-color: #96cace;
}
#sidebar-card {
  border-radius: 25px;
  height: 100%;
}
</style>