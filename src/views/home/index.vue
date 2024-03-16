<template>
  <AppPage>
    <n-grid :x-gap="12" :y-gap="8" :cols="4" item-responsive responsive="screen">
      <n-grid-item span="4 s:2 m:1 l:1">
        <n-card title="在线居民" header-style="padding-bottom:0">
          <n-statistic tabular-nums class="text-right">
            <n-number-animation :from="0" :to="12039" />
            <template #suffix><span class="text-6xl">人</span></template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="4 s:2 m:1 l:1">
        <n-card title="入住居民" header-style="padding-bottom:0">
          <n-statistic tabular-nums class="text-right">
            <n-number-animation :from="0" :to="12039" />
            <template #suffix><span class="text-6xl">人</span></template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="4 s:2 m:1 l:1">
        <n-card title="开通店长" header-style="padding-bottom:0">
          <n-statistic tabular-nums class="text-right">
            <n-number-animation :from="0" :to="12039" />
            <template #suffix><span class="text-6xl">人</span></template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="4 s:2 m:1 l:1">
        <n-card title="实名居民" header-style="padding-bottom:0">
          <n-statistic tabular-nums class="text-right">
            <n-number-animation :from="0" :to="12039" />
            <template #suffix><span class="text-6xl">人</span></template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="4 s:2 m:1 l:1">
        <n-card title="共产宝石" header-style="padding-bottom:0">
          <n-statistic tabular-nums class="text-right">
            <n-number-animation :from="0" :to="12039" />
            <template #suffix><span class="text-6xl">颗</span></template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="4 s:2 m:1 l:1">
        <n-card title="销毁宝石" header-style="padding-bottom:0">
          <n-statistic tabular-nums class="text-right">
            <n-number-animation :from="0" :to="12039" />
            <template #suffix><span class="text-6xl">颗</span></template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="4 s:2 m:1 l:1">
        <n-card title="累计宝石转赠" header-style="padding-bottom:0">
          <n-statistic tabular-nums class="text-right">
            <n-number-animation :from="0" :to="12039" />
            <template #suffix><span class="text-6xl">笔</span></template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="4 s:2 m:1 l:1">
        <n-card title="竞技宝石价值" header-style="padding-bottom:0">
          <n-statistic tabular-nums class="text-right">
            <n-number-animation :from="0" :to="12039" />
            <template #suffix><span class="text-6xl">颗</span></template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="4 s:2 m:1 l:1">
        <n-card title="在线矿工" header-style="padding-bottom:0">
          <n-statistic tabular-nums class="text-right">
            <n-number-animation :from="0" :to="12039" />
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="4 s:2 m:1 l:1">
        <n-card title="共投入矿工" header-style="padding-bottom:0">
          <n-statistic tabular-nums class="text-right">
            <n-number-animation :from="0" :to="12039" />
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="4 s:2 m:1 l:1">
        <n-card title="闪卡库存" header-style="padding-bottom:0">
          <n-statistic tabular-nums class="text-right">
            <n-number-animation :from="0" :to="12039" />
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="4 s:2 m:1 l:1"></n-grid-item>
      <n-grid-item span="4 s:2 m:1 l:1">
        <n-card title="小型城堡" header-style="padding-bottom:0">
          <n-statistic tabular-nums class="text-right">
            <n-number-animation :from="0" :to="12039" />
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item span="4 s:2 m:1 l:1">
        <n-card title="中型城堡" header-style="padding-bottom:0">
          <n-statistic tabular-nums class="text-right">
            <n-number-animation :from="0" :to="12039" />
          </n-statistic>
        </n-card>
      </n-grid-item>
    </n-grid>

    <n-card class="mt-12" title="⚡️ 宝石、闪卡交易统计" segmented>
      <p>以月为单位，统计每天的宝石、闪卡交易笔数和数量</p>
      <VChart :option="trendOption" :init-options="{ height: 400 }" autoresize />
    </n-card>
    <n-card class="mt-12" title="⚡️ 游戏交易统计" segmented>
      <p>
        以月为单位，统计玩家每天大逃杀、运动会、赐福的投入和盈利总数，并计算平台的盈亏，竞技兑入兑出
      </p>
      <VChart :option="trendOption" :init-options="{ height: 400 }" autoresize />
    </n-card>
  </AppPage>
</template>

<script setup>
import { useUserStore } from '@/store'
import * as echarts from 'echarts/core'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

const userStore = useUserStore()

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  PieChart,
])

const trendOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999',
      },
    },
  },
  legend: {
    top: '5%',
    data: ['star', 'fork'],
  },
  xAxis: [
    {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisPointer: {
        type: 'shadow',
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      min: 0,
      max: 3000,
      interval: 500,
      axisLabel: {
        formatter: '{value}',
      },
    },
    {
      type: 'value',
      min: 0,
      max: 500,
      interval: 100,
      axisLabel: {
        formatter: '{value}',
      },
    },
  ],
  series: [
    {
      name: 'star',
      type: 'line',
      data: [200, 320, 520, 550, 600, 805, 888, 950, 1300, 2503, 2702, 2712],
    },
    {
      name: 'fork',
      yAxisIndex: 1,
      type: 'bar',
      data: [40, 72, 110, 115, 121, 175, 180, 201, 260, 398, 423, 455],
    },
  ],
}

const skillOption = {
  tooltip: {
    trigger: 'item',
    formatter({ name, value }) {
      return `${name} ${value}%`
    },
  },
  legend: {
    left: 'center',
  },
  series: [
    {
      top: '12%',
      type: 'pie',
      radius: ['35%', '90%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 36,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 38.5, name: 'Vue' },
        { value: 37.0, name: 'JavaScript' },
        { value: 6.5, name: 'CSS' },
        { value: 6.2, name: 'HTML' },
        { value: 1.8, name: 'Other' },
      ],
    },
  ],
}

const message = $message
</script>
