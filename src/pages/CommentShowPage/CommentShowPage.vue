<template>
  <div class="flex h-full">
    <div class="flex flex-col w-1/3 px-4 py-3">
      <div class="pt-2 pb-3 text-4xl font-bold text-gray-700">
        コメント一覧
        <p class="text-lg">{{ comments.length }}件の改善要望が届いています</p>
      </div>
      <div class="flex pr-1 mt-1 mb-2">
        <SearchBox
          :modelValue="search"
          @on-input="onChangeSearch"
          @on-submit="filterComments"
        />
      </div>
      <div class="flex flex-col ml-2">
        <div class="py-2 cursor-pointer">
          <p>未読のメッセージ</p>
        </div>
        <div class="py-2 cursor-pointer">
          <router-link
            data-testid="section-submit-link"
            :to="`/section/${sectionId}/edit`"
            ><p>戻る</p></router-link
          >
        </div>
      </div>
    </div>
    <div v-if="comments.length > 0" class="w-full">
      <transition-group
        tag="ul"
        class="flex flex-col p-3"
        appear
        @before-enter="beforeEnter"
        @enter="enter"
      >
        <li
          data-testid="question-card"
          v-for="(comment, idx) in comments"
          :key="idx"
          :data-idx="idx"
        >
          <CommentCard :comment="comment" />
        </li>
      </transition-group>
    </div>
    <div v-else class="w-full h-full">
      <Spinner />
    </div>
  </div>
</template>
<script lang="ts">
import SearchBox from '../../components/SearchBox.vue';
import { ref, computed, onMounted, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { Comment } from '../../types';
import { useRoute, useRouter } from 'vue-router';
import Spinner from '../../components/Spinner.vue';
import gsap from 'gsap';
import axios from 'axios';
import CommentCard from '../../components/CommentCard.vue';
export default defineComponent({
  name: 'CommentShowPage',
  components: {
    Spinner,
    SearchBox,
    CommentCard,
  },
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
    const search = ref('');
    const comments = ref<Comment[]>([]);
    const fComments = ref<Comment[]>([]);
    const showAllComments = () => {
      fComments.value = comments.value;
    };
    const filterComments = () => {
      fComments.value = comments.value.filter((el) => {
        return el.comment_type.includes(search.value);
      });
    };
    const onChangeSearch = (payload: string) => {
      search.value = payload;
    };
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
        console.log(comments.value);
        if (user.value.id === data.commented_to) {
          isPostedByUser.value = true;
        } else {
          router.push(`/section/${sectionId}/edit`);
        }
      } catch (e) {
        console.log(e);
      }
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
      comments,
      sectionId,
      user,
      isPostedByUser,
      beforeEnter,
      enter,
      showAllComments,
      filterComments,
      search,
      onChangeSearch,
    };
  },
});
</script>
