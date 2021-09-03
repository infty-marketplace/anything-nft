<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
const { abi: inftyNftAbi } = require("./assets/InftyNft.json");
const { abi: stakeAbi } = require("./assets/StakingForINFT.json");
const { abi: raffleAbi } = require("./assets/Raffle.json");

import { eventBus } from "./main";
// const { Conflux } = require('js-conflux-sdk')

export default {
    name: "App",
    created() {
        // TODO based on wallet network
        // const cfx = new Conflux({
        //   url:'https://test.confluxrpc.com',
        //   networkId: 1
        // })
        document.title = "Infty Marketplace";
        const minterContract = window.confluxJS.Contract({
            abi: inftyNftAbi,
            address: this.$store.getters.getMinterAddress,
        });
        this.$store.commit("setMinterContract", minterContract);

        const stakeContract = window.confluxJS.Contract({
            abi: stakeAbi,
            address: this.$store.getters.getStakeAddress,
        });
        this.$store.commit("setStakeContract", stakeContract);

        const raffleContract = window.confluxJS.Contract({
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

        eventBus.$on("App.notifyCommission", () => {
            this.$notify({
                title: "Notification",
                message: "Paying commission now.",
                duration: 0,
            });
        });
    },
    beforeDestroy() {
        eventBus.$off("App.notifyWIP");
        eventBus.$off("App.notifyCommission");
    },
};
</script>

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
</style>
