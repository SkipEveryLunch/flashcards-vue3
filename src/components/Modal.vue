<template>
  <div
    data-testid="modal"
    class="absolute z-10 flex items-center justify-center w-full h-full transition-opacity bg-black  bg-opacity-20"
  >
    <div class="flex flex-col p-5 bg-white border-gray-600 rounded-md">
      <div class="flex justify-center mb-3">{{ modal.message }}</div>
      <div class="flex justify-center">
        <button class="btn btn-blue" @click="onClose">閉じる</button>
      </div>
    </div>
  </div>
</template>
<script>
import { useStore } from 'vuex';
export default {
  name: 'Modal',
  props: ['modal'],
  setup() {
    const store = useStore();
    const onClose = () => {
      store.dispatch('discardModal');
    };
    return {
      onClose,
    };
  },
};
</script>
