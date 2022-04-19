<template>
    <div class="heart-like-button" ref="heart" @click="onClickLike"></div>
</template>
<script>
export default {
    data: () => ({
        isLiked: false,
    }),
    async mounted() {
        this.isLiked = this.$refs["heart"].getAttribute("isLiked");
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
        onClickLike() {
            const walletAddress = this.$store.getters.getAddress;
            if (!walletAddress) {
                return this.$store.dispatch("connectWallet");
            }
            console.log(this.$store.getters.getAddress);
            console.log(this.$refs["heart"].getAttribute("nftId"));
            this.isLiked = !this.isLiked;
            this.updateHeartColor();
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
