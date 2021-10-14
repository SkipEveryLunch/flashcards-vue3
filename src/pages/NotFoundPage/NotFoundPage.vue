<template>
  <div class="h-1/6"></div>
  <div class="flex items-center justify-center h-1/3">
    <div class="text-5xl text-center text-gray-800 text-bold glitch">
      <span area-hidden="true">404</span>
      <span area-hidden="true">404</span>
      <span>404</span>
    </div>
  </div>
  <div class="text-center">
    <p>ページが見つかりません</p>
  </div>
</template>
<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
export default {
  name: 'NotFoundPage',
  setup() {
    const router = useRouter();
    onMounted(() => {
      setTimeout(() => {
        router.push('/');
      }, 2000);
    });
  },
};
</script>
<style scoped>
.glitch {
  position: relative;
  text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.5),
    0.025em 0.05em 0 rgba(0, 0, 255, 0.5),
    -0.025em -0.05em 0 rgba(0, 255, 0, 0.5);
  animation: glitch 500ms infinite;
}
.glitch span {
  position: absolute;
  transform: translateX(-50%);
}
.glitch span:first-child {
  animation: glitch 650ms infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 30%);
  transform: translate(-0.83em, -0.025em);
  opacity: 0.6;
}
.glitch span:last-child {
  animation: glitch 375ms infinite;
  clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
  transform: translate(-0.75em, 0.025em);
  opacity: 0.4;
}
@keyframes glitch {
  0% {
    text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.5),
      -0.025em 0.05em 0 rgba(0, 0, 255, 0.5),
      -0.05em -0.025em 0 rgba(0, 255, 0, 0.5);
  }
  14% {
    text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.5),
      -0.025em 0.05em 0 rgba(0, 0, 255, 0.5),
      -0.05em -0.025em 0 rgba(0, 255, 0, 0.5);
  }
  15% {
    text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.5),
      -0.05em -0.05em 0 rgba(0, 0, 255, 0.5),
      0.025em 0.05em 0 rgba(18, 83, 18, 0.5);
  }
  49% {
    text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.5),
      -0.05em -0.05em 0 rgba(0, 0, 255, 0.5),
      0.025em 0.05em 0 rgba(18, 83, 18, 0.5);
  }
  50% {
    text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.5),
      0 -0.05em 0 rgba(0, 0, 255, 0.5), 0.05em 0 0 rgba(0, 255, 0, 0.5);
  }
  99% {
    text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.5),
      0 -0.05em 0 rgba(0, 0, 255, 0.5), 0.05em 0 0 rgba(0, 255, 0, 0.5);
  }
  100% {
    text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75),
      -0.025em -0.05em 0 rgba(0, 0, 255, 0.75),
      -0.025em -0.025em 0 rgba(0, 255, 0, 0.75);
  }
}
</style>
