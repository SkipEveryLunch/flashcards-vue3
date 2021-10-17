<template>
  <div class="flex items-center justify-center h-screen bg-black">
    <FavButton type="like" :count="3" :isFaved="isFaved" @fav="onFav" />
  </div>
</template>
<script>
import FavButton from './components/FavButton.vue';
import { ref } from 'vue';
export default {
  name: 'App',
  components: {
    FavButton,
  },
  setup() {
    const isFaved = ref(false);
    const onFav = () => {
      isFaved.value = !isFaved.value;
    };
    return {
      isFaved,
      onFav,
    };
  },
};
</script>
