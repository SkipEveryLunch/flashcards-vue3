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
        <button data-testid="login-button" class="btn btn-yellow">投稿</button>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue';
import Input from '../../components/Input.vue';
export default {
  name: 'LoginPage',
  components: { Input },
  setup() {
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
    return {
      form,
      onChangeEmail,
      onChangePassword,
    };
  },
};
</script>
