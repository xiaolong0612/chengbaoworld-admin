<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建新矿场
      </n-button>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1500"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="关键词搜索">
        <n-input
          v-model:value="queryItems.nickname"
          type="text"
          placeholder="矿场名称"
          clearable
        />
      </MeQueryItem>
      <MeQueryItem label="宝石排序">
        <n-select v-model:value="queryItems.balanceSort" clearable :options="[
            { label: '宝石降序', value: 1 },
            { label: '宝石升序', value: 2 },
        ]" />
      </MeQueryItem>

    </MeCrud>

    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="80"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >


        <n-form-item
          label="矿场名称"
          path="name"
          :rule="{
            required: true,
            message: '请输入名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="解锁消耗材料"
          path="price"
          :rule="{
            required: true,
            message: '解锁消耗材料',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.mobile"  />
        </n-form-item>


        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="最大可容纳人数"
          path="max"
          :rule="{
            required: true,
            message: '最大可容纳人数',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.max"  />
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="总产出"
          path="output"
          :rule="{
            required: true,
            message: '总产出',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.output"  />
        </n-form-item>
        <n-form-item v-if="modalAction === 'add'" label="状态" path="status">
          <n-switch v-model:value="modalForm.status"
                    checked-value="1"
                    unchecked-value="0"
          >
            <template #checked>上架</template>
            <template #unchecked>下架</template>
          </n-switch>
        </n-form-item>
      </n-form>

    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal,CustomUpload } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({
  balanceSort: 1
})

onMounted(() => {
  $table.value?.handleSearch()
})

const roles = ref([])
api.getAllRoles().then(({ data = [] }) => (roles.value = data))

const columns = [
  { title: '矿场名称', key: 'name', width: 100, ellipsis: { tooltip: true } },
  { title: '最大可容纳人数', key: 'max', width: 100, ellipsis: { tooltip: true } },
  { title: '日产', key: 'singleOuput', width: 100, ellipsis: { tooltip: true },
    render: (row) =>{
      return row.singleOuput*86400
    }
  },
  { title: '总产出', key: 'output', width: 50, ellipsis: { tooltip: true },
  render: (row) =>{
    return row.output === 0?"无限制":row.output
  }
  },
  { title: '解锁消耗材料', key: 'price', width: 100, ellipsis: { tooltip: true } },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: row.status==='1',
          loading: !!row.enableLoading,
          onUpdateValue: () => handleEnable(row),
        },
        {
          checked: () => '上架',
          unchecked: () => '下架',
        }
      ),
  },
  {
    title: '创建时间',
    key: 'createDate',
    width: 150,
    render(row) {
      return h('span', formatDateTime(row['reg_date']))
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 50,
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
  handleOpen,
  handleEdit,
  handleSave,
} = useCrud({
  name: '矿场',
  initForm: { status: '1' },
  doCreate: api.create,
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
