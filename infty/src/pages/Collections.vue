<template>
    <div class='flex-wrapper'>
        <Navbar active-index='2'/>
        <div class='flex-wrapper-row m-3'>
        <b-tabs class='main-content' content-class="ml-5 mr-5">
            <b-tab title="NFT" active>
                <div class='cards-container'>
                <Card class='mt-4 card' v-for="nft in nfts" :card="nft" :key="nft.url" />
                </div>
            </b-tab>
            <b-tab title="Album"><p>TODO</p></b-tab>
        </b-tabs>
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

import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import Card from '../components/Card.vue'
export default {
    name: "Collections",
    components: {
        Navbar,
        Footer,
        Card
    },
    data: () => ({
        nfts: [
        {
          collection: "SupDucks",
          author: "Ada Lovelace",
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
        },
        {
          collection: "Art Blocks Curated",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          collection: "Bored Ape Kennel Club",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          collection: "Cool Cats",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          collection: "ZED RUN",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          collection: "FameLadySquad",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          collection: "Sorare",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          collection: "Meebits",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          collection: "Ape Gang",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        ]
    }),
    async mounted() {
      const getters = this.$store.getters
      const accounts = await window.conflux.send("cfx_requestAccounts")
      this.$store.commit("setAccount", accounts[0])
      const res = await axios.get(`${getters.getApiUrl}/profile/${getters.getAccount}`)
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

