<template>
  <div class="flex h-full">
    <div class="flex flex-col w-1/3 px-4 py-3">
      <div class="pt-2 pb-3 text-5xl font-bold text-gray-700">Sections</div>
      <div class="flex pr-1 mt-1 mb-2">
        <input type="text" class="pl-1 formInput" />
        <button class="bg-gray-700">
          <font-awesome-icon class="formButton fa-lg" :icon="faSearch" />
        </button>
      </div>
      <div class="flex flex-col ml-2">
        <div class="py-2 cursor-pointer">
          <router-link
            data-testid="section-submit-link"
            v-if="user"
            to="section_submit"
            ><p>新規セクション作成</p></router-link
          >
        </div>

        <div class="py-2" v-if="user">
          <p>投稿したセクション</p>
        </div>
        <div class="py-2">
          <p>前置詞・名詞</p>
        </div>
        <div class="py-2">
          <p>単位・度合</p>
        </div>
        <div class="py-2">
          <p>時・条件</p>
        </div>
        <div class="py-2">
          <p>仮定法</p>
        </div>
      </div>
    </div>
    <div v-if="sections.length > 0" data-testid="section-page">
      <transition-group
        tag="ul"
        class="flex flex-col p-3"
        appear
        @before-enter="beforeEnter"
        @enter="enter"
      >
        <li
          data-testid="section-card"
          v-for="(section, idx) in sections"
          :key="section.id"
          :data-idx="idx"
        >
          <SectionCard :section="section" />
        </li>
      </transition-group>
    </div>
    <div v-else class="w-full h-full">
      <bg-gray-100 />
    </div>
  </div>
</template>
<script lang="ts">
class ListElement extends HTMLElement {}
import gsap from 'gsap';
import { ref, watch, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { Section } from '../../types';
import bg-gray-100 from '../../components/bg-gray-100.vue';
import SectionCard from '../../components/SectionCard.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
export default {
  name: 'SectionsPage',
  components: {
    bg-gray-100,
    SectionCard,
    FontAwesomeIcon,
  },
  setup() {
    const sections = ref<Section[]>([]);
    const store = useStore();
    const search = ref('');
    const user = computed(() => store.state.user);
    onMounted(async () => {
      const { data } = await axios.get('sections');
      sections.value = data.sections;
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
          rotateY: 0,
          delay: parseInt(el.dataset.idx) * 0.2,
        });
      }
    };
    return {
      sections,
      beforeEnter,
      enter,
      search,
      user,
      faSearch,
    };
  },
};
</script>
<style scoped>
.formInput {
  @apply w-full focus:outline-none;
  border-top-left-radius: 0.15em;
  border-bottom-left-radius: 0.15em;
}
.formButton {
  @apply text-gray-100;
  padding: 3px 3px 3px 3px;
  border-top-right-radius: 0.15em;
  border-bottom-right-radius: 0.15em;
}
</style>
