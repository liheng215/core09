<script setup lang="ts">
import { computed } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

use([CanvasRenderer, GaugeChart]);

const props = defineProps<{ bmi: number; label: string }>();

const option = computed(() => {
  const bmi = props.bmi || 0;
  // 15 - 35 as visual range
  const min = 15;
  const max = 35;
  const clamped = Math.max(min, Math.min(max, bmi));
  return {
    backgroundColor: "transparent",
    series: [
      {
        type: "gauge",
        min,
        max,
        startAngle: 210,
        endAngle: -30,
        progress: { show: true, width: 14 },
        axisLine: { lineStyle: { width: 14, color: [[1, "#1e293b"]] } },
        axisTick: { show: false },
        splitLine: { length: 10, lineStyle: { color: "#334155" } },
        axisLabel: { color: "#94a3b8", distance: 18, fontFamily: "JetBrains Mono, monospace" },
        pointer: {
          length: "60%",
          width: 5,
          itemStyle: { color: "#22d3ee", shadowColor: "#22d3ee", shadowBlur: 10 },
        },
        itemStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: "#22d3ee" },
              { offset: 0.5, color: "#6366f1" },
              { offset: 1, color: "#ec4899" },
            ],
          },
        },
        detail: {
          valueAnimation: true,
          formatter: `{value}`,
          color: "#e2e8f0",
          fontSize: 36,
          fontFamily: "Orbitron, Rajdhani, sans-serif",
          offsetCenter: [0, "35%"],
        },
        title: {
          offsetCenter: [0, "65%"],
          color: "#94a3b8",
          fontSize: 12,
          fontWeight: 600,
        },
        data: [{ value: +clamped.toFixed(1), name: `BMI · ${props.label}` }],
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
          BMI 仪表盘
        </div>
        <div class="text-xs text-cyber-muted">基于最近一次记录</div>
      </div>
      <span class="cyber-tag">GAUGE</span>
    </div>
    <v-chart :option="option" autoresize class="h-[280px] w-full" />
  </div>
</template>
