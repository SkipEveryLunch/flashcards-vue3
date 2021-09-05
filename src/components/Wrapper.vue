<template>
  <div class="h-screen">
    <Header />
    <router-view />
  </div>
</template>
<script>
import Header from './Header/Header.vue';
import axios from 'axios';
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
  name: 'Wrapper',
  components: {
    Header,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    onMounted(async () => {
      try {
        const {
          data: { user },
        } = await axios.get('current_user');
        store.dispatch('setUser', user);
      } catch (e) {
        await router.push('/login');
        store.dispatch('discardUser');
      }
    });
  },
};
</script>
