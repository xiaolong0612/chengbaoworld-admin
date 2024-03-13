<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建新用户
      </n-button>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="关键词搜索">
        <n-input
          v-model:value="queryItems.nickname"
          type="text"
          placeholder="请输入 昵称 / 账号 / ID"
          clearable
        />
      </MeQueryItem>
    </MeCrud>

    <MeModal ref="modalRef" width="520px"></MeModal>
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
  { title: '姓名', key: 'mobile', ellipsis: { tooltip: true } },
  { title: '身份证号码', key: 'mobile', ellipsis: { tooltip: true } },
  {
    title: '是否人脸',
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
    title: '状态',
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
    title: '审核方式',
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
    title: '创建时间',
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
            default: () => '通过',
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
            default: () => '关联账户',
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
            icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
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
