<template>
  <n-alert type="info" class="mb-16">配置实名认证</n-alert>
  <n-form
    ref="formRef"
    label-placement="left"
    label-width="130"
    require-mark-placement="right-hanging"
  >
    <n-form-item label="审核方式" path="inputValue">
      <n-select
        :options="[
          { label: '自动审核', value: 1 },
          { label: '人工审核', value: 0 },
        ]"
      />
    </n-form-item>
    <n-form-item label="App Code" path="inputValue">
      <div>
        <n-input />
        <p>
          <n-text depth="3">获取地址:</n-text>
          <a
            href="https://market.aliyun.com/products/57000002/cmapi029522.html?spm=5176.2020520132.101.4.51647218pge5L6#sku=yuncode2352200002"
            target="_blank"
          >
            https://market.aliyun.com/products/57000002/cmapi029522.html?spm=5176.2020520132.101.4.51647218pge5L6#sku=yuncode2352200002
          </a>
        </p>
      </div>
    </n-form-item>
    <n-form-item label="认证数量限制" path="inputValue">
      <n-input>
        <template #suffix>个普通会员</template>
      </n-input>
    </n-form-item>
    <n-form-item label="剩余认证数量" path="inputValue">
      <n-input disabled>
        <template #suffix>次</template>
      </n-input>
    </n-form-item>
    <n-form-item label=" ">
      <n-space>
        <n-button strong secondary type="primary">提交</n-button>
        <n-button strong secondary>重置</n-button>
      </n-space>
    </n-form-item>
  </n-form>
</template>
