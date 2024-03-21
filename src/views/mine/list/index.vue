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
      :scroll-x="1800"
      :columns="columns"
      :get-data="api.read"
    >
      <MeQueryItem label="矿场名称" :label-width="80">
        <n-input
          v-model:value="queryItems.name"
          type="text"
          placeholder="请输入矿场名称"
          clearable
        />
      </MeQueryItem>
    </MeCrud>

    <MeModal ref="modalRef" width="520px">
      <n-form
        ref="modalFormRef"
        label-placement="left"
        label-align="left"
        :label-width="130"
        :model="modalForm"
        :disabled="modalAction === 'view'"
      >
        <n-form-item
          label="矿场封面图"
          path="poster"
          :rule="{
            required: true,
            message: '请上传封面图',
            trigger: ['input', 'blur'],
          }"
        >
          <CustomUpload v-model:value="modalForm.poster" />
        </n-form-item>
        <n-form-item
          label="矿场名称"
          path="name"
          :rule="{
            required: true,
            message: '请输入名称',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.name" />
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="解锁消耗材料"
          path="price"
          :rule="{
            required: true,
            message: '解锁消耗宝石',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.price" />
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="总产出"
          path="output"
          :rule="{
            required: true,
            message: '请输入总产出',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input v-model:value="modalForm.output"><template #suffix>颗宝石</template></n-input>
        </n-form-item>
        <n-form-item
          label="有效期"
          path="validityPeriod"
      
        >
          <n-input @change="changeDate"  v-if="['add','edit'].includes(modalAction)" v-model:value="modalForm.validityPeriod">
            <template #suffix>天</template>
          </n-input>
        </n-form-item>
        <n-form-item label="日产">
          <n-input v-model:value="day_output" disabled>
            <template #suffix>颗宝石</template>
          </n-input>
        </n-form-item>
        <n-form-item
          v-if="['add', 'edit'].includes(modalAction)"
          label="最大开启数量"
          path="max"
          :rule="{
            required: true,
            message: '最大开启数量',
            trigger: ['input', 'blur'],
          }"
        >
          <n-input  v-model:value="modalForm.max" />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-switch v-model:value="modalForm.status" checked-value="1" unchecked-value="0">
            <template #checked>上架</template>
            <template #unchecked>下架</template>
          </n-switch>
        </n-form-item>
      </n-form>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { NImage, NButton, NSwitch } from 'naive-ui'
import { formatDateTime, isNumber } from '@/utils'
import { MeCrud, MeModal, CustomUpload, MeQueryItem } from '@/components'
import { useCrud } from '@/composables'
import api from './api'

defineOptions({ name: 'UserMgt' })

const $table = ref(null)

onMounted(() => {
  $table.value?.handleSearch()
})


const changeDate = (text)=>{
  modalForm.value.validityPeriod = Number(text);
}

const columns = [
  {
    title: '矿场封面',
    key: 'poster',
    render: ({ poster }) =>
      h(NImage, {
        height: '30',
        src: poster,
      }),
  },
  { title: '矿场名称', key: 'name' },
  { title: '解锁消耗宝石', key: 'price' },
  { title: '最大开启数量', key: 'max' },
  {
    title: '日产',
    key: 'singleOutput',
    ellipsis: { tooltip: true },

  },
  {
    title: '总产出',
    key: 'output',
    ellipsis: { tooltip: true },
    render: (row) => {
      return row.output === 0 ? '无限制' : row.output
    },
  },
  {
    title: '状态',
    key: 'status',
    render: (row) =>
      h(
        NSwitch,
        {
          size: 'small',
          rubberBand: false,
          value: row.status === '1',
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
    render(row) {
      return h('span', formatDateTime(row['reg_date']))
    },
  },
  {
    title: '操作',
    key: 'actions',
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
            onClick: () => handleEdit({...row,price:row.price.toString(),output:row.price.toString(),
            max:row.max.toString()
            }),
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
    await api.updateStatus({ id: row.id, status: row.status === '1'?'0':'1' })
    row.enableLoading = false
    $message.success('操作成功')
    $table.value?.handleSearch()
  } catch (error) {
    row.enableLoading = false
  }
}
const queryItems = ref({})
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

const day_output = computed(() => {
  let val = modalForm.value.output / modalForm.value.validityPeriod
  return val > 0 ? val : 0
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
