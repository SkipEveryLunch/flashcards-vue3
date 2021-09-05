<template>
  <div>
    <Input
      name="名字"
      id="first-name"
      :error="errors.first_name"
      :modelValue="userForm.first_name"
      @custom-input="onChangeFirstName"
    />
    <Input
      name="名前"
      id="last-name"
      :error="errors.last_name"
      :modelValue="userForm.last_name"
      @custom-input="onChangeLastName"
    />
    <Input
      name="アドレス"
      id="email"
      :error="errors.email"
      :modelValue="userForm.email"
      @custom-input="onChangeEmail"
    />
    <button
      v-if="!isChangingUser"
      @click="onUserUpdate"
      class="btn btn-blue"
      data-testid="update-user-button"
      :disabled="userDisabled"
    >
      ユーザー情報を変更
    </button>
    <button v-else class="btn btn-blue" data-testid="user-update-message">
      変更中…
    </button>
    <Input
      name="パスワード"
      id="password"
      :error="errors.password"
      :modelValue="passwordForm.password"
      @custom-input="onChangePassword"
    />
    <Input
      name="パスワード(確認)"
      id="password-confirm"
      :error="errors.password_confirm"
      :modelValue="passwordForm.password_confirm"
      @custom-input="onChangePasswordConfirm"
    />
    <button
      v-if="!isChangingPassword"
      @click="onPasswordUpdate"
      class="btn btn-blue"
      data-testid="update-password-button"
      :disabled="passwordDisabled"
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
import { ref, reactive, onMounted, watch, computed } from 'vue';
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
      password_confirm: '',
    });
    const errors = reactive({
      first_name: ['名字が未入力です'],
      last_name: ['名前が未入力です'],
      email: ['メールアドレスが未入力です'],
      password: ['パスワードが未入力です'],
      password_confirm: ['パスワード確認が未入力です'],
    });
    watch(userForm, () => {
      if (userForm.first_name.length === 0) {
        pushToArr(errors.first_name, '名字が未入力です');
      } else {
        deleteFromArr(errors.first_name, '名字が未入力です');
      }
      if (userForm.first_name.length > 12) {
        pushToArr(errors.first_name, '名字は12字以内です');
      } else {
        deleteFromArr(errors.first_name, '名字は12字以内です');
      }
      if (userForm.last_name.length === 0) {
        pushToArr(errors.last_name, '名前が未入力です');
      } else {
        deleteFromArr(errors.last_name, '名前が未入力です');
      }
      if (userForm.last_name.length > 12) {
        pushToArr(errors.last_name, '名前は12字以内です');
      } else {
        deleteFromArr(errors.last_name, '名前は12字以内です');
      }
      const mailReg =
        /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}.[A-Za-z0-9]{1,}$/;
      if (userForm.email.length === 0) {
        pushToArr(errors.email, 'メールアドレスが未入力です');
      } else {
        deleteFromArr(errors.email, 'メールアドレスが未入力です');
      }
      if (userForm.email.length > 0 && !mailReg.test(userForm.email)) {
        pushToArr(errors.email, '正しいメールアドレスを入力して下さい');
      } else {
        deleteFromArr(errors.email, '正しいメールアドレスを入力して下さい');
      }
    });
    watch(passwordForm, () => {
      if (passwordForm.password.length === 0) {
        pushToArr(errors.password, 'パスワードが未入力です');
      } else {
        deleteFromArr(errors.password, 'パスワードが未入力です');
      }
      if (passwordForm.password_confirm.length === 0) {
        pushToArr(errors.password_confirm, 'パスワード確認が未入力です');
      } else {
        deleteFromArr(errors.password_confirm, 'パスワード確認が未入力です');
      }
      if (passwordForm.password !== passwordForm.password_confirm) {
        pushToArr(errors.password_confirm, 'パスワードと違います');
      } else {
        deleteFromArr(errors.password_confirm, 'パスワードと違います');
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
      passwordForm.password_confirm = payload;
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
      try {
        const {
          data: { user },
        } = await axios.put('user_update', userForm);
        await store.dispatch('setUser', user);
        isChangingUser.value = false;
      } catch (e) {
        console.log(e);
      }
    };
    const onPasswordUpdate = async () => {
      isChangingPassword.value = true;
      const { password, password_confirm } = passwordForm;
      if (password === password_confirm) {
        try {
          const {
            data: { user },
          } = await axios.put('password_update', { password });
          store.dispatch('setUser', user);
          isChangingPassword.value = false;
        } catch (e) {
          console.log(e);
        }
      }
    };
    const userDisabled = computed(() => {
      return !(
        errors.first_name.length === 0 &&
        errors.last_name.length === 0 &&
        errors.email.length === 0
      );
    });
    const passwordDisabled = computed(() => {
      return !(
        errors.password.length === 0 && errors.password_confirm.length === 0
      );
    });
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
      errors,
      userDisabled,
      passwordDisabled,
    };
  },
};
</script>
