<template>
<div class='container'>
  <b-btn class='connect' variant="primary" @click="connectWallet">Connect Wallet</b-btn>
</div>
</template>

<script>
export default {
  methods: {
    connectWallet() {
      this.$store.dispatch("connectWallet");
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