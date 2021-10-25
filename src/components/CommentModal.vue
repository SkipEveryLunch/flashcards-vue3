<template>
  <div
    data-testid="modal"
    class="fixed z-20 flex items-center justify-center w-full h-full transition-opacity bg-black  bg-opacity-40"
  >
    <transition name="modalbox" appear>
      <div class="modal">
        <div class="py-2 pl-5 text-white bg-blue-700">通知</div>
        <div class="flex justify-center p-3">
          改善要望を以下から選んでください
        </div>
        <div class="flex justify-center">
          <button
            class="mr-1 btn btn-primary"
            data-testid="modal-yes-button"
            @click="onSubmit"
          >
            投稿
          </button>
          <button
            class="btn btn-sub"
            data-testid="modal-no-button"
            @click="onClose"
          >
            戻る
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
// import { reactive } from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'CommentModal',
  props: ['questionId'],
  setup(props) {
    const store = useStore();
    const onClose = () => {
      store.dispatch('discardCommentModal');
    };
    const onSubmit = () => {
      console.log(props.questionId);
    };
    return {
      onClose,
      onSubmit,
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
