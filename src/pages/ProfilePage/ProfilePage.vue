<template>
  <div v-if="user" data-testid="profile-page">
    <span data-testid="user-firstname">{{ user.first_name }}</span>
    <span data-testid="user-lastname">{{ user.last_name }}</span>
    <span data-testid="user-email">{{ user.email }}</span>
  </div>
  <div v-else data-testid="profile-page">ログインしてください</div>
</template>
<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'ProfilePage',
  setup() {
    const store = useStore();
    const user = computed(() => {
      if (store.state.user) {
        return store.state.user;
      } else {
        return null;
      }
    });
    return {
      user,
    };
  },
};
</script>
