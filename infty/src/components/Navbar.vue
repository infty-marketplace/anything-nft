<template>
  <div>
    <header>
      <div class="logo" href="#">
        <img class="logo-img" src="@/assets/imgs/infty-logo.png" alt="logo" />
      </div>
      <nav>
        <ul class="nav__links">
          <li><a href="#">Marketplace</a></li>
          <li><a href="#">Collections</a></li>
          <li><a href="#">About</a></li>
          <li>
            <b-button pill variant='primary' class='wallet-btn'><b-icon class='ml-2 mr-2' icon="wallet2" aria-hidden="true"></b-icon></b-button>
          </li>
        </ul>
      </nav>
    </header>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  methods: {
    menuOpen() {
      const overlay = document.querySelector(".overlay");
      overlay.classList.add("overlay--active");
    },
    menuClose() {
      const overlay = document.querySelector(".overlay");
      overlay.classList.remove("overlay--active");
    },
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
</style>