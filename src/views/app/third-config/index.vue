<template>
  <AppPage>
    <n-card>
      <n-tabs type="line" animated>
        <n-tab-pane name="aliCloud" tab="阿里云">
          <Ali />
        </n-tab-pane>
        <n-tab-pane name="tencentCloud" tab="腾讯云">
          <Tencent />
        </n-tab-pane>
        <n-tab-pane name="baiduCloud" tab="百度云">
          <Baidu />
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </AppPage>
</template>

<script setup>
import Ali from './components/Ali.vue'
import Tencent from './components/Tencent.vue'
import Baidu from './components/Baidu.vue'
</script>
