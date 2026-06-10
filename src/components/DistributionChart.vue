<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { WeightRecord } from "@/types/weight";

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent]);

const props = defineProps<{ records: WeightRecord[] }>();

const option = computed(() => {
  const weights = props.records.map((r) => r.weight);
  if (weights.length === 0) {
    return {
      backgroundColor: "transparent",
      xAxis: { type: "category", data: [] },
      yAxis: {},
      series: [],
    };
  }
  const min = Math.floor(Math.min(...weights));
  const max = Math.ceil(Math.max(...weights));
  const step = 1;
  const bins: { label: string; count: number }[] = [];
  for (let v = min; v <= max; v += step) {
    bins.push({ label: `${v}`, count: 0 });
  }
  weights.forEach((w) => {
    const idx = Math.floor(w) - min;
    if (idx >= 0 && idx < bins.length) bins[idx].count += 1;
  });
  return {
    backgroundColor: "transparent",
    grid: { left: 48, right: 24, top: 40, bottom: 36 },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#0b1222",
      borderColor: "#22d3ee55",
      borderWidth: 1,
      textStyle: { color: "#e2e8f0", fontFamily: "JetBrains Mono, monospace" },
    },
    xAxis: {
      type: "category",
      data: bins.map((b) => b.label),
      axisLine: { lineStyle: { color: "#1e293b" } },
      axisLabel: { color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" },
      name: "kg",
      nameTextStyle: { color: "#64748b" },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
      axisLabel: { color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" },
    },
    series: [
      {
        type: "bar",
        data: bins.map((b) => b.count),
        barWidth: "60%",
        itemStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "#22d3ee" },
              { offset: 1, color: "#6366f1" },
            ],
          },
          borderRadius: [4, 4, 0, 0],
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
          体重分布
        </div>
        <div class="text-xs text-cyber-muted">各体重区间的记录频次</div>
      </div>
      <span class="cyber-tag">DISTRIBUTION</span>
    </div>
    <v-chart :option="option" autoresize class="h-[280px] w-full" />
  </div>
</template>
