<template>
  <div data-testid="login-page" class="flex justify-center">
    <div class="w-2/3 p-5 m-5">
      <Input
        id="email"
        name="メールアドレス"
        @custom-input="onChangeEmail"
        :modelValue="form.email"
        :error="errors.email"
      />
      <Input
        id="password"
        name="パスワード"
        @custom-input="onChangePassword"
        :modelValue="form.password"
        :error="errors.password"
      />
      <div class="flex justify-center">
        <button
          data-testid="login-button"
          class="btn btn-primary"
          @click="onLogin"
          v-if="!isCalling"
          :disabled="disabled"
        >
          投稿
        </button>
        <button data-testid="logingin-message" class="btn btn-primary" v-else>
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
      email: '',
      password: '',
    });
    const errors = reactive({
      email: ['メールアドレスが未入力です'],
      password: ['パスワードが未入力です'],
    });
    const isCalling = ref(false);
    const onChangeEmail = (payload) => {
      form.email = payload;
    };
    const onChangePassword = (payload) => {
      form.password = payload;
    };
    watch(form, () => {
      const mailReg =
        /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}.[A-Za-z0-9]{1,}$/;
      if (form.email.length === 0) {
        pushToArr(errors.email, 'メールアドレスが未入力です');
      } else {
        deleteFromArr(errors.email, 'メールアドレスが未入力です');
      }
      if (form.email.length > 0 && !mailReg.test(form.email)) {
        pushToArr(errors.email, '正しいメールアドレスを入力して下さい');
      } else {
        deleteFromArr(errors.email, '正しいメールアドレスを入力して下さい');
      }
      if (form.password.length === 0) {
        pushToArr(errors.password, 'パスワードが未入力です');
      } else {
        deleteFromArr(errors.password, 'パスワードが未入力です');
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
      return !(errors.email.length === 0 && errors.password.length === 0);
    });
    const onLogin = async () => {
      isCalling.value = true;
      try {
        const {
          data: { user },
          status,
        } = await axios.post('login', form);
        isCalling.value = false;
        if (status === 200 && user) {
          store.dispatch('setUser', user);
          router.push('/');
          store.dispatch('setModal', {
            message: 'ログインしました',
          });
        }
      } catch (e) {
        if (e.response.status === 401) {
          store.dispatch('setModal', {
            message: 'メールアドレスかパスワードが違います',
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
      onChangeEmail,
      onChangePassword,
      onLogin,
      disabled,
      errors,
      isCalling,
    };
  },
};
</script>
