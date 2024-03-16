<template>
  <CommonPage>
    <MeCrud ref="$table" v-model:query-items="queryItems" :columns="columns" :get-data="api.read">
      <MeQueryItem label="关键词搜索">
        <n-input
          v-model:value="queryItems.nickname"
          type="text"
          placeholder="请输入 昵称 / 账号 / ID"
          clearable
        />
      </MeQueryItem>
      <MeQueryItem label="查询方式">
        <n-select
          v-model:value="queryItems.balanceSort"
          clearable
          :options="[
            { label: '单例模式', value: 1 },
            { label: '合并模式', value: 2 },
          ]"
        />
      </MeQueryItem>
      <MeQueryItem label="变动类型">
        <n-select
          v-model:value="queryItems.balanceSort"
          clearable
          :options="[
            { label: '转赠', value: 1 },
            { label: '矿场分佣', value: 2 },
            { label: '矿场收入', value: 3 },
            { label: '游戏消耗', value: 4 },
            { label: '游戏收入', value: 5 },
            { label: '游戏分佣', value: 6 },
          ]"
        />
      </MeQueryItem>
      <MeQueryItem label="时间范围">
        <n-date-picker v-model:value="queryItems.date" type="datetimerange" clearable />
      </MeQueryItem>
    </MeCrud>
  </CommonPage>
</template>

<script setup>
import { NTag } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({
  balanceSort: 1,
})

onMounted(() => {
  $table.value?.handleSearch()
})

const columns = [
  {
    title: '支出用户',
    key: 'nickname',
  },
  {
    title: '接收用户',
    key: 'nickname',
  },
  {
    title: '变动类型',
    key: 'nickname',
  },
  { title: '变动金额', key: 'mobile', width: 150, ellipsis: { tooltip: true } },
  { title: '费率', key: 'balance', width: 150, ellipsis: { tooltip: true } },
  { title: '变动前宝石', key: 'frezon_balance', width: 150, ellipsis: { tooltip: true } },
  { title: '变动后宝石', key: 'wechat', width: 150, ellipsis: { tooltip: true } },
  { title: '说明', key: 'remark', width: 150, ellipsis: { tooltip: true } },
  {
    title: '创建时间',
    key: 'edit_date',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row['edit_date']))
    },
  },
]

useCrud({
  name: '宝石日志',
  initForm: {},
  refresh: () => $table.value?.handleSearch(),
})
</script>
