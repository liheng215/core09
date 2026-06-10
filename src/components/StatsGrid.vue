<script setup lang="ts">
import { computed } from "vue";
import {
  TrendingDown,
  TrendingUp,
  Target,
  Activity,
  Scale,
  Flame,
} from "@lucide/vue";
import type { Profile, WeightStats } from "@/types/weight";

const props = defineProps<{ stats: WeightStats; profile: Profile }>();

const cards = computed(() => {
  const { stats, profile } = props;
  return [
    {
      title: "当前体重",
      value: stats.current ? `${stats.current} kg` : "—",
      sub: profile.height ? `身高 ${profile.height} cm` : "尚未设置身高",
      icon: Scale,
      accent: "from-cyan-400 to-blue-500",
    },
    {
      title: "BMI 指数",
      value: stats.bmi ? stats.bmi.toFixed(1) : "—",
      sub: stats.bmiLabel,
      icon: Activity,
      accent: "from-indigo-400 to-violet-500",
    },
    {
      title: "累计变化",
      value: stats.delta !== undefined ? `${stats.delta > 0 ? "+" : ""}${stats.delta} kg` : "—",
      sub: stats.delta < 0 ? "正在下降" : stats.delta > 0 ? "正在上升" : "持平",
      icon: stats.delta <= 0 ? TrendingDown : TrendingUp,
      accent: stats.delta <= 0 ? "from-emerald-400 to-cyan-500" : "from-pink-500 to-rose-500",
    },
    {
      title: "目标距离",
      value:
        stats.deltaToTarget || stats.deltaToTarget === 0
          ? `${stats.deltaToTarget > 0 ? "+" : ""}${stats.deltaToTarget} kg`
          : "—",
      sub: `目标 ${profile.targetWeight} kg`,
      icon: Target,
      accent: "from-amber-400 to-pink-500",
    },
    {
      title: "记录天数",
      value: `${stats.daysTracked} d`,
      sub: `平均 ${stats.avg || 0} kg`,
      icon: Flame,
      accent: "from-fuchsia-400 to-indigo-500",
    },
    {
      title: "区间范围",
      value: stats.min ? `${stats.min} ~ ${stats.max}` : "—",
      sub: "最低 / 最高",
      icon: Activity,
      accent: "from-sky-400 to-indigo-500",
    },
  ];
});
</script>

<template>
  <div class="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
    <div
      v-for="(card, i) in cards"
      :key="i"
      class="cyber-panel cyber-corner group relative p-4"
    >
      <div class="relative flex items-start justify-between">
        <div class="text-xs font-semibold uppercase tracking-[0.25em] text-cyber-muted">
          {{ card.title }}
        </div>
        <div
          class="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br text-slate-900 shadow-neon"
          :class="card.accent"
        >
          <component :is="card.icon" :size="16" />
        </div>
      </div>
      <div class="relative mt-3">
        <div class="font-display text-2xl font-bold text-cyber-text glow-text">
          {{ card.value }}
        </div>
        <div class="mt-1 text-xs text-cyber-muted">{{ card.sub }}</div>
      </div>
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r opacity-70"
        :class="card.accent"
      />
    </div>
  </div>
</template>
