<template>
  <div class="max-w-1200px mx-auto my-8 px-4">
    <h1 class="text-2xl font-bold mb-8 text-center">工具集</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="tool in tools"
        :key="tool.id"
        class="border border-gray-200 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center cursor-pointer"
        @click="navigateToTool(tool.path)"
      >
        <div
          class="w-15 h-15 flex items-center justify-center mb-4 p-3 rounded-full"
          :style="{ backgroundColor: tool.bgColor }"
        >
          <div :class="tool.icon" class="text-3xl" :style="{ color: tool.iconColor }"></div>
        </div>
        <h2 class="text-lg font-semibold mb-2">{{ tool.name }}</h2>
        <p class="text-gray-600 text-center text-sm">{{ tool.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tools = ref([
  {
    id: 1,
    name: '封面图生成器',
    description: '生成自定义标题、图片和样式的封面图',
    path: '/cover-generator',
    bgColor: '#F3E5F5',
    iconColor: '#8E24AA',
    icon: 'i-carbon-image-copy',
  },
  {
    id: 2,
    name: '图片处理',
    description: '压缩、裁剪、格式转换等图片处理工具',
    path: '/image',
    bgColor: '#E3F2FD',
    iconColor: '#1E88E5',
    icon: 'i-carbon-image',
  },
  {
    id: 3,
    name: '文本工具',
    description: '文本格式化、加密解密、编码转换等',
    path: '/text',
    bgColor: '#E8F5E9',
    iconColor: '#43A047',
    icon: 'i-carbon-text-font',
  },
  {
    id: 4,
    name: '二维码',
    description: '二维码生成与解析工具',
    path: 'https://www.codebox.club/zh',
    bgColor: '#FAFAFA',
    iconColor: '#424242',
    icon: 'i-carbon-qr-code',
  },
])

const navigateToTool = (path) => {
  if (path.startsWith('http')) {
    window.open(path, '_blank')
  } else {
    router.push(path)
  }
}
</script>
