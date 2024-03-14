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
      :scroll-x="2900"
      :columns="columns"
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
      <MeQueryItem label="宝石数量">
        <n-select
          v-model:value="queryItems.balanceSort"
          clearable
          :options="[
            { label: '宝石降序', value: 1 },
            { label: '宝石升序', value: 2 },
          ]"
        />
      </MeQueryItem>
      <MeQueryItem label="城堡数量">
        <n-select
          v-model:value="queryItems.mineSort"
          clearable
          :options="[
            { label: '城堡降序', value: 1 },
            { label: '城堡升序', value: 2 },
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

      <MeQueryItem label="允许登陆">
        <n-select
          v-model:value="queryItems.status"
          clearable
          :options="[
            { label: '允许', value: 1 },
            { label: '禁止', value: 0 },
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
        :label-width="100"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="头像"
          path="avatar"
          :rule="{
            required: true,
            message: '请上传头像',
            trigger: ['input', 'blur'],
          }"
        >
          <CustomUpload v-model:value="modalForm.avatar"></CustomUpload>
        </n-form-item>
        <n-form-item
          label="用户名"
          path="nickname"
          :rule="{
            required: true,
            message: '请输入用户名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input
            v-model:value="modalForm.nickname"
            :disabled="['cert', 'card', 'balance'].includes(modalAction)"
          />
        </n-form-item>
        <n-form-item v-if="['balance'].includes(modalAction)" label="变动类型">
          <n-radio-group v-model:value="value" name="radiogroup">
            <n-space>
              <n-radio value="1">增加</n-radio>
              <n-radio value="0">减少</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item
          v-if="['balance'].includes(modalAction)"
          label="变动宝石"
          path="mobile"
          :rule="{
            required: true,
            message: '请输入变动宝石数量',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.mobile">
            <template #suffix>个宝石</template>
          </n-input>
        </n-form-item>
        <n-form-item v-if="['balance'].includes(modalAction)" label="宝石数量">
          <n-input v-model:value="modalForm.balance" disabled>
            <template #suffix>个宝石</template>
          </n-input>
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="手机号"
          path="mobile"
          :rule="{
            required: true,
            message: '请输入手机号',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.mobile" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item
          v-if="['card'].includes(modalAction)"
          label="空投卡牌"
          path="mobile"
          :rule="{
            required: true,
            message: '请选择空投卡牌',
            trigger: ['input', 'blur'],
          }"
        >
          <n-select
            v-model:value="value"
            filterable
            placeholder="可搜索"
            :options="options"
            :loading="loading"
            clearable
            remote
            @search="handleSearch"
          />
        </n-form-item>
        <n-form-item
          v-if="['card'].includes(modalAction)"
          label="空投数量"
          path="mobile"
          :rule="{
            required: true,
            message: '请输入空投数量',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.mobile" />
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="上级账号"
          path="ucode"
          :rule="{
            required: true,
            message: '请输入手机号',
            trigger: ['input', 'blur'],
          }"
        >
          <n-select
            v-model:value="modalForm.ucode"
            filterable
            placeholder="可搜索"
            :options="userOptions"
            :loading="userLoading"
            label-field="nickname"
            value-field="ucode"
            clearable
            remote
            @search="userHandleSearch"
          />
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="登陆密码"
          path="password"
          :rule="{
            required: ['add'].includes(modalAction),
            message: '请输入密码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.password" placeholder="为空不修改" />
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="支付密码"
          path="payPassword"
          :rule="{
            required: ['add'].includes(modalAction),
            message: '请输入密码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.payPassword" placeholder="为空不修改" />
        </n-form-item>
        <n-form-item v-if="['edit'].includes(modalAction)" label="QQ">
          <n-input v-model:value="modalForm.qqName" />
        </n-form-item>
        <n-form-item v-if="['edit'].includes(modalAction)" label="微信">
          <n-input v-model:value="modalForm.wxName" />
        </n-form-item>
        <n-form-item v-if="modalAction === 'add'" label="允许登陆">
          <n-switch v-model:value="modalForm.status"
                    checked-value="0" unchecked-value="1">
            <template #checked>启用</template>
            <template #unchecked>停用</template>
          </n-switch>
        </n-form-item>
        <n-form-item v-if="modalAction === 'add'" label="允许转赠">
          <n-switch v-model:value="modalForm.isGive"
                    checked-value="0" unchecked-value="1">
            <template #checked>启用</template>
            <template #unchecked>停用</template>
          </n-switch>
        </n-form-item>
        <n-form-item v-if="['add', 'edit'].includes(modalAction)" label="备注">
          <n-input v-model:value="modalForm.remark" type="textarea" />
        </n-form-item>
        <n-form-item
          v-if="['cert'].includes(modalAction)"
          label="真是姓名"
          path=""
          :rule="{
            required: true,
            message: '请输入真实姓名',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.password" placeholder="请输入真实姓名" />
        </n-form-item>
        <n-form-item
          v-if="['cert'].includes(modalAction)"
          label="身份证号码"
          path=""
          :rule="{
            required: true,
            message: '请输入身份证号码',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.password" placeholder="请输入身份证号码" />
        </n-form-item>
      </n-form>
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
        <MeQueryItem label="邀请等级">
          <n-select
            v-model:value="queryItems.cert"
            clearable
            :options="[
              { label: '直邀', value: 0 },
              { label: '间邀', value: 1 },
              { label: '3', value: 2 },
              { label: '4', value: 3 },
              { label: '5', value: 4 },
              { label: '6', value: 5 },
              { label: '7', value: 6 },
              { label: '8', value: 7 },
              { label: '9', value: 8 },
            ]"
          />
        </MeQueryItem>
      </MeCrud>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NAvatar, NButton, NSwitch, NTag, NSpace } from 'naive-ui'
import { formatDateTime, getQueryObject } from '@/utils'
import { MeCrud, MeQueryItem, MeModal, CustomUpload } from '@/components'
import { useCrud, useModal } from '@/composables'
import api from './api'

defineOptions({ name: 'UserList' })

const urlQuery = getQueryObject()
const userOptions = ref();
const userLoading = ref(false);
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
    title: '头像',
    width: 60,
    align: 'center',
    render: ({ avatar }) =>
      h(NAvatar, {
        size: 'medium',
        src: avatar,
      }),
  },
  {
    title: '昵称',
    render: ({ nickname }) => h('span', nickname),
  },
  { title: '手机号', key: 'mobile' },
  {
    title: '宝石数量',
    width: 150,
    render: (row) => {
      if (urlQuery.baoshi) {
        return h(
          NButton,
          {
            quaternary: true,
            type: 'info',
            onClick: () => handleOpen({ action: 'balance', title: '宝石设置', row, onOk: onSave }),
          },
          row.balance
        )
      } else {
        return h('span', row.balance)
      }
    },
  },
  {
    title: '冻结宝石',
    width: 150,
    render: ({ frezon_balance }) =>
      h(
        NButton,
        {
          quaternary: true,
          type: 'info',
        },
        frezon_balance
      ),
  },
  { title: '邀请码', key: 'ucode', width: 150 },
  {
    title: '店长信息',
    width: 120,
    render: (row) =>
      h(
        NTag,
        {
          type: row.online == '0' ? 'info' : 'success',
        },
        row.online == '0' ? '一级店长' : '二级店长'
      ),
  },
  {
    title: '城堡数量',
    width: 150,
    render: ({ frezon_balance }) =>
      h(
        NButton,
        {
          quaternary: true,
          type: 'info',
        },
        frezon_balance
      ),
  },
  {
    title: '卡牌数量',
    width: 150,
    render: ({ frezon_balance }) =>
      h(
        NButton,
        {
          quaternary: true,
          type: 'info',
        },
        frezon_balance
      ),
  },
  { title: '分佣比例', key: 'rate', width: 100 },
  {
    title: '实名信息',
    render: (row) =>
      h(
        NButton,
        {
          quaternary: true,
          type: 'info',
          onClick: () => handleOpen({ action: 'cert', title: '实名信息', row, onOk: onSave }),
        },
        '查看'
      ),
  },
  {
    title: '在线状态',
    width: 120,
    render: (row) =>
      h(
        NTag,
        {
          type: row.online == '0' ? '' : 'success',
        },
        row.online == '0' ? '离线' : '在线'
      ),
  },
  {
    title: '允许登陆',
    key: 'status',
    width: 120,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          checkedValue: '1',
          uncheckedValue: '0',
          value: row.status,
          loading: !!row.statusLoading,
          onUpdateValue: () => handleEnable(row),
        },
        {
          checked: () => '允许',
          unchecked: () => '禁止',
        }
      ),
  },
  {
    title: '允许转赠',
    key: 'is_give',
    width: 120,
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          checkedValue: '1',
          uncheckedValue: '0',
          value: row.isGive,
          loading: !!row.isGiveLoading,
          onUpdateValue: () => handleEnable(row),
        },
        {
          checked: () => '允许',
          unchecked: () => '禁止',
        }
      ),
  },
  { title: '上级账号', key: 'qqName', width: 150 },
  { title: '微信', key: 'wxName', width: 150 },
  { title: 'QQ', key: 'qqName', width: 150 },
  { title: '注册IP', key: 'regIp', width: 130 },
  {
    title: '注册时间',
    key: 'regDate',
    width: 120,
    render(row) {
      return h('span', formatDateTime(row['regDate']))
    },
  },
  {
    title: '编辑时间',
    key: 'editDate',
    width: 120,
    render(row) {
      return h('span', formatDateTime(row['editDate']))
    },
  },
  {
    title: '注销状态',
    render: (row) =>
      h(
        NTag,
        {
          type: row.delFlag == '0' ? 'success' : '',
        },
        row.delFlag == '0' ? '未注销' : '已注销'
      ),
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    width: 220,
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
              type: 'info',
              secondary: true,
              onClick: () => handleOpen({ action: 'card', title: '空投', row, onOk: onSave }),
            },
            {
              default: () => '空投',
              icon: () => h('i', { class: 'i-fe:credit-card text-14' }),
            }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              onClick: () =>
                modalTeam.value?.open({
                  action: 'team',
                  title: '团队信息',
                  row,
                  showFooter: false,
                }),
            },
            {
              default: () => '团队信息',
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

function userHandleSearch(query){
  if(!query.length){
    userOptions.value = [];
    return
  }
  userLoading.value = true;
  api.fetchData({pageNum:1,pageSize:30,keyword:query}).then(res=>{

    userOptions.value = res.rows;
    userLoading.value = false;
  })
}

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

const [modalTeam] = useModal()

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
  initForm: { status:'0',isGive:'0' },
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})

function onSave() {
  if (modalAction.value === 'cert') {
    return handleSave({
      api: () => api.update(modalForm.value),
      cb: () => $message.success('实名信息修改成功'),
    })
  } else if (modalAction.value === 'card') {
    // return handleSave({
    //   api: () => api.resetPwd(modalForm.value.id, modalForm.value),
    //   cb: () => $message.success('密码重置成功'),
    // })
  }
  handleSave()
}

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
</script>
