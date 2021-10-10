<template>
  <div class="h-full">
    <transition name="flip" mode="out-in">
      <div v-if="phase === 'question'" class="card card-front" @click="flip">
        <div class="mb-5 text-lg text-center">質問</div>
        <div>{{ front }}</div>
      </div>
      <div v-else class="card card-back" @click="flip">
        <div class="mb-5 text-lg text-center">解答</div>
        <div>{{ back }}</div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'FlipCard',
  props: ['front', 'back', 'phase'],
  emits: ['flip'],
  setup(_, { emit }) {
    const flip = () => {
      emit('flip');
    };
    return {
      flip,
    };
  },
};
</script>
<style scoped>
.card {
  height: 270px;
  width: 250px;
  @apply flex flex-col p-4 m-5 rounded;
}
.card-front {
  @apply bg-green-300;
}
.card-back {
  @apply bg-yellow-300;
}
.flip-enter-from {
  transform: rotateY(90deg);
}
.flip-enter-to {
  transform: rotateY(0deg);
}
.flip-enter-active {
  transition: all 0.25s ease-in;
}
.flip-leave-from {
  transform: rotateY(0deg);
}
.flip-leave-to {
  transform: rotateY(90deg);
}
.flip-leave-active {
  transition: all 0.25s ease-out;
}
</style>
