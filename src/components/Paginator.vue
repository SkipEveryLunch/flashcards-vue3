<template>
  <nav>
    <ul class="flex items-center justify-center w-full px-3 text-base">
      <li class="mr-2">
        <a href="javascript:void(0)" @click="prev"
          ><font-awesome-icon class="fa-md" :icon="faChevronLeft"
        /></a>
      </li>
      <div
        class="px-2 mx-1 border-2 rounded-sm cursor-pointer hover:bg-gray-300"
        v-for="p in range(1, lastPage)"
        :class="boxColor(p)"
        @click="() => goTo(p)"
        :key="p"
      >
        <span class="text-lg"> {{ p }} </span>
      </div>

      <li class="ml-2">
        <a href="javascript:void(0)" @click="next"
          ><font-awesome-icon class="fa-md" :icon="faChevronRight"
        /></a>
      </li>
    </ul>
  </nav>
</template>
<script lang="ts">
const range = (start: number, end: number) => {
  const list = [];
  for (let i = start; i <= end; i++) {
    list.push(i);
  }
  return list;
};
import { defineComponent, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
interface paginatorProps {
  lastPage: number;
  page: number;
}
export default defineComponent({
  name: 'Paginator',
  emits: ['page-change'],
  components: {
    FontAwesomeIcon,
  },
  props: ['lastPage', 'page'],
  setup(props: paginatorProps, context) {
    const next = () => {
      if (props.page < props.lastPage) {
        context.emit('page-change', props.page + 1);
      }
    };
    const goTo = (p: number) => {
      context.emit('page-change', p);
    };
    const prev = () => {
      if (props.page > 1) {
        context.emit('page-change', props.page - 1);
      }
    };
    const boxColor = (p: number) => {
      if (p == props.page) {
        return 'text-gray-100 border-gray-100 hover:bg-gray-500 cursor-default';
      } else {
        return 'text-gray-400 border-gray-400';
      }
    };
    return {
      next,
      prev,
      faChevronLeft,
      faChevronRight,
      range,
      boxColor,
      goTo,
    };
  },
});
</script>
