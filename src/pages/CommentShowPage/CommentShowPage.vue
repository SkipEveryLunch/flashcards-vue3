<template>
  <div
    v-if="user && isPostedByUser"
    data-testId="comment-show-page"
    class="h-full"
  >
    <h1 class="text-2xl text-center">
      この質問には以下のコメントが付いています
    </h1>
    <div class="flex flex-col">
      <div v-for="(comment, idx) in comments" :key="idx">
        <div
          class="p-5 mx-5 my-3 text-white bg-gray-700 rounded"
          data-testId="comment-card"
        >
          <p>{{ comment.comment_type }}</p>
          <p>詳細：{{ comment.comment_detail }}</p>
        </div>
      </div>
    </div>
    <div class="fixed flex p-5 m-2 bg-black rounded bottom-1 right-1">
      <router-link :to="`/section/${sectionId}/edit`">
        <button class="mr-2 btn btn-sub-white">戻る</button>
      </router-link>
    </div>
  </div>
  <div v-else data-testId="cannot-display"></div>
</template>
<script lang="ts">
import { ref, computed, onMounted, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { Comment } from '../../types';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
export default defineComponent({
  name: 'CommentShowPage',
  setup() {
    const store = useStore();
    const router = useRouter();
    const isPostedByUser = ref(false);
    const user = computed(() => {
      return store.state.user;
    });
    const {
      params: { questionId, sectionId },
    } = useRoute();
    const comments = ref<Comment[]>([]);
    onMounted(async () => {
      if (!user.value) {
        router.push(`/section/${sectionId}/edit`);
        return;
      }
      try {
        const { data } = await axios.get(
          `/questions_several_comments/${questionId}`
        );
        comments.value = data.comments;
        if (user.value.id === data.commented_to) {
          isPostedByUser.value = true;
        } else {
          router.push(`/section/${sectionId}/edit`);
        }
      } catch (e) {
        console.log(e);
      }
    });

    return {
      comments,
      sectionId,
      user,
      isPostedByUser,
    };
  },
});
</script>
