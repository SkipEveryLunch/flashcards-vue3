<template>
  <div class="h-full">
    <h1 class="text-2xl text-center">届いているメッセージは以下の通りです</h1>
    <div class="flex flex-col">
      <div v-for="message in messages" :key="message.id">
        <div class="p-5 mx-5 my-3 text-white bg-gray-700 rounded">
          <p>{{ message.title }}<span v-if="!message.is_read"> new!</span></p>
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
</template>
<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';
import { Message } from '../../types';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
export default defineComponent({
  name: 'MessageShowPage',
  setup() {
    const store = useStore();
    const router = useRouter();
    const messages = ref<Message[]>([]);
    onMounted(async () => {
      try {
        const { data } = await axios.get('/messages');
        messages.value = data.messages;
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
      if (!message.is_read) {
        const { status } = await axios.put(`/messages/${message.id}`);
        if (status !== 200) {
          store.dispatch('setModal', {
            type: 'error',
            message: '不明なエラーが発生しました',
          });
        }
      }
    };
    return {
      messages,
      onConfirm,
    };
  },
});
</script>
