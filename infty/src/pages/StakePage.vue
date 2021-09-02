<template>
    <div class="flex-wrapper">
        <Navbar />

        <el-dialog title="" :visible.sync="dialogVisible" width="30%">
            <span>{{ dialogMessage }}</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">Close</el-button>
            </span>
        </el-dialog>

        <el-menu
            default-active="CFX"
            class="currency-menu"
            mode="horizontal"
            @select="handleSelectCurrency"
            menu-trigger="click"
        >
            <el-menu-item index="INFT">INFT</el-menu-item>
            <el-menu-item index="CFX">CFX</el-menu-item>
        </el-menu>

        <div class="main pb-4">
            <div class="banner">
                <div class="info-left">
                    <div>Wallet Balance</div>
                    <div>{{ `${this.walletBalance.toFixed(4)} ${this.selectedCurrency}` }}</div>
                </div>
                <div
                    class="circle"
                    @mouseover="onMouseOverClaim(true)"
                    @mouseleave="onMouseOverClaim(false)"
                    @click="onClickClaim"
                >
                    <div class="circle-text">{{ this.circleMessage }}</div>
                </div>
                <div class="info-right">
                    <div>Staked Balance</div>
                    <div>{{ `${this.stakedBalance.toFixed(4)} ${this.selectedCurrency}` }}</div>
                </div>
            </div>

            <div class="stake-form">
                <el-card class="box-card">
                    <el-form>
                        <div>Amount Available to Stake</div>
                        <el-form-item>
                            <el-input v-model="stakeAmount">
                                <el-button
                                    slot="append"
                                    icon="el-icon-sort-up"
                                    @click="onClickMaxStakeAmount"
                                ></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onClickStake">Stake</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>

                <el-card class="box-card">
                    <el-form>
                        <div>Amount Available to Unstake</div>
                        <el-form-item>
                            <el-input v-model="unstakeAmount">
                                <el-button
                                    slot="append"
                                    icon="el-icon-sort-up"
                                    @click="onClickMaxUnstakeAmount"
                                ></el-button
                            ></el-input>
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
        this.stakeContract = this.$store.getters.getStakeContract;
        this.stakeAddress = this.$store.getters.getStakeAddress;
        this.sender = (await window.conflux.send("cfx_requestAccounts"))[0];
        await this.updateInformation();
    },
    data: () => ({
        selectedCurrency: "CFX",
        stakeContract: undefined,
        stakeAddress: undefined,
        sender: undefined,
        hoverClaimStatus: false,
        clickClaimStatus: false,

        walletBalance: 0,
        stakedBalance: 0,
        apyRate: 0,
        earnedBalance: 0,
        stakeAmount: 0,
        unstakeAmount: 0,
        dialogVisible: false,
        dialogMessage: "",
    }),
    computed: {
        circleMessage() {
            if (this.clickClaimStatus) {
                return "Claiming...";
            } else if (this.hoverClaimStatus) {
                return "Claim";
            } else {
                return `Unclaimed\n ${this.earnedBalance.toFixed(4)} INFT`;
            }
        },
    },
    methods: {
        updateInformation: async function() {
            this.apyRate = Number(await this.stakeContract.rewardPerToken()) / 1e18;
            this.earnedBalance = Number(await this.stakeContract.earned(this.sender)) / 1e18;
            this.stakedBalance = Number(await this.stakeContract.balanceOf(this.sender)) / 1e18;
            this.walletBalance = Number(await await window.confluxJS.getBalance(this.sender)) / 1e18;
        },
        handleSelectCurrency: function(event) {
            if (event !== "CFX") {
                this.dialogMessage = "Maintaining";
                this.dialogVisible = true;
                // prevent users from clicking other currency tabs, but do not do this in the future
                document.querySelector("[role='menuitem']:nth-child(2)").click();
                return;
            }
            this.selectedCurrency = event;
        },
        onMouseOverClaim: function(status) {
            this.hoverClaimStatus = status;
        },
        onClickClaim: async function() {
            if (this.clickClaimStatus) {
                return;
            }
            this.clickClaimStatus = true;
            if (this.selectedCurrency === "INFT") {
                return;
            } else if (this.selectedCurrency === "CFX") {
                await this.stakeContract
                    .getReward()
                    .sendTransaction({
                        from: this.sender,
                        to: this.stakeAddress,
                    })
                    .executed();
            }
            await this.updateInformation();
            this.clickClaimStatus = false;
        },
        onClickStake: async function(event) {
            if (this.stakeAmount <= 0 || this.stakeAmount > this.walletBalance) {
                this.dialogMessage = "Please enter an valid amount";
                this.dialogVisible = true;
                return;
            }

            event.target.disabled = true;
            event.target.innerText = "Staking...";
            if (this.selectedCurrency === "INFT") {
                return;
            } else if (this.selectedCurrency === "CFX") {
                await this.stakeContract
                    .stake()
                    .sendTransaction({
                        from: this.sender,
                        to: this.stakeAddress,
                        value: this.stakeAmount * 1e18,
                    })
                    .executed();
            }
            this.$notify({
                title: "Congrats",
                message: `${parseInt(this.stakeAmount)} is successfully staked. You are now earning INFT.`,
                duration: 3000,
                type: "success",
            });
            await this.updateInformation();
            this.stakeAmount = 0;
            event.target.disabled = false;
            event.target.innerText = "Stake";
        },
        onClickUnstake: async function(event) {
            if (this.unstakeAmount <= 0 || this.unstakeAmount > this.unstakeAmount) {
                this.dialogMessage = "Please enter an valid amount";
                this.dialogVisible = true;
                return;
            }

            event.target.disabled = true;
            event.target.innerText = "Unstaking...";
            if (this.selectedCurrency === "INFT") {
                return;
            } else if (this.selectedCurrency === "CFX") {
                await this.stakeContract
                    .withdraw(this.unstakeAmount * 1e18)
                    .sendTransaction({
                        from: this.sender,
                        to: this.stakeAddress,
                    })
                    .executed();
            }
            this.$notify({
                title: "Congrats",
                message: `${parseInt(this.unstakeAmount)} is successfully unstaked.`,
                duration: 3000,
                type: "success",
            });
            await this.updateInformation();
            this.unstakeAmount = 0;
            event.target.disabled = false;
            event.target.innerText = "Unstake";
        },
        onClickMaxStakeAmount: function() {
            this.stakeAmount = this.walletBalance;
        },
        onClickMaxUnstakeAmount: function() {
            this.unstakeAmount = this.stakedBalance;
        },
    },
};
</script>

<style scoped>
.main {
    text-align: center;
    margin-top: 0%;
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

.circle:hover {
    background-color: #121212;
}

.circle-text {
    margin-top: 35%;
    white-space: pre-line;
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

.currency-menu {
    background-color: black;
    color: white;
    active-text-color: white;
    default-active: 1;
    border-bottom: 0px;
}

.el-menu.el-menu--horizontal {
    border-bottom: 0px;
}

.el-menu--horizontal > .el-menu-item {
    color: white;
    width: 20%;
    text-align: center;
}

.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
    background-color: black;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
    color: white;
}

.el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 2px solid #2f7df6;
    color: white;
}

.el-button--primary {
    color: white;
    background-color: #2f7df6;
    border-color: #2f7df6;
}

.el-button--primary:disabled {
    background-color: #66b1ff;
    border-color: #66b1ff;
}

/deep/ .el-dialog {
    background: #121212;
}

/deep/ .el-dialog__body {
    color: white;
}

/deep/ .el-input__inner {
    border-color: black;
    background-color: black;
}

/deep/ .el-input-group__append,
.el-input-group__prepend {
    background-color: black;
    color: white;
    border: 0px solid #121212;
}
</style>
