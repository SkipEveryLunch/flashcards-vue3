<template>
  <div v-if="!isLoading" class="flex h-full">
    <div class="flex flex-col w-1/3 px-4 py-3">
      <div
        class="pt-2 pb-3 text-4xl font-bold text-gray-700 cursor-pointer"
        @click="showAllSections"
      >
        セクション一覧
      </div>
      <div class="flex pr-1 mt-1 mb-2">
        <input
          type="text text-gray-700"
          v-model="search"
          class="pl-1 formInput"
        />
        <button class="bg-gray-700" @click="filterSections">
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

        <div @click="findMySections" class="py-2 cursor-pointer" v-if="user">
          <p>投稿したセクション</p>
        </div>
        <div v-for="(aSeries, idx) in series" :key="idx" class="py-2">
          <p>{{ aSeries }}</p>
        </div>
      </div>
    </div>
    <div v-if="fSections.length > 0" data-testid="section-page">
      <transition-group
        tag="ul"
        class="flex flex-col p-3"
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
          <SectionCard :section="section" />
        </li>
      </transition-group>
    </div>
    <div v-else class="flex items-center justify-center w-full">
      <div class="text-xl text-gray-200">セクションがありません</div>
    </div>
  </div>
  <div v-else class="w-full h-full">
    <Spinner />
  </div>
</template>
<script lang="ts">
class ListElement extends HTMLElement {}
import gsap from 'gsap';
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { Section } from '../../types';
import Spinner from '../../components/Spinner.vue';
import SectionCard from '../../components/SectionCard.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
export default {
  name: 'SectionsPage',
  components: {
    Spinner,
    SectionCard,
    FontAwesomeIcon,
  },
  setup() {
    const sections = ref<Section[]>([]);
    const fSections = ref<Section[]>([]);
    const series = ref<string[]>([]);
    const isLoading = ref(false);
    const store = useStore();
    const search = ref('');
    const user = computed(() => store.state.user);
    onMounted(async () => {
      isLoading.value = true;
      const sectionData = await axios.get('sections');
      const seriesData = await axios.get('series');
      if (sectionData.status === 200 && seriesData.status === 200) {
        isLoading.value = false;
        sections.value = sectionData.data.sections;
        fSections.value = sectionData.data.sections;
        series.value = seriesData.data.series;
      }
    });
    const showAllSections = () => {
      fSections.value = sections.value;
    };
    const findMySections = () => {
      fSections.value = sections.value.filter((el) => {
        return el.posted_by === user.value.id;
      });
    };
    const filterSections = () => {
      console.log(search.value);
      fSections.value = sections.value.filter((el) => {
        return el.title.includes(search.value);
      });
    };
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
      fSections,
      series,
      beforeEnter,
      enter,
      search,
      user,
      faSearch,
      findMySections,
      showAllSections,
      isLoading,
      filterSections,
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
