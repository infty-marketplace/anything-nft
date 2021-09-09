<template>
  <div>
    <b-card
      class="user-card"
      @click="cardClicked"
    >
    <!-- <b-form-checkbox
      v-bind:class="{'checkbox': !checkState, 'checkbox-active': checkState}"
      v-model='checkState'
      :value="true"
      :unchecked-value="false"
      v-if="card.status == 'private'"
      @change="checkBox"
    /> -->
    <!-- <router-link :to="{ path:'/card/:id', name: 'card-detail', params: { id: card.nft_id || 'default_id', card: card } }"> -->
    <img @click="cardClicked" :src='card.url' class='nft-img'/>
      <b-card-text class="card-detail">
        <p>{{ card.title }}</p>
        <p>{{ card.collection }}</p>
        <b>{{ card.author }}</b>
      </b-card-text>
      <template #footer>
        <div v-if="card.status == 'sale'">
          <span class="text-muted-left"
            ><small class="text-muted"
              ><b-icon icon="clock"></b-icon>&nbsp;X
              days left</small
            ></span
          >
          <span class="text-muted-right"
            ><small class="text-muted"
              ><b-icon icon="suit-diamond-fill"></b-icon>&nbsp;Price:
              {{ card.price }}</small
            ></span>
            
        </div>
        <div v-else>
          <small class="text-muted">Currently Unlisted</small>
          
          <small class="text-muted-right"
            ><b-button size="sm" style="margin-top: -3px" variant="primary" @click="listAlbumClicked"
              >List album</b-button
            ></small
          >
          <!-- <small class="text-muted-right mr-2"
            ><b-button size="sm" style="margin-top: -3px" variant="info" @click="raffleNftClicked"
              >Raffle it</b-button
            ></small
          > -->
          <b-modal ref="list-modal" title='List Album' @ok="handleListAlbum">
            <label>Album Price</label>
            <b-form-input class='mb-4' v-model='listing_price' placeholder="How much in cfx..."/>
            <label>Commision Fee</label>
            <b-form-input class='mb-4' v-model='listing_commision' placeholder="How much in cfx... (Minimum 2.5%)"/>
            <div v-for='nft in nfts' :key="nft.nft_id">
              <label>Item Price for '{{nft.title}}'</label>
              <b-form-input class='mb-4' v-model='nft.listing_price' placeholder="How much in cfx..."/>
            </div>
          </b-modal>
          <!-- <b-modal ref="raffle-modal" title='Raffle It' @ok="handleRaffleNft">
            <label>Ticket Price</label>
            <b-form-input class='mb-4' v-model='raffle_price' placeholder="How much in cfx..."/>
            <label>Number of Tickets</label>
            <b-form-input class='mb-4' v-model='raffle_tickets' placeholder="How many tickets..."/>
            <label>Commision</label>
            <b-form-input class='mb-4' v-model='raffle_commision' placeholder="How much in cfx... (Minimum 5%)"/>
            <b-form-checkbox
              id="checkbox-1"
              v-model="status"
              name="checkbox-1"
              value="accepted"
              unchecked-value="not_accepted"
            >
              One Ticket Per Address
            </b-form-checkbox>
            
          </b-modal> -->
        </div>
        <b-btn v-if='card.status == "sale" && !onMarket' variant='info' class='text-muted-right' @click='delistAlbum'>Delist</b-btn>
      </template>
      <!-- </router-link> -->
    </b-card>
    
  </div>
</template>

<script>
import axios from 'axios'
import { eventBus } from '../main'
import { Notification } from 'element-ui'

export default {
  name: "Card",
  props: {
    card: Object,

  },
  data:() => ({
    status: undefined,
    listing_price: undefined,
    listing_commision: undefined,
    raffle_price: undefined,
    raffle_tickets: undefined,
    raffle_commision: undefined,
    checkState: false,
    nfts: []
  }),
  created() {
    this.$store.getters.getNftsInAlbum(this.card.album_id)
    .then(async nft_ids => {
      const nft_promises = nft_ids.map((nid) =>
          axios.get(`${this.$store.getters.getApiUrl}/nft/${nid}`)
      );
      const nft_promises_result = await Promise.allSettled(nft_promises);
      this.nfts = nft_promises_result.map((p) => {
          if (p.status == "fulfilled") return p.value.data;
      });
    })
  },
  methods: {
    listAlbumClicked(e) {
      e.preventDefault();
      this.$refs['list-modal'].show()
    },
    // raffleNftClicked(e) {
    //   e.preventDefault();
    //   this.$refs['raffle-modal'].show()
    // },
    async handleListAlbum() {
      const getters = this.$store.getters;
      this.$store.dispatch('notifyCommission')
      const tx = window.confluxJS.sendTransaction({
        from: (await window.conflux.send("cfx_requestAccounts"))[0],
        to: getters.getManagerAddr,
        gasPrice: 1,
        value: 1e18*(parseFloat(this.listing_commision))
      })

      const res = await tx.executed()
      console.log(res)
      await getters.getMinterContract.setApprovalForAll(getters.getManagerAddr, true).sendTransaction({from:getters.getAddress, to: getters.getMinterAddress, gasPrice: 1}).executed()
      const nft_prices = {}
      this.nfts.forEach(n => nft_prices[n.nft_id] = n.listing_price)
      axios.post(`${this.$store.getters.getApiUrl}/list-album`, {
        price: this.listing_price,
        nft_prices,
        comission: this.listing_commision,
        currency: 'cfx',
        album_id: this.card.album_id
      }).then(() => {
        Notification.closeAll()
        this.$notify({
          title: "Congrats",
          message: "Album listed successfully",
          duration: 3000,
          type: 'success'
        })
        eventBus.$emit("AlbumCard.statusChanged", this.card.album_id)
      }).catch(err => {
        console.log(err)
        this.$bvToast.toast("Listing Failed", {
          title: 'Error',
          autoHideDelay: 3000,
          appendToast: false,
        })
      })
      
    },
    delistAlbum(e) {
      e.preventDefault()
      axios.post(`${this.$store.getters.getApiUrl}/delist-album`, {album_id: this.card.album_id})
        .then(res => {
          this.$bvToast.toast("Delisted Successfully", {
            title: 'Info',
            autoHideDelay: 3000,
            appendToast: false,
          })
          eventBus.$emit("AlbumCard.statusChanged", this.card.album_id)
          console.log(res)
        })
    },
    // checkBox() {
    //   if (this.checkState) {
    //     eventBus.$emit("Card.addAlbumCandidate", this.card.nft_id)
    //   } else {
    //     eventBus.$emit("Card.delAlbumCandidate", this.card.nft_id)
    //   }
    // },
    cardClicked(e) {
      if (!['BUTTON', 'LABEL', 'INPUT'].includes(e.srcElement.nodeName)) this.$router.push({ path:'/album/:id', name: 'album-detail', params: { id: this.card.album_id || 'default_id', card: this.card } })
    }
  },
  computed: {
    onMarket: function() {
      return this.$route.path.includes('marketplace')
    }
  },
};
</script>

<style scoped>
.user-card {
  width: 100%;
  transition: all 0.15s ease-in-out;
}
.user-card:hover {
  transform: scale(1.02);
  box-shadow: 0 0 5px rgba(33, 33, 33, 0.2);
  cursor: pointer;
}
.text-muted-right {
  float: right;
}
.card-detail {
  font-size: 0.875em;
}
.checkbox {
  display: none;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 0;
}

.checkbox-active {
  display: block;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 0;
}
.checkbox:hover {
  display: block;
}

.user-card:hover .checkbox {
  display: block;
}
.nft-img {
  width:100%;
  height: 250px;
  object-fit: contain;
  cursor: pointer;
  border-radius: 15px;
}
</style>