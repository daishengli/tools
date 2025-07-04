<template>
  <div class="text-processor p-4 bg-gray-100 rounded-lg shadow-md">
    <div class="flex flex-col gap-4">
      <!-- 输入区域 -->
      <div class="input-area bg-white rounded-lg p-4 shadow-sm">
        <label class="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
        <textarea
          v-model="inputText"
          class="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="请输入要处理的文本..."
        ></textarea>
        <div class="flex justify-between items-center mt-2">
          <span class="text-xs text-gray-500">字符数: {{ inputText.length }}</span>
          <div class="flex gap-2">
            <button
              @click="clearInput"
              class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition flex items-center gap-1"
            >
              <div class="i-carbon-trash-can text-base"></div>
              清空
            </button>
            <button
              @click="pasteFromClipboard"
              class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition flex items-center gap-1"
            >
              <div class="i-carbon-paste text-base"></div>
              粘贴
            </button>
          </div>
        </div>
      </div>

      <!-- 操作面板 -->
      <div class="operations bg-white rounded-lg p-4 shadow-sm">
        <h3 class="text-lg font-medium mb-3">文本操作</h3>

        <!-- 格式化选项 -->
        <div class="operation-group mb-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <div class="i-carbon-text-font text-base"></div>
            文本格式化
          </h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              v-for="format in textFormats"
              :key="format.name"
              @click="applyTextFormat(format.action)"
              class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition flex items-center gap-1"
            >
              <div :class="`i-carbon-${format.icon} text-base`"></div>
              {{ format.name }}
            </button>
          </div>
        </div>

        <!-- 加密解密选项 -->
        <div class="operation-group mb-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <div class="i-carbon-locked text-base"></div>
            加密/解密
          </h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              v-for="crypto in cryptoMethods"
              :key="crypto.name"
              @click="applyCryptoMethod(crypto.action)"
              class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition flex items-center gap-1"
            >
              <div :class="`i-carbon-${crypto.icon} text-base`"></div>
              {{ crypto.name }}
            </button>
          </div>
          <div v-if="showCryptoKey" class="mt-2">
            <label class="block text-xs text-gray-500 mb-1">加密密钥</label>
            <input
              v-model="cryptoKey"
              type="text"
              class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="输入加密密钥"
            />
          </div>
        </div>

        <!-- 编码转换选项 -->
        <div class="operation-group">
          <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <div class="i-carbon-code text-base"></div>
            编码转换
          </h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              v-for="encoding in encodingMethods"
              :key="encoding.name"
              @click="applyEncoding(encoding.action)"
              class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition flex items-center gap-1"
            >
              <div :class="`i-carbon-${encoding.icon} text-base`"></div>
              {{ encoding.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- 输出区域 -->
      <div class="output-area bg-white rounded-lg p-4 shadow-sm">
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700">处理结果</label>
          <div class="flex gap-2">
            <button
              @click="copyToClipboard"
              class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition flex items-center gap-1"
            >
              <div class="i-carbon-copy text-base"></div>
              复制
            </button>
            <button
              @click="downloadOutput"
              class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition flex items-center gap-1"
            >
              <div class="i-carbon-download text-base"></div>
              下载
            </button>
          </div>
        </div>
        <textarea
          v-model="outputText"
          readonly
          class="w-full h-40 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          placeholder="处理结果将显示在这里..."
        ></textarea>
        <div class="flex justify-between items-center mt-2">
          <span class="text-xs text-gray-500">字符数: {{ outputText.length }}</span>
          <span class="text-xs text-gray-500">处理时间: {{ processingTime }}ms</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CryptoJS from 'crypto-js'

// 文本状态
const inputText = ref('')
const outputText = ref('')
const processingTime = ref(0)
const cryptoKey = ref('mySecretKey')
const showCryptoKey = ref(false)

// 文本格式化选项
const textFormats = [
  { name: '大写', action: 'uppercase', icon: 'text-font' },
  { name: '小写', action: 'lowercase', icon: 'text-small-caps' },
  { name: '首字母大写', action: 'capitalize', icon: 'text-creation' },
  { name: '去除首尾空格', action: 'trim', icon: 'text-spacing' },
  { name: '反转文本', action: 'reverse', icon: 'rotate' },
  { name: '去除重复行', action: 'removeDuplicateLines', icon: 'filter-remove' },
  { name: '单行化', action: 'singleLine', icon: 'text-new-line' },
  { name: 'JSON格式化', action: 'formatJson', icon: 'data-2' },
]

// 加密解密选项
const cryptoMethods = [
  { name: 'AES加密', action: 'aesEncrypt', icon: 'encryption' },
  { name: 'AES解密', action: 'aesDecrypt', icon: 'decryption' },
  { name: 'Base64编码', action: 'base64Encode', icon: 'code' },
  { name: 'Base64解码', action: 'base64Decode', icon: 'decode' },
  { name: 'MD5哈希', action: 'md5Hash', icon: 'fingerprint' },
  { name: 'SHA1哈希', action: 'sha1Hash', icon: 'fingerprint' },
  { name: 'SHA256哈希', action: 'sha256Hash', icon: 'fingerprint' },
  { name: 'URL编码', action: 'urlEncode', icon: 'link' },
  { name: 'URL解码', action: 'urlDecode', icon: 'link' },
]

// 编码转换选项
const encodingMethods = [
  { name: 'UTF-8', action: 'utf8', icon: 'character-whole-number' },
  { name: 'UTF-16', action: 'utf16', icon: 'character-whole-number' },
  { name: 'ASCII', action: 'ascii', icon: 'character-whole-number' },
  { name: 'Hex', action: 'hex', icon: 'character-whole-number' },
  { name: '二进制', action: 'binary', icon: 'binary' },
  { name: 'HTML实体', action: 'htmlEntities', icon: 'html' },
  { name: 'Unicode转义', action: 'unicodeEscape', icon: 'string-text' },
  { name: 'Unicode解码', action: 'unicodeUnescape', icon: 'string-text' },
]

// 应用文本格式化
const applyTextFormat = (action) => {
  const startTime = performance.now()

  try {
    switch (action) {
      case 'uppercase':
        outputText.value = inputText.value.toUpperCase()
        break
      case 'lowercase':
        outputText.value = inputText.value.toLowerCase()
        break
      case 'capitalize':
        outputText.value = inputText.value
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
        break
      case 'trim':
        outputText.value = inputText.value.trim()
        break
      case 'reverse':
        outputText.value = inputText.value.split('').reverse().join('')
        break
      case 'removeDuplicateLines':
        outputText.value = [...new Set(inputText.value.split('\n'))].join('\n')
        break
      case 'singleLine':
        outputText.value = inputText.value.replace(/\s+/g, ' ').trim()
        break
      case 'formatJson':
        try {
          const jsonObj = JSON.parse(inputText.value)
          outputText.value = JSON.stringify(jsonObj, null, 2)
        } catch (e) {
          outputText.value = '无效的JSON格式: ' + e.message
        }
        break
      default:
        outputText.value = inputText.value
    }
  } catch (error) {
    outputText.value = `处理错误: ${error.message}`
  }

  processingTime.value = Math.round(performance.now() - startTime)
}

// 应用加密解密方法
const applyCryptoMethod = (action) => {
  const startTime = performance.now()
  showCryptoKey.value = ['aesEncrypt', 'aesDecrypt'].includes(action)

  try {
    switch (action) {
      case 'aesEncrypt':
        outputText.value = CryptoJS.AES.encrypt(inputText.value, cryptoKey.value).toString()
        break
      case 'aesDecrypt':
        outputText.value = CryptoJS.AES.decrypt(inputText.value, cryptoKey.value).toString(
          CryptoJS.enc.Utf8,
        )
        break
      case 'base64Encode':
        outputText.value = btoa(unescape(encodeURIComponent(inputText.value)))
        break
      case 'base64Decode':
        outputText.value = decodeURIComponent(escape(atob(inputText.value)))
        break
      case 'md5Hash':
        outputText.value = CryptoJS.MD5(inputText.value).toString()
        break
      case 'sha1Hash':
        outputText.value = CryptoJS.SHA1(inputText.value).toString()
        break
      case 'sha256Hash':
        outputText.value = CryptoJS.SHA256(inputText.value).toString()
        break
      case 'urlEncode':
        outputText.value = encodeURIComponent(inputText.value)
        break
      case 'urlDecode':
        outputText.value = decodeURIComponent(inputText.value)
        break
      default:
        outputText.value = inputText.value
    }
  } catch (error) {
    outputText.value = `加密/解密错误: ${error.message}`
  }

  processingTime.value = Math.round(performance.now() - startTime)
}

// 应用编码转换
const applyEncoding = (action) => {
  const startTime = performance.now()

  try {
    switch (action) {
      case 'utf8':
        outputText.value = inputText.value
        break
      case 'utf16':
        outputText.value = Array.from(inputText.value)
          .map((c) => c.charCodeAt(0).toString(16).padStart(4, '0'))
          .join(' ')
        break
      case 'ascii':
        outputText.value = Array.from(inputText.value)
          .map((c) => c.charCodeAt(0))
          .join(' ')
        break
      case 'hex':
        outputText.value = Array.from(inputText.value)
          .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join(' ')
        break
      case 'binary':
        outputText.value = Array.from(inputText.value)
          .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
          .join(' ')
        break
      case 'htmlEntities':
        outputText.value = inputText.value.replace(/[^\w\s]/g, (c) => `&#${c.charCodeAt(0)};`)
        break
      case 'unicodeEscape':
        outputText.value = inputText.value.replace(
          /[^\w\s]/g,
          (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`,
        )
        break
      case 'unicodeUnescape':
        outputText.value = inputText.value.replace(/\\u([\dA-Fa-f]{4})/g, (_, hex) =>
          String.fromCharCode(parseInt(hex, 16)),
        )
        break
      default:
        outputText.value = inputText.value
    }
  } catch (error) {
    outputText.value = `编码转换错误: ${error.message}`
  }

  processingTime.value = Math.round(performance.now() - startTime)
}

// 实用功能
const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
  } catch (error) {
    alert('无法访问剪贴板: ' + error.message)
  }
}

const copyToClipboard = async () => {
  if (!outputText.value) return
  try {
    await navigator.clipboard.writeText(outputText.value)
    alert('已复制到剪贴板')
  } catch (error) {
    alert('复制失败: ' + error.message)
  }
}

const downloadOutput = () => {
  if (!outputText.value) return
  const blob = new Blob([outputText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'processed-text.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.operation-group {
  padding: 0.75rem;
  border-width: 1px;
  border-color: rgb(229 231 235);
  border-radius: 0.375rem;
}

button {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

textarea {
  resize: none;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>
