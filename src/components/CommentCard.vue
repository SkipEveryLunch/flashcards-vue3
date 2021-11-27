<template>
  <div class="flex items-center w-full mb-2">
    <div class="mr-2">
      <div class="p-2 text-center bg-gray-700 rounded-full w-14 h-14">
        <font-awesome-icon class="text-gray-100 fa-2x" :icon="faUser" />
      </div>
    </div>
    <div class="triangle"></div>
    <div class="card" data-testId="comment-card">
      <div class="flex flex-col w-full px-5 py-3">
        <div class="mb-1">
          <p>
            {{ comment.comment_type.name }}
          </p>
        </div>
        <div class="text-sm">
          <p>{{ comment.comment_detail }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
export default defineComponent({
  name: 'CommentCard',
  props: ['comment'],
  components: {
    FontAwesomeIcon,
  },
  setup() {
    return {
      faUser,
    };
  },
});
</script>
<style scoped>
.card {
  @apply w-full text-gray-100 bg-gray-700 rounded;
}
.triangle {
  height: 15px;
  border-top: 15px solid transparent;
  border-right: 20px solid rgba(64, 64, 64);
  border-bottom: 15px solid transparent;
}
</style>
