<template>
  <div class="relative cursor-pointer" :class="colorClass" @click="fav">
    <div>
      <font-awesome-icon
        v-if="type === 'like'"
        :icon="faThumbsUp"
        class="fa-lg"
      />
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
  components: {
    FontAwesomeIcon,
  },
  setup(props) {
    const isFaved = ref(false);
    const colorClass = computed(() => {
      return isFaved.value ? 'text-white' : 'text-gray-400';
    });
    return {
      colorClass,
      faThumbsUp,
      faThumbsDown,
      fav,
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
</style>
