<template>
    <div class='flex-wrapper'>
        <Navbar active-index='2'/>
        <div class='flex-wrapper-row m-3'>
        <b-tabs class='main-content' content-class="ml-5 mr-5">
            <b-tab title="NFT" active>
                <b-card-group columns>
                <Card class='mt-4' v-for="card in usersCards" :card="card" :key="card.url" />
                </b-card-group>
            </b-tab>
            <b-tab title="Album"><p>TODO</p></b-tab>
        </b-tabs>
        </div>
        <Footer style="z-index:1"/>
        <a href='/mine/create'>
        <b-btn variant='primary' class='add-btn'>
            <b-icon icon="plus-circle-fill"></b-icon>
        </b-btn></a>
    </div>

</template>

<script>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import Card from '../components/Card.vue'
export default {
    name: "Collections",
    components: {
        Navbar,
        Footer,
        Card
    },
    data: () => ({
        usersCards: [
        {
          collection: "SupDucks",
          author: "Ada Lovelace",
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
        },
        {
          collection: "Art Blocks Curated",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          collection: "Bored Ape Kennel Club",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          collection: "Cool Cats",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          collection: "ZED RUN",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          collection: "FameLadySquad",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          collection: "Sorare",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          collection: "Meebits",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        {
          collection: "Ape Gang",
          author: "Ada Lovelace",
          price: Math.random().toFixed(2),
          url: `https://source.unsplash.com/random/200x200?sig=1${Math.round(
            Math.random() * 100
          )}`,
          expirationDate: `${Math.round(Math.random() * 10)}`,
        },
        ]
    })
}
</script>

<style scoped>
.main-content {
    width: 100%;
    max-width: 80vw;
}

.add-btn {
    position: fixed;
    bottom: 5vh;
    right: 5vw;
    height: 4vh;
    box-shadow: 0 0 5px rgba(33,33,33,.2); 
}
</style>

