<template>
  <li
    class="block p-5 m-5 text-white bg-gray-600 rounded"
    :key="question.id"
    data-testid="question-card"
  >
    <div class="flex justify-end">
      <div class="flex mr-5">
        <FavButton
          type="like"
          :count="like"
          :isFaved="isLikedByUser"
          :isLocked="isDislikedByUser"
          class="mr-10"
          @fav="onLike"
        />
        <FavButton
          type="dislike"
          :count="dislike"
          :isFaved="isDislikedByUser"
          :isLocked="isLikedByUser"
          @fav="onDislike"
        />
      </div>
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
      <div class="flex">
        <router-link
          :to="`/section/${question.section_id}/question/${question.id}/edit`"
        >
          <button class="mr-2 btn btn-primary">編集する</button>
        </router-link>

        <button
          data-testid="question-delete-button"
          @click="onDelete"
          class="btn btn-sub-white"
        >
          削除する
        </button>
      </div>
    </div>
  </li>
</template>
<script lang="ts">
import { ref, onMounted, computed, defineComponent, SetupContext } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import FavButton from './FavButton.vue';
import { Question } from '../types';
interface QuestionCardProps {
  question: Question;
}
export default defineComponent({
  props: ['question'],
  emits: ['load'],
  components: {
    FavButton,
  },
  setup(props: QuestionCardProps, { emit }: SetupContext) {
    const store = useStore();
    const user = computed(() => {
      return store.state.user;
    });
    const like = ref(0);
    const dislike = ref(0);
    const isLikedByUser = ref(false);
    const isDislikedByUser = ref(false);
    onMounted(() => {
      like.value = props.question.likedBy.length;
      dislike.value = props.question.dislikedBy.length;
      isLikedByUser.value = props.question.likedBy.includes(user.value.id);
      isDislikedByUser.value = props.question.dislikedBy.includes(
        user.value.id
      );
    });
    const onLike = async () => {
      if (!isDislikedByUser.value) {
        if (!isLikedByUser.value) {
          like.value = like.value + 1;
          isLikedByUser.value = true;
          try {
            const { status } = await axios.post(
              `/favorites/${props.question.id}`,
              {
                type: 'like',
              }
            );
            if (status !== 200) {
              like.value = like.value - 1;
              isLikedByUser.value = false;
              onFavError();
            }
          } catch (e) {
            like.value = like.value - 1;
            isLikedByUser.value = false;
            onFavError();
          }
        } else {
          like.value = like.value - 1;
          isLikedByUser.value = false;
          try {
            const { status } = await axios.delete(
              `/favorites/${props.question.id}`
            );
            if (status !== 204) {
              like.value = like.value + 1;
              isLikedByUser.value = true;
              onFavError();
            }
          } catch (e) {
            like.value = like.value + 1;
            isLikedByUser.value = true;
            onFavError();
          }
        }
      }
    };
    const onDislike = async () => {
      if (!isLikedByUser.value) {
        if (!isDislikedByUser.value) {
          dislike.value = dislike.value + 1;
          isDislikedByUser.value = true;
          try {
            const { status } = await axios.post(
              `/favorites/${props.question.id}`,
              {
                type: 'dislike',
              }
            );
            if (status !== 200) {
              dislike.value = dislike.value - 1;
              isDislikedByUser.value = false;
            }
          } catch {
            dislike.value = dislike.value - 1;
            isDislikedByUser.value = false;
          }
        } else {
          dislike.value = dislike.value - 1;
          isDislikedByUser.value = false;
          try {
            const { status } = await axios.delete(
              `/favorites/${props.question.id}`
            );
            if (status !== 204) {
              dislike.value = dislike.value + 1;
              isDislikedByUser.value = true;
            }
          } catch (e) {
            dislike.value = dislike.value + 1;
            isDislikedByUser.value = true;
          }
        }
      }
    };
    const onFavError = () => {
      store.dispatch('setModal', {
        type: 'error',
        message: 'エラーによりアクションが取り消されました',
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
      like,
      dislike,
      isLikedByUser,
      isDislikedByUser,
      onLike,
      onDislike,
    };
  },
});
</script>
