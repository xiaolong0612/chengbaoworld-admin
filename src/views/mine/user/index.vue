<template>
  <CommonPage>
    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="会员账号">
        <n-input
          v-model:value="queryItems.nickname"
          type="text"
          placeholder="请输入 账号 / ID"
          clearable
        />
      </MeQueryItem>
      <MeQueryItem label="矿场名称">
        <n-select
          v-model:value="queryItems.balanceSort"
          clearable
          :options="[
            { label: '矿1', value: 1 },
            { label: '矿2', value: 2 },
          ]"
        />
      </MeQueryItem>
      <MeQueryItem label="矿场状态">
        <n-select
          v-model:value="queryItems.balanceSort"
          clearable
          :options="[
            { label: '使用中', value: 1 },
            { label: '手动停产', value: 2 },
            { label: '已过期', value: 3 },
          ]"
        />
      </MeQueryItem>
    </MeCrud>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal, CustomUpload } from '@/components'
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
    title: '矿场名称',
    key: 'nickname',
    width: 150,
    render: ({ avatar, nickname }) => [
      h(NAvatar, {
        size: 'medium',
        src: avatar,
      }),
      h('span', nickname),
    ],
  },
  { title: '会员账号', key: 'mobile' },
  { title: '总产出', key: 'balance' },
  { title: '已产出', key: 'frezon_balance' },
  { title: '一级分佣', key: 'wechat' },
  { title: '二级分佣', key: 'qq' },
  { title: '三级分佣', key: 'rate' },
  { title: '有效期', key: 'is_give' },
  {
    title: '矿场状态',
    key: 'online',
    render: (row) =>
      h(
        NTag,
        {
          type: !row.online ? '' : 'success',
        },
        !row.online ? '离线' : '在线'
      ),
  },
  {
    title: '开启时间',
    key: 'reg_date',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row['reg_date']))
    },
  },
  {
    title: '暂停时间',
    key: 'reg_date',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row['reg_date']))
    },
  },
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
        /*        h(
                  NButton,
                  {
                    size: 'small',
                    type: 'primary',
                    secondary: true,
                    onClick: () => handleOpenRolesSet(row),
                  },
                  {
                    default: () => '分配角色',
                    icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
                  }
                ),*/
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

function handleOpenRolesSet(row) {
  const roleIds = row.roles.map((item) => item.id)
  handleOpen({
    action: 'setRole',
    title: '分配角色',
    row: { id: row.id, username: row.username, roleIds },
    onOk: onSave,
  })
}

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleAdd,
  handleDelete,
  handleOpen,
  handleEdit,
  handleSave,
} = useCrud({
  name: '用户',
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
