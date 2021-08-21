<template>
    <div class="heart-like-button" ref='heart' @click='heartClicked'></div>
</template>
<script>
export default {
    data: () => ({
        liked: false
    }),
    methods: {
        heartClicked(){
            console.log(this.$refs['heart'].classList.length)
            if (this.$refs['heart'].classList.length == 1) this.$refs['heart'].classList.add('liked');
            else this.$refs['heart'].classList.remove('liked');
        }
    },
    
}
</script>
<style scoped>
.heart-like-button {
  position: relative;
  width: 160px;
  height: 130px;
}
.heart-like-button:before {
  position: absolute;
  top: 0;
  left: 80px;
  transform: rotate(-45deg);
  transform-origin: 0 100%;
  width: 80px;
  height: 125px;
  border-radius: 40px 40px 0 0;
  background-color: #aca9a9;
  content: "";
  cursor: pointer;
  transition: background .4s;
}
.heart-like-button:after {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(45deg);
  transform-origin :100% 100%;
  width: 80px;
  height: 125px;
  border-radius: 40px 40px 0 0;
  background-color: #aca9a9;
  content: "";
  cursor: pointer;
  transition: background .4s;
}

.heart-like-button.liked::before,
.heart-like-button.liked::after {
  background-color: #d65076;
}
.heart-like-button.liked {
  animation: liked .4s ease;
}
@keyframes liked {
  0% {
    transform: scale(.8);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

</style>