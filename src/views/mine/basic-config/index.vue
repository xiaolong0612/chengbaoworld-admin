<template>
  <AppPage>
    <n-grid class="mt-12" cols="2" :x-gap="12" :y-gap="8" item-responsive responsive="screen">
      <n-grid-item span="2 m:2 l:1">
        <n-card title="基础配置">
          <n-form
            ref="formRef"
            label-placement="left"
            label-width="130"
            require-mark-placement="right-hanging"
          >
            <n-form-item label="注册赠送基础矿" path="inputValue">
              <n-switch v-model:value="active">
                <template #checked>是</template>
                <template #unchecked>否</template>
              </n-switch>
            </n-form-item>
            <n-form-item label="一级分佣" path="inputValue">
              <n-input placeholder="请输入一级分佣比例" />
            </n-form-item>
            <n-form-item label="二级分佣" path="inputValue">
              <n-input placeholder="请输入二级分佣比例" />
            </n-form-item>
            <n-form-item label="三级分佣" path="inputValue">
              <n-input placeholder="请输入三级分佣比例" />
            </n-form-item>
            <n-form-item label=" ">
              <n-space>
                <n-button strong secondary type="primary">提交</n-button>
                <n-button strong secondary>重置</n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </n-card>
      </n-grid-item>
      <n-grid-item span="2 m:2 l:1">
        <n-card title="卡牌日产">
          <n-form
            ref="formRef"
            label-placement="left"
            label-width="130"
            require-mark-placement="right-hanging"
          >
            <n-form-item label="日产模式">
              <n-radio-group v-model:value="value" name="radiogroup">
                <n-space>
                  <n-radio value="1">卡牌数量</n-radio>
                  <n-radio value="0">单卡日产</n-radio>
                  <n-radio value="2">质押半个月</n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="日产总量(<3)" path="inputValue">
              <n-input placeholder="请输入日产量" />
            </n-form-item>
            <n-form-item label="日产总量(<5)" path="inputValue">
              <n-input placeholder="请输入日产量" />
            </n-form-item>
            <n-form-item label="日产总量(<7)" path="inputValue">
              <n-input placeholder="请输入日产量" />
            </n-form-item>
            <n-form-item label="日产总量(<10)" path="inputValue">
              <n-input placeholder="请输入日产量" />
            </n-form-item>
            <n-form-item label="日产总量(<20)" path="inputValue">
              <n-input placeholder="请输入日产量" />
            </n-form-item>
            <n-form-item label="日产总量(<50)" path="inputValue">
              <n-input placeholder="请输入日产量" />
            </n-form-item>
            <n-form-item label="日产总量(<100)" path="inputValue">
              <n-input placeholder="请输入日产量" />
            </n-form-item>
            <n-form-item label="日产总量(>100)" path="inputValue">
              <n-input placeholder="请输入日产量" />
            </n-form-item>
            <n-form-item label=" ">
              <n-space>
                <n-button strong secondary type="primary">提交</n-button>
                <n-button strong secondary>重置</n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </n-card>
      </n-grid-item>
    </n-grid>
  </AppPage>
</template>

<script setup></script>
