<template>
  <div
    data-testid="modal"
    class="fixed z-20 flex items-center justify-center w-full h-full transition-opacity bg-black  bg-opacity-40"
  >
    <transition name="modalbox" appear>
      <div class="modal">
        <div class="py-2 pl-5 text-white bg-blue-600">{{ typeName }}</div>
        <div class="flex justify-center p-3">{{ modal.message }}</div>
        <div class="flex justify-center" v-if="modal.cb">
          <button
            v-if="modal.cb"
            class="mr-1 btn btn-primary"
            data-testid="modal-yes-button"
            @click="modal.cb.cb"
          >
            {{ modal.cb.name }}
          </button>
          <button
            class="btn btn-sub"
            data-testid="modal-no-button"
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
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'Modal',
  props: ['modal'],
  setup(props) {
    const store = useStore();
    const onClose = () => {
      store.dispatch('discardModal');
    };
    const typeName = computed(() => {
      switch (props.modal.type) {
        case 'notification':
          return '通知';
        case 'caution':
          return '注意';
        case 'error':
          return 'エラー';
        default:
          return '';
      }
    });
    onMounted(() => {
      if (!props.modal.cb) {
        setTimeout(() => {
          store.dispatch('discardModal');
        }, 2000);
      }
    });
    return {
      onClose,
      typeName,
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
.modal {
  @apply flex flex-col pb-5 bg-white border-gray-600 rounded-md;
  width: 250px;
  overflow: hidden;
}
</style>
