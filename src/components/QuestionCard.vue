<template>
  <div class="flex card">
    <div class="flex flex-col justify-center w-full m-3">
      <div class="pb-2 border-u">
        <p>{{ question.front }}</p>
      </div>
      <div class="mt-2">
        <p>{{ question.back }}</p>
      </div>
    </div>
    <div class="flex flex-col w-1/4">
      <div class="flex">
        <div
          class="flex flex-col justify-start w-2/3 p-2 text-sm  whitespace-nowrap"
        >
          <p>
            レベル:
            {{ question.learning_stage ? question.learning_stage : '未学習' }}
          </p>
          <p>
            次回:
            {{ question.next_period ? question.next_period : '未学習' }}
          </p>
        </div>
        <div class="flex justify-end w-full pr-2">
          <CommentIcon
            :isCommented="isCommentedByMe"
            :count="question.commented_by.length"
            @comment="showModal"
          />
        </div>
      </div>
      <div v-if="isPostedByMe" class="flex items-end justify-end h-full">
        <router-link
          :to="`/section/${question.section_id}/question/${question.id}/edit`"
        >
          <button class="mr-2 whitespace-nowrap btn btn-primary">
            編集する
          </button>
        </router-link>
        <button
          data-testid="question-delete-button"
          @click="onDelete"
          class="mr-2 btn btn-sub-white whitespace-nowrap"
        >
          削除する
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, SetupContext } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Question } from '../types';
import CommentIcon from './CommentIcon.vue';
interface QuestionCardProps {
  question: Question;
}
export default defineComponent({
  props: ['question'],
  emits: ['load'],
  components: {
    CommentIcon,
  },
  setup(props: QuestionCardProps, { emit }: SetupContext) {
    const store = useStore();
    const router = useRouter();
    const user = computed(() => {
      return store.state.user;
    });
    const isPostedByMe = computed(() => {
      return props.question.posted_by === user.value.id;
    });
    const isCommentedByMe = computed(() => {
      return props.question.commented_by.includes(user.value.id);
    });
    const showModal = () => {
      if (isPostedByMe.value) {
        router.push(
          `/section/${props.question.section_id}/question/${props.question.id}/comment`
        );
      } else {
        store.dispatch('setCommentModal', {
          questionId: props.question.id,
          modalMode: isCommentedByMe.value ? 'edit' : 'new',
        });
      }
    };
    const onDelete = () => {
      store.dispatch('setModal', {
        type: 'caution',
        message: '本当に削除しますか?',
        cb: {
          name: '削除します',
          cb: async () => {
            try {
              const { status } = await axios.delete(
                `questions/${props.question.id}`
              );
              if (status === 204) {
                await store.dispatch('discardModal');
                store.dispatch('setModal', {
                  type: 'notification',
                  message: '削除しました',
                });
                emit('load');
              } else {
                store.dispatch('setModal', {
                  type: 'error',
                  message: '不明なエラーです',
                });
              }
            } catch (e) {
              if (e.response.status === 404) {
                store.dispatch('setModal', {
                  type: 'error',
                  message: '質問が見つかりません',
                });
              } else {
                store.dispatch('setModal', {
                  type: 'error',
                  message: '不明なエラーです',
                });
              }
            }
          },
        },
      });
    };
    return {
      onDelete,
      user,
      showModal,
      isPostedByMe,
      isCommentedByMe,
    };
  },
});
</script>
<style>
.card {
  @apply p-3 mb-2 bg-gray-700 rounded flex;
  height: 140px;
}
.border-u {
  border-bottom: 2px solid rgba(115, 115, 115);
}
</style>
