<template>
  <li
    class="block p-5 m-5 text-white bg-gray-600 rounded"
    :key="question.id"
    data-testid="question-card"
  >
    <div class="flex justify-end">
      <div class="flex mr-5"></div>
    </div>
    <p>質問: {{ question.front.slice(0, 100) + '...' }}</p>
    <p>解答: {{ question.back.slice(0, 100) + '...' }}</p>
    <p>
      習得レベル:
      {{ question.learning_stage ? question.learning_stage : '未学習' }}
    </p>
    <p>
      次の学習日:
      {{ question.next_period ? question.next_period : '未学習' }}
    </p>
    <div class="flex justify-center mt-3">
      <div v-if="isPostedByMe" class="flex">
        <router-link
          :to="`/section/${question.section_id}/question/${question.id}/edit`"
        >
          <button class="mr-2 btn btn-primary">編集する</button>
        </router-link>

        <button
          data-testid="question-delete-button"
          @click="onDelete"
          class="mr-2 btn btn-sub-white"
        >
          削除する
        </button>
      </div>
      <button
        v-else
        data-testid="question-comment-button"
        class="btn btn-sub-white"
        @click="showModal"
      >
        改善要望
      </button>
    </div>
  </li>
</template>
<script lang="ts">
import { computed, defineComponent, SetupContext } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { Question } from '../types';
interface QuestionCardProps {
  question: Question;
}
export default defineComponent({
  props: ['question'],
  emits: ['load'],
  setup(props: QuestionCardProps, { emit }: SetupContext) {
    const store = useStore();
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
      store.dispatch('setCommentModal', {
        questionId: props.question.id,
      });
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
