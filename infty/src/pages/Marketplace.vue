<template>
  <div class="marketplace">
    <Navbar active-index="0"/>
    <div>
      <div id="sidebar" style="width: 25%" class='mr-2 mb-4'>
        <b-card no-body class='filter-card'>
          <template #header>
            <h4 class="mb-0">
              <b-icon icon="filter-circle"></b-icon>&nbsp;Filter
            </h4>
          </template>
          <b-list-group flush>
            <b-list-group-item>
              <b-button pill v-b-toggle.collapse-1 variant="outline-secondary" class="category-button" >Status</b-button>
              <b-collapse id="collapse-1" class="mt-2">
                <b-card>
                  <b-form-checkbox @change="filterOthers">Not Mine</b-form-checkbox>
                  <!-- <b-form-group v-slot="{ ariaDescribedby }">
                    
                    <b-form-checkbox-group
                      id="checkbox-group-1"
                      v-model="statusSelected"
                      :options="statusOptions"
                      :aria-describedby="ariaDescribedby"
                      name="flavour-1"
                    ></b-form-checkbox-group>
                  </b-form-group> -->
                </b-card>
              </b-collapse>
            </b-list-group-item>
            <b-list-group-item>
              <b-button
                pill
                v-b-toggle.collapse-2
                variant="outline-secondary"
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
                  <b-button id="price-apply-btn" variant="outline-primary"
                    >Apply</b-button
                  >
                </b-card>
              </b-collapse>
            </b-list-group-item>
            <b-list-group-item>
              <b-button
                pill
                v-b-toggle.collapse-3
                variant="outline-secondary"
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
            <!-- <b-list-group-item>
              <b-button
                pill
                v-b-toggle.collapse-4
                variant="outline-secondary"
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
            </b-list-group-item> -->
            <b-list-group-item>
              <b-button
                pill
                v-b-toggle.collapse-5
                variant="outline-secondary"
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

      <div class="content">
        <div class='search-bar-container'>
        <div id="search-bar">
          <b-input-group size="md" class="mb-2">
            
            <b-form-input type="search" placeholder="Search..."></b-form-input>
            <b-input-group-prepend is-text>
              <b-icon icon="search"></b-icon>
            </b-input-group-prepend>
          </b-input-group>

        </div>
         </div>
        <div id="tab">
          <b-tabs class="main-content" content-class="ml-5 mt-3">
            <b-tab title="NFT" active>
              <div class='nft-container'>
                <transition name="fade">
                  <div class="loading" v-show="loadingNft">
                    <span class="fa fa-spinner fa-spin"></span> Loading
                  </div>
                </transition>
                <NftCard v-for="card in usersCards" :card="card" :key="card.url" class='mr-5 mb-4'/>
              </div>
              <p v-if="noMoreNft">No More</p>
            </b-tab>


            <b-tab title="Album">
              <div class='album-container'>
                <transition name="fade">
                  <div class="loading" v-show="loadingAlbum">
                    <span class="fa fa-spinner fa-spin"></span> Loading
                  </div>
                </transition>
                <AlbumCard class='mr-4 mb-4' v-for="album in usersAlbum" :card="album" :key="album.url" />
              </div>
              <p v-if="noMoreAlbum">No More</p>
              
            </b-tab>
          </b-tabs>
        </div>

       

        <!-- <b-button variant="primary" class='load-more' @click='loadMarket'>Load More</b-button> -->
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import NftCard from "../components/NftCard.vue";
import axios from 'axios';
import AlbumCard from '../components/AlbumCard.vue';

export default {
  name: "Marketplace",
  components: {
    Navbar,
    Footer,
    NftCard,
    AlbumCard,
  },
  async mounted() {
    const nft = document.querySelector('.nft-container');
    nft.addEventListener('scroll', () => {
      if(nft.scrollTop + nft.clientHeight >= nft.scrollHeight) {
        this.loadNftMarket();
      }
    });

    const alb = document.querySelector('.album-container');
    alb.addEventListener('scroll', () => {
      if(alb.scrollTop + alb.clientHeight >= alb.scrollHeight) {
        this.loadAlbumMarket();
      }
    });

    this.user = this.$store.getters.getAddress;
    this.loadNftMarket();
    this.loadAlbumMarket();
  },
  data() {
    return {
      offsetNft: 0,
      limit: 2,
      statusSelected: [],
      // statusOptions: [
      //   { text: "Buy Now", value: "buyNow" },
      //   { text: "On Auction", value: "onAuction" },
      //   { text: "New", value: "new" },
      //   { text: "Has Offers", value: "hasOffers" },
      // ],
      priceTypeSelected: "usd",
      priceTypeOptions: [
        { value: "usd", text: "United States Dollar(USD)" },
        { value: "eth", text: "Ether(ETH)" },
      ],
      usersCards: [],
      loadingNft: false,
      noMoreNft: false,
      usersAlbum: [],
      loadingAlbum: false,
      noMoreAlbum: false,
      offsetAlbum: 0,
      user: undefined,
      notMine: false
    };
  },

  methods: {
      async proccessNft(nft_ids) {
        const nft_promises = nft_ids.map((nid) =>
            axios.get(`${this.$store.getters.getApiUrl}/nft/${nid}`)
        );
        const nft_promises_result = await Promise.allSettled(nft_promises);
        const nfts = nft_promises_result.map((p) => {
            if (p.status == "fulfilled") return p.value;
        });
        nfts.map(async (n) => {
          if ((this.notMine && this.user != n.data.owner[0].address) || !this.notMine) {
              console.log(n)
              axios.get(`${this.$store.getters.getApiUrl}/profile/${n.data.author}`).then((res) => {
              n.data.author = res.data.first_name + " " + res.data.last_name
              n.data.url = n.data.file;
              this.usersCards.push(n.data);
            })
          }
        });
      },

      async proccessAlbum(album_id){
        const album_promises = album_id.map((aid) => axios.get(`${this.$store.getters.getApiUrl}/album/${aid}`));
        const album_promises_result = await Promise.allSettled(album_promises);
        const albums = album_promises_result.map((p) => {
          if (p.status == "fulfilled") return p.value;
        });
        albums.map(async (a) => {
          if ((this.notMine && this.user != a.data.owner) || !this.notMine) {
            axios.get(`${this.$store.getters.getApiUrl}/profile/${a.data.author}`).then((res) => {
              a.data.author = res.data.first_name + " " + res.data.last_name
              a.data.url = a.data.file;
              this.usersAlbum.push(a.data);
            })
          }
        })
      },

      loadNftMarket(){
        this.loadingNft = true;
        setTimeout(() => {
          const body = {
            offset: this.offsetNft,
            limit: this.limit,
          };
          axios.post(this.$store.getters.getApiUrl+"/market", body)
          .then(async (res) => {
              const nft_ids = res.data.nft_ids;
              this.proccessNft(nft_ids);
              this.offsetNft += nft_ids.length;
              this.noMoreNft = nft_ids.length < this.limit;
              this.loadingNft = false;
          });
        }, 200)
    },

    loadAlbumMarket(){
      this.loadingAlbum = true;
      setTimeout(() => {
        const body = {
          offset: this.offsetAlbum,
          limit: this.limit,
        };
        axios.post(this.$store.getters.getApiUrl+"/market", body)
        .then(async (res) => {
            const album_ids = res.data.album_ids;
            this.proccessAlbum(album_ids);
            this.offsetAlbum += album_ids.length;
            this.noMoreAlbum = album_ids.length < this.limit;
            this.loadingAlbum = false;
        });
      }, 200)
    },
    
    filterOthers(checked) {
      this.user = this.$store.getters.getAddress;
      this.notMine = checked;
      console.log(checked)
      if (checked) {
        const nft_list = this.usersCards;
        const album_list = this.usersAlbum;
        let target_nfts = []
        let target_albums = []
        nft_list.map((n) => { if (n.owner[0].address != this.user) target_nfts.push(n) })
        album_list.map((a) => { if (a.owner != this.user) target_albums.push(a) })
        this.usersCards = target_nfts;
        this.usersAlbum = target_albums;
      } else {
        this.loadingNft = true;
        setTimeout(() => {
          const nft_body = {
            offset: 0,
            limit: this.offsetNft,
          };
          axios.post(this.$store.getters.getApiUrl+"/market", nft_body)
          .then(async (res) => {
              const nft_ids = res.data.nft_ids;
              this.usersCards = [];
              this.proccessNft(nft_ids);
              this.loadingNft = false;
          });
        }, 200)

        this.loadingAlbum = true;
        setTimeout(() => {
          const album_body = {
            offset: 0,
            limit: this.offsetAlbum,
          };
          axios.post(this.$store.getters.getApiUrl+"/market", album_body)
          .then(async (res) => {
              const album_ids = res.data.album_ids;
              this.usersAlbum = [];
              this.proccessAlbum(album_ids);
              this.loadingAlbum = false;
          });
        }, 200)
      }
    }
  },
};
</script>

<style scoped>
.marketplace {
  text-align: left;
  /* height: 100vh; */
}
.category-button {
  width: 100%;
}
#sidebar {
  margin-top: 2em;
  display: inline-block;
  /* height: 100%; */
  text-align: left;
  vertical-align: top;
  /* border: 1px solid #f00; */
}
.price-range {
  width: 40%;
  display: inline-block;
  margin-top: 1em;
  margin-right: 3%;
  margin-left: 2%;
}
#price-apply-btn {
  margin-top: 1em;
  width: 40%;
  margin-right: 30%;
  margin-left: 30%;
}
#collections-group {
  margin-top: 1em;
}
.content {
  width: 70%;
  margin-left: 10px;
  /* float: left; */
  /* margin-top: 0; */
  display: inline-block;
  /* top: 0%; */
  /* left: 0; */
  vertical-align: top;
  position: relative;
}

#search-bar {
  width: 50%;
  display: inline-block;
  margin-top: 2em;
  position: absolute;
  width: 50%;
  right: 0;
}
#tab {

  display: inline-block;
  margin-top: 2em;
}
.nft-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.album-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  overflow-y: scroll;
  height: 350px;
}
.search-bar-container {
  width: 100%;
  display: flex;
  /* justify-content:center; */
}
.filter-card {
  width: 20rem;
  float:right;
}
.loading {
  text-align: center;
  position: absolute;
  color: #fff;
  z-index: 9;
  background: rgb(0, 0, 0);
  padding: 8px 18px;
  border-radius: 5px;
  left: calc(50% - 45px);
  top: calc(50% - 18px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>

<style>
</style>