<template>
  <div>
    <header>
      <div class="logo"><router-link to='/'>
        <img class="logo-img" src="@/assets/imgs/infty-logo.png" alt="logo" />
      </router-link></div>
      <nav>
        <ul class="nav__links">
          <li v-bind:class="{active: activeIndex==0}"><a href="/marketplace">Marketplace</a></li>
          <li v-bind:class="{active: activeIndex==1}"><a href="/raffles">Raffles</a></li>
          <li v-bind:class="{active: activeIndex==2}"><a href="/mine/collections">Collections</a></li>
          <li v-bind:class="{active: activeIndex==3}"><a href="#">About</a></li>
          <li>
            <b-button pill variant='primary' class='wallet-btn' @click="connectWallet">
              <b-icon class='ml-2 mr-2' icon="wallet2" aria-hidden="true"></b-icon>
            </b-button>
          </li>
        </ul>
      </nav>
    </header>
    <b-modal ref="reg-modal" title='Register' @ok="handleRegister">
      <div class='mb-4'>We noticed that this is your first time connecting to our platform, so we need some info from you.</div>
      <label>First Name</label>
      <b-form-input class='mb-4' v-model='first_name' placeholder="Your creative first name here..."/>
      <label>Last Name</label>
      <b-form-input class='mb-4' v-model='last_name' placeholder="Optional"/>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: "Navbar",
  props: ['activeIndex'],
  data: () => ({
    first_name: '',
    last_name: ''
  }),
  methods: {
    async connectWallet() {
      let accounts;
      try {
        if (! window.conflux) {
          window.alert("Conflux Wallet Undetected")
          return
        }
        accounts = await window.conflux.send("cfx_requestAccounts")
      } catch (e) {
        console.log(e)
      }
      if (accounts) {
        this.$store.commit("setAccount", accounts[0])
        axios.get(`${this.$store.getters.getApiUrl}/profile/${accounts[0]}`)
          .then(res => {
            console.log(res)
          }).catch(err => {
            if (err.response.status == 404) {
              this.$refs['reg-modal'].show()
            }
          })
        console.log(this.$store.getters.getAccount)
        window.alert('Connected')
      }
    },
    handleRegister() {
      axios.post(`${this.$store.getters.getApiUrl}/profile/update-profile`,
        {
          first_name: this.first_name,
          last_name: this.last_name,
          address: this.$store.getters.getAccount,
        }).then(res => {
          console.log(res)
        })
    }
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap");
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 10%;
  background-color: rgb(18, 18, 18);
}

.logo {
  margin-right: auto;
}

.logo-img {
  cursor: pointer;
  width: 70px;
}

.nav__links a,
.overlay__content a {
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 1.2rem;
  color: #edf0f1;
  text-decoration: none;
  cursor: pointer;
}

.nav__links {
  list-style: none;
  display: flex;
  align-items: center;
}

.nav__links li {
  padding: 0px 20px;
  cursor: pointer;
}

.nav__links li a {
  transition: color 0.3s ease 0s;
}

.nav__links li a:hover {
  color: #0088a9;
}

.wallet-btn {
  margin-left: 15px;
}

.active {
  border-bottom: 2px solid #0088a9;
}
</style>