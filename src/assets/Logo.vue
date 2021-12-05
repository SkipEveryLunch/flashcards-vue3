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
        <polygon
          points="0,10 5,0 85,0 90,10 85,20 5,20"
          stroke-width="1"
          stroke="white"
          fill="none"
          class="polygon"
        ></polygon>
        <text
          class="text"
          x="45"
          y="9"
          dominant-baseline="central"
          fill="white"
          stroke="none"
          text-anchor="middle"
        >
          Learn w/U
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
}
</style>
