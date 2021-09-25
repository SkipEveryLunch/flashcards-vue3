<template>
  <div
    data-testid="modal"
    class="fixed z-10 flex items-center justify-center w-full h-full transition-opacity bg-black  bg-opacity-20"
  >
    <div class="flex flex-col p-5 bg-white border-gray-600 rounded-md">
      <div class="flex justify-center mb-3">{{ modal.message }}</div>
      <div class="flex justify-center" v-if="modal.cb">
        <button
          v-if="modal.cb"
          class="btn btn-yellow"
          data-testid="modal-button"
          @click="modal.cb.cb"
        >
          {{ modal.cb.name }}
        </button>
        <button
          class="btn btn-blue"
          data-testid="modal-button"
          @click="onClose"
        >
          いいえ
        </button>
      </div>
      <div v-else class="flex justify-center">
        <button
          class="btn btn-blue"
          data-testid="modal-button"
          @click="onClose"
        >
          閉じる
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'Modal',
  props: ['modal'],
  setup(props) {
    const store = useStore();
    const onClose = () => {
      store.dispatch('discardModal');
    };
    onMounted(() => {
      if (!props.modal.cb) {
        setTimeout(() => {
          store.dispatch('discardModal');
        }, 2000);
      }
    });
    return {
      onClose,
    };
  },
};
</script>
