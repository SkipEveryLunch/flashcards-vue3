<template>
  <div v-if="user && section">
    <div class="flex justify-center mt-5 mb-2">
      <div class="flex w-2/3 justify-evenly">
        <div>
          <h1 class="text-4xl text-center">{{ section.title }}</h1>
        </div>
        <div>
          <p class="text-lg">問題数：{{ section.questions.length }}</p>
          <p class="text-lg">
            達成率：{{ Math.round(section.complete_rate * 100) }}%
          </p>
        </div>
      </div>
    </div>

    <transition-group
      v-if="section.count_questions > 0"
      appear
      @before-enter="beforeEnter"
      @enter="enter"
      tag="ul"
      class="h-full overflow-scroll"
    >
      <QuestionCard
        v-for="(question, idx) in section.questions"
        :question="question"
        :key="idx"
        :data-idx="idx"
        @load="load"
      />
    </transition-group>
    <div v-else class="mt-10 text-xl text-center">
      <p>このセクションには問題がありません。</p>
    </div>

    <div class="fixed flex p-5 m-2 bg-black rounded bottom-1 right-1">
      <router-link to="/">
        <button class="mr-2 btn btn-sub-white">戻る</button>
      </router-link>
      <router-link :to="`/section/${sectionId}/submit`">
        <button class="btn btn-yellow">問題を作る</button>
      </router-link>
    </div>
  </div>
  <div v-else class="h-full" data-testid="not-found-message">
    <Spinner />
  </div>
</template>
<script lang="ts">
import axios from 'axios';
import gsap from 'gsap';
import QuestionCard from '../../components/QuestionCard.vue';
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Section } from '../../types';
import Spinner from '../../components/Spinner.vue';
export default {
  name: 'SectionEditPage',
  components: {
    Spinner,
    QuestionCard,
  },
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
    const load = async () => {
      try {
        const { data, status } = await axios.get(`sections/${sectionId}`);
        if (status === 200) {
          section.value = data.section;
        } else if (status === 404) {
          store.dispatch('setModal', {
            type: 'error',
            message: 'セクションが見つかりません',
          });
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
    store.watch(
      (state) => {
        return state.sectionReloader;
      },
      async () => await load()
    );
    const beforeEnter = (el: HTMLElement) => {
      el.style.transform = 'translateX(60px)';
      el.style.opacity = '0';
    };
    const enter = (el: HTMLElement) => {
      if (typeof el.dataset.idx === 'string') {
        gsap.to(el, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          delay:
            parseInt(el.dataset.idx) < 4 ? parseInt(el.dataset.idx) * 0.2 : 0,
        });
      }
    };
    return {
      section,
      user,
      sectionId,
      beforeEnter,
      enter,
      load,
    };
  },
};
</script>
