<template>
  <div class="flex h-full">
    <div class="flex flex-col w-1/3 px-4 py-3">
      <div class="pt-2 pb-3 text-4xl font-bold text-gray-700">
        メッセージ一覧
        <p class="text-lg">
          <span class="mr-3">全{{ messages.length }}件</span>
          <span>うち{{ unconfirmed }}件未読</span>
        </p>
      </div>
      <div class="flex pr-1 mt-1 mb-2">
        <input type="text" class="pl-1 formInput" />
        <button class="bg-gray-700">
          <font-awesome-icon class="formButton fa-lg" :icon="faSearch" />
        </button>
      </div>
      <div class="flex flex-col ml-2">
        <div class="py-2 cursor-pointer">
          <p>未読のメッセージ</p>
        </div>
        <div class="py-2 cursor-pointer">
          <router-link data-testid="section-submit-link" to="/"
            ><p>戻る</p></router-link
          >
        </div>
      </div>
    </div>
    <div v-if="messages.length > 0" class="w-full">
      <transition-group
        tag="ul"
        class="flex flex-col p-3"
        appear
        @before-enter="beforeEnter"
        @enter="enter"
      >
        <li
          data-testid="question-card"
          v-for="(message, idx) in messages"
          :key="message.id"
          :data-idx="idx"
        >
          <MessageCard @confirm="() => onConfirm(message)" :message="message" />
        </li>
      </transition-group>
    </div>
    <div v-else class="w-full h-full">
      <Spinner />
    </div>
  </div>
</template>
<script lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ref, computed, onMounted, defineComponent } from 'vue';
import { Message } from '../../types';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Spinner from '../../components/Spinner.vue';
import axios from 'axios';
import gsap from 'gsap';
import MessageCard from '../../components/MessageCard.vue';
export default defineComponent({
  name: 'MessageShowPage',
  components: { Spinner, FontAwesomeIcon, MessageCard },
  setup() {
    const store = useStore();
    const router = useRouter();
    const unconfirmed = ref(0);
    const messages = ref<Message[]>([]);
    const user = computed(() => {
      return store.state.user;
    });
    onMounted(async () => {
      if (!user.value) {
        router.push('/');
      }
      try {
        const { data } = await axios.get('/messages');
        messages.value = data.messages;
        let result = 0;
        messages.value.forEach((el) => {
          if (!el.is_confirmed) {
            result += 1;
          }
        });
        unconfirmed.value = result;
      } catch (e) {
        console.log(e);
      }
    });
    const onConfirm = async (message: Message) => {
      let linkTo = '';
      const { link_type, link_data } = message;
      if (link_type === 'comment') {
        const { section_id, question_id } = JSON.parse(link_data);
        linkTo = `/section/${section_id}/question/${question_id}/comment`;
      }
      router.push(linkTo);
      if (!message.is_confirmed) {
        const { status } = await axios.put(`/messages/${message.id}`);
        if (status !== 200) {
          store.dispatch('setModal', {
            type: 'error',
            message: '不明なエラーが発生しました',
          });
        } else {
          store.dispatch('decreaseUnconfirmed');
        }
      }
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
      beforeEnter,
      enter,
      messages,
      onConfirm,
      unconfirmed,
      user,
      faSearch,
    };
  },
});
</script>
