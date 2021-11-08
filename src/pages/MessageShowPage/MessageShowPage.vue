<template>
  <div class="h-full" v-if="user">
    <h1 class="my-3 text-2xl text-center">
      <span data-testId="unconfirmed">{{ unconfirmed }}</span>
      件の未読のメッセージがあります。
    </h1>
    <div class="flex flex-col">
      <div v-for="message in messages" :key="message.id">
        <div
          class="p-5 mx-5 my-3 text-white bg-gray-700 rounded"
          data-testId="message-card"
        >
          <p class="mb-2">
            <span
              v-if="!message.is_confirmed"
              class="px-1 mr-1 text-yellow-700 bg-yellow-300 rounded-sm"
            >
              new!</span
            >
            <span class="text-xl">
              {{ message.title }}
            </span>
          </p>
          <p>詳細：{{ message.body }}</p>
          <div class="flex justify-center mt-5">
            <button
              @click="() => onConfirm(message)"
              class="mr-2 btn btn-primary"
            >
              確認する
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed flex p-5 m-2 bg-black rounded bottom-1 right-1">
      <router-link to="/">
        <button class="mr-2 btn btn-sub-white">戻る</button>
      </router-link>
    </div>
  </div>
  <div
    v-else
    class="flex items-center justify-center h-screen"
    data-testId="cannot-display"
  >
    <Spinner />
  </div>
</template>
<script lang="ts">
import { ref, computed, onMounted, defineComponent } from 'vue';
import { Message } from '../../types';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Spinner from '../../components/Spinner.vue';
import axios from 'axios';
export default defineComponent({
  name: 'MessageShowPage',
  components: { Spinner },
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
    return {
      messages,
      onConfirm,
      unconfirmed,
      user,
    };
  },
});
</script>
