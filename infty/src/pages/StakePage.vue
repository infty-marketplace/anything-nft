<template>
    <div class="flex-wrapper">
        <Navbar />
        <div class="main">
            <div class="banner">
                <div class="info-left">
                    <div>wallet balance</div>
                    <div>{{ this.walletBalance }}</div>
                </div>
                <div
                    class="circle"
                    @mouseover="onMouseOverCircle(true)"
                    @mouseleave="onMouseOverCircle(false)"
                    @click="onClickCircle"
                >
                    <div class="circle-text">{{ this.circleMessage }}</div>
                </div>
                <div class="info-right">
                    <div>staked balance</div>
                    <div>{{ this.stakedBalance }}</div>
                </div>
            </div>

            <div class="stake-form">
                <el-card class="box-card">
                    <el-form :model="stakeForm">
                        <div>Amount Available to Stake</div>
                        <el-form-item>
                            <el-input v-model="stakeForm.stakeAmount" placeholder="0"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onClickStake">Stake</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>

                <el-card class="box-card">
                    <el-form :model="stakeForm">
                        <div>Amount Available to Unstake</div>
                        <el-form-item>
                            <el-input v-model="stakeForm.unstakeAmount" placeholder="0"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onClickUnstake">Unstake</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
export default {
    name: "App",
    components: {
        Navbar,
        Footer,
    },
    async mounted() {
        const stakeContract = this.$store.getters.getStakeContract;
        const sender = (await window.conflux.send("cfx_requestAccounts"))[0];
        console.log(sender);
        this.rewardPerToken = await stakeContract.rewardPerToken();
        this.earnedBalance = await stakeContract.earned(sender);
        this.stakedBalance = await stakeContract.balanceOf(sender);
        console.log(String(this.rewardPerToken));
    },
    data: () => ({
        stakeForm: {},
        claim: false,
        walletBalance: undefined,
        stakedBalance: undefined,
        rewardPerToken: undefined,
    }),
    computed: {
        circleMessage() {
            return this.claim ? "Claim" : `Net APY: ${this.earnedBalance}`;
        },
    },
    methods: {
        onMouseOverCircle: function(status) {
            this.claim = status;
        },
        onClickCircle: function() {
            console.log("a");
        },
        onClickStake: function() {
            console.log("stake");
        },
        onClickUnstake: function() {
            console.log("unstake");
        },
    },
};
</script>

<style scoped>
.main {
    text-align: center;
    margin-bottom: 0%;
    background-color: black;
    color: white;
}
.banner {
    margin-top: 10px;
    margin-left: 0px;
    margin-right: 0px;

    display: flex;
    height: 200px;
    background-color: black;

    position: relative;
}
.info-left {
    display: inline-block;
    vertical-align: middle;
    position: absolute;
    width: 200px;
    top: 30%;
    left: calc(25% - 100px);
}
.info-right {
    display: inline-block;
    vertical-align: middle;
    position: absolute;
    width: 200px;
    top: 30%;
    left: calc(75% - 100px);
}
.circle {
    display: inline-block;
    vertical-align: middle;
    width: 160px;
    height: 160px;
    background-color: black;
    border: solid 2px #2f7df6;
    border-radius: 50%;
    position: absolute;
    top: 20px;
    left: calc(50% - 80px);
    cursor: pointer;
}

.circle-text {
    margin-top: 45%;
}

.stake-form {
    margin-top: 2%;
    margin-left: 1%;
    margin-right: 1%;
    display: block;
}

.box-card {
    display: inline-block;
    width: 40%;
    margin: 1%;
    border-color: #121212;
    background-color: #121212;
    color: white;
}
</style>
