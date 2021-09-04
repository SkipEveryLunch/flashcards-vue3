<template>
  <div>
    <Input
      name="名字"
      id="first-name"
      :error="[]"
      :modelValue="userForm.first_name"
      @custom-input="onChangeFirstName"
    />
    <Input
      name="名前"
      id="last-name"
      :error="[]"
      :modelValue="userForm.last_name"
      @custom-input="onChangeLastName"
    />
    <Input
      name="アドレス"
      id="email"
      :error="[]"
      :modelValue="userForm.email"
      @custom-input="onChangeEmail"
    />
    <button
      v-if="!isChangingUser"
      @click="onUserUpdate"
      class="btn btn-blue"
      data-testid="update-user-button"
    >
      ユーザー情報を変更
    </button>
    <button v-else class="btn btn-blue" data-testid="user-update-message">
      変更中…
    </button>
    <Input
      name="パスワード"
      id="password"
      :error="[]"
      :modelValue="passwordForm.password"
      @custom-input="onChangePassword"
    />
    <Input
      name="パスワード(確認)"
      id="password-confirm"
      :error="[]"
      :modelValue="passwordForm.passwordConfirm"
      @custom-input="onChangePasswordConfirm"
    />
    <button
      v-if="!isChangingPassword"
      @click="onPasswordUpdate"
      class="btn btn-blue"
      data-testid="update-password-button"
    >
      パスワードを変更
    </button>
    <button v-else class="btn btn-blue" data-testid="password-update-message">
      変更中…
    </button>
    <router-link to="/profile_show"> 戻る </router-link>
  </div>
</template>
<script>
import axios from 'axios';
import { ref, reactive, onMounted } from 'vue';
import { useStore } from 'vuex';
import Input from '../../components/Input.vue';
export default {
  name: 'ProfileShowPage',
  components: { Input },
  setup() {
    const store = useStore();
    const isChangingUser = ref(false);
    const isChangingPassword = ref(false);
    const userForm = reactive({
      first_name: '',
      last_name: '',
      email: '',
    });
    const passwordForm = reactive({
      password: '',
      passwordConfirm: '',
    });
    const onChangeFirstName = (payload) => {
      userForm.first_name = payload;
    };
    const onChangeLastName = (payload) => {
      userForm.last_name = payload;
    };
    const onChangeEmail = (payload) => {
      userForm.email = payload;
    };
    const onChangePassword = (payload) => {
      passwordForm.password = payload;
    };
    const onChangePasswordConfirm = (payload) => {
      passwordForm.passwordConfirm = payload;
    };
    onMounted(() => {
      if (store.state.user) {
        const {
          state: { user },
        } = store;
        userForm.first_name = user.first_name;
        userForm.last_name = user.last_name;
        userForm.email = user.email;
      }
    });
    const onUserUpdate = async () => {
      isChangingUser.value = true;
      const { data } = await axios.put('user_update', userForm);
      store.dispatch('setUser', data);
      isChangingUser.value = false;
    };
    const onPasswordUpdate = async () => {
      isChangingPassword.value = true;
      const { password, passwordConfirm } = passwordForm;
      if (password === passwordConfirm) {
        const { data } = await axios.put('password_update', { password });
        store.dispatch('setUser', data);
        isChangingPassword.value = false;
      }
    };
    return {
      userForm,
      passwordForm,
      onChangeFirstName,
      onChangeLastName,
      onChangeEmail,
      onChangePassword,
      onChangePasswordConfirm,
      onUserUpdate,
      onPasswordUpdate,
      isChangingUser,
      isChangingPassword,
      isUserButtonDisabled,
    };
  },
};
</script>
