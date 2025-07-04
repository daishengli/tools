<template>
  <div class="image-processor p-4 bg-gray-100 rounded-lg shadow-md">
    <div class="flex flex-col gap-4">
      <!-- 文件上传区域 -->
      <div class="upload-area border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          class="hidden"
          @change="handleFileUpload"
        />
        <label
          for="imageInput"
          class="cursor-pointer flex flex-col items-center justify-center gap-2"
        >
          <div class="i-carbon-image text-4xl text-gray-400"></div>
          <p class="text-gray-600">点击或拖拽图片到此处</p>
          <p class="text-sm text-gray-500">支持 JPG, PNG, GIF, WEBP</p>
        </label>
      </div>

      <!-- 预览和操作区域 -->
      <div v-if="imageFile" class="preview-area bg-white rounded-lg p-4 shadow-sm">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- 原始图片预览 -->
          <div class="original-preview flex-1">
            <h3 class="text-lg font-medium mb-2">原始图片</h3>
            <div class="border rounded overflow-hidden">
              <img
                :src="originalImageUrl"
                alt="Original"
                class="w-full h-auto max-h-60 object-contain"
              />
            </div>
            <p class="text-sm text-gray-500 mt-1">
              尺寸: {{ originalWidth }} × {{ originalHeight }} px
              <br />
              大小: {{ formatFileSize(imageFile.size) }}
            </p>
          </div>

          <!-- 处理后的图片预览 -->
          <div class="processed-preview flex-1">
            <h3 class="text-lg font-medium mb-2">处理后图片</h3>
            <div v-if="processedImageUrl" class="border rounded overflow-hidden">
              <img
                :src="processedImageUrl"
                alt="Processed"
                class="w-full h-auto max-h-60 object-contain"
              />
            </div>
            <div v-else class="border rounded flex items-center justify-center h-60 bg-gray-50">
              <p class="text-gray-400">处理后图片将显示在这里</p>
            </div>
            <p v-if="processedImageUrl" class="text-sm text-gray-500 mt-1">
              尺寸: {{ processedWidth }} × {{ processedHeight }} px
              <br />
              大小: {{ formatFileSize(processedSize) }}
              <br />
              格式: {{ outputFormat.toUpperCase() }}
            </p>
          </div>
        </div>

        <!-- 控制面板 -->
        <div class="controls mt-6 space-y-4">
          <!-- 压缩设置 -->
          <div class="control-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">压缩质量</label>
            <div class="flex items-center gap-3">
              <input type="range" v-model="quality" min="10" max="100" step="5" class="w-full" />
              <span class="text-sm w-12 text-center">{{ quality }}%</span>
            </div>
          </div>

          <!-- 裁剪设置 -->
          <div class="control-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">裁剪尺寸</label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label class="text-xs text-gray-500 block mb-1">宽度</label>
                <input
                  type="number"
                  v-model="cropWidth"
                  min="1"
                  :max="originalWidth"
                  class="w-full px-2 py-1 border rounded text-sm"
                  placeholder="宽度"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500 block mb-1">高度</label>
                <input
                  type="number"
                  v-model="cropHeight"
                  min="1"
                  :max="originalHeight"
                  class="w-full px-2 py-1 border rounded text-sm"
                  placeholder="高度"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500 block mb-1">X 偏移</label>
                <input
                  type="number"
                  v-model="cropX"
                  min="0"
                  :max="originalWidth"
                  class="w-full px-2 py-1 border rounded text-sm"
                  placeholder="X"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500 block mb-1">Y 偏移</label>
                <input
                  type="number"
                  v-model="cropY"
                  min="0"
                  :max="originalHeight"
                  class="w-full px-2 py-1 border rounded text-sm"
                  placeholder="Y"
                />
              </div>
            </div>
          </div>

          <!-- 输出格式 -->
          <div class="control-group">
            <label class="block text-sm font-medium text-gray-700 mb-1">输出格式</label>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="format in supportedFormats"
                :key="format"
                class="inline-flex items-center"
              >
                <input
                  type="radio"
                  v-model="outputFormat"
                  :value="format"
                  class="h-4 w-4 text-indigo-600"
                />
                <span class="ml-2 text-sm text-gray-700">{{ format.toUpperCase() }}</span>
              </label>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex flex-wrap gap-3 pt-2">
            <button
              @click="processImage"
              class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <div class="i-carbon-processor text-base"></div>
              处理图片
            </button>
            <button
              v-if="processedImageUrl"
              @click="downloadImage"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2"
            >
              <div class="i-carbon-download text-base"></div>
              下载图片
            </button>
            <button
              @click="reset"
              class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition flex items-center gap-2"
            >
              <div class="i-carbon-reset text-base"></div>
              重置
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// 状态管理
const imageFile = ref(null)
const originalImageUrl = ref('')
const processedImageUrl = ref('')
const originalWidth = ref(0)
const originalHeight = ref(0)
const processedWidth = ref(0)
const processedHeight = ref(0)
const processedSize = ref(0)

// 处理参数
const quality = ref(80)
const cropWidth = ref('')
const cropHeight = ref('')
const cropX = ref(0)
const cropY = ref(0)
const outputFormat = ref('webp')
const supportedFormats = ['jpeg', 'png', 'webp', 'gif']

// 处理文件上传
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  imageFile.value = file
  originalImageUrl.value = URL.createObjectURL(file)
  processedImageUrl.value = ''

  // 获取图片尺寸
  const img = new Image()
  img.onload = () => {
    originalWidth.value = img.width
    originalHeight.value = img.height
    // 默认裁剪尺寸为原始尺寸
    cropWidth.value = img.width
    cropHeight.value = img.height
  }
  img.src = originalImageUrl.value
}

// 图片处理函数
const processImage = async () => {
  if (!imageFile.value) return

  try {
    // 创建Canvas元素
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // 加载原始图片
    const img = await loadImage(originalImageUrl.value)

    // 计算裁剪尺寸
    const width = cropWidth.value ? Math.min(Number(cropWidth.value), img.width) : img.width
    const height = cropHeight.value ? Math.min(Number(cropHeight.value), img.height) : img.height
    const x = Math.min(Number(cropX.value), img.width - width)
    const y = Math.min(Number(cropY.value), img.height - height)

    // 设置Canvas尺寸
    canvas.width = width
    canvas.height = height

    // 绘制裁剪后的图片
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height)

    // 转换为Blob
    canvas.toBlob(
      (blob) => {
        if (!blob) return

        processedSize.value = blob.size
        processedImageUrl.value = URL.createObjectURL(blob)
        processedWidth.value = width
        processedHeight.value = height
      },
      `image/${outputFormat.value}`,
      quality.value / 100,
    )
  } catch (error) {
    console.error('图片处理失败:', error)
    alert('图片处理失败，请重试')
  }
}

// 辅助函数：加载图片
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

// 下载处理后的图片
const downloadImage = () => {
  if (!processedImageUrl.value) return

  const link = document.createElement('a')
  link.href = processedImageUrl.value
  link.download = `processed-image-${Date.now()}.${outputFormat.value}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 重置所有设置
const reset = () => {
  imageFile.value = null
  originalImageUrl.value = ''
  processedImageUrl.value = ''
  originalWidth.value = 0
  originalHeight.value = 0
  processedWidth.value = 0
  processedHeight.value = 0
  processedSize.value = 0
  quality.value = 80
  cropWidth.value = ''
  cropHeight.value = ''
  cropX.value = 0
  cropY.value = 0
  outputFormat.value = 'webp'
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.upload-area:hover {
  border-color: #6366f1;
  background-color: #f8fafc;
}

input[type='range'] {
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
}
</style>
