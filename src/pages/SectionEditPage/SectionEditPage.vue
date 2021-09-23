<template>
  <div v-if="user && section">
    <h1>{{ section.title }}</h1>
    <div
      class="p-5 m-5 text-white bg-gray-600 rounded"
      v-for="question in section.questions"
      :key="question.id"
      data-testid="question-card"
    >
      <p>Front: {{ question.front.slice(0, 100) + '...' }}</p>
      <p>Back: {{ question.back.slice(0, 100) + '...' }}</p>
      <div class="flex justify-center mt-3">
        <div class="mr-2 btn btn-yellow">編集する</div>
        <div class="btn btn-white">削除する</div>
      </div>
    </div>
    <div class="fixed flex p-5 m-2 bg-black rounded bottom-1 right-1">
      <router-link to="/">
        <button class="mr-2 btn btn-yellow">戻る</button>
      </router-link>
      <button class="bg-white btn btn-blue">問題を作る</button>
    </div>
  </div>
  <div data-testid="not-found-message">section not found</div>
</template>
<script lang="ts">
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Section } from '../../types';
export default {
  name: 'SectionEditPage',
  setup() {
    const section = ref<Section | null>(null);
    const {
      params: { sectionId },
    } = useRoute();
    const store = useStore();
    const router = useRouter();
    const user = computed(() => {
      return store.state.user;
    });
    onMounted(async () => {
      if (!user.value) {
        router.push('/');
      } else {
        try {
          const { data, status } = await axios.get(`sections/${sectionId}`);
          if (status === 200) {
            section.value = data.section;
          } else if (status === 404) {
            store.dispatch('setModal', {
              message: 'セクションが見つかりません',
            });
          } else {
            store.dispatch('setModal', {
              message: '不明なエラーです',
            });
          }
        } catch (e) {
          store.dispatch('setModal', {
            message: '不明なエラーです',
          });
        }
      }
    });
    return {
      section,
      user,
    };
  },
};
</script>
