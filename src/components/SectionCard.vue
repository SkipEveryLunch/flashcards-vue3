<template>
  <div class="card">
    <div class="flex flex-col justify-center text-2xl text-center h-1/5">
      <div>
        <p>{{ section.title }}</p>
      </div>
    </div>
    <div class="flex flex-col justify-center mb-2 h-1/2">
      <div class="text-center">
        <p>{{ section.description }}</p>
      </div>
    </div>
    <div class="flex items-center justify-center h-1/4">
      <router-link :to="`/section/${section.id}/study`">
        <button class="mr-2 btn btn-primary">学習する</button>
      </router-link>
      <router-link :to="`/section/${section.id}/edit`">
        <button class="btn btn-sub-white">問題一覧</button>
      </router-link>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue';
export default {
  name: 'SectionCard',
  props: ['section'],
  setup() {
    const isFliped = ref(false);
    const flip = (value) => {
      console.log(value);
      isFliped.value = value;
    };
    return {
      flip,
      isFliped,
    };
  },
};
</script>
<style scoped>
.card {
  @apply m-5 w-full p-5  text-white bg-gray-900 rounded-lg h-full;
  height: 350px;
  width: 280px;
  overflow: hidden;
}
.slide-enter-from {
  transform: translateX(120px);
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0px);
}
.slide-enter-active {
  transition: all 0.25s ease-in;
}
.slide-leave-from {
  transform: translateX(0px);
}
.slide-leave-to {
  transform: translateX(-120px);
  opacity: 0;
}
.slide-leave-active {
  transition: all 0.25s ease-out;
}
</style>
