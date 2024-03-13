<template>
  <AppPage show-footer>
    <n-form
      ref="formRef"
      label-placement="left"
      label-width="130"
      require-mark-placement="right-hanging"
    >
      <n-card :bordered="false" title="转赠配置" content-style="padding-bottom: 0;">
        <n-form-item label="转赠手续费%" path="inputValue">
          <n-input placeholder="请输入二级分佣比例" />
        </n-form-item>
        <n-form-item label="是否需要密码" path="inputValue">
          <n-switch>
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
        </n-form-item>
      </n-card>
      <n-card :bordered="false" title="游戏返佣配置" content-style="padding-bottom: 0;">
        <n-form-item label="下级逃生%" path="inputValue">
          <n-input placeholder="请输入" />
        </n-form-item>
        <n-form-item label="游戏总返利%" path="inputValue">
          <n-input placeholder="请输入" />
        </n-form-item>
        <n-form-item label="一级店长游戏返利%" path="inputValue">
          <n-input placeholder="请输入" />
        </n-form-item>
        <n-form-item label="二级店长游戏返利%" path="inputValue">
          <n-input placeholder="请输入" />
        </n-form-item>
        <n-form-item label="玩家游戏返利%" path="inputValue">
          <n-input placeholder="请输入" />
        </n-form-item>
      </n-card>
      <n-card :bordered="false" title="店长配置" content-style="padding-bottom: 0;">
        <n-form-item label="店长质押" path="inputValue">
          <n-input placeholder="请输入质押宝石数量" />
        </n-form-item>
      </n-card>
      <n-card :bordered="false" title="开放日期" content-style="padding-bottom: 0;">
        <n-form-item label="平台开放日期" path="inputValue">
          <n-input placeholder="" />
        </n-form-item>
        <n-form-item label=" ">
          <n-space>
            <n-button strong secondary type="primary">提交</n-button>
            <n-button strong secondary>重置</n-button>
          </n-space>
        </n-form-item>
      </n-card>
    </n-form>
  </AppPage>
</template>

<script setup></script>
