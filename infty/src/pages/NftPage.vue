<template>
  <div class="flex-wrapper">
    <Navbar />
    <div class="detail-content">
      <b-card
        class="detailed-card"
        :img-src="card&&card.url"
        img-alt="Card image"
        img-top
      >
        <b-card-title
          ><b-icon icon="card-text"></b-icon>&nbsp;Description</b-card-title
        >
        <b-card-text>
          <p>Created by {{ card && card.author_name }}</p>
          <p>
            {{ card && card.description || "No description." }}
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
              <b-icon icon="card-image"></b-icon>&nbsp;{{card && card.title}}
            </span>
            <!-- <span class="mb-0 heart"
              ><button><b-icon icon="heart"></b-icon></button>&nbsp;2</span
            >  -->
            <div class='like-container'>
              <HeartBtn/>
            </div>
          </template>
          <b-card-text>Owned by {{ card && card.owner_name }}</b-card-text>
          <!-- <template #footer>
            <em>Footer Slot</em>
          </template> -->
        </b-card>

        <b-card
          class="transaction-info"
          header-tag="header"
          footer-tag="footer"
          v-if='!isOwner'
        >
          <template #header>
            <h6 class="mb-0" v-if="card.expirationDate">
              <b-icon icon="clock"></b-icon>&nbsp;Sale ends in
              {{ card.expirationDate }} days
            </h6>
          </template>
          <b-card-text>Current Price</b-card-text>
          <p>
            <b-icon icon="suit-diamond-fill"></b-icon>&nbsp;
            {{ card.price }}
          </p>

          <b-button href="#" variant="primary" @click="buyNowClicked" v-if="!isOwner&&card.status=='sale'"
            ><b-icon icon="wallet2"></b-icon>&nbsp;&nbsp;Buy now</b-button
          >
          <b-button variant="outline-primary" class='ml-2' @click='$store.dispatch("notifyWIP")'><b-icon icon='tag-fill'/>&nbsp;Make offer</b-button>
          <b-modal ref="buy-modal" title='List Item' @ok="purchaseNft">
            <label>Price</label>
            <p>
              <b-icon icon="suit-diamond-fill"></b-icon>&nbsp;
              {{ card.price }}
            </p>
            <label>Commision Fee</label>
            <b-form-input class='mb-4' v-model='listing_commision' placeholder="How much in cfx... (Minimum 2.5%)"/>
          </b-modal>
          <!-- <template #footer>
            <em>Footer Slot</em>
          </template> -->
        </b-card>
        <b-card
          class="transaction-info"
          header-tag="header"
          footer-tag="footer"
        >
       
        <template #header>
          Offers
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
import axios from "axios"
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import HeartBtn from "../components/HeartBtn.vue";

export default {
  name: "DetailPage",
  components: {
    Navbar,
    Footer,
    HeartBtn
  },
  props: ['card'],
  data: () => ({
      isOwner: true,
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
  }),
  created() {
    if (this.card) return;
    if (this.$store.getters.getAddress == undefined) this.$store.dispatch("connectWallet");
  },

  async mounted() {
    const res = await axios.get(`${this.$store.getters.getApiUrl}/nft/${this.$route.params.id}`)
    const card = res.data;
    await axios.get(`${this.$store.getters.getApiUrl}/profile/${card.author}`).then(resp => {
      card.author_name = resp.data.first_name + " " + resp.data.last_name;
      if (this.$store.getters.getAddress != card.owner[0].address) this.isOwner = false;
    })
    await axios.get(`${this.$store.getters.getApiUrl}/profile/${card.owner[0].address}`).then(resp => {
      card.owner_name = resp.data.first_name + " " + resp.data.last_name;
      card.url = card.file;
      this.card = card;
    })
    
  },
  methods: {
    rand(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    buyNowClicked(e) {
      e.preventDefault();
      this.$refs['buy-modal'].show()
    },

    async purchaseNft() {
      const getters = this.$store.getters;

      const tx = window.confluxJS.sendTransaction({
        from: (await window.conflux.send("cfx_requestAccounts"))[0],
        to: getters.getManagerAddr,
        gasPrice: 1,
        value: 1e18*(parseFloat(this.listing_commision) + parseFloat(this.card.price))
      })

      const res = await tx.executed()
      console.log(res)
      
      console.log(getters.getAddress)
      const data = {
        nft_id: this.card.nft_id,
        buyer: getters.getAddress,
        commission: this.listing_commision,
        commission_currency: 'cfx'
      };
      axios.post(`${getters.getApiUrl}/purchase-nft`, data).then(
        res => {
          if (res.status == 200) {
              this.$bvToast.toast("NFT Purchased Successfully", {
                  title: "Notification",
                  autoHideDelay: 3000
              })
              const ownerAddress = getters.getAddress;
              axios.get(`${this.$store.getters.getApiUrl}/profile/${ownerAddress}`).then((resp) => {
                this.card.owner_name = resp.data.first_name + " " + resp.data.last_name;
                this.isOwner = (ownerAddress == this.card.author);
                this.card.status = 'private';
                this.$forceUpdate();
              })
          }
        }
      ).catch(err => {
        console.log(err)
        this.$bvToast.toast("Purchase Failed", {
          title: 'Error',
          autoHideDelay: 3000,
          appendToast: false,
        })
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
  display: flex;
  flex-direction: column;
  gap: 40px;
}
/* .transaction-info {
  margin-bottom: 20px;
} */
.like-container {
  float: right;
  margin-top: -55px;
  margin-right: -80px;
  margin-bottom: -60px;
  transform: scale(0.15);
}
</style>