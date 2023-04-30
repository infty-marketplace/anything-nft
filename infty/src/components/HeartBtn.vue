<template>
    <div class="heart-like-button" ref="heart" @click="onClickLike"></div>
</template>
<script>
import axios from "axios";
import {eventBus} from "../main";

export default {
    props: {
        isLiked: Boolean,
        nftId: String,
    },
    async mounted() {
        this.updateHeartColor();
    },
    methods: {
        updateHeartColor() {
            if (this.isLiked) {
                this.$refs["heart"].classList.add("liked");
            } else {
                this.$refs["heart"].classList.remove("liked");
            }
        },
        async onClickLike() {
            const loggedIn = this.$store.getters.getLogInStatus;
            if (!loggedIn) {
                this.$notify.info({
                    title: "Warning",
                    message: "Please login to continue",
                    duration: 3000,
                });
                return;
            }

            const address = this.$store.getters.getAddress;
            // if the nft is currently liked, we should unlike it, otherwise like it
            if (this.isLiked) {
                await axios.post(this.$store.getters.getApiUrl + "/unlike-nft", {address, nft_id: this.nftId});
            } else {
                await axios.post(this.$store.getters.getApiUrl + "/like-nft", {address, nft_id: this.nftId});
            }

            this.isLiked = !this.isLiked;
            this.updateHeartColor();
            // reload the page only when the currently opened page is the nft page
            if (this.$route.name === "nft-detail") {
                eventBus.$emit("NftPage.reload");
            }
        },
    },
};
</script>
<style scoped>
.heart-like-button {
    position: relative;
    width: 160px;
    height: 130px;
}

.heart-like-button:before {
    position: absolute;
    top: 0;
    left: 80px;
    transform: rotate(-45deg);
    transform-origin: 0 100%;
    width: 80px;
    height: 125px;
    border-radius: 40px 40px 0 0;
    background-color: #aca9a9;
    content: "";
    cursor: pointer;
    transition: background 0.4s;
}

.heart-like-button:after {
    position: absolute;
    top: 0;
    left: 0;
    transform: rotate(45deg);
    transform-origin: 100% 100%;
    width: 80px;
    height: 125px;
    border-radius: 40px 40px 0 0;
    background-color: #aca9a9;
    content: "";
    cursor: pointer;
    transition: background 0.4s;
}

.heart-like-button.liked::before,
.heart-like-button.liked::after {
    background-color: #d65076;
}

.heart-like-button.liked {
    animation: liked 0.4s ease;
}

@keyframes liked {
    0% {
        transform: scale(0.8);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}
</style>
