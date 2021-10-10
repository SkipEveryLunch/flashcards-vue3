<template>
  <div
    data-testid="modal"
    class="fixed z-20 flex items-center justify-center w-full h-full transition-opacity bg-black  bg-opacity-40"
  >
    <transition name="modalbox" appear>
      <div class="flex flex-col px-5 bg-white border-gray-600 rounded-md py-7">
        <div class="flex justify-center mb-3">{{ modal.message }}</div>
        <div class="flex justify-center" v-if="modal.cb">
          <button
            v-if="modal.cb"
            class="mr-1 btn btn-primary"
            data-testid="modal-button"
            @click="modal.cb.cb"
          >
            {{ modal.cb.name }}
          </button>
          <button
            class="btn btn-sub"
            data-testid="modal-button"
            @click="onClose"
          >
            いいえ
          </button>
        </div>
        <div v-else class="flex justify-center">
          <button
            class="btn btn-primary"
            data-testid="modal-button"
            @click="onClose"
          >
            閉じる
          </button>
        </div>
      </div>
    </transition>
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
<style scoped>
.modalbox-enter-from {
  transform: translateY(-30px);
}
.modalbox-enter-to {
  transform: translateY(0);
}
.modalbox-enter-active {
  transition: all 0.25s ease;
}
</style>
