<template>
  <div class="flex-wrapper">
    <Navbar />
    <div class="detailed-content" id='album-page'>
      <b-card
        class="detailed-card"
      >
        <el-carousel trigger="click" class='carousel' :autoplay='false'>
          <el-carousel-item class='crs-item'>
            <el-tooltip class="item" effect="dark" content="Whoever collects all of the NFTs in this album will be rewarded with this album cover NFT." placement="top-start">
              <b-icon icon='sun' class='cover-tag'/>
            </el-tooltip>
            <img :src="card.url" class='nft-img'/>
          </el-carousel-item>
          <el-carousel-item class='crs-item' v-for="nft in nfts" :key="nft.nft_id">
            <img :src="nft.file" class='nft-img'/>
          </el-carousel-item>
        </el-carousel>
        
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
      <div class='album-title-container'>
        <h1 class='album-title'>&nbsp;{{ card.title }}</h1>
        <h5 class='owner'>&nbsp;&nbsp;&nbsp;&nbsp;Owned by {{this.ownerName}}&nbsp;&nbsp;&nbsp;
          <b-icon icon='eye'/>&nbsp;{{view}} views
          <div class='like' @click='likes+=likeswitch;likeswitch*=-1;'><heart-btn/></div> {{likes}} likes
          </h5>
      </div>
      
      
      <b-card-group deck class="transaction">
        <b-card
          class="transaction-info"
          header-tag="header"
          footer-tag="footer"
        >
          <template #header>
            <span class="mb-0">
              <b-icon icon="list"></b-icon>&nbsp;NFTs
            </span>
            
          </template>
           <el-table
          :data="nftsTable"
          style="width: 100%"
          height='200'
          empty-text="Nothing">
          <el-table-column
            prop="title"
            label="NFT Title"
            width="180">
          </el-table-column>
          <el-table-column
            prop="price"
            label="Listing Price"
            width="180">
          </el-table-column>
          <el-table-column
            prop="usd"
            label="in USD">
          </el-table-column>
          <el-table-column
            prop="owner"
            label="Owner">
          </el-table-column>
        </el-table>
        
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
        <b-card>
          <template #header>
            <h6 class="mb-0">
              <b-icon icon="card-list"/> Offers
            </h6>
          </template>
          <el-table
          :data="offersData"
          style="width: 100%"
          height='200'
          empty-text="Nothing">
          <el-table-column
            prop="unit_price"
            label="Unit Price"
            width="180">
          </el-table-column>
          <el-table-column
            prop="usd"
            label="USD"
            width="180">
          </el-table-column>
          <el-table-column
            prop="exp"
            label="Expiration">
          </el-table-column>
          <el-table-column
            prop="from"
            label="From">
          </el-table-column>
        </el-table>
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
import HeartBtn from '../components/HeartBtn.vue'
export default {
  name: "DetailPage",
  components: {
    Navbar,
    Footer,
    HeartBtn
  },
	props: ['card'],
  data() {
    return {
      isAuthor: false,
      ownerName: '',
      nfts: [],
      likes: this.rand(0,100),
      view: this.rand(100,2000),
      likeswitch: 1,
      nftsTable: [
        {
          title: 'Title A',
          price: '1',
          usd: '3',
          owner: '0x0'
        },
        {
          title: 'Title B',
          price: '1',
          usd: '3',
          owner: '0x0'
        }
      ],
      offersData: [{
        unit_price: 30,
        usd: 9,
        exp: '2 days',
        from: 'William M'
      },{
        unit_price: 1,
        usd: 0.3,
        exp: '1 days',
        from: 'User M'
      },{
        unit_price: 1,
        usd: 0.3,
        exp: '1 days',
        from: 'User A'
      },{
        unit_price: 1,
        usd: 0.3,
        exp: '1 days',
        from: 'User B'
      },
      ]
    };
  },
  created() {
    const api = this.$store.getters.getApiUrl
    axios.get(`${api}/album/${this.$route.params.id}`)
      .then(async res => {
        const card = res.data
        console.log(res)
        card.url = card.file
        this.card = card;
        for (const nid of card.nft_ids) {
          const res = await axios.get(`${api}/nft/${nid}`)
          this.nfts.push(res.data)
        }
        console.log(this.nfts)
        axios.get(`${api}/profile/${this.card.owner}`).then(resp => {
          this.ownerName = resp.data.first_name + " " + resp.data.last_name;
        })
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
  margin-top: 2em;
  margin-left: 5%;
  margin-bottom: 2em;
  width: 550px;
  margin-right: 1em;
}

.category-button {
  width: 100%;
}
.heart {
  float: right;
}

.transaction {
  margin-top: 2em;
  width: calc(80vw - 800px);
  display: flex;
  flex-direction: column;
  gap: 40px;
  position: inline;
}
.transaction-info {
  max-width: 100%;
}
.carousel {
  width: 80vw;
  margin-left:auto;
  margin-right:auto;
  color:#dadada
}
.nft-img {
  margin-left: auto;
  margin-right: auto;
  display: block;
  object-fit: contain;
  height: 500px;
  width: 500px;
}

.cover-tag {
  width: 30px;
  height:30px;
  position: absolute;
  left: 5px;
  top: 5px;
  color: rgb(64, 215, 253);
  cursor: pointer;
}

.carousel {
  width: 500px;
  height: 500px;
}

.crs-item {
  width: 500px;
  height: 500px;
}

#album-page {
  margin-left: auto;
  margin-right: auto;
  width: 80vw;
}

.album-title-container {
  margin-top: 2rem;
}
.album-title {
  font-weight: bold;
  font-size: 4rem;
}

.like {
  display: inline-block;
  transform: scale(0.2);
  margin-top: -100px;
  margin-bottom: -58px;
  margin-left: -30px;
  margin-right: -60px;
}
</style>

<style>
#album-page .el-carousel__container {
  height: 500px;
}
</style>