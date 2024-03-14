

<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建新店长
      </n-button>
    </template>

    <MeCrud
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1700"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="用户名" :label-width="50">
        <n-input
          v-model:value="queryItems.username"
          type="text"
          placeholder="请输入用户名"
          clearable
        />
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
          label="用户名"
          path="userName"
          :rule="{
            required: true,
            message: '请输入用户名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-select
            v-model:value="queryItems.username"
            filterable
            type="text"
            placeholder="请选择用户"
            :options="userOptions"
            :loading="userLoading"
            label-field="nickname"
            value-field=""
            clearable
            remote
            @search="userHandleSearch"
          />
        </n-form-item>
        <n-form-item
          v-if="['add', 'reset'].includes(modalAction)"
          :label="modalAction === 'reset' ? '重置密码' : '初始密码'"
          path="password"
          :rule="{
            required: true,
            message: '请输入密码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.password" />
        </n-form-item>

        <n-form-item v-if="['add', 'setRole'].includes(modalAction)" label="角色" path="roleIds">
          <n-select
            v-model:value="modalForm.roleIds"
            :options="roles"
            label-field="roleName"
            value-field="roleId"
            clearable
            filterable
            multiple
          />
        </n-form-item>
        <n-form-item v-if="modalAction === 'add'" label="状态" path="status">
          <n-switch v-model:value="modalForm.status" checked-value="0" unchecked-value="1">
            <template #checked>启用</template>
            <template #unchecked>停用</template>
          </n-switch>
        </n-form-item>
      </n-form>
      <!--      <n-alert v-if="modalAction === 'add'" type="warning" closable>
        详细信息需由用户本人补充修改
      </n-alert>-->
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'UserMgt' })

const userOptions = ref();
const userLoading = ref(false);

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

/*const genders = [
  { label: '男', value: '0' },
  { label: '女', value: '1' },
]*/
const roles = ref([])

const columns = [

  { title: '用户名', key: 'username', width: 120, ellipsis: { tooltip: true } },
  { title: '手机号', key: 'tel', width: 120, ellipsis: { tooltip: true } },
  { title: '邮箱', key: 'email', width: 120, ellipsis: { tooltip: true } },
  { title: '银行卡号', key: 'bankNumber', width: 150, ellipsis: { tooltip: true } },
  { title: '微信收款码URl', key: 'wechatPayCode', width: 150, ellipsis: { tooltip: true } },
  { title: '支付宝URl', key: 'alipayPayCode', width: 150, ellipsis: { tooltip: true } },
  { title: '收款码URl', key: 'paymentCode', width: 150, ellipsis: { tooltip: true } },
  { title: '地址', key: 'address', width: 150, ellipsis: { tooltip: true } },
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
          value: row.status === '0',
          loading: !!row.enableLoading,
          onUpdateValue: () => handleEnable(row),
        },
        {
          checked: () => '显示',
          unchecked: () => '未显示',
        }
      ),
  },
  {
    title: '创建时间',
    key: 'createDate',
    width: 180,
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    align: 'right',
    fixed: 'right',
    hideInExcel: true,
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 12px;',
            onClick: () => handleOpen({ action: 'reset', title: '重置密码', row, onOk: onSave }),
          },
          {
            default: () => '编辑',
          }
        ),

        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: 'margin-left: 12px;',
            onClick: () => handleDelete(row.userId),
          },
          {
            default: () => '删除',
          }
        ),
      ]
    },
  },
]

function userHandleSearch(query){
  if(!query.length){
    userOptions.value = [];
    return
  }
  userLoading.value = true;
  api.getUserList({pageNum:1,pageSize:30,keyword:query}).then(res=>{
    console.log(res.rows)
    userOptions.value = res.rows;
    userLoading.value = false;
  })
}

async function handleEnable(row) {
  row.enableLoading = true
  try {
    await api.updateStatus({ userId: row.userId, status: row.status == '1' ? '0' : '1' })
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
    row: { id: row.id, userName: row.userName, roleIds },
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
  handleSave,
} = useCrud({
  name: '店长',
  initForm: { status: '0' },
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
