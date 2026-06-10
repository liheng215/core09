<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent, MarkLineComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { WeightRecord } from "@/types/weight";

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, MarkLineComponent]);

const props = defineProps<{ records: WeightRecord[]; target: number }>();

const option = computed(() => {
  const list = [...props.records].sort(
    (a, b) =>
      new Date(a.date + "T00:00:00").getTime() -
      new Date(b.date + "T00:00:00").getTime(),
  );
  const dates = list.map((r) => r.date.slice(5));
  const weights = list.map((r) => r.weight);
  const target = props.target;

  return {
    backgroundColor: "transparent",
    grid: { left: 48, right: 24, top: 40, bottom: 36 },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#0b1222",
      borderColor: "#22d3ee55",
      borderWidth: 1,
      textStyle: { color: "#e2e8f0", fontFamily: "JetBrains Mono, monospace" },
      formatter: (params: { axisValue: string; value: number }[]) => {
        const p = params[0];
        return `<div class="font-mono text-xs"><div class="text-cyan-300">${p.axisValue}</div><div>体重：<span class="text-cyan-200 font-bold">${p.value} kg</span></div></div>`;
      },
    },
    xAxis: {
      type: "category",
      data: dates,
      axisLine: { lineStyle: { color: "#1e293b" } },
      axisLabel: { color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      scale: true,
      splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
      axisLabel: {
        color: "#94a3b8",
        formatter: "{value} kg",
        fontFamily: "JetBrains Mono, monospace",
      },
    },
    series: [
      {
        name: "体重",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        data: weights,
        lineStyle: { width: 2, color: "#22d3ee", shadowColor: "#22d3ee", shadowBlur: 8 },
        itemStyle: { color: "#22d3ee", borderColor: "#0ea5e9", borderWidth: 1 },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(99,102,241,0.55)" },
              { offset: 1, color: "rgba(34,211,238,0.02)" },
            ],
          },
        },
        markLine: {
          symbol: "none",
          lineStyle: { color: "#ec4899", type: "dashed", width: 1 },
          label: {
            formatter: `目标 ${target}kg`,
            color: "#f472b6",
            fontFamily: "JetBrains Mono, monospace",
          },
          data: target ? [{ yAxis: target }] : [],
        },
      },
    ],
  };
});
</script>

<template>
  <div class="cyber-panel cyber-corner p-5">
    <div class="relative mb-3 flex items-center justify-between">
      <div>
        <div class="font-display text-sm font-bold tracking-widest text-cyber-text">
          体重趋势
        </div>
        <div class="text-xs text-cyber-muted">时间序列 · 含目标参考线</div>
      </div>
      <span class="cyber-tag">LINE TREND</span>
    </div>
    <v-chart :option="option" autoresize class="h-[320px] w-full" />
  </div>
</template>
