<template>
  <div class="h-screen">
    <Modal v-if="modal" :modal="modal" />
    <Header />
    <router-view />
  </div>
</template>
<script>
import Header from './Header/Header.vue';
import Modal from './Modal.vue';
import axios from 'axios';
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default {
  name: 'Wrapper',
  components: {
    Header,
    Modal,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const modal = computed(() => {
      if (store.state.modal) {
        return store.state.modal;
      } else {
        return null;
      }
    });
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
    return {
      modal,
    };
  },
};
</script>
