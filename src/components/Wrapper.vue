<template>
  <div class="flex flex-col h-screen">
    <transition name="modal" appear>
      <Modal v-if="modal" :modal="modal" />
    </transition>
    <Header />
    <div class="h-full overflow-y-scroll">
      <router-view />
    </div>
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
        // await router.push('/login');
        store.dispatch('discardUser');
      }
    });
    return {
      modal,
    };
  },
};
</script>
<style>
.modal-enter-from {
  opacity: 0;
}
.modal-enter-active {
  transition: all 0.25s ease;
}
.modal-leave-to {
  opacity: 0;
}
.modal-leave-active {
  transition: all 0.25s ease;
}
</style>
