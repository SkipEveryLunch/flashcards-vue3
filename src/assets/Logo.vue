<template>
  <div class="container">
    <transition name="svg">
      <svg
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        style="enable-background: new 0 0 500 500"
        xml:space="preserve"
      >
        <polyline
          points="0,10 5,0 85,0 90,10 85,20 5,20 0,10"
          class="polyline"
          stroke-dasharray="300px"
          stroke-dashoffset="300px"
          stroke-width="1"
          stroke="white"
          fill="none"
        ></polyline>
        <text
          class="text"
          x="45"
          y="9"
          dominant-baseline="central"
          fill="white"
          stroke="none"
          text-anchor="middle"
        >
          Learn w/ U
        </text>
      </svg>
    </transition>
  </div>
</template>
>
<style scoped>
.container {
  @apply w-40 h-8;
}
.text {
  font-size: 14px;
  animation: text_animation 2s both;
}
.polyline {
  animation: line_animation 2s both;
}

@keyframes line_animation {
  0% {
    stroke-dashoffset: 300px; /*# 0秒では間隔を300px */
  }
  100% {
    stroke-dashoffset: 0px; /*# 3秒後に間隔を0px */
  }
}
@keyframes text_animation {
  0% {
    opacity: 0; /*# 0秒では間隔を300px */
  }
  75% {
    opacity: 1;
  }
  100% {
    opacity: 1; /*# 3秒後に間隔を0px */
  }
}
</style>
