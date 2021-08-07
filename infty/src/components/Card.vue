<template>
  <router-link :to="{ path:'/card/:id', name: 'card-detail', params: { id: card.nft_id || 'default_id', card: card } }">
    <b-card
      class="user-card"
      :img-src="card.url"
      :key="card.url"
      img-alt="Image"
      img-top
    >
      <b-card-text class="card-detail">
        <p>{{ card.title }}</p>
        <p>{{ card.collection }}</p>
        <b>{{ card.author }}author</b>
      </b-card-text>
      <template #footer>
        <div v-if="card.price">
          <span class="text-muted-left"
            ><small class="text-muted"
              ><b-icon icon="clock"></b-icon>&nbsp;{{
                card.expirationDate
              }}
              days left</small
            ></span
          >
          <span class="text-muted-right"
            ><small class="text-muted"
              ><b-icon icon="suit-diamond-fill"></b-icon>&nbsp;Price:
              {{ card.price }}</small
            ></span
          >
        </div>
        <div v-else>
          <small class="text-muted">Currently Unlisted</small>
          
          <small class="text-muted-right"
            ><b-button size="sm" style="margin-top: -3px" variant="primary" @click="listNftClicked"
              >List item</b-button
            ></small
          >
          <small class="text-muted-right mr-2"
            ><b-button size="sm" style="margin-top: -3px" variant="info" @click="raffleNftClicked"
              >Raffle it</b-button
            ></small
          >
          <b-modal ref="list-modal" title='List Item' @ok="handleListNft">
            <label>Price</label>
            <b-form-input class='mb-4' v-model='listing_price' placeholder="How much in cfx..."/>
            <label>Commision Fee</label>
            <b-form-input class='mb-4' v-model='listing_commision' placeholder="How much in cfx... (Minimum 2.5%)"/>
          </b-modal>
          <b-modal ref="raffle-modal" title='Raffle It' @ok="handleRaffleNft">
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
            
          </b-modal>
        </div>
      </template>
    </b-card>
  </router-link>
</template>

<script>
import axios from 'axios'
import { eventBus } from '../main'
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
    raffle_commision: undefined
  }),
  methods: {
    listNftClicked(e) {
      e.preventDefault();
      this.$refs['list-modal'].show()
    },
    raffleNftClicked(e) {
      e.preventDefault();
      this.$refs['raffle-modal'].show()
    },
    handleListNft() {
      axios.post(`${this.$store.getters.getApiUrl}/list-nft`, {
        price: this.listing_price,
        comission: this.listing_commision,
        currency: 'cfx',
        nftId: this.card.nft_id
      }).then(res => {
        this.$bvToast.toast("Listed Successfully", {
          title: 'Congrats',
          autoHideDelay: 3000,
          appendToast: false,
        })
        console.log(res.data)
        eventBus.$emit("Card.statusChanged", res.data.status)
      }).catch(err => {
        console.log(err)
        this.$bvToast.toast("Listing Failed", {
          title: 'Error',
          autoHideDelay: 3000,
          appendToast: false,
        })
      })
      
    },
    handleRaffleNft() {
      
    }
  },
};
</script>

<style scoped>
.user-card {
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
</style>