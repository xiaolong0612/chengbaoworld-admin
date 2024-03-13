<template>
  <AppPage>
    <n-form
      ref="formRef"
      label-placement="left"
      label-width="130"
      require-mark-placement="right-hanging"
    >
      <n-card :bordered="false" title="矿场配置" content-style="padding-bottom: 0;">
        <n-grid x-gap="12" :cols="3">
          <n-gi>
            <n-form-item label="暂停产出">
              <n-switch>
                <template #checked>是</template>
                <template #unchecked>否</template>
              </n-switch>
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="暂停日期">2012-12-12 12:12:12</n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="距今">12天</n-form-item>
          </n-gi>
        </n-grid>
      </n-card>
      <n-card :bordered="false" title="转赠配置" content-style="padding-bottom: 0;">
        <n-form-item label="暂停卡牌转赠">
          <n-switch>
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
        </n-form-item>
        <n-form-item label="暂停宝石转赠">
          <n-switch>
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
        </n-form-item>
        <n-form-item label="转赠手续费%" path="inputValue">
          <n-input v-model:value="modelData.aaa" placeholder="请输入二级分佣比例" />
        </n-form-item>
        <n-form-item label="是否需要密码">
          <n-switch>
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
        </n-form-item>
      </n-card>
      <n-card :bordered="false" title="游戏返佣配置" content-style="padding-bottom: 0;">
        <n-form-item label="下级逃生%" path="inputValue">
          <n-input placeholder="请输入" />
        </n-form-item>
        <n-form-item label="游戏总返利%" path="inputValue">
          <n-input placeholder="请输入" />
        </n-form-item>
        <n-form-item label="一级店长游戏返利%" path="inputValue">
          <n-input-group>
            <n-input placeholder="请输入" />
            <n-button type="primary">同步至所有一级店长</n-button>
          </n-input-group>
        </n-form-item>
        <n-form-item label="二级店长游戏返利%" path="inputValue">
          <n-input-group>
            <n-input placeholder="请输入" />
            <n-button type="primary">同步至所有二级店长</n-button>
          </n-input-group>
        </n-form-item>
        <n-form-item label="玩家游戏返利%" path="inputValue">
          <n-input-group>
            <n-input placeholder="请输入" />
            <n-button type="primary">同步至所有玩家</n-button>
          </n-input-group>
        </n-form-item>
      </n-card>
      <n-card :bordered="false" title="店长配置" content-style="padding-bottom: 0;">
        <n-form-item label="店长质押" path="inputValue">
          <n-input placeholder="请输入质押宝石数量" />
        </n-form-item>
      </n-card>
      <n-card :bordered="false" title="开放日期" content-style="padding-bottom: 0;">
        <n-form-item label="平台开放日期" path="inputValue">
          <n-input placeholder="" />
        </n-form-item>
        <n-form-item label=" ">
          <n-space>
            <n-button :loading="loading" strong secondary type="primary" @click="update">
              提交
            </n-button>
            <n-button :disabled="loading" strong secondary @click="reset">重置</n-button>
          </n-space>
        </n-form-item>
      </n-card>
    </n-form>
  </AppPage>
</template>

<script setup>
import api from './api'

const modelData = ref({ aaa: 1 })
const loading = ref(false)

onMounted(() => {
  api.read().then((res) => {})
})
const update = () => {
  loading.value = true
  api.update().then(
    (res) => {
      $message.success('操作成功')
      loading.value = false
    },
    (err) => {
      loading.value = false
    }
  )
}
const reset = () => {
  modelData.value = { aaa: 1 }
}
</script>
