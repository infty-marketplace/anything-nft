<template>
  <div class="flex-wrapper">
    <Navbar />
    <button @click='$router.go(-1)' class='back-btn'><i class='el-icon-back' style='color:white'/></button>
    <div class="detail-content mb-4">
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
              <p>Contract Address: <a target="_blank" :href='`https://testnet.confluxscan.io/token/${$store.getters.getMinterAddress}`'>{{$store.getters.getMinterAddress}}</a></p>
              <p>Token ID {{ rand(1000, 9999) }}</p>
            </b-collapse>
          </b-list-group-item>
        </b-list-group>
      </b-card>
      <div class='album-title-container'>
        <h1 class='album-title'>&nbsp;{{ card.title }}</h1>
        
        <h5 class='owner'>&nbsp;&nbsp;&nbsp;&nbsp;Owned by {{card.owner_name}}&nbsp;&nbsp;&nbsp;
          <div style='display: inline-block'><b-icon icon='eye'/>&nbsp;{{view}} views</div>
          <div style='display: inline-block'>
            <div class='like' @click='likes+=likeswitch;likeswitch*=-1;'><heart-btn/></div> {{likes}} likes
          </div>
          
          </h5>
      </div>
      
      <b-card-group deck class="transaction">
        
        <el-tooltip style='cursor:pointer' effect="dark" content="You'll see the content once you purchase the NFT." placement="top">
          <div class='unlock'><i class='el-icon-lock'></i>&nbsp;&nbsp;Contains Unlockable Content</div>
          </el-tooltip>
        <b-card
          class="transaction-info"
          header-tag="header"
          footer-tag="footer"
          v-if='!isOwner'
        >
          <template #header>
            <h6 class="mb-0">
              <b-icon icon="clock"></b-icon>&nbsp;Sale ends in
              5 days
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
  data() {
    return {
      isOwner: true,
      likes: this.rand(0,100),
      view: this.rand(100,2000),
      likeswitch: 1,
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
      ]}
  },
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
  width: 500px;
  margin-top: 2rem;
  margin-bottom: 2rem;
  margin-right: 1rem;
}
@media screen and (max-width: 2000px) {
  .detailed-card {
    width: 300px;
  }
}
.category-button {
  width: 100%;
}
.heart {
  float: right;
}
.detail-content {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}
@media screen and (max-width: 2000px) {
  .detailed-content {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
}
.transaction {
  float: left;
  margin-top: 2rem;
  margin-left: 0.5rem;
  width: calc(80vw - 600px);
  display: flex;
  flex-direction: column;
  gap: 40px;
}
@media screen and (max-width: 2000px) {
  .transaction {
    width: calc(80vw - 350px);
  }
}
.transaction-info {
  max-width: 100%;
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
.back-btn {
  position: absolute;
  top: 150px;
  left: -10px;
  width: 60px;
  border-radius: 20%;
  background-color: rgb(72, 83, 87);
  border: unset;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
}
.unlock {
  display: inline-block;
  padding: 0.3rem;
  font-size: 1rem;
  font-weight: bold;
  color:rgb(203, 132, 236);
  border-style: solid;
  border-width: 0.2rem;
  border-image: linear-gradient(170deg, rgb(224, 169, 255), rgb(101, 224, 255)) 1;
  margin: 0 15px;
}
</style>