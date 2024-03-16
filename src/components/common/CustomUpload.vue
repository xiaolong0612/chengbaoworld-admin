<script setup>
import { ref } from 'vue'
const emit = defineEmits(['update:value'])

const token = JSON.parse(localStorage.getItem('vue-naivue-admin_auth'))
const apiUrl = import.meta.env.VITE_PROXY_TARGET

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
})
const fileList = ref(
  props.value
    ? [
        {
          url: props.value,
          status: 'finished',
        },
      ]
    : []
)

watchEffect(() => {
  fileList.value = props.value
    ? [
        {
          url: props.value,
          status: 'finished',
        },
      ]
    : []
})

const handleFinish = ({ event }) => {
  const result = JSON.parse(event.target.response)
  if (result.code == 200) {
    emit('update:value', result.data)
  }
}
</script>
<template>
  <n-upload
    :action="apiUrl + '/file/upload'"
    :default-file-list="fileList"
    list-type="image-card"
    :max="1"
    :headers="{
      Authorization: token.accessToken,
    }"
    accept="image/"
    :on-finish="handleFinish"
  >
    点击上传
  </n-upload>
</template>
