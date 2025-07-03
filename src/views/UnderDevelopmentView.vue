<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-2xl font-bold mb-4">开发中<span class="dots">...</span></h1>
    <p class="text-gray-600">抱歉，该功能正在开发中，敬请期待。</p>
  </div>
</template>

<style scoped>
.dots {
  display: inline-block;
  animation: dotAnimation 1.5s infinite;
}

@keyframes dotAnimation {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}
</style>
