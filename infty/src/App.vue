<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
const { abi: inftyNftAbi } = require("./assets/InftyNft.json");
const { abi: stakeAbi } = require("./assets/StakingForINFT.json");
const { abi: raffleAbi } = require("./assets/Raffle.json");
const { Conflux } = require("js-conflux-sdk")
import { eventBus } from "./main";
// const { Conflux } = require('js-conflux-sdk')

export default {
    name: "App",
    created() {
        document.title = "Infty Marketplace";
        const cfx = new Conflux({
            networkId: 1,
        })
        cfx.provider = window.conflux;
        window.conflux.on("chainChanged", cfx.updateNetworkId);
        this.$store.commit("setCfx", cfx);
        const minterContract = cfx.Contract({
            abi: inftyNftAbi,
            address: this.$store.getters.getMinterAddress,
        });
        this.$store.commit("setMinterContract", minterContract);

        const stakeContract = cfx.Contract({
            abi: stakeAbi,
            address: this.$store.getters.getStakeAddress,
        });
        this.$store.commit("setStakeContract", stakeContract);

        const raffleContract = cfx.Contract({
            abi: raffleAbi,
            address: this.$store.getters.getRaffleAddress,
        });
        this.$store.commit("setRaffleContract", raffleContract);

        eventBus.$on("App.notifyWIP", () => {
            this.$notify.info({
                title: "Info",
                message: "This functionality is work in progress.",
                duration: 3000,
            });
        });

        eventBus.$on("App.notifyLoading", (msg) => {
            this.$notify({
                title: "Notification",
                dangerouslyUseHTMLString: true,
                message: `<div style="display:flex; align-items: center;"> <div class="loader"></div><div style="display:inline">${msg}</div></div>`,
                duration: 0,
            });
        });

        eventBus.$on("App.notifyErr", () => {
            this.$notify.error({
                title: "Error",
                message: "Transaction failed.",
                duration: 3000,
            });
        });
    },
    beforeDestroy() {
        eventBus.$off("App.notifyWIP");
        eventBus.$off("App.notifyLoading");
    },
};
</script>
<style scoped>
.err {
    position: fixed;
    top: 0;
}
</style>
<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

.flex-wrapper {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    justify-content: space-between;
}

.flex-wrapper-row {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
}

.loader {
    display: inline-block;
    border: 2px solid #f3f3f3; /* Light grey */
    border-top: 2px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.back-btn {
    position: absolute;
    top: 150px;
    left: -10px;
    width: 60px;
    border-radius: 20%;
    background-color: rgb(72, 83, 87);
    border: unset;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}
</style>
