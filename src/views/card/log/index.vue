<template>
  <CommonPage>
    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :columns="columns"
      :get-data="api.fetchData"
    >
      <MeQueryItem label="赠送会员">
        <n-input
          v-model:value="queryItems.mobile"
          type="text"
          placeholder="请输入 账号 / ID"
          clearable
        />
      </MeQueryItem>
      <MeQueryItem label="接收会员">
        <n-input
          v-model:value="queryItems.mobile"
          type="text"
          placeholder="请输入 账号 / ID"
          clearable
        />
      </MeQueryItem>

      <MeQueryItem label="卡牌名称">
        <n-select
          v-model:value="queryItems.status"
          clearable
          :options="[
            { label: '启用', value: 1 },
            { label: '停用', value: 0 },
          ]"
        />
      </MeQueryItem>
    </MeCrud>

    <MeModal ref="modalRef" width="800px">
      <MeCrud
        ref="$table"
        v-model:query-items="queryItems"
        :scroll-x="780"
        :columns="columnsCard"
        :get-data="api.fetchData"
      ></MeCrud>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NTag, NButton } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

const columns = [
  {
    title: '卡牌名称',
    key: 'title',
    render: ({ title }) => h('span', title),
  },
  {
    title: '赠送会员',
    key: 'mobile',
  },
  {
    title: '接收会员',
    key: 'mobile',
  },
  {
    title: '卡牌类型',
    key: 'roles',
    ellipsis: { tooltip: true },
    // render: ({ roles }) => {
    //   return roles.map((item, index) =>
    //     h(
    //       NTag,
    //       { type: 'success', style: index > 0 ? 'margin-left: 8px;' : '' },
    //       { default: () => item.name }
    //     )
    //   )
    // },
  },
  {
    title: '卡牌数量',
    key: 'title',
    render: ({ title }) => h('span', title),
  },
  {
    title: '创建时间',
    key: 'editDate',
    width: 120,
    render(row) {
      return h('span', formatDateTime(row['editDate']))
    },
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    width: 220,
    render: (row) =>
      h(
        NButton,
        {
          size: 'small',
          type: 'primary',
          secondary: true,
          onClick: () => handleView(row),
        },
        {
          default: () => '查看详情',
        }
      ),
  },
]
// 团队table
const columnsCard = [
  {
    title: '卡牌名称',
    render: ({ mobile }) => h('span', mobile),
  },
  { title: '卡号', key: 'level' },
  { title: '状态', key: 'regDate' },
  { title: '剩余有效天数', key: 'regDate' },
  { title: '获得时间', key: 'regDate' },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    render: (row) =>
      h(
        NButton,
        {
          size: 'small',
          type: 'primary',
          secondary: true,
          onClick: () => handleView(row),
        },
        {
          default: () => '撤销',
        }
      ),
  },
]
const { modalRef, handleView } = useCrud({
  name: '闪卡日志',
  initForm: {},
  refresh: () => $table.value?.handleSearch(),
})
</script>
