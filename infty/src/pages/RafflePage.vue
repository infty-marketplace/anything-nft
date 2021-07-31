<template>
  <div class="raffle-page">
    <Navbar active-index="1" />
    <div class="container">
      <div id="stack">
        <div id="card">
          <figure class="front spade"></figure>
          <figure class="back"></figure>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
export default {
  name: "RafflePage",
  components: {
    Navbar,
    Footer,
  },
};
</script>
<style  scoped>
@charset "UTF-8";
.raffle-page {
  text-align: left;
}
.container {
  width: 500px;
  height: 500px;
  /* position: relative; */
  perspective: 800px;
  margin-top: 2em;
  margin-left: 2em;
}

#stack {
  background: url(https://www.toptal.com/designers/subtlepatterns/patterns/pink%20dust.png);
  height: 325px;
  width: 250px;
  border-radius: 10px;
  position: absolute;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  padding: 10px;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
  transform: rotate(2deg);
}
#stack:before {
  top: -2px;
  left: -2px;
  transform: rotate(-1deg);
}
#stack:after {
  top: -5px;
  left: -6px;
  transform: rotate(-1.5deg);
}
#stack:before,
#stack:after {
  content: "";
  background: url(https://www.toptal.com/designers/subtlepatterns/patterns/pink%20dust.png);
  height: 325px;
  width: 250px;
  display: block;
  border-radius: 10px;
  position: absolute;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
}
#stack #card {
  width: 250px;
  height: 325px;
  position: absolute;
  transform-style: preserve-3d;
  transition: transform 0.4s ease, margin 0.6s ease 0.2s;
  left: -3px;
  top: -3px;
}
#stack #card figure {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  transition-delay: transform 1s;
}
#stack #card figure.front {
  background: #fafafa;
  transform: rotateZ(2deg) rotateY(180deg);
}
#stack #card figure.front:after {
  color: #555;
  font-size: 120px;
  font-family: arial;
  position: absolute;
  top: 80px;
}
#stack #card figure.front.spade:after {
  content: "♠";
  left: 95px;
}
#stack #card figure.front.club:after {
  content: "♣";
  left: 85px;
}
#stack #card figure.front.heart:after {
  content: "❤";
  left: 70px;
  color: rgba(255, 90, 25, 0.8);
}
#stack #card figure.front.diamond:after {
  content: "♦";
  left: 95px;
  color: rgba(255, 90, 25, 0.8);
}
#stack #card figure.back {
  background: url(https://www.toptal.com/designers/subtlepatterns/patterns/pink%20dust.png);
}
#stack:hover #card {
  margin: -8px 0px 0px 300px;
  transform: rotateY(-180deg);
  transition: transform 0.6s ease 0.4s, margin 0.8s ease;
}
#stack:hover #card figure {
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
}
</style>