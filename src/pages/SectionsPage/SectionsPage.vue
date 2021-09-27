<template>
  <div data-testid="section-page" class="h-full">
    <div class="flex justify-around w-full p-5">
      <div class="flex w-2/5">
        <input v-model="search" class="formInput" type="text" />
        <button class="btn btn-blue">
          <span class="whitespace-nowrap">検索する</span>
        </button>
      </div>
      <div>
        <router-link
          data-testid="section-submit-link"
          v-if="user"
          to="section_submit"
          ><button class="btn btn-yellow">
            新セクションを作る
          </button></router-link
        >
      </div>
    </div>
    <transition-group
      v-if="fSections.length > 0"
      tag="ul"
      appear
      @before-enter="beforeEnter"
      @enter="enter"
    >
      <li
        data-testid="section-card"
        v-for="(section, idx) in fSections"
        :key="section.id"
        :data-idx="idx"
      >
        <div
          class="flex justify-between p-5 m-5 text-white bg-gray-900 rounded-lg"
        >
          <div class="text-2xl">
            {{ section.title }}
          </div>
          <div class="flex">
            <router-link :to="`/section/${section.id}/study`">
              <div class="mr-2 btn btn-yellow">学習する</div>
            </router-link>
            <router-link :to="`/section/${section.id}/edit`">
              <div class="btn btn-black">編集する</div>
            </router-link>
          </div>
        </div>
      </li>
    </transition-group>
    <div v-else>No Sections Yet.</div>
  </div>
</template>
<script lang="ts">
class ListElement extends HTMLElement {}
import gsap from 'gsap';
import { ref, watch, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { Section } from '../../types';
export default {
  name: 'SectionsPage',
  setup() {
    const sections = ref<Section[]>([]);
    const fSections = ref<Section[]>([]);
    const store = useStore();
    const search = ref('');
    const user = computed(() => store.state.user);
    watch(search, () => {
      if (sections.value.length > 0 && search.value.length > 0) {
        fSections.value = sections.value.filter((el) => {
          return ~el.title.indexOf(search.value);
        });
      } else {
        fSections.value = sections.value;
      }
    });
    onMounted(async () => {
      const { data } = await axios.get('sections');
      sections.value = data.sections;
      fSections.value = data.sections;
    });
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
          delay: parseInt(el.dataset.idx) * 0.2,
        });
      }
    };
    return {
      beforeEnter,
      enter,
      fSections,
      search,
      user,
    };
  },
};
</script>
<style scoped>
.formInput {
  @apply w-full px-2 py-1 mx-2 border-2 border-gray-200 rounded focus:outline-none focus:border-gray-400;
}
</style>
