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
      :scroll-x="2500"
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
      <MeQueryItem label="宝石排序">
        <n-select
          v-model:value="queryItems.balanceSort"
          clearable
          :options="[
            { label: '宝石降序', value: 1 },
            { label: '宝石升序', value: 2 },
          ]"
        />
      </MeQueryItem>

      <MeQueryItem label="用户状态">
        <n-select
          v-model:value="queryItems.status"
          clearable
          :options="[
            { label: '启用', value: 1 },
            { label: '停用', value: 0 },
          ]"
        />
      </MeQueryItem>
      <MeQueryItem label="认证状态">
        <n-select
          v-model:value="queryItems.cert"
          clearable
          :options="[
            { label: '已认证', value: 1 },
            { label: '未认证', value: 0 },
          ]"
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
        <n-form-item v-if="['add', 'setRole'].includes(modalAction)" label="会员" path="roleIds">
          <n-select
            v-model:value="modalForm.roleIds"
            :options="roles"
            label-field="name"
            value-field="id"
            clearable
            filterable
            multiple
          />
        </n-form-item>
        <n-form-item
          label="游戏分佣比例%"
          path="nickname"
          :rule="{
            required: true,
            message: '请输入游戏分佣比例',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input
            v-model:value="modalForm.nickname"
            :disabled="['cert', 'card', 'balance'].includes(modalAction)"
          />
        </n-form-item>

        <n-form-item v-if="['add', 'edit'].includes(modalAction)" label="支付宝收款码">
          <CustomUpload v-model:value="modalForm.avatar"></CustomUpload>
        </n-form-item>

        <n-form-item v-if="['add', 'edit'].includes(modalAction)" label="微信收款码">
          <CustomUpload v-model:value="modalForm.avatar"></CustomUpload>
        </n-form-item>
        <n-form-item label="状态" path="enable">
          <n-switch v-model:value="modalForm.enable">
            <template #checked>显示</template>
            <template #unchecked>隐藏</template>
          </n-switch>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal, CustomUpload } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'StoreList' })

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
    title: '昵称',
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
  { title: '手机号', key: 'mobile', width: 150, ellipsis: { tooltip: true } },
  /*  {
      title: '角色',
      key: 'roles',
      width: 200,
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
    {
      title: '性别',
      key: 'gender',
      width: 80,
      render: ({ gender }) => genders.find((item) => gender === item.value)?.label ?? '',
    },*/
  { title: '余额', key: 'balance', width: 150, ellipsis: { tooltip: true } },
  { title: '冻结宝石', key: 'frezon_balance', width: 150, ellipsis: { tooltip: true } },
  { title: '微信', key: 'wechat', width: 150, ellipsis: { tooltip: true } },
  { title: 'QQ', key: 'qq', width: 150, ellipsis: { tooltip: true } },
  { title: '分佣比例', key: 'rate', width: 150 },
  { title: '允许赠送', key: 'is_give', width: 50 },
  {
    title: '在线',
    key: 'online',
    width: 50,
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
    title: '登陆状态',
    key: 'status',
    width: 120,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: row.enable,
          loading: !!row.enableLoading,
          onUpdateValue: () => handleEnable(row),
        },
        {
          checked: () => '允许',
          unchecked: () => '禁止',
        }
      ),
  },
  {
    title: '注册时间',
    key: 'reg_date',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row['reg_date']))
    },
  },
  {
    title: '编辑时间',
    key: 'edit_date',
    width: 180,
    render(row) {
      return h('span', formatDateTime(row['edit_date']))
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
  name: '店长',
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
