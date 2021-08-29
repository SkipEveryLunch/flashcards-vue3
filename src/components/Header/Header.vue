<template>
  <nav
    data-testid="header"
    class="flex justify-between px-3 text-xl text-white bg-gray-900"
  >
    <div class="flex space-x-1">
      <div class="flex items-center px-2 py-5">
        <router-link to="/">
          <span>💡</span>
          <span>Fla$hApp</span>
        </router-link>
      </div>
      <div class="flex items-center px-2 py-5">
        <a class="px-2">セクション</a>
        <a class="px-2">今日の宿題</a>
      </div>
    </div>
    <div v-if="name.length === 0">
      <div class="flex items-center px-2 py-5">
        <router-link data-testid="login-link" to="/login" class="px-2 pr-4"
          >ログイン</router-link
        >
        <router-link
          to="/register"
          class="px-2 py-2 text-yellow-700 bg-yellow-300 rounded-md"
          >新規登録</router-link
        >
      </div>
    </div>
    <div v-else>
      <div class="flex items-center px-2 py-5">
        <span @click="logout" data-testid="logout-link" class="px-2 pr-4">
          ログアウト
        </span>
        <router-link
          data-testid="profile-link"
          to="/profile"
          class="px-2 pr-4"
          >{{ name }}</router-link
        >
      </div>
    </div>
  </nav>
</template>
<script>
import axios from 'axios';
import { computed } from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'Header',
  setup() {
    const store = useStore();
    const name = computed(() => {
      return store.state.user
        ? `${store.state.user.first_name} ${store.state.user.last_name} `
        : '';
    });
    const logout = async () => {
      const { data } = await axios.delete('logout');
      store.dispatch('discardUser', data);
    };
    return {
      name,
      logout,
    };
  },
};
</script>
