<template>
  <div class="flex items-center justify-center h-full">
    <div
      v-if="questions.length > 0 && remains.length === 0"
      data-testid="study-finish-message"
      class="py-4 m-4 text-white bg-gray-900 rounded-lg px-7"
    >
      本日の学習は終了しました。
      <div class="flex justify-center mt-5">
        <button class="mr-2 btn btn-primary" @click="onSubmit">同期</button>
        <router-link to="/">
          <button class="btn btn-sub-white">戻る</button>
        </router-link>
      </div>
    </div>
    <div
      v-else-if="questions.length > 0"
      data-testid="question-window"
      class="py-4 m-4 text-white bg-gray-900 rounded-lg px-7"
    >
      <p class="mb-3 text-center">{{ progress + 1 }}/{{ questions.length }}</p>
      <FlipCard
        :front="questions[progress].front"
        :back="questions[progress].back"
        :phase="phase"
        @flip="onFlip"
      />
      <div class="buttonContainer">
        <div
          class="flex flex-col justify-center h-full"
          v-if="phase === 'question'"
        >
          <div class="text-center">カードをクリックすると答えが見れます</div>
        </div>
        <div v-else-if="phase === 'answer'" class="flex justify-center">
          <button
            class="mr-2 btn btn-primary"
            @click="() => next(true)"
            data-testid="correct-button"
          >
            正解！
          </button>
          <button class="btn btn-sub-white" @click="() => next(false)">
            もう一度
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Section, Question } from '../../types';
import axios from 'axios';
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import FlipCard from '../../components/FlipCard.vue';
const range = (start: number, end: number) => {
  const list = [];
  for (let i = start; i <= end; i++) {
    list.push(i);
  }
  return list;
};
export default {
  name: 'StudyNewPage',
  components: {
    FlipCard,
  },
  setup() {
    const {
      params: { sectionId },
    } = useRoute();
    const questions = ref<Question[]>([]);
    const remains = ref<number[]>([]);
    interface FormState {
      question_ids: number[];
    }
    const form = reactive<FormState>({
      question_ids: [],
    });
    const section = ref<null | Section>(null);
    const progress = ref(0);
    const store = useStore();
    const router = useRouter();
    const phase = ref('question');
    onMounted(async () => {
      if (!user.value) {
        store.dispatch('setModal', {
          type: 'error',
          message: 'ログインが必要です',
        });
        router.push('/');
      } else {
        await load();
      }
    });
    const load = async () => {
      try {
        const { status, data } = await axios.get(
          `sections/${sectionId}/new_questions`
        );
        if (data.message === "next assignment isn't yet") {
          store.dispatch('setModal', {
            type: 'notification',
            message: '本日の新規学習は終了しました。明日また頑張ろうね',
          });
        } else if (status == 200) {
          questions.value = data.questions;
          remains.value = range(0, questions.value.length - 1);
        } else {
          store.dispatch('setModal', {
            type: 'error',
            message: '不明なエラーです',
          });
        }
      } catch (e) {
        store.dispatch('setModal', {
          type: 'error',
          message: '不明なエラーです',
        });
      }
    };

    const onFlip = () => {
      if (phase.value === 'question') {
        phase.value = 'answer';
      } else {
        phase.value = 'question';
      }
    };
    const next = (isCorrect: boolean) => {
      if (isCorrect) {
        const newRemains = remains.value.filter((el) => {
          return el !== progress.value;
        });
        remains.value = newRemains;
        form.question_ids = [
          ...form.question_ids,
          questions.value[progress.value].id,
        ];
      }
      if (remains.value.length > 0) {
        do {
          if (progress.value < questions.value.length - 1) {
            progress.value = progress.value + 1;
          } else {
            progress.value = 0;
          }
        } while (!remains.value.includes(progress.value));
      }
      phase.value = 'question';
    };
    const onSubmit = async () => {
      const { status, data } = await axios.post(
        `sections/${sectionId}/answer_questions`,
        form
      );
      if (status === 200) {
        store.dispatch('setModal', {
          type: 'notification',
          message: '同期しました',
        });
        questions.value = [];
        remains.value = [];
        progress.value = 0;
        form.question_ids = [];
      }
    };
    const user = computed(() => {
      return store.state.user;
    });
    return {
      questions,
      progress,
      next,
      section,
      remains,
      onSubmit,
      user,
      phase,
      onFlip,
    };
  },
};
</script>
<style>
.buttonContainer {
  height: 45px;
  @apply:flex justify-center items-center;
}
</style>
