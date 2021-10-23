<template>
  <div class="relative cursor-pointer" @click="onFav" :class="colorClass">
    <div>
      <span v-if="type === 'like'">
        <font-awesome-icon
          :icon="faThumbsUp"
          class="fa-lg"
          :class="{ thumbsup: isAnimating }"
        />
        <span class="circle" :class="{ pulse: isAnimating }"></span>
      </span>
      <span v-else>
        <font-awesome-icon
          :icon="faThumbsDown"
          class="fa-lg"
          :class="{ thumbsup: isAnimating }"
        />
        <span class="circle" :class="{ pulse: isAnimating }"></span>
      </span>
    </div>
    <span class="count">{{ count }}</span>
  </div>
</template>
<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'FavButton',
  props: ['type', 'count', 'isFaved', 'isLocked'],
  emits: ['fav'],
  components: {
    FontAwesomeIcon,
  },
  setup(props, { emit }) {
    const store = useStore();
    const isAnimating = ref(false);
    const colorClass = computed(() => {
      return props.isFaved ? 'text-white' : 'text-gray-400';
    });
    const onFav = () => {
      if (!props.isLocked) {
        emit('fav');
        if (!props.isFaved) {
          isAnimating.value = true;
          setTimeout(() => {
            isAnimating.value = false;
          }, 300);
        }
      } else {
        store.dispatch('setModal', {
          type: 'caution',
          message: 'likeとdislikeは同時にできません',
        });
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
  top: 5px;
}
.thumbsup {
  animation: thumbs-up 0.3s infinite;
}
.circle {
  position: absolute;
  top: -65%;
  left: -80%;
  background-color: white;
  height: 60px;
  width: 60px;
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
