<template>
  <!-- <div class="footer-container mt-5">
    Copyright @ CutoffX -->
  <footer>
    <div class="content">
      <div class="top">
        <!-- <div class="logo-details">
          <i class="fab fa-slack"></i>
          <span class="logo_name">Logo</span>
        </div> -->
        <div class="logo-details" href="#">
          <img class="logo-img" src="@/assets/imgs/infty-logo.png" alt="logo" />
        </div>
        <div class="media-icons">
          <a href="https://github.com/InfTkm/anything-nft" target="_blank"
            ><b-icon icon="github"></b-icon>
          </a>
          <!-- <a href="#"><i class="fab fa-facebook-f"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-linkedin-in"></i></a>
          <a href="#"><i class="fab fa-youtube"></i></a> -->
        </div>
      </div>
      <div class="link-boxes">
        <ul class="box">
          <li class="link_name">Marketplace</li>
          <li><a href="#">All NFTs</a></li>
          <li><a href="#">Art</a></li>
          <li><a href="#">Trading Cards</a></li>
          <li><a href="#">Collectibles</a></li>
        </ul>
        <ul class="box">
          <li class="link_name">Account</li>
          <li><a href="#">App design</a></li>
          <li><a href="#">Web design</a></li>
          <li><a href="#">Logo design</a></li>
          <li><a href="#">Banner design</a></li>
        </ul>
        <ul class="box">
          <li class="link_name">Stats</li>
          <li><a href="#">Rankings</a></li>
          <li><a href="#">Activity</a></li>
          <!-- <li><a href="#">Prefrences</a></li>
          <li><a href="#">Purchase</a></li> -->
        </ul>
        <ul class="box">
          <li class="link_name">CutoffX</li>
          <li><a href="#">Contact us</a></li>
          <li><a href="#">About us</a></li>
          <!-- <li><a href="#">Photography</a></li>
          <li><a href="#">Photoshop</a></li> -->
        </ul>
        <ul class="box input-box">
          <li class="link_name">Subscribe</li>
          <li><input type="text" placeholder="Enter your email" /></li>
          <li><input type="button" value="Subscribe" /></li>
        </ul>
      </div>
    </div>
    <div class="bottom-details">
      <div class="bottom_text">
        <span class="copyright_text"
          >Copyright @ CutoffX &nbsp; &nbsp; All rights reserved</span
        >
        <span class="policy_terms">
          <a href="#">Privacy policy</a>
          <a href="#">Terms & condition</a>
        </span>
      </div>
    </div>
  </footer>

  <!-- </div> -->
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Montserrat", sans-serif;
}
body {
  min-height: 100vh;
  width: 100%;
  background: #eeeceb;
}
footer {
  /* position: fixed; */
  background: rgb(18, 18, 18);
  width: 100%;
  padding-top: 30px;
  margin-top: 5%;
  /* padding-bottom: 30px; */
  bottom: 0;
  left: 0;
}
footer::before {
  content: "";
  position: absolute;
  left: 0;
  top: 100px;
  height: 1px;
  width: 100%;
  /* background: #afafb6; */
}
footer .content {
  /* max-width: 1250px; */
  margin-left: 10%;
  margin-right: 11%;
  margin-top: 30px;
  margin-bottom: 40px;
}
footer .content .box {
  padding-left: 0;
}

footer .content .top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
}
.content .top .logo-details {
  color: #fff;
  font-size: 30px;
}
.content .top .media-icons {
  display: flex;
}
.content .top .media-icons a {
  height: 50px;
  width: 50px;
  margin: 0 8px;
  border-radius: 50%;
  text-align: center;
  line-height: 52px;
  color: #fff;
  font-size: 30px;
  text-decoration: none;
  transition: all 0.4s ease;
}
.logo-img {
  cursor: pointer;
  width: 70px;
}
.top .media-icons a:nth-child(1) {
  background: rgb(47, 125, 246);
}
.top .media-icons a:nth-child(1):hover {
  color: rgb(47, 125, 246);
  background: #fff;
}
.top .media-icons a:nth-child(2) {
  background: #1da1f2;
}
.top .media-icons a:nth-child(2):hover {
  color: #1da1f2;
  background: #fff;
}
.top .media-icons a:nth-child(3) {
  background: #e1306c;
}
.top .media-icons a:nth-child(3):hover {
  color: #e1306c;
  background: #fff;
}
.top .media-icons a:nth-child(4) {
  background: #0077b5;
}
.top .media-icons a:nth-child(4):hover {
  color: #0077b5;
  background: #fff;
}
.top .media-icons a:nth-child(5) {
  background: #ff0000;
}
.top .media-icons a:nth-child(5):hover {
  color: #ff0000;
  background: #fff;
}
footer .content .link-boxes {
  width: 100%;
  display: flex;
  /* justify-content: space-between; */
  /* justify-content: flex-start; */
  text-align: left;
}
footer .content .link-boxes .box {
  width: calc(100% / 5 - 10px);
}

.content .link-boxes .box .link_name {
  color: #fff;
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 10px;
  position: relative;
}
.link-boxes .box .link_name::before {
  content: "";
  position: absolute;
  /* left: 0; */
  bottom: -2px;
  height: 2px;
  width: 35px;
  background: #fff;
}
.content .link-boxes .box li {
  margin: 6px 0;
  list-style: none;
}
.content .link-boxes .box li a {
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  text-decoration: none;
  opacity: 0.8;
  transition: all 0.4s ease;
}
.content .link-boxes .box li a:hover {
  opacity: 1;
  /* text-decoration: underline; */
  color: #0088a9;
}
.content .link-boxes .input-box {
  margin-right: 55px;
}
.link-boxes .input-box input {
  height: 40px;
  width: calc(100% + 55px);
  outline: none;
  border: 2px solid #afafb6;
  background: #edf0f1;
  border-radius: 4px;
  padding: 0 15px;
  font-size: 15px;
  color: rgb(18, 18, 18);
  margin-top: 5px;
}
.link-boxes .input-box input::placeholder {
  color: #737377;
  font-size: 16px;
}
.link-boxes .input-box input[type="button"] {
  background: rgb(47, 125, 246);
  color: #fff;
  border: none;
  font-size: 18px;
  font-weight: 500;
  margin: 4px 0;
  opacity: 0.8;
  cursor: pointer;
  transition: all 0.4s ease;
}
.input-box input[type="button"]:hover {
  opacity: 1;
}
footer .bottom-details {
  width: 100%;
  background: black;
  padding: 30px 10%;
}
footer .bottom-details .bottom_text {
  /* max-width: 1250px; */
  /* margin-right: -20; */
  margin: 0;
  padding-top: 40px;
  padding-bottom: 40px;
  display: flex;
  justify-content: space-between;
}
.bottom-details .bottom_text span,
.bottom-details .bottom_text a {
  font-size: 14px;
  font-weight: 300;
  color: #fff;
  opacity: 0.8;
  text-decoration: none;
}
.bottom-details .bottom_text a:hover {
  opacity: 1;
  text-decoration: underline;
}
.bottom-details .bottom_text a {
  margin-right: 10px;
}
@media (max-width: 900px) {
  footer .content .link-boxes {
    flex-wrap: wrap;
  }
  footer .content .link-boxes .input-box {
    width: 40%;
    margin-top: 10px;
  }
}
@media (max-width: 700px) {
  footer {
    position: relative;
  }
  .content .top .logo-details {
    font-size: 26px;
  }
  .content .top .media-icons a {
    height: 35px;
    width: 35px;
    font-size: 14px;
    line-height: 35px;
  }
  footer .content .link-boxes .box {
    width: calc(100% / 3 - 10px);
  }
  footer .content .link-boxes .input-box {
    width: 60%;
  }
  .bottom-details .bottom_text span,
  .bottom-details .bottom_text a {
    font-size: 12px;
  }
}
@media (max-width: 520px) {
  footer::before {
    top: 145px;
  }
  footer .content .top {
    flex-direction: column;
  }
  .content .top .media-icons {
    margin-top: 16px;
  }
  footer .content .link-boxes .box {
    width: calc(100% / 2 - 10px);
  }
  footer .content .link-boxes .input-box {
    width: 100%;
  }
}
</style>
