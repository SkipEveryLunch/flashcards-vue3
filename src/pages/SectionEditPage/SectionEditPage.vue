<template>
  <div v-if="section" class="flex h-full">
    <div class="flex flex-col w-1/3 px-4 py-3">
      <div
        class="pt-2 pb-3 text-4xl font-bold text-gray-700 cursor-pointer"
        @click="showAllQuestions"
      >
        {{ section.title }}
        <p class="text-lg">
          <span class="mr-3">問題数：{{ section.questions.length }}</span>
          <span>達成率：{{ Math.round(section.complete_rate * 100) }}%</span>
        </p>
      </div>
      <div class="flex pr-1 mt-1 mb-2">
        <SearchBox
          @on-input="onChangeSearch"
          @on-submit="filterQuestions"
          :modelValue="search"
        />
      </div>
      <div class="flex flex-col ml-2" @click="findMyQuestions">
        <div class="py-2 cursor-pointer" v-if="user">
          <p>投稿した問題</p>
        </div>
        <div class="py-2 cursor-pointer">
          <router-link v-if="user" :to="`/section/${sectionId}/submit`"
            ><p>新しい問題を投稿</p></router-link
          >
        </div>
        <div class="py-2 cursor-pointer" v-if="user">
          <router-link data-testid="section-submit-link" to="/"
            ><p>戻る</p></router-link
          >
        </div>
      </div>
    </div>
    <div
      v-if="fQuestions.length > 0"
      class="w-full"
      data-testid="question-page"
    >
      <transition-group
        tag="ul"
        class="flex flex-col p-3"
        appear
        @before-enter="beforeEnter"
        @enter="enter"
      >
        <li
          data-testid="question-card"
          v-for="(question, idx) in fQuestions"
          :key="question.id"
          :data-idx="idx"
        >
          <QuestionCard :question="question" />
        </li>
      </transition-group>
    </div>
    <div v-else class="flex items-center justify-center w-full h-full">
      <div class="text-lg">
        <p>まだ問題がありません</p>
      </div>
    </div>
  </div>
  <div v-else class="w-full h-full">
    <Spinner />
  </div>
</template>
<script lang="ts">
import axios from 'axios';
import gsap from 'gsap';
import QuestionCard from '../../components/QuestionCard.vue';
import { ref, onMounted, watch, computed, defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Section, Question } from '../../types';
import Spinner from '../../components/Spinner.vue';
import SearchBox from '../../components/SearchBox.vue';
export default defineComponent({
  name: 'SectionEditPage',
  components: {
    Spinner,
    QuestionCard,
    SearchBox,
  },
  setup() {
    const section = ref<Section | null>(null);
    const fQuestions = ref<Question[]>([]);
    const {
      params: { sectionId },
    } = useRoute();
    const store = useStore();
    const router = useRouter();
    const user = computed(() => {
      return store.state.user;
    });
    const search = ref('');
    const filterQuestions = () => {
      if (section.value) {
        fQuestions.value = section.value.questions.filter((el) => {
          return (
            el.front.includes(search.value) || el.back.includes(search.value)
          );
        });
      }
    };
    const findMyQuestions = () => {
      if (section.value) {
        fQuestions.value = section.value.questions.filter((el) => {
          return el.posted_by === user.value.id;
        });
      }
    };
    const onChangeSearch = (payload: string) => {
      search.value = payload;
    };
    const showAllQuestions = () => {
      if (section.value) {
        fQuestions.value = section.value.questions;
      }
    };
    const load = async () => {
      try {
        const { data, status } = await axios.get(`sections/${sectionId}`);
        if (status === 200) {
          section.value = data.section;
          fQuestions.value = data.section.questions;
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
      el.style.transform = 'translateY(60px)';
      el.style.opacity = '0';
    };
    const enter = (el: HTMLElement) => {
      if (typeof el.dataset.idx === 'string') {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          rotateY: 0,
          delay: parseInt(el.dataset.idx) * 0.2,
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
      search,
      filterQuestions,
      onChangeSearch,
      showAllQuestions,
      findMyQuestions,
      fQuestions,
    };
  },
});
</script>
