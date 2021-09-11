<template>
  <div
    data-testid="profile-dropdown"
    class="absolute right-0 text-black bg-white border border-gray-400 rounded shadow-sm  top-full w-max"
    v-click-away="toggleDropDown"
  >
    <ul>
      <ul @click="goTo('/profile_show')" class="profileList">
        <span data-testid="profile-link"> プロフィールを見る </span>
      </ul>
      <ul @click="goTo('/profile_edit')" class="profileList">
        <span> プロフィールを編集する </span>
      </ul>
      <ul @click="goTo('/password_edit')" class="profileList">
        <span> パスワードを変更する </span>
      </ul>
      <ul data-testid="logout-button" @click="onLogout" class="profileList">
        ログアウトする
      </ul>
    </ul>
  </div>
</template>
<script>
import axios from 'axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
  name: 'ProfileDropDown',
  props: ['toggleDropDown'],
  setup(props) {
    const router = useRouter();
    const store = useStore();
    const goTo = (path) => {
      props.toggleDropDown();
      router.push(path);
    };
    const onLogout = async () => {
      try {
        const { data } = await axios.delete('logout');
        store.dispatch('discardUser', data);
        props.toggleDropDown();
        router.push('/');
        store.dispatch('setModal', {
          message: 'ログアウトしました',
        });
      } catch (e) {
        console.log(e);
      }
    };
    return {
      onLogout,
      goTo,
    };
  },
};
</script>
<style scoped>
.profileList {
  @apply w-full border-b pl-2 mr-4 py-2 text-gray-800
    text-lg hover:bg-gray-100 cursor-pointer;
}
</style>
