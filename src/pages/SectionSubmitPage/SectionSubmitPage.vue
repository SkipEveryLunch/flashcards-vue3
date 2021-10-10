<template>
  <div class="flex justify-center">
    <div data-testid="section-submit-page" v-if="user" class="w-2/3 p-5 m-5">
      <Input
        id="title"
        name="タイトル"
        @custom-input="onChangeTitle"
        :modelValue="form.title"
        :error="errors.title"
      />
      <Input
        id="description"
        name="説明文"
        @custom-input="onChangeDescription"
        :modelValue="form.description"
        :error="errors.description"
      />
      <div class="flex justify-center">
        <div class="flex">
          <button
            data-testid="submit-button"
            class="mr-2 btn btn-primary"
            @click="onSubmit"
            v-if="!isCalling"
            :disabled="disabled"
          >
            投稿
          </button>
          <button
            data-testid="submiting-message"
            class="mr-2 btn btn-primary"
            v-else
          >
            投稿中…
          </button>
          <router-link to="/">
            <button class="btn btn-blue">戻る</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive, watch, computed, onMounted } from 'vue';
import Input from '../../components/Input.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default {
  name: 'LoginPage',
  components: { Input },
  setup() {
    const router = useRouter();
    const store = useStore();
    const form = reactive({
      title: '',
      description: '',
    });
    const errors = reactive({
      title: ['タイトルが未入力です'],
      description: ['内容説明が未入力です'],
    });
    const isCalling = ref(false);
    const onChangeTitle = (payload) => {
      form.title = payload;
    };
    const onChangeDescription = (payload) => {
      form.description = payload;
    };
    watch(form, () => {
      if (form.title.length === 0) {
        pushToArr(errors.title, 'タイトルが未入力です');
      } else {
        deleteFromArr(errors.title, 'タイトルが未入力です');
      }
      if (form.title.length > 25) {
        pushToArr(errors.title, 'タイトルは25字以内です');
      } else {
        deleteFromArr(errors.title, 'タイトルは25字以内です');
      }
      if (form.description.length === 0) {
        pushToArr(errors.description, '説明文が未入力です');
      } else {
        deleteFromArr(errors.description, '説明文が未入力です');
      }
      if (form.description.length > 100) {
        pushToArr(errors.description, '説明文は100字以内です');
      } else {
        deleteFromArr(errors.description, '説明文は100字以内です');
      }
    });
    const pushToArr = (arr, str) => {
      if (!arr.includes(str)) {
        arr.push(str);
      }
    };
    const deleteFromArr = (arr, str) => {
      if (arr.includes(str)) {
        arr = arr.splice(arr.indexOf(str), 1);
      }
    };
    const disabled = computed(() => {
      return !(errors.title.length === 0);
    });
    const user = computed(() => {
      return store.state.user;
    });
    onMounted(() => {
      if (!user.value) {
        store.dispatch('setModal', {
          message: '実行するにはログインしてください',
        });
        router.push('/login');
      }
    });
    const onSubmit = async () => {
      isCalling.value = true;
      try {
        const {
          data: { section },
          status,
        } = await axios.post('sections', form);
        isCalling.value = false;
        if (status === 201 && section) {
          store.dispatch('setUser', section);
          router.push('/');
          store.dispatch('setModal', {
            message: 'セクションを作成しました',
          });
        }
      } catch (e) {
        if (e.response.status === 401) {
          store.dispatch('setModal', {
            message: '投稿はログインしないとできません',
          });
        } else if (e.response.status === 409) {
          store.dispatch('setModal', {
            message: '既に登録されているタイトルです',
          });
        } else {
          store.dispatch('setModal', {
            message: '不明なエラーです',
          });
        }
        isCalling.value = false;
      }
    };
    return {
      form,
      onChangeTitle,
      onChangeDescription,
      onSubmit,
      disabled,
      errors,
      isCalling,
      user,
    };
  },
};
</script>
