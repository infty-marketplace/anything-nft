<template>
  <div>
    <b-card
      class="user-card"
      :img-src="card.url"
      :key="card.url"
      img-alt="Image"
      img-top
      @click="cardClicked"
    >
      <b-form-checkbox
        v-bind:class="{ checkbox: !checkState, 'checkbox-active': checkState }"
        v-model="checkState"
        :value="true"
        :unchecked-value="false"
        v-if="card.status == 'private'"
        @change="checkBox"
      />
      <!-- <router-link :to="{ path:'/card/:id', name: 'card-detail', params: { id: card.nft_id || 'default_id', card: card } }"> -->
      <b-card-text class="card-detail">
        <p>{{ card.title }}</p>
        <p>{{ card.collection }}</p>
        <b>{{ card.author }}</b>
      </b-card-text>
      <template #footer>
        <div v-if="card.status == 'sale'">
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
            ><b-button
              size="sm"
              style="margin-top: -3px"
              variant="primary"
              @click="listNftClicked"
              >List item</b-button
            ></small
          >
          <small class="text-muted-right mr-2"
            ><b-button
              size="sm"
              style="margin-top: -3px"
              variant="info"
              @click="raffleNftClicked"
              >Raffle it</b-button
            ></small
          >
          <b-modal ref="list-modal" title="List Item" @ok="handleListNft">
            <label>Price</label>
            <b-form-input
              class="mb-4"
              v-model="listing_price"
              placeholder="How much in cfx..."
            />
            <label>Commision Fee</label>
            <b-form-input
              class="mb-4"
              v-model="listing_commision"
              placeholder="How much in cfx... (Minimum 2.5%)"
            />
          </b-modal>
          <b-modal ref="raffle-modal" title="Raffle It" @ok="handleRaffleNft">
            <label>Ticket Price</label>
            <b-form-input
              class="mb-4"
              v-model="raffle_price"
              placeholder="How much in cfx..."
            />
            <label>Number of Tickets</label>
            <b-form-input
              class="mb-4"
              v-model="raffle_tickets"
              placeholder="How many tickets..."
            />
            <label>Commision</label>
            <b-form-input
              class="mb-4"
              v-model="raffle_commision"
              placeholder="How much in cfx... (Minimum 5%)"
            />
            <label for="example-datepicker">Deadline</label>
            <b-form-datepicker
              id="example-datepicker"
              v-model="deadline"
              class="mb-2"
            ></b-form-datepicker>
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
        <b-btn
          v-if="card.status == 'sale'"
          variant="info"
          class="text-muted-right"
          @click="delistNft"
          >Delist</b-btn
        >
      </template>
      <!-- </router-link> -->
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";

export default {
  name: "Card",
  props: {
    card: Object,
  },
  data: () => ({
    status: undefined,
    listing_price: undefined,
    listing_commision: undefined,
    raffle_price: undefined,
    raffle_tickets: undefined,
    raffle_commision: undefined,
    checkState: false,
  }),
  methods: {
    listNftClicked(e) {
      e.preventDefault();
      this.$refs["list-modal"].show();
    },
    raffleNftClicked(e) {
      e.preventDefault();
      this.$refs["raffle-modal"].show();
    },
    handleListNft() {
      axios
        .post(`${this.$store.getters.getApiUrl}/list-nft`, {
          price: this.listing_price,
          comission: this.listing_commision,
          currency: "cfx",
          nft_id: this.card.nft_id,
        })
        .then((res) => {
          this.$bvToast.toast("Listed Successfully", {
            title: "Congrats",
            autoHideDelay: 3000,
            appendToast: false,
          });
          console.log(res.data);
          eventBus.$emit("Card.statusChanged", this.card.nft_id);
        })
        .catch((err) => {
          console.log(err);
          this.$bvToast
            .toast("Listing Failed", {
              title: "Error",
              autoHideDelay: 3000,
              appendToast: false,
            })
            .catch((err) => {
              console.log(err);
              this.$bvToast.toast("Listing Failed", {
                title: "Error",
                autoHideDelay: 3000,
                appendToast: false,
              });
            });
        });
    },
    handleRaffleNft() {
      axios
        .post(`${this.$store.getters.getApiUrl}/list-nft-draw`, {
          nftId: this.card.nft_id,
          title: this.card.title,
          description: this.card.description,
          unitPrice: this.raffle_price,
          quantity: this.raffle_tickets,
          currency: "cfx",
          deadline: new Date(this.deadline),
          nft_id: this.card.nft_id,
          owner: this.card.owner[0]._id,
        })
        .then((res) => {
          this.$bvToast.toast("Raffling Successfully", {
            title: "Congrats",
            autoHideDelay: 3000,
            appendToast: false,
          });
          console.log(res.data);
          eventBus.$emit("Card.statusChanged", this.card.nft_id);
        })
        .catch((err) => {
          console.log(err);
          this.$bvToast.toast("Raffling Failed", {
            title: "Error",
            autoHideDelay: 3000,
            appendToast: false,
          });
        });
    },
    delistNft(e) {
      e.preventDefault();
      axios
        .post(`${this.$store.getters.getApiUrl}/delist-nft`, {
          nft_id: this.card.nft_id,
        })
        .then((res) => {
          this.$bvToast.toast("Delisted Successfully", {
            title: "Info",
            autoHideDelay: 3000,
            appendToast: false,
          });
          eventBus.$emit("Card.statusChanged", this.card.nft_id);
          console.log(res);
        });
    },
    checkBox() {
      if (this.checkState) {
        eventBus.$emit("Card.addAlbumCandidate", this.card.nft_id);
      } else {
        eventBus.$emit("Card.delAlbumCandidate", this.card.nft_id);
      }
    },
    cardClicked(e) {
      if (!["BUTTON", "LABEL", "INPUT"].includes(e.srcElement.nodeName))
        this.$router.push({
          path: "/nft/:id",
          name: "nft-detail",
          params: { id: this.card.nft_id || "default_id", card: this.card },
        });
    },
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
</style>