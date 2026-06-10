<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { BarChart, LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { WeightRecord } from "@/types/weight";

use([CanvasRenderer, BarChart, LineChart, GridComponent, TooltipComponent]);

const props = defineProps<{ records: WeightRecord[] }>();

const option = computed(() => {
  const list = [...props.records].sort(
    (a, b) =>
      new Date(a.date + "T00:00:00").getTime() -
      new Date(b.date + "T00:00:00").getTime(),
  );
  const dates = list.map((r) => r.date.slice(5));
  const diff: number[] = [];
  for (let i = 0; i < list.length; i++) {
    if (i === 0) {
      diff.push(0);
    } else {
      diff.push(+(list[i].weight - list[i - 1].weight).toFixed(2));
    }
  }

  return {
    backgroundColor: "transparent",
    grid: { left: 48, right: 24, top: 40, bottom: 36 },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#0b1222",
      borderColor: "#8b5cf655",
      borderWidth: 1,
      textStyle: { color: "#e2e8f0", fontFamily: "JetBrains Mono, monospace" },
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
      splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
      axisLabel: {
        color: "#94a3b8",
        formatter: "{value} kg",
        fontFamily: "JetBrains Mono, monospace",
      },
    },
    series: [
      {
        name: "日变化",
        type: "bar",
        data: diff.map((v) => ({
          value: v,
          itemStyle: {
            color: v <= 0 ? "rgba(34,211,238,0.75)" : "rgba(236,72,153,0.75)",
          },
        })),
        barWidth: 10,
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
          日变化量
        </div>
        <div class="text-xs text-cyber-muted">绿色下降 / 粉色上升</div>
      </div>
      <span class="cyber-tag">DELTA</span>
    </div>
    <v-chart :option="option" autoresize class="h-[280px] w-full" />
  </div>
</template>
