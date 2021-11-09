<template>
  <div data-testid="section-page" class="h-full">
    <div v-if="sections.length > 0">
      <div class="flex justify-around w-full p-5"></div>
      <transition-group
        tag="ul"
        class="flex flex-wrap justify-center"
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
      <div class="fixed flex p-5 m-2 bg-black rounded bottom-1 right-1">
        <router-link
          data-testid="section-submit-link"
          v-if="user"
          to="section_submit"
          ><button class="btn btn-yellow">新規作成</button></router-link
        >
      </div>
    </div>
    <div v-else class="h-full">
      <Spinner color="blue" />
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
import Spinner from '../../components/Spinner.vue';
import SectionCard from '../../components/SectionCard.vue';
export default {
  name: 'SectionsPage',
  components: {
    Spinner,
    SectionCard,
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
    };
  },
};
</script>
<style scoped>
.formInput {
  @apply w-full px-2 py-1 mx-2 border-2 border-gray-200 rounded focus:outline-none focus:border-gray-400;
}
</style>
