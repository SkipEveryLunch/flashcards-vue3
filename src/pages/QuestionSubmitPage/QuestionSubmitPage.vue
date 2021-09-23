<template>
  <div
    v-if="user"
    data-testid="question-submit-page"
    class="flex justify-center"
  >
    <div class="w-2/3 p-5 m-5">
      <Input
        id="front"
        name="問題"
        @custom-input="onChangeFront"
        :modelValue="form.front"
        :error="errors.front"
      />
      <Input
        id="back"
        name="解答"
        @custom-input="onChangeBack"
        :modelValue="form.back"
        :error="errors.back"
      />
      <div class="flex justify-center">
        <button
          v-if="!isCalling"
          data-testid="submit-button"
          class="btn btn-yellow"
          @click="onSubmit"
          :disabled="disabled"
        >
          投稿
        </button>
        <button
          v-else
          data-testid="submitting-message"
          class="btn btn-yellow"
          disabled="true"
        >
          投稿中...
        </button>
      </div>
    </div>
  </div>
  <div data-testid="not-found-message"></div>
</template>
<script>
import { reactive, watch, ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import Input from '../../components/Input.vue';
import axios from 'axios';
export default {
  name: 'QuestionSubmitPage',
  components: { Input },
  setup() {
    const router = useRouter();
    const store = useStore();
    const route = useRoute();
    const form = reactive({
      front: '',
      back: '',
      section_id: '',
    });
    const errors = reactive({
      front: ['問題が未入力です'],
      back: ['解答が未入力です'],
    });
    const isCalling = ref(false);
    const onChangeFront = (payload) => {
      form.front = payload;
    };
    const onChangeBack = (payload) => {
      form.back = payload;
    };
    const user = computed(() => {
      return store.state.user;
    });
    onMounted(() => {
      if (!store.state.user) {
        router.push('/login');
      } else {
        form.section_id = route.params.sectionId;
      }
    });
    watch(form, () => {
      if (form.front.length === 0) {
        pushToArr(errors.front, '問題が未入力です');
      } else {
        deleteFromArr(errors.front, '問題が未入力です');
      }
      if (form.front.length > 100) {
        pushToArr(errors.front, '問題は100字以内です');
      } else {
        deleteFromArr(errors.front, '問題は100字以内です');
      }
      if (form.back.length === 0) {
        pushToArr(errors.back, '解答が未入力です');
      } else {
        deleteFromArr(errors.back, '解答が未入力です');
      }
      if (form.back.length > 180) {
        pushToArr(errors.back, '解答は180字以内です');
      } else {
        deleteFromArr(errors.back, '解答は180字以内です');
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
    const onSubmit = async () => {
      isCalling.value = true;
      try {
        const { status } = await axios.post('questions', form);
        if (status === 201) {
          isCalling.value = false;
          form.front = '';
          form.back = '';
          store.dispatch('setModal', {
            message: '新しい問題を作成しました',
          });
        } else {
          store.dispatch('setModal', {
            message: '不明なエラーです',
          });
        }
      } catch (e) {
        store.dispatch('setModal', {
          message: '不明なエラーです',
        });
      }
    };
    const disabled = computed(() => {
      return !(errors.front.length === 0 && errors.back.length === 0);
    });
    return {
      user,
      form,
      onChangeFront,
      onChangeBack,
      errors,
      disabled,
      isCalling,
      onSubmit,
    };
  },
};
</script>
