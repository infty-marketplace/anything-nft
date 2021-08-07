<template>
    <div class='flex-wrapper'>
        <Navbar active-index='2'/>
        <div class='flex-wrapper-row m-3' v-if='$store.getters.getAddress'>
        <b-tabs class='main-content' content-class="ml-5 mr-5">
            <b-tab title="NFT" active>
                <div class='cards-container'>
                <Card class='mt-4 card' v-for="nft in nfts" :card="nft" :key="nft.url" />
                <p class='mt-4' v-if="nfts.length == 0">Nothing</p>
                </div>
            </b-tab>
            <b-tab title="Album"><p>TODO</p></b-tab>
        </b-tabs>
        </div>
        <div v-else class='flex-wrapper-row'>
          <ConnectWallet />
        </div>
        <Footer style="z-index:0"/>
        <a href='/mine/create'>
        <b-btn variant='primary' class='add-btn'>
            <b-icon icon="plus-circle-fill"></b-icon>
        </b-btn></a>
    </div>

</template>

<script>
import axios from 'axios'
import { eventBus } from '../main'

import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import Card from '../components/Card.vue'
import ConnectWallet from '../components/ConnectWallet.vue'

export default {
    name: "Collections",
    components: {
        Navbar,
        Footer,
        Card,
        ConnectWallet
    },
    data: () => ({
        nfts: []
    }),
    async mounted() {
      if (this.$store.getters.getAddress) this.loadNfts();
      this.$store.dispatch('connectWallet')

      eventBus.$on("Collections.loadNfts", ()=>this.loadNfts())
      eventBus.$on("Card.statusChanged", (nid) => {
        axios.get(`${this.$store.getters.getApiUrl}/nft/${nid}`)
          .then(res => {
            const newNft = res.data
            newNft.url = newNft.file
            newNft.author = newNft.owner[0].address
            this.$set(this.nfts, this.nfts.findIndex(n => n.nft_id == nid), newNft)
          })
      })
    },
    beforeDestroy() {
      eventBus.$off("Collections.loadNfts")
    },
    methods: {
      async loadNfts() {
        const getters = this.$store.getters
        const res = await axios.get(`${getters.getApiUrl}/profile/${getters.getAddress}`)
        const nft_promises = res.data.nft_ids.map((nid) => axios.get(`${getters.getApiUrl}/nft/${nid}`))
        const nft_promises_result = await Promise.allSettled(nft_promises)
        let nfts = nft_promises_result.map(p => {
          if (p.status == 'fulfilled') {
            return p.value.data;
          }
        })
        nfts = nfts.map(n => {
          n.url = n.file;
          n.author = n.owner[0].address
          return n
        })
        this.nfts = nfts;
      }
    }
}
</script>

<style scoped>
.main-content {
    width: 100%;
    max-width: 80vw;
}

.add-btn {
    position: fixed;
    bottom: 5vh;
    right: 5vw;
    height: 4vh;
    box-shadow: 0 0 5px rgba(33,33,33,.2); 
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
}

.card {
 max-width: 400px;
 height:100%;
}
</style>

