<template>
  <div class="flex-wrapper" id="collections-page">
    <Navbar active-index="2" />
    <div class="flex-wrapper-row m-3" v-if="$store.getters.getAddress">
      <el-tabs class='main-content'>
        <el-tab-pane label='NFT'>
          <p>Unlisted</p>
          <div class="cards-container">
            <NftCard
              class="mt-4 card"
              v-for="nft in private_nfts"
              :card="nft"
              :key="nft.url"
            />
            <p class="mt-4" v-if="private_nfts.length == 0"><el-empty description="Nothing"></el-empty></p>
          </div>
          <p>On Sale</p>
          <div class="cards-container">
            <NftCard
              class="mt-4 card"
              v-for="nft in sale_nfts"
              :card="nft"
              :key="nft.url"
            />
            <p class="mt-4" v-if="sale_nfts.length == 0"><el-empty description="Nothing"></el-empty></p>
          </div>
        </el-tab-pane>
        <el-tab-pane label='Album'>
          <p>Unlisted</p>
          <div class="cards-container">
            <AlbumCard
              class="mt-4 card"
              v-for="album in private_albums"
              :card="album"
              :key="album.url"
            />
            <p class="mt-4" v-if="private_albums.length == 0"><el-empty description="Nothing"></el-empty></p>
          </div>
          <p>On Sale</p>
          <div class="cards-container">
            <AlbumCard
              class="mt-4 card"
              v-for="album in sale_albums"
              :card="album"
              :key="album.url"
            />
            <p class="mt-4" v-if="sale_albums.length == 0"><el-empty description="Nothing"></el-empty></p>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- <b-tabs class="main-content" content-class="ml-5 mr-5">
        <b-tab title="NFT" active>
          
        </b-tab>
        <b-tab title="Album"
          ></b-tab
        >
      </b-tabs> -->
    </div>
    <div v-else class="flex-wrapper-row">
      <ConnectWallet />
    </div>
    <Footer style="z-index: 0" />
    <a href="/mine/create">
      <b-btn variant="primary" class="add-btn">
        <b-icon icon="plus-circle-fill"></b-icon> </b-btn
    ></a>
    <b-btn
      v-if="album_candidates.length > 0"
      variant="info"
      class="create-album-btn"
      @click="createAlbumClicked"
    >
      Create Album</b-btn
    >
    <b-modal
      id="album-modal"
      ref="album-modal"
      title="Package NFTs to Album"
      @ok="createAlbum"
      class="album-modal"
    >
      <label>Album Title</label>
      <b-form-input
        class="mb-4"
        v-model="album_title"
        placeholder="Name for your special album..."
      />
      <label>Album Description</label>
      <b-form-input
        class="mb-4"
        v-model="album_description"
        placeholder="Description for you special album..."
      />
      <label>Album Cover</label>
      <div
        style="display: flex; min-width: 100%; justify-content: space-around"
        class="mb-4"
      >
        <FileUploader
          pass-file-to-event="Collections.receiveFile"
          class="file-uploader"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";
import { Notification } from 'element-ui'

import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import NftCard from "../components/NftCard.vue";
import AlbumCard from "../components/AlbumCard.vue";
import ConnectWallet from "../components/ConnectWallet.vue";
import FileUploader from "../components/FileUploader.vue";

export default {
  name: "Collections",
  components: {
    Navbar,
    Footer,
    NftCard,
    AlbumCard,
    ConnectWallet,
    FileUploader,
  },
  data: () => ({
    nfts: [],
    fragments: [],
    albums: [],
    album_candidates: [],
    album_title: "",
    album_description: "",
    album_cover: undefined,
    album_price: "",
  }),
  computed: {
    private_frags: function() {
      return this.fragments.filter(f => f.status=='private')
    },  
    sale_frags: function() {
      return this.fragments.filter(f => f.status=='sale')
    },
    private_nfts: function () {
      const nfts = this.nfts.filter((n) => {
        if (n.fragmented) {
          return this.private_frags.map(f=>f.nft_id).includes(n.nft_id)
        } else {
          return n.status == "private" 
        }
      });
      const res = []
      nfts.forEach(n => {
        const nclone = JSON.parse(JSON.stringify(n))
        nclone.status='private'
        res.push(nclone)
      })

      return res;
    },
    sale_nfts: function () {
      return this.nfts.filter((n, i) => {
        if (n.fragmented) {
          this.nfts[i].status = 'sale'
          return this.sale_frags.map(f=>f.nft_id).includes(n.nft_id)
        } else {
          return n.status == "sale"
        }
      });
    },
    private_albums: function () {
      return this.albums.filter((a) => a.status == "private");
    },
    sale_albums: function () {
      return this.albums.filter((a) => a.status == "sale");
    },
  },
  async mounted() {
    const getters = this.$store.getters
    if (getters.getAddress) this.loadCollections();
    this.$store.dispatch("connectWallet");

    eventBus.$on("Collections.loadCollections", () => this.loadCollections());
    eventBus.$on("Card.statusChanged", (nid) => {
      axios.get(`${getters.getApiUrl}/nft/${nid}`).then(async (res) => {
        const newNft = res.data;
        newNft.url = newNft.file;
        if (newNft.fragmented) {
          const fres = await axios.get(`${getters.getApiUrl}/fragments/${getters.getAddress}`)
          const f = fres.data.filter(f => (f.nft_id == nid && f.owner == getters.getAddress))[0]
          newNft.price = f.price
          newNft.status = f.status
        }

        this.$set(
          this.nfts,
          this.nfts.findIndex((n) => n.nft_id == nid),
          newNft
        );
        // expensive, but couldn't only change one, needs enhancement
        this.loadCollections()
      });
    });
    eventBus.$on("AlbumCard.statusChanged", (aid) => {
      axios.get(`${this.$store.getters.getApiUrl}/album/${aid}`).then((res) => {
        const newAlbum = res.data;
        newAlbum.url = newAlbum.file;
        newAlbum.author = newAlbum.owner;
        this.$set(
          this.albums,
          this.albums.findIndex((a) => a.album_id == aid),
          newAlbum
        );
      });
    });
    eventBus.$on("Card.addAlbumCandidate", (candId) => {
      this.album_candidates.push(candId);
    });
    eventBus.$on("Card.delAlbumCandidate", (candId) => {
      this.album_candidates = this.album_candidates.filter(
        (cid) => cid != candId
      );
    });
    eventBus.$on("Collections.receiveFile", (file) => {
      this.album_cover = file;
    });
  },
  beforeDestroy() {
    eventBus.$off("Collections.loadCollections");
    eventBus.$off("Card.addAlbumCandidate");
    eventBus.$off("Card.delAlbumCandidate");
    eventBus.$off("Collections.receiveImage");
    eventBus.$off("Card.statusChanged");
    eventBus.$off("AlbumCard.statusChanged");
  },
  methods: {
    async loadNfts(nft_ids) {
      const api = this.$store.getters.getApiUrl
      const nft_promises = nft_ids.map((nid) =>
        axios.get(`${api}/nft/${nid}`)
      );
      const nft_promises_result = await Promise.allSettled(nft_promises);
      let nfts = nft_promises_result.map((p) => {
        if (p.status == "fulfilled") return p.value.data;
      });
      nfts = nfts.filter(n => !!n && !!n.file)
      this.nfts = nfts.map((n) => {
        n.url = n.file;
        n.author = n.author;
        return n;
      });

      axios.get(`${api}/fragments/${this.$store.getters.getAddress}`)
        .then(res => this.fragments = res.data)
    },
    async loadAlbums(album_ids) {
      const album_promises = album_ids.map((aid) =>
        axios.get(`${this.$store.getters.getApiUrl}/album/${aid}`)
      );
      const album_promises_result = await Promise.allSettled(album_promises);
      let albums = album_promises_result.map((p) => {
        if (p.status == "fulfilled") return p.value.data;
      });
      albums = albums.filter(a => !!a && !!a.file)
      this.albums = albums.map((n) => {
        n.url = n.file;
        n.author = n.owner;
        return n;
      });
    },
    async loadCollections() {
      const getters = this.$store.getters;
      const res = await axios.get(
        `${getters.getApiUrl}/profile/${getters.getAddress}`
      );
      this.loadNfts(res.data.nft_ids);
      this.loadAlbums(res.data.album_ids);
    },
    createAlbumClicked() {
      this.$refs["album-modal"].show();
    },
    createAlbum() {
      this.$notify({
        title: 'Notification',
        dangerouslyUseHTMLString: true,
        message: '<div style="display:flex; align-items: center;"> <div class="loader"></div><div style="display:inline">Album Minting In Progress</div></div>', 
        duration: 0
      })
      const fd = new FormData();
      fd.append("file", this.album_cover);
      fd.append("address", this.$store.getters.getAddress);
      fd.append("title", this.album_title);
      fd.append("description", this.album_description);
      fd.append("nft_ids", JSON.stringify(this.album_candidates));
      axios
        .post(`${this.$store.getters.getApiUrl}/create-album`, fd)
        .then((res) => {
          this.loadCollections();
          Notification.closeAll();
          this.$notify({
              title: "Congrats",
              message: "Album Created Successfully",
              duration: 3000,
              type: 'success'
          })
        });
    },
  },
};
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
  box-shadow: 0 0 5px rgba(33, 33, 33, 0.2);
}

.create-album-btn {
  position: fixed;
  bottom: 5vh;
  right: 10vw;
  height: 4vh;
  box-shadow: 0 0 5px rgba(33, 33, 33, 0.2);
}
.cards-container {
  display: flex;
  flex-wrap: wrap;
  row-gap: 10px;
  column-gap: 40px;
  align-items: flex-start;
}

.card {
  max-width: 400px;
  height: 100%;
}

.file-uploader {
  width: 80%;
  height: 450px;
}


</style>

<style>
@media (min-width: 576px) {
  #album-modal .modal-dialog {
    max-width: unset !important;
  }
}
#album-modal .modal-dialog {
  width: 50vw;
}
#collections-page .el-tabs__item.is-top {
  font-size: 28px;
}
</style>

