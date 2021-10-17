<template>
  <div class="relative cursor-pointer" @click="onFav" :class="colorClass">
    <div>
      <span v-if="type === 'like'">
        <font-awesome-icon
          :icon="faThumbsUp"
          class="z-10 fa-lg"
          :class="{ thumbsup: isAnimating }"
        />
        <span class="circle" :class="{ pulse: isAnimating }"></span>
      </span>

      <font-awesome-icon v-else :icon="faThumbsDown" class="fa-lg" />
    </div>
    <span class="count">{{ count }}</span>
  </div>
</template>
<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { ref, computed } from 'vue';
export default {
  name: 'FavButton',
  props: ['type', 'count', 'isFaved'],
  emits: ['fav'],
  components: {
    FontAwesomeIcon,
  },
  setup(props, { emit }) {
    const isAnimating = ref(false);
    const colorClass = computed(() => {
      return props.isFaved ? 'text-white' : 'text-gray-400';
    });
    const onFav = () => {
      emit('fav');
      if (!props.isFaved) {
        isAnimating.value = true;
        setTimeout(() => {
          isAnimating.value = false;
        }, 300);
      }
    };
    return {
      colorClass,
      faThumbsUp,
      faThumbsDown,
      onFav,
      isAnimating,
    };
  },
};
</script>
<style scoped>
.count {
  text-shadow: 2px 2px 0 black, -2px -2px 0 black, -2px 2px 0 black,
    2px -2px 0 black, 0px 2px 0 black, 0-2px 0 black, -2px 0 0 black,
    2px 0 0 black;
  position: absolute;
  left: 20px;
  top: 8px;
}
.thumbsup {
  animation: thumbs-up 0.3s infinite;
}
.circle {
  position: absolute;
  top: -85%;
  left: -120%;
  background-color: white;
  height: 75px;
  width: 75px;
  border-radius: 50%;
  opacity: 0;
}
.pulse {
  animation: pulse 0.3s infinite;
}
@keyframes thumbs-up {
  0% {
    transform: scale(0.9);
  }
  65% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes pulse {
  0% {
    transform: scale(0.1);
    opacity: 0.5;
  }
  70% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
