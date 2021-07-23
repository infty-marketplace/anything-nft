<template>
  <b-card
    class="user-card"
    :img-src="card.url"
    :key="card.url"
    img-alt="Image"
    img-top
  >
    <b-card-text class="card-detail">
      <p>Card Name</p>
      <p>{{ card.collection }}</p>
      <b>{{ card.author }}author</b>
    </b-card-text>
    <template #footer>
      <span class="text-muted-left"
        ><small class="text-muted"
          ><b-icon icon="clock"></b-icon>&nbsp;{{ card.expirationDate }} days
          left</small
        ></span
      >
      <span class="text-muted-right"
        ><small class="text-muted"
          ><b-icon icon="suit-diamond-fill"></b-icon>&nbsp;Price:
          {{ card.price }}</small
        ></span
      >
    </template>
  </b-card>
</template>

<script>
export default {
  name: "Card",
  props: {
    card: Object,
  },
};
</script>

<style scoped>
.user-card {
  transition: all 0.15s ease-in-out;
}
.user-card:hover {
  transform: scale(1.02);
  cursor: pointer;
}
.text-muted-left {
  margin-right: 42%;
}
.card-detail {
  font-size: 0.875em;
}
</style>