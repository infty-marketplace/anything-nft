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
            <b-icon id="wallet" icon="wallet2" aria-hidden="true"></b-icon>
          </li>
        </ul>
      </nav>
      <!-- <a class="cta" href="#">Contact</a> -->

      <p @click="menuOpen" class="menu cta">Menu</p>
    </header>
    <div class="overlay">
      <a class="close">&times;</a>
      <div @click="menuClose" class="overlay__content">
        <a href="#">Services</a>
        <a href="#">Projects</a>
        <a href="#">About</a>
      </div>
    </div>
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
  margin-top: 5px;
}

.logo-img {
  cursor: pointer;
  margin-right: auto;
  width: 3vw;
}

.nav__links a,
.cta a,
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
}

.cta,
.nav__links li {
  padding: 0px 20px;
  cursor: pointer;
}

.cta a,
.nav__links li a {
  transition: color 0.3s ease 0s;
}

.cta a:hover {
  color: #0088a9;
}

.nav__links li a:hover {
  color: #0088a9;
}

#wallet {
  color: #edf0f1;
  transition: color 0.3s ease 0s;
  cursor: pointer;
  margin-left: 1.5vw;
  height: 120%;
}

#wallet:hover {
  color: #0088a9;
}

/* .cta { */
/* padding: 9px 25px; */
/* background-color: rgba(0, 136, 169, 1); */
/* border: none; */
/* border-radius: 50px; */
/* cursor: pointer;
  transition: background-color 0.3s ease 0s;
} */

/* .cta:hover {
  background-color: rgba(0, 136, 169, 0.8);
} */

/* Mobile Nav */

.menu {
  display: none;
}

.overlay {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  background-color: #24252a;
  overflow-x: hidden;
  transition: width 0.5s ease 0s;
}

.overlay--active {
  width: 100%;
}

.overlay__content {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.overlay a {
  padding: 15px;
  font-size: 36px;
  display: block;
  transition: color 0.3s ease 0s;
}

.overlay a:hover,
.overlay a:focus {
  color: #0088a9;
}
.overlay .close {
  position: absolute;
  top: 20px;
  right: 45px;
  font-size: 60px;
  color: #edf0f1;
}

@media screen and (max-height: 450px) {
  .overlay a {
    font-size: 20px;
  }
  .overlay .close {
    font-size: 40px;
    top: 15px;
    right: 35px;
  }
}

@media only screen and (max-width: 800px) {
  .nav__links,
  .cta {
    display: none;
  }
  .menu {
    display: initial;
  }
}
</style>
