<template>
  <div class="flex-wrapper">
    <Navbar />
    <b-carousel controls indicators background="#dadada" class='carousel mt-4'>
      <b-carousel-slide v-for="nft in nfts" :key="nft.nft_id" >
        <template #img>
          <div @click="redirectToNft(nft.nft_id)">
            <img :src='nft.file' class='nft-img'/>
          </div>
        </template>
      </b-carousel-slide>
    </b-carousel>
    <div class="detail-content">
      <b-card
        class="detailed-card"
        :img-src="card.url"
        img-alt="Card image"
        img-top
      >
        <b-card-title
          ><b-icon icon="card-text"></b-icon>&nbsp;Description</b-card-title
        >
        <b-card-text>
          <p>Created by {{ card.author }}</p>
          <p>
            {{ card.description || "No description." }}
          </p>
        </b-card-text>
        <b-list-group flush>
          <b-list-group-item>
            <b-button
              v-b-toggle.collapse-1
              variant="outline-secondary"
              class="category-button"
              ><b-icon icon="file-earmark-richtext"></b-icon>About</b-button
            >
            <b-collapse id="collapse-1" class="mt-2">
              <p>
                Pixelglyphs are a set of 10,000 unique on-chain avatar NFTs
                created using a cellular automaton on the Ethereum blockchain.
              </p>
            </b-collapse>
          </b-list-group-item>
          <b-list-group-item>
            <b-button
              v-b-toggle.collapse-2
              variant="outline-secondary"
              class="category-button"
              ><b-icon icon="file-earmark-text"></b-icon>Details</b-button
            >
            <b-collapse id="collapse-2" class="mt-2">
              <p>Contact Address</p>
              <p>Token ID {{ rand(1000, 9999) }}</p>
              <p>Contact Address:Ethereum</p>
            </b-collapse>
          </b-list-group-item>
        </b-list-group>
      </b-card>
      <b-card-group deck class="transaction">
        <b-card
          class="transaction-info"
          header-tag="header"
          footer-tag="footer"
        >
          <template #header>
            <span class="mb-0">
              <b-icon icon="card-image"></b-icon>&nbsp;Album Name
            </span>
            <span class="mb-0 heart"
              ><button><b-icon icon="heart"></b-icon></button>&nbsp;2</span
            >
          </template>
          <b-card-text>Owned by {{ card.author }}</b-card-text>
          <!-- <template #footer>
            <em>Footer Slot</em>
          </template> -->
        </b-card>

        <b-card v-if='card.status == "sale"'
          class="transaction-info"
          header-tag="header"
          footer-tag="footer"
        >
          <template #header>
            <h6 class="mb-0">
              <b-icon icon="clock"></b-icon>&nbsp;Sale ends in
              {{ card.expirationDate }} days
            </h6>
          </template>
          <b-card-text>Current Price</b-card-text>
          <p>
            <b-icon icon="suit-diamond-fill"></b-icon>&nbsp;
            {{ card.price }}
          </p>

          <b-button href="#" variant="primary" @click="purchaseAlbum"
            ><b-icon icon="wallet2"></b-icon>&nbsp;&nbsp;Buy Now</b-button
          >
          <!-- <template #footer>
            <em>Footer Slot</em>
          </template> -->
        </b-card>
      </b-card-group>
    </div>

    <Footer style="z-index: 1" />
  </div>
</template>

<script>
import axios from 'axios'

import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
export default {
  name: "DetailPage",
  components: {
    Navbar,
    Footer,
  },
	props: ['card'],
  data() {
    return {
      isAuthor: false,
      nfts: []
    };
  },
  created() {
    const api = this.$store.getters.getApiUrl
    axios.get(`${api}/album/${this.$route.params.id}`)
      .then(async res => {
        const card = res.data
        card.url = card.file
        this.card = card;
        for (const nid of card.nft_ids) {
          const res = await axios.get(`${api}/nft/${nid}`)
          this.nfts.push(res.data)
        }
        console.log(this.nfts)
      })
  },
  methods: {
    rand(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    redirectToNft(nid) {
      this.$router.push(`/nft/${nid}`)
    },
    purchaseAlbum() {
      const buyer = this.$store.getters.getAddress
      if (!buyer) {
        this.$store.dispatch('connectWallet')
      }
      axios.post(`${this.$store.getters.getApiUrl}/purchase-album`, {
        album_id: this.card.album_id,
        buyer,
        commission: 10,
        commission_currency:'cfx'
      }).then(res =>{
        console.log(res)
      })
    }
  },
};
</script>

<style scoped>
.detailed-card {
  float: left;
  width: 35vw;
  margin-top: 2em;
  margin-left: 5%;
  margin-bottom: 2em;
}
.category-button {
  width: 100%;
}
.heart {
  float: right;
}
.detail-content {
  /* display: flex; */
}
.transaction {
  float: left;
  margin-top: 2em;
  margin-left: 10vw;
  width: 40vw;
  height: 50vh;
  display: flex;
  flex-direction: column;
  gap: 40px;
}
/* .transaction-info {
  margin-bottom: 20px;
} */
.carousel {
  width: 80vw;
  margin-left:auto;
  margin-right:auto;
  color:#dadada
}
.nft-img {
  max-height: 500px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>