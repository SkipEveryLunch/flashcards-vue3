<template>
  <div data-testid="login-page" class="flex justify-center">
    <div class="w-2/3 p-5 m-5">
      <Input
        id="email"
        name="メールアドレス"
        @custom-input="onChangeEmail"
        :modelValue="form.email"
        :error="[]"
      />
      <Input
        id="password"
        name="パスワード"
        @custom-input="onChangePassword"
        :modelValue="form.password"
        :error="[]"
      />
      <div class="flex justify-center">
        <button
          data-testid="login-button"
          class="btn btn-yellow"
          @click="onLogin"
        >
          投稿
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue';
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
    const onChangeEmail = (payload) => {
      form.email = payload;
    };
    const onChangePassword = (payload) => {
      form.password = payload;
    };
    const onLogin = async () => {
      const {
        data: { user },
        status,
      } = await axios.post('login', form);
      if (status === 200 && user) {
        store.dispatch('setUser', user);
        router.push('/');
      }
    };
    return {
      form,
      onChangeEmail,
      onChangePassword,
      onLogin,
    };
  },
};
</script>
