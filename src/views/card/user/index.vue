<template>
  <CommonPage>
    <MeCrud ref="$table" v-model:query-items="queryItems" :columns="columns" :get-data="api.read">
      <MeQueryItem label="会员账号">
        <n-input
          v-model:value="queryItems.mobile"
          type="text"
          placeholder="请输入 账号 / ID"
          clearable
        />
      </MeQueryItem>
      <MeQueryItem label="卡牌类型">
        <n-select
          v-model:value="queryItems.balanceSort"
          clearable
          :options="[
            { label: '闪卡', value: 1 },
            { label: '商品卡', value: 2 },
          ]"
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
      <MeQueryItem label="卡牌数量">
        <n-select
          v-model:value="queryItems.cardSort"
          clearable
          :options="[
            { label: '卡牌降序', value: 1 },
            { label: '卡牌升序', value: 2 },
          ]"
        />
      </MeQueryItem>
    </MeCrud>

    <MeModal ref="modalRef" width="520px"></MeModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NTag } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
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
    title: '卡牌名称',
    key: 'title',
    render: ({ title }) => h('span', title),
  },
  {
    title: '会员信息',
    key: 'mobile',
    render: ({ title }) => [h('p', '昵称'), h('p', '账号')],
  },
  {
    title: '卡牌类型',
    key: 'roles',
    ellipsis: { tooltip: true },
    render: ({ roles }) => {
      if (roles?.length) {
        return roles.map((item, index) =>
          h(
            NTag,
            { type: 'success', style: index > 0 ? 'margin-left: 8px;' : '' },
            { default: () => item.name }
          )
        )
      }
      return '暂无角色'
    },
  },
  { title: '闪卡数量', key: 'balance' },
  { title: '矿工数量', key: 'balance' },
  { title: '商品卡数量', key: 'balance' },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    align: 'center',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            secondary: true,
            onClick: () => handleEdit(row),
          },
          {
            default: () => '编辑',
            icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
          }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            onClick: () => handleOpen({ action: 'reset', title: '重置密码', row, onOk: onSave }),
          },
          {
            default: () => '重置密码',
            /*            icon: () => h('i', { class: 'i-radix-icons:reset text-14' }),*/
          }
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: () => handleDelete(row.id),
          },
          {
            default: () => '删除',
            /*            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),*/
          }
        ),
      ]
    },
  },
]

async function handleEnable(row) {
  row.enableLoading = true
  try {
    await api.update({ id: row.id, enable: !row.enable })
    row.enableLoading = false
    $message.success('操作成功')
    $table.value?.handleSearch()
  } catch (error) {
    row.enableLoading = false
  }
}

const { modalRef, modalForm, modalAction, handleDelete, handleOpen, handleEdit, handleSave } =
  useCrud({
    name: '卡牌',
    initForm: { enable: true },
    doCreate: api.create,
    doDelete: api.delete,
    doUpdate: api.update,
    refresh: () => $table.value?.handleSearch(),
  })

function onSave() {
  if (modalAction.value === 'setRole') {
    return handleSave({
      api: () => api.update(modalForm.value),
      cb: () => $message.success('分配成功'),
    })
  } else if (modalAction.value === 'reset') {
    return handleSave({
      api: () => api.resetPwd(modalForm.value.id, modalForm.value),
      cb: () => $message.success('密码重置成功'),
    })
  }
  handleSave()
}
</script>
