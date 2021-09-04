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
export default {
  name: 'Wrapper',
  components: {
    Header,
  },
  setup() {
    const store = useStore();
    onMounted(async () => {
      try {
        const { data } = await axios.get('current_user');
        store.dispatch('setUser', data);
      } catch (e) {
        store.dispatch('discardUser');
      }
    });
  },
};
</script>
