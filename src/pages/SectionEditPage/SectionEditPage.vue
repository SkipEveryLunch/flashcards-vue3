<template>
  <div v-if="user && section">
    <div class="flex justify-center mt-5 mb-2">
      <div class="flex w-2/3 justify-evenly">
        <div>
          <h1 class="text-4xl text-center">{{ section.title }}</h1>
        </div>
        <div>
          <p class="text-lg">問題数：{{ section.questions.length }}</p>
          <p class="text-lg">達成率：{{ section.complete_rate * 100 }}%</p>
        </div>
      </div>
    </div>

    <transition-group
      appear
      @before-enter="beforeEnter"
      @enter="enter"
      tag="ul"
      class="h-full overflow-scroll"
    >
      <li
        class="block p-5 m-5 text-white bg-gray-600 rounded"
        v-for="(question, idx) in section.questions"
        :key="question.id"
        data-testid="question-card"
        :data-idx="idx"
      >
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
          <router-link
            :to="`/section/${sectionId}/question/${question.id}/edit`"
          >
            <button class="mr-2 btn btn-primary">編集する</button>
          </router-link>

          <button
            data-testid="question-delete-button"
            @click="() => onDelete(question.id)"
            class="btn btn-sub-white"
          >
            削除する
          </button>
        </div>
      </li>
    </transition-group>

    <div class="fixed flex p-5 m-2 bg-black rounded bottom-1 right-1">
      <router-link to="/">
        <button class="mr-2 btn btn-sub-white">戻る</button>
      </router-link>
      <router-link :to="`/section/${sectionId}/submit`">
        <button class="btn btn-yellow">問題を作る</button>
      </router-link>
    </div>
  </div>
  <div v-else data-testid="not-found-message">section not found</div>
</template>
<script lang="ts">
import axios from 'axios';
import gsap from 'gsap';
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
    const load = async () => {
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
    };
    onMounted(async () => {
      if (!user.value) {
        router.push('/');
      } else {
        await load();
      }
    });
    const onDelete = (id: number) => {
      store.dispatch('setModal', {
        message: '本当に削除しますか?',
        cb: {
          name: '削除します',
          cb: async () => {
            try {
              const { status } = await axios.delete(`questions/${id}`);
              if (status === 204) {
                await store.dispatch('discardModal');
                store.dispatch('setModal', {
                  message: '削除しました',
                });
                await load();
              } else {
                store.dispatch('setModal', {
                  message: '不明なエラーです',
                });
              }
            } catch (e) {
              if (e.response.status === 404) {
                store.dispatch('setModal', {
                  message: '質問が見つかりません',
                });
              } else {
                store.dispatch('setModal', {
                  message: '不明なエラーです',
                });
              }
            }
          },
        },
      });
    };
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
      onDelete,
      beforeEnter,
      enter,
    };
  },
};
</script>
