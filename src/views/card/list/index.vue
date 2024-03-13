<template>
  <CommonPage>
    <template #action>
      <n-button type="primary" @click="handleAdd()">
        <i class="i-material-symbols:add mr-4 text-18" />
        创建卡牌
      </n-button>
    </template>

    <MeCrud ref="$table" v-model:query-items="queryItems" :columns="columns" :get-data="api.read">
      <MeQueryItem label="上架状态">
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
          label="封面"
          path="poster"
          :rule="{
            required: true,
            message: '请上传封面',
            trigger: ['input', 'blur'],
          }"
        >
          <CustomUpload
            v-if="['add', 'edit'].includes(modalAction)"
            :value="modalForm.poster"
          ></CustomUpload>
        </n-form-item>
        <n-form-item
          label="标题"
          path="title"
          :rule="{
            required: true,
            message: '请输入标题',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.title" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item
          label="价格"
          path="price"
          :rule="{
            required: true,
            message: '请输入价格',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.price" :disabled="modalAction !== 'add'" />
        </n-form-item>
        <n-form-item
          label="类型"
          path="type"
          :rule="{
            required: true,
            message: '请选择类型',
            trigger: ['change'],
          }"
        >
          <n-radio-group v-model:value="modalForm.type" name="type">
            <n-space>
              <n-radio value="1">闪卡</n-radio>
              <n-radio value="0">商品卡</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="发行量"
          path="mobile"
          :rule="{
            required: true,
            message: '请输入发行量',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.mobile" :disabled="['edit'].includes(modalAction)" />
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="有效期"
          path="mobile"
          :rule="{
            required: true,
            message: '请输入有效期',
            trigger: ['input', 'blur'],
          }"
        >
          <n-select
            v-model:value="modalForm.mobile"
            clearable
            :disabled="['edit'].includes(modalAction)"
            :options="[
              { label: '永久', value: '0' },
              { label: '月卡', value: '1' },
              { label: '季卡', value: '3' },
              { label: '年卡', value: '12' },
            ]"
          />
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="日产量"
          path="mobile"
          :rule="{
            required: true,
            message: '请输入日产量',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.mobile" />
        </n-form-item>
        <n-form-item
          label="排序"
          path="sort"
          :rule="{
            required: true,
            message: '请输入排序',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.sort" :disabled="['edit'].includes(modalAction)" />
        </n-form-item>

        <n-form-item v-if="modalAction === 'add'" label="状态" path="status">
          <n-switch v-model:value="modalForm.status" checked-value="1" unchecked-value="0">
            <template #checked>启用</template>
            <template #unchecked>停用</template>
          </n-switch>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NButton, NSwitch, NImage } from 'naive-ui'
import { formatDateTime } from '@/utils'
import { MeCrud, MeQueryItem, MeModal, CustomUpload } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'CardList' })

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
    title: '封面',
    width: 80,
    render: ({ poster }) =>
      h(NImage, {
        height: '30',
        src: poster,
      }),
  },
  {
    title: '标题',
    key: 'title',
  },
  { title: '价格', key: 'price' },
  { title: '发行量', key: 'balance' },
  { title: '库存', key: 'frezon_balance' },
  { title: '流通量', key: 'wechat' },
  { title: '日产', key: 'wechat' },
  {
    title: '上架状态',
    key: 'status',
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
    title: '创建时间',
    key: 'reg_date',
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
  name: '卡牌',
  initForm: { type: '1', sort: 0, status: '1' },
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
