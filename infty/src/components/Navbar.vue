<template>
  <div>
    <header>
      <div class="logo"><router-link to='/'>
        <img class="logo-img" src="@/assets/imgs/infty-logo.png" alt="logo" />
      </router-link></div>
      <nav>
        <ul class="nav__links">
          <li v-bind:class="{active: activeIndex==0}"><a href="/marketplace">Marketplace</a></li>
          <li v-bind:class="{active: activeIndex==1}"><a href="/mine/collections">Collections</a></li>
          <li v-bind:class="{active: activeIndex==2}"><a href="#">About</a></li>
          <li>
            <b-button pill variant='primary' class='wallet-btn' @click="connectWallet">
              <b-icon class='ml-2 mr-2' icon="wallet2" aria-hidden="true"></b-icon>
            </b-button>
          </li>
		<div class="profile-header">
			<img class="profile-image" src="@/assets/imgs/infty-logo.png" alt="logo" @click="navToProfile">
		</div>
        </ul>
      </nav>
    </header>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  props: ['activeIndex'],
  methods: {
    async connectWallet() {
      let accounts;
      try {
        accounts = await window.conflux.send("cfx_requestAccounts")
      } catch (e) {
        console.log(e)
      }
      if (accounts) {
        this.$store.commit("setAccount", accounts[0])
        console.log(this.$store.getters.getAccount)
        window.alert('Connected')
      }
    },
	navToProfile(){
		this.$router.push('Profile') 
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

.profile-header {
  margin-right: auto;
  
}

.profile-img {
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
  justify-content: flex-end;
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