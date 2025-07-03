<template>
  <div>
    <h1 class="text-2xl font-bold mb-8 text-center p-t-1.8rem">封面图生成器</h1>
    <div class="flex gap-20px max-w-1200px mx-auto p-20px">
      <div class="w-400px bg-white rounded-8px shadow-sm p-20px overflow-y-auto max-h-800px">
        <div class="mb-20px pb-15px border-b border-gray-200">
          <div class="flex items-center mb-10px">
            <label for="title" class="w-100px text-14px text-gray-600">主标题</label>
            <input
              type="text"
              id="title"
              v-model="title"
              class="flex-1 p-8px border border-gray-300 rounded-4px"
            />
          </div>

          <div class="flex items-center mb-10px">
            <label for="titleFont" class="w-100px text-14px text-gray-600">字体</label>
            <select
              id="titleFont"
              v-model="titleFont"
              class="flex-1 p-8px border border-gray-300 rounded-4px"
            >
              <option value="Microsoft YaHei">微软雅黑</option>
              <option value="SimSun">宋体</option>
              <option value="KaiTi">楷体</option>
              <option value="Arial">Arial</option>
            </select>
          </div>

          <div class="flex items-center mb-10px">
            <label for="titleSize" class="w-100px text-14px text-gray-600">大小</label>
            <div class="flex-1 flex items-center">
              <input
                type="range"
                id="titleSize"
                min="20"
                max="100"
                v-model="titleSize"
                class="flex-1 mx-10px"
              />
              <span class="w-40px text-right text-14px">{{ titleSize }}px</span>
            </div>
          </div>

          <div class="flex items-center mb-10px">
            <label for="titleColor" class="w-100px text-14px text-gray-600">颜色</label>
            <div class="flex-1 flex items-center">
              <input
                type="color"
                id="titleColor"
                v-model="titleColor"
                class="w-30px h-30px border border-gray-300 rounded-4px ml-10px"
              />
            </div>
          </div>

          <div class="flex items-center mb-10px">
            <label for="subtitle" class="w-100px text-14px text-gray-600">副标题</label>
            <input
              type="text"
              id="subtitle"
              v-model="subtitle"
              class="flex-1 p-8px border border-gray-300 rounded-4px"
            />
          </div>

          <div class="flex items-center mb-10px">
            <label for="subtitleFont" class="w-100px text-14px text-gray-600">字体</label>
            <select
              id="subtitleFont"
              v-model="subtitleFont"
              class="flex-1 p-8px border border-gray-300 rounded-4px"
            >
              <option value="Microsoft YaHei">微软雅黑</option>
              <option value="SimSun">宋体</option>
              <option value="KaiTi">楷体</option>
              <option value="Arial">Arial</option>
            </select>
          </div>

          <div class="flex items-center mb-10px">
            <label for="subtitleSize" class="w-100px text-14px text-gray-600">大小</label>
            <div class="flex-1 flex items-center">
              <input
                type="range"
                id="subtitleSize"
                min="12"
                max="60"
                v-model="subtitleSize"
                class="flex-1 mx-10px"
              />
              <span class="w-40px text-right text-14px">{{ subtitleSize }}px</span>
            </div>
          </div>

          <div class="flex items-center mb-10px">
            <label for="subtitleColor" class="w-100px text-14px text-gray-600">颜色</label>
            <div class="flex-1 flex items-center">
              <input
                type="color"
                id="subtitleColor"
                v-model="subtitleColor"
                class="w-30px h-30px border border-gray-300 rounded-4px ml-10px"
              />
            </div>
          </div>
        </div>

        <div class="pb-15px border-b border-gray-200">
          <label for="imageUpload" class="w-100px text-14px text-gray-600">上传图片</label>
          <input
            type="file"
            ref="imageUpload"
            accept="image/*"
            class="hidden"
            @change="handleImageUpload"
          />
          <div
            class="inline-block bg-gray-100 text-gray-800 p-8px-15px rounded-4px cursor-pointer text-14px border border-dashed border-gray-300 text-center mt-10px"
            @click="triggerImageUpload"
          >
            选择图片
          </div>

          <div class="flex items-center mt-15px mb-10px">
            <label for="overlayOpacity" class="w-100px text-14px text-gray-600">蒙版透明度</label>
            <div class="flex-1 flex items-center">
              <input
                type="range"
                id="overlayOpacity"
                min="0"
                max="100"
                v-model="overlayOpacity"
                class="flex-1 mx-10px"
              />
              <span class="w-40px text-right text-14px">{{ overlayOpacity }}%</span>
            </div>
          </div>

          <div class="flex items-center mb-10px">
            <label for="overlayColor" class="w-100px text-14px text-gray-600">蒙版颜色</label>
            <div class="flex-1 flex items-center">
              <input
                type="color"
                id="overlayColor"
                v-model="overlayColor"
                class="w-30px h-30px border border-gray-300 rounded-4px ml-10px"
              />
            </div>
          </div>

          <div class="mt-15px">
            <label class="w-100px text-14px text-gray-600">图片比例</label>
            <div class="flex gap-10px mt-10px">
              <button
                v-for="ratio in aspectRatios"
                :key="ratio.value"
                :class="[
                  'flex-1 bg-gray-100 text-gray-800 border-none p-8px rounded-4px cursor-pointer text-14px',
                  currentAspectRatio === ratio.value ? 'bg-blue! text-white' : '',
                ]"
                @click="setAspectRatio(ratio.value)"
              >
                {{ ratio.label }}
              </button>
            </div>
          </div>
        </div>

        <button
          class="bg-blue text-white border-none rounded-25px text-16px cursor-pointer mt-20px w-full hover:bg-blue-600 h-36px"
          @click="downloadImage"
        >
          下载图片
        </button>
      </div>

      <div
        class="flex-1 bg-white rounded-8px shadow-sm p-20px flex flex-col items-center justify-center"
      >
        <div ref="canvasContainer" class="relative w-full rounded-4px overflow-hidden">
          <canvas ref="previewCanvas" class="w-full h-full block"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// 状态定义
const title = ref('在时间褶皱里打捞星光')
const subtitle = ref('关于那些未被说尽的温柔与荒芜​')
const titleFont = ref('Microsoft YaHei')
const subtitleFont = ref('Microsoft YaHei')
const titleSize = ref(48)
const subtitleSize = ref(24)
const titleColor = ref('#ffffff')
const subtitleColor = ref('#f0f0f0')
const overlayOpacity = ref(40)
const overlayColor = ref('#1F2937')
const currentAspectRatio = ref(1.777778)
const currentImage = ref(null)

// DOM 引用
const canvasContainer = ref(null)
const previewCanvas = ref(null)
const imageUpload = ref(null)

// 预定义比例
const aspectRatios = [
  { value: 1, label: '1:1', class: 'aspect-ratio-1/1' },
  { value: 1.333333, label: '4:3', class: 'aspect-ratio-4/3' },
  { value: 1.777778, label: '16:9', class: 'aspect-ratio-16/9' },
  { value: 2.35, label: '公众号', class: 'aspect-ratio-900/383' },
]

// 画布上下文
let ctx = null

// 调整画布尺寸
const resizeCanvas = (ratio) => {
  const canvas = previewCanvas.value
  if (!canvas) return

  const container = canvas.parentElement
  if (ratio) {
    container.classList.forEach((item) => {
      if (item.startsWith('aspect-ratio-')) {
        container.classList.remove(item)
      }
    })
    container.classList.add(aspectRatios.find((item) => item.value === ratio).class)
  }
  const width = container.clientWidth
  const height = width / currentAspectRatio.value

  canvas.width = width
  canvas.height = height
  updateCanvas()
}

// 更新画布内容
const updateCanvas = () => {
  const canvas = previewCanvas.value
  if (!canvas || !ctx) return

  const width = canvas.width
  const height = canvas.height

  // 清空画布
  ctx.clearRect(0, 0, width, height)

  // 绘制图片
  if (currentImage.value) {
    const img = currentImage.value
    drawImageCenterCover(ctx, img, width, height)
  } else {
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, width, height)
  }

  // 绘制蒙版
  ctx.fillStyle = overlayColor.value
  ctx.globalAlpha = overlayOpacity.value / 100
  ctx.fillRect(0, 0, width, height)
  ctx.globalAlpha = 1

  // 绘制主标题
  ctx.font = `bold ${titleSize.value}px ${titleFont.value}`
  ctx.fillStyle = titleColor.value
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(title.value, width / 2, height / 2 - titleSize.value / 2)

  // 绘制副标题
  ctx.font = `${subtitleSize.value}px ${subtitleFont.value}`
  ctx.fillStyle = subtitleColor.value
  ctx.fillText(subtitle.value, width / 2, height / 2 + titleSize.value / 2)
}

// 图片上传处理
const triggerImageUpload = () => {
  imageUpload.value.click()
}

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        currentImage.value = img
        updateCanvas()
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 设置比例
const setAspectRatio = (ratio) => {
  currentAspectRatio.value = ratio
  resizeCanvas(ratio)
}

// 添加图片
function drawImageCenterCover(ctx, img, canvasWidth, canvasHeight) {
  const imgRatio = img.width / img.height
  const canvasRatio = canvasWidth / canvasHeight

  let sourceWidth,
    sourceHeight,
    sourceX = 0,
    sourceY = 0
  let destWidth = canvasWidth
  let destHeight = canvasHeight

  if (imgRatio > canvasRatio) {
    sourceHeight = img.height
    sourceWidth = sourceHeight * canvasRatio
    sourceX = (img.width - sourceWidth) / 2
  } else {
    sourceWidth = img.width
    sourceHeight = sourceWidth / canvasRatio
    sourceY = (img.height - sourceHeight) / 2
  }

  ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, destWidth, destHeight)
}

// 下载图片
const downloadImage = () => {
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')

  const targetWidth = 900
  const targetHeight = targetWidth / currentAspectRatio.value

  tempCanvas.width = targetWidth
  tempCanvas.height = targetHeight

  // 绘制背景
  if (currentImage.value) {
    const img = currentImage.value
    drawImageCenterCover(tempCtx, img, targetWidth, targetHeight)
  } else {
    tempCtx.fillStyle = '#f0f0f0'
    tempCtx.fillRect(0, 0, targetWidth, targetHeight)
  }

  // 绘制蒙版
  tempCtx.fillStyle = overlayColor.value
  tempCtx.globalAlpha = overlayOpacity.value / 100
  tempCtx.fillRect(0, 0, targetWidth, targetHeight)
  tempCtx.globalAlpha = 1

  // 绘制文字
  const scaleFactor = targetWidth / previewCanvas.value.width

  // 主标题
  tempCtx.font = `bold ${titleSize.value * scaleFactor}px ${titleFont.value}`
  tempCtx.fillStyle = titleColor.value
  tempCtx.textAlign = 'center'
  tempCtx.textBaseline = 'middle'
  tempCtx.fillText(
    title.value,
    targetWidth / 2,
    targetHeight / 2 - (titleSize.value * scaleFactor) / 2,
  )

  // 副标题
  tempCtx.font = `${subtitleSize.value * scaleFactor}px ${subtitleFont.value}`
  tempCtx.fillStyle = subtitleColor.value
  tempCtx.fillText(
    subtitle.value,
    targetWidth / 2,
    targetHeight / 2 + (titleSize.value * scaleFactor) / 2,
  )

  // 下载
  const link = document.createElement('a')
  link.download = `cover-image-${Date.now()}.png`
  link.href = tempCanvas.toDataURL('image/png')
  link.click()
}

// 监听状态变化
watch(
  [
    title,
    subtitle,
    titleFont,
    subtitleFont,
    titleSize,
    subtitleSize,
    titleColor,
    subtitleColor,
    overlayOpacity,
    overlayColor,
  ],
  () => {
    updateCanvas()
  },
)

// 初始化
onMounted(() => {
  canvasContainer.value.classList.add('aspect-ratio-16/9')
  ctx = previewCanvas.value.getContext('2d')
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})
</script>
