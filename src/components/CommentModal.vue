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
        <div class="flex justify-center mt-5">
          <div class="flex flex-col">
            <div class="mb-2">
              <input
                type="radio"
                id="too-long"
                value="複雑・長すぎる"
                v-model="form.commentType"
              />
              <label for="too-long">複雑・長すぎる</label>
            </div>
            <div class="mb-2">
              <input
                type="radio"
                id="not-suitable"
                value="セクションにそぐわない"
                v-model="form.commentType"
              />
              <label for="not-suitable">セクションにそぐわない</label>
            </div>
            <div class="mb-2">
              <input
                type="radio"
                id="pejorative"
                value="内容が攻撃的"
                v-model="form.commentType"
              />
              <label for="pejorative">内容が攻撃的</label>
            </div>
            <div>
              <input
                type="radio"
                id="not-proper"
                value="文法的に不自然"
                v-model="form.commentType"
              />
              <label for="not-proper">文法的に不自然</label>
            </div>
          </div>
        </div>
        <transition name="detailinput" appear>
          <div class="mx-5 my-2" v-if="form.commentType === '文法的に不自然'">
            <label for="not-proper-detail">詳細：</label>
            <input
              class="w-full border-2 border-gray-200"
              id="not-proper-detail"
              v-model="form.commentDetail"
              type="text"
            />
          </div>
        </transition>
        <div class="flex justify-center mt-4">
          <button
            class="mr-1 btn btn-primary"
            data-testid="modal-yes-button"
            @click="onSubmit"
            :disabled="isDisabled"
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
import { reactive, computed, watch, ref } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
export default {
  name: 'CommentModal',
  props: ['questionId'],
  setup(props) {
    const store = useStore();
    const originalHeight = useStore(0);
    const onClose = () => {
      store.dispatch('discardCommentModal');
    };
    const form = reactive({
      commentType: '',
      commentDetail: '',
    });
    watch(form.commentType, () => {
      if (form.commentType !== '文法的に不自然') {
        form.commentDetail = '';
      }
    });
    const isDisabled = computed(() => {
      return form.commentType === '';
    });
    const onSubmit = async () => {
      console.log('submit');
      try {
        const { status } = await axios.post(
          `questions/${props.questionId}/comments`,
          {
            comment_type: form.commentType,
            comment_detail:
              form.commentDetail === '' ? 'no detail' : form.commentDetail,
          }
        );
        if (status === 200) {
          console.log('succeed');
          onClose();
          store.dispatch('setModal', {
            type: 'notification',
            message: 'コメントを投稿しました',
          });
        }
      } catch (e) {
        console.log('failed');
        onClose();
        store.dispatch('setModal', {
          type: 'caution',
          message: 'すでに投稿済です',
        });
      }
    };
    return {
      onClose,
      form,
      isDisabled,
      onSubmit,
    };
  },
};
</script>
<style scoped>
.modalbox-enter-from {
  transform: translateY(-30px);
}
.modalbox-enter-active {
  transition: all 0.25s ease;
}
.detailinput-enter-from {
  transform: scaleY(0);
}
.detailinput-enter-active {
  transition: all 0.25s ease;
}
.detailinput-leave-to {
  transform: scaleY(0);
}
.detailinput-leave-active {
  transition: all 0.25s ease;
}
.modal {
  @apply flex flex-col pb-5 bg-white border-gray-600 rounded-md;
  width: 400px;
  overflow: hidden;
  transition: height 0.3s;
}
</style>
