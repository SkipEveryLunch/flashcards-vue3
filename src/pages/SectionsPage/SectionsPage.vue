<template>
  <div data-testid="section-page" class="h-full">
    <div class="flex justify-around w-full p-5">
      <div class="flex">
        <input v-model="search" class="formInput" type="text" />
        <button class="btn btn-blue">
          <span class="whitespace-nowrap">検索する</span>
        </button>
      </div>
      <div>
        <button class="btn btn-yellow">新セクションを作る</button>
      </div>
    </div>
    <ul v-if="sections.length > 0">
      <li
        data-testid="section-card"
        v-for="section in sections"
        :key="section.id"
      >
        <div
          class="flex justify-between p-5 m-5 text-white bg-gray-900 rounded-lg"
        >
          <div class="text-2xl">
            {{ section.title }}
          </div>
          <div class="flex">
            <router-link :to="`/section/${section.id}`">
              <div class="mr-2 btn btn-yellow">学習する</div>
            </router-link>
            <div class="btn btn-black">編集する</div>
          </div>
        </div>
      </li>
    </ul>
    <div v-else>No Sections Yet.</div>
  </div>
</template>
<script lang="ts">
interface Section {
  id: string;
  title: string;
}
import { ref, onMounted } from 'vue';
import axios from 'axios';
export default {
  name: 'SectionsPage',
  setup() {
    const sections = ref<Section[]>([]);
    const search = ref('');
    onMounted(async () => {
      const { data } = await axios.get('sections');
      sections.value = data.sections;
    });
    return {
      sections,
      search,
    };
  },
};
</script>
<style scoped>
.formInput {
  @apply w-full px-2 py-1 mx-2 border-2 border-gray-200 rounded focus:outline-none focus:border-gray-400;
}
</style>
