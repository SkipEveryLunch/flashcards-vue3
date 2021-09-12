<template>
  <div data-testid="section-submit-page" class="flex justify-center">
    <div class="w-2/3 p-5 m-5">
      <Input
        id="title"
        name="タイトル"
        @custom-input="onChangeTitle"
        :modelValue="form.title"
        :error="errors.title"
      />
      <div class="flex justify-center">
        <button
          data-testid="submit-button"
          class="btn btn-yellow"
          @click="onSubmit"
          v-if="!isCalling"
          :disabled="disabled"
        >
          投稿
        </button>
        <button data-testid="submiting-message" class="btn btn-yellow" v-else>
          投稿中…
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive, watch, computed } from 'vue';
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
    });
    const errors = reactive({
      title: ['タイトルが未入力です'],
    });
    const isCalling = ref(false);
    const onChangeTitle = (payload) => {
      form.title = payload;
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
      onSubmit,
      disabled,
      errors,
      isCalling,
    };
  },
};
</script>
