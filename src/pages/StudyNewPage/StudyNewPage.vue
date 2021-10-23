<template>
  <div class="flex items-center justify-center h-full">
    <div
      v-if="questions.length > 0 && isFinished"
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
    <StudyTemplate
      v-else-if="questions.length > 0"
      :questions="questions"
      @finish="finish"
      @add-to-answer="AddToAnswer"
    />
  </div>
</template>
<script lang="ts">
import { Section, Question } from '../../types';
import axios from 'axios';
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import StudyTemplate from '../../components/StudyTemplate.vue';
export default {
  name: 'StudyNewPage',
  components: {
    StudyTemplate,
  },
  setup() {
    const {
      params: { sectionId },
    } = useRoute();
    const isFinished = ref(false);
    const finish = () => {
      isFinished.value = true;
    };
    const questions = ref<Question[]>([]);
    interface FormState {
      question_ids: number[];
    }
    const form = reactive<FormState>({
      question_ids: [],
    });
    const section = ref<null | Section>(null);
    const store = useStore();
    const router = useRouter();
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
    const AddToAnswer = (answerId: number) => {
      form.question_ids = [...form.question_ids, answerId];
    };
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
          router.push(`/section/${sectionId}/study`);
        } else if (status == 200) {
          questions.value = data.questions;
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
        form.question_ids = [];
        router.push(`/section/${sectionId}/study`);
      }
    };
    const user = computed(() => {
      return store.state.user;
    });
    return {
      questions,
      section,
      onSubmit,
      user,
      isFinished,
      finish,
      AddToAnswer,
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
