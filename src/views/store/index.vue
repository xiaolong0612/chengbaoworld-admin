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
      :scroll-x="1800"
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
        :label-width="120"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          label="用户名"
          path="uid"

        >
          <n-select
            v-model:value="modalForm.uid"
            filterable
            type="text"
            placeholder="请选择用户"
            :options="userOptions"
            :loading="userLoading"
            label-field="nickname"
            value-field="id"
            clearable
            remote
            @search="userHandleSearch"
          />
        </n-form-item>



        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="邮箱"
          path="email"
          :rule="{
            required: true,
            message: '请输入邮箱',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.email" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="银行账号"
          path="bankNumber"
          :rule="{
            required: true,
            message: '请输入银行账号',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.bankNumber" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="微信收款二维码"
          path="wechatPayCode"
          :rule="{
            required: true,
            message: '请输入微信收款二维码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.wechatPayCode" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="支付宝收款二维码"
          path="alipayPayCode"
          :rule="{
            required: true,
            message: '请输入支付宝收款二维码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.alipayPayCode" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="收款二维码"
          path="paymentCode"
          :rule="{
            required: true,
            message: '请输入收款二维码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.paymentCode" :disabled="modalAction !== 'add'" />
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
    <MeModal ref="modalTeam" width="980px">
      <MeCrud
        ref="$table"
        v-model:query-items="queryItems"
        :scroll-x="780"
        :columns="columnsTeam"
        :get-data="api.fetchData"
      >
        <MeQueryItem label="关键词搜索">
          <n-input
            v-model:value="queryItems.keyword"
            type="text"
            placeholder="请输入 昵称 / 账号 / ID"
            clearable
          />
        </MeQueryItem>

      </MeCrud>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag, NSpace } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal } from '@/components'
import { useCrud, useModal } from '@/composables'
import api from './api'

const [modalTeam] = useModal()

defineOptions({ name: 'UserMgt' })

const userOptions = ref()
const userLoading = ref(false)

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})

const roles = ref([])

const columns = [
  { title: '用户名', key: 'username', width: 120, ellipsis: { tooltip: true } },
  { title: '手机号', key: 'tel', width: 120, ellipsis: { tooltip: true } },
  { title: '店长等级', key: 'level', width: 80 },
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
    align: 'center',
    fixed: 'right',
    width: 250,
    render: (row) =>
      h(
        NSpace,
        {
          justify: 'center',
        },
        [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              secondary: true,
              onClick: () => handleEdit(row),
            },
            {
              default: () => '查看详情',
              icon: () => h('i', { class: 'i-carbon:user-role text-14' }),
            }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => handleDelete(row.id),
            },
            {
              default: () => '删除',
              icon: () => h('i', { class: 'i-material-symbols:delete-outline text-14' }),
            }
          ),
        ]
      ),
  },
]

// 团队table
const columnsTeam = [
  {
    title: '账号',
    render: ({ mobile }) => h('span', mobile),
  },
  { title: '邀请等级', key: 'level' },
  { title: '宝石数量', key: 'balance' },
  { title: '城堡数量', key: 'regDate' },
  { title: '卡牌数量', key: 'regDate' },
  { title: '注册时间', key: 'regDate' },
]



function userHandleSearch(query) {
  if (!query.length) {
    userOptions.value = []
    return
  }
  userLoading.value = true
  api.getUserList({ pageNum: 1, pageSize: 30, keyword: query }).then((res) => {

    userOptions.value = res.rows
    userLoading.value = false
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
  name: '店长',
  initForm: { status: '0' },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})






function onSave() {
  if (modalAction.value === 'add') {

    return handleSave({

      api: () => {
        console.log(111)
           let username = userOptions.value.find(val => {
             return val.id === modalForm.value.uid
           }).username;
        return api.create({...modalForm.value,username:username})
      },
      cb: () => $message.success('分配成功'),
    })
  }

}
</script>
