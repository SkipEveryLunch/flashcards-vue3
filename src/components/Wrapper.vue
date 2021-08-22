<template>
  <div class="h-screen">
    <Header />
    <router-view />
  </div>
</template>
<script>
import Header from './Header/Header.vue';
export default {
  name: 'Wrapper',
  components: {
    Header,
  },
};
</script>
