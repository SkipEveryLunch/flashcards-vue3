<template>
  <div class="card">
    <div class="flex items-center w-1/6 mr-1">
      <p class="text-2xl">{{ section.title }}</p>
    </div>
    <div class="flex flex-col justify-center w-1/2 px-2 flex-2 wrap">
      <div>
        <p>{{ section.description }}</p>
      </div>
    </div>
    <div class="flex items-center justify-self-end">
      <div class="flex whitespace-nowrap">
        <router-link :to="`/section/${section.id}/study`">
          <button class="mr-2 btn btn-primary">学習する</button>
        </router-link>
        <router-link :to="`/section/${section.id}/edit`">
          <button class="btn btn-sub-white">問題一覧</button>
        </router-link>
      </div>
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
  @apply w-full flex flex-row pl-2 py-3 mb-2 text-gray-100 bg-gray-700 rounded justify-around;
  min-height: 90px;
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
