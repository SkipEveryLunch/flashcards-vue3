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
        <span class="mt-1 ml-1 text-sm arrow" :class="{ up: showDropDown }">
          <Arrow />
        </span>
      </div>
      <transition name="dropdown" appear>
        <ProfileDropDown v-if="showDropDown" :toggleDropDown="toggleDropDown" />
      </transition>
    </div>
  </nav>
</template>
<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import ProfileDropDown from '../ProfileDropDown.vue';
import Arrow from '../../assets/Arrow.vue';
export default {
  name: 'Header',
  components: { ProfileDropDown, Arrow },
  setup() {
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

    return {
      name,
      showDropDown,
      toggleDropDown,
    };
  },
};
</script>
<style>
.dropdown-enter-from {
  opacity: 0;
  transform-origin: top;
  transform: scaleY(0);
}
.dropdown-enter-to {
  opacity: 1;
  transform-origin: top;
  transform: scaleY(1);
}
.dropdown-enter-active {
  transition: all 0.25s ease-out;
}
.dropdown-leave-from {
  opacity: 1;
  transform-origin: top;
  transform: scaleY(1);
}
.dropdown-leave-to {
  opacity: 0;
  transform-origin: top;
  transform: scaleY(0);
}
.dropdown-leave-active {
  transition: all 0.25s ease-out;
}
.arrow {
  transition: all 0.25s ease-out;
}
.arrow.up {
  transform: rotate(-180deg);
}
</style>
