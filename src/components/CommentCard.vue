<template>
  <div class="card" data-testId="comment-card">
    <div class="flex flex-col w-full p-3">
      <div>
        <p class="mb-2 text-3xl">
          {{ comment.comment_type }}
        </p>
      </div>
      <div>
        <p>{{ comment.comment_detail }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Comment } from '../types';
import { defineComponent, onMounted } from 'vue';
interface CommentCardProps {
  comment: Comment;
}
export default defineComponent({
  name: 'CommentCard',
  props: ['comment'],
  setup(props) {
    onMounted(() => console.log(props.comment));
  },
});
</script>
<style>
.card {
  @apply flex p-2 mb-2 text-gray-100 bg-gray-700 rounded;
  height: 160px;
}
</style>
