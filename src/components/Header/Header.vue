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
    <!-- <div v-else class="flex items-center"> -->
    <div v-else class="relative flex items-center px-2 py-5">
      <div
        class="flex"
        @click="toggleDropDown"
        data-testid="profile-menu"
        @blur="toggleDropDown"
      >
        <span class="mr-2 cursor-pointer">
          {{ name }}
        </span>
        <span class="mt-1 ml-1 text-sm" v-if="!showDropDown"> ▼ </span>
        <span class="mt-1 ml-1 text-sm" v-else> ▲ </span>
      </div>
      <ProfileDropDown v-if="showDropDown" :onLogout="onLogout" />
    </div>
    <!-- </div> -->
  </nav>
</template>
<script>
import axios from 'axios';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ProfileDropDown from '../ProfileDropDown.vue';
export default {
  name: 'Header',
  components: { ProfileDropDown },
  setup() {
    const router = useRouter();
    const store = useStore();
    const showDropDown = ref(false);
    const name = computed(() => {
      return store.state.user
        ? `${store.state.user.first_name} ${store.state.user.last_name} `
        : '';
    });
    const toggleDropDown = () => {
      showDropDown.value = !showDropDown.value;
    };
    const onLogout = async () => {
      try {
        const { data } = await axios.delete('logout');
        store.dispatch('discardUser', data);
        router.push('/');
      } catch (e) {
        console.log(e);
      }
    };
    return {
      name,
      showDropDown,
      toggleDropDown,
      onLogout,
    };
  },
};
</script>
