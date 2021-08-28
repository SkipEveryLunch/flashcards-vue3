<template>
  <div data-testid="register-page" class="flex justify-center">
    <div class="w-2/3 p-5 m-5">
      <Input
        id="name"
        name="名前"
        @custom-input="onChangeName"
        :modelValue="form.name"
        :error="[]"
      />
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
      <Input
        id="password-confirm"
        name="パスワード(確認)"
        @custom-input="onChangePasswordConfirm"
        :modelValue="form.passwordConfirm"
        :error="[]"
      />
      <div class="flex justify-center">
        <button data-testid="register-button" class="btn btn-yellow">
          投稿
        </button>
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
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    });
    const onChangeName = (payload) => {
      form.name = payload;
    };
    const onChangeEmail = (payload) => {
      form.email = payload;
    };
    const onChangePassword = (payload) => {
      form.password = payload;
    };
    const onChangePasswordConfirm = (payload) => {
      form.passwordConfirm = payload;
    };
    return {
      form,
      onChangeName,
      onChangeEmail,
      onChangePassword,
      onChangePasswordConfirm,
    };
  },
};
</script>
