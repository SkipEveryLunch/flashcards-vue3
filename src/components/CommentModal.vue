<template>
  <div
    data-testid="modal"
    class="fixed z-20 flex items-center justify-center w-full h-full transition-opacity bg-black  bg-opacity-40"
  >
    <transition name="modalbox" appear>
      <div class="modal">
        <div class="py-2 pl-5 text-white bg-blue-700">通知</div>
        <div class="flex justify-center p-3">
          <span v-if="mode === 'new'"> 改善要望を以下から選んでください </span>
          <span v-else> 以前に投稿した要望を編集・削除しますか？ </span>
        </div>
        <div class="flex justify-center mt-5">
          <div class="flex flex-col">
            <div class="mb-2">
              <input
                type="radio"
                id="too-long"
                value="複雑・長すぎる"
                v-model="form.comment_type"
              />
              <label for="too-long">複雑・長すぎる</label>
            </div>
            <div class="mb-2">
              <input
                type="radio"
                id="not-suitable"
                value="セクションにそぐわない"
                v-model="form.comment_type"
              />
              <label for="not-suitable">セクションにそぐわない</label>
            </div>
            <div class="mb-2">
              <input
                type="radio"
                id="pejorative"
                value="内容が攻撃的"
                v-model="form.comment_type"
              />
              <label for="pejorative">内容が攻撃的</label>
            </div>
            <div>
              <input
                type="radio"
                id="not-proper"
                value="文法的に不自然"
                v-model="form.comment_type"
              />
              <label for="not-proper">文法的に不自然</label>
            </div>
          </div>
        </div>
        <transition name="detailinput" appear>
          <div class="mx-5 my-2" v-if="form.comment_type === '文法的に不自然'">
            <label for="not-proper-detail">詳細：</label>
            <input
              class="w-full border-2 border-gray-200"
              id="not-proper-detail"
              v-model="form.comment_detail"
              type="text"
            />
          </div>
        </transition>
        <div v-if="mode === 'new'" class="flex justify-center mt-4">
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
        <div v-else class="flex justify-center mt-4">
          <button
            class="mr-1 btn btn-primary"
            data-testid="modal-yes-button"
            @click="onEdit"
            :disabled="isDisabled"
          >
            編集
          </button>
          <button
            class="mr-1 btn btn-primary"
            data-testid="modal-yes-button"
            @click="onDelete"
          >
            削除
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
import { reactive, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
export default {
  name: 'CommentModal',
  props: ['questionId', 'mode'],
  setup(props) {
    const store = useStore();
    const onClose = () => {
      store.dispatch('discardCommentModal');
    };
    const form = reactive({
      comment_type: '',
      comment_detail: '',
    });
    onMounted(async () => {
      if (props.mode === 'edit') {
        const { status, data } = await axios(
          `questions_comments/${props.questionId}`
        );
        form.comment_type = data.comment.comment_type;
        form.comment_detail = data.comment.comment_detail;
      }
    });
    watch(form.comment_type, () => {
      if (form.comment_type !== '文法的に不自然') {
        form.comment_detail = '';
      }
    });
    const isDisabled = computed(() => {
      return form.comment_type === '';
    });
    const onSubmit = async () => {
      try {
        if (props.mode === 'new') {
          const { status } = await axios.post(
            `questions_comments/${props.questionId}`,
            {
              comment_type: form.comment_type,
              comment_detail:
                form.comment_detail === '' ? 'no detail' : form.comment_detail,
            }
          );
          if (status === 200) {
            store.dispatch('reloadSection');
            onClose();
            store.dispatch('setModal', {
              type: 'notification',
              message: 'コメントを投稿しました',
            });
          }
        }
      } catch (e) {
        onClose();
        store.dispatch('setModal', {
          type: 'caution',
          message: '投稿されておりません',
        });
      }
    };
    const onEdit = async () => {
      try {
        if (props.mode === 'edit') {
          const { status } = await axios.put(
            `questions_comments/${props.questionId}`,
            {
              comment_type: form.comment_type,
              comment_detail:
                form.comment_detail === '' ? 'no detail' : form.comment_detail,
            }
          );
          if (status === 200) {
            onClose();
            store.dispatch('setModal', {
              type: 'notification',
              message: 'コメントを編集しました',
            });
          }
        }
      } catch (e) {
        onClose();
        store.dispatch('setModal', {
          type: 'caution',
          message: '投稿されておりません',
        });
      }
    };
    const onDelete = async () => {
      try {
        if (props.mode === 'edit') {
          const { status } = await axios.delete(
            `questions_comments/${props.questionId}`
          );
          if (status === 204) {
            store.dispatch('reloadSection');
            onClose();
            store.dispatch('setModal', {
              type: 'notification',
              message: 'コメントを削除しました',
            });
          }
        }
      } catch (e) {
        onClose();
        store.dispatch('setModal', {
          type: 'caution',
          message: '投稿されておりません',
        });
      }
    };
    return {
      onClose,
      form,
      isDisabled,
      onSubmit,
      onEdit,
      onDelete,
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
