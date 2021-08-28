<template>
  <div data-testid="register-page" class="flex justify-center">
    <div class="w-2/3 p-5 m-5">
      <div class="formWrapper">
        <div>
          <span class="whitespace-nowrap">名前：</span>
        </div>
        <input
          data-testid="name-input"
          v-model="form.name"
          type="text"
          class="formInput"
        />
      </div>
      <div class="formWrapper">
        <div>
          <span class="whitespace-nowrap">メールアドレス：</span>
        </div>
        <input
          data-testid="email-input"
          v-model="form.email"
          type="text"
          class="formInput"
        />
      </div>
      <div class="formWrapper">
        <div>
          <span class="whitespace-nowrap">パスワード：</span>
        </div>
        <input
          data-testid="password-input"
          v-model="form.password"
          type="text"
          class="formInput"
        />
      </div>
      <div class="formWrapper">
        <div>
          <span class="whitespace-nowrap">パスワード(再確認)：</span>
        </div>
        <input
          data-testid="password-confirm-input"
          v-model="form.passwordCConfirm"
          type="text"
          class="formInput"
        />
      </div>
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
export default {
  name: 'LoginPage',
  setup() {
    const form = reactive({
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    });
    return {
      form,
    };
  },
};
</script>
