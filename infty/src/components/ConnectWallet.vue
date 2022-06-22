<template>
    <div class="container">
        <b-btn class="connect" variant="primary" @click="connectWallet">{{ this.message }}</b-btn>
    </div>
</template>

<script>
export default {
    methods: {
        connectWallet() {
            this.$store.dispatch("connectWallet");
        },
    },
    computed: {
        message: function() {
            if (!this.$store.getters.getAddress) {
                return "Connect Wallet";
            }
            return "Register";
        },
    },
};
</script>

<style scoped>
.container {
    width: 100%;
    display: flex;
    justify-content: center;
}
.connect {
    max-width: 20vw;
}
</style>
