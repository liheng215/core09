<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Activity, Settings as SettingsIcon, Zap, Cpu } from "lucide-vue-next";
import { useWeight } from "@/composables/useWeight";

const router = useRouter();
const route = useRoute();
const { profile, stats } = useWeight();

const now = ref(new Date());
onMounted(() => {
  const id = setInterval(() => (now.value = new Date()), 1000 * 30);
  return () => clearInterval(id);
});

const clock = computed(() => {
  const d = now.value;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
});

const navItems = [
  { key: "home", label: "控制中心", icon: Activity },
  { key: "settings", label: "参数设置", icon: SettingsIcon },
];
</script>

<template>
  <div class="relative min-h-screen bg-cyber-bg text-cyber-text">
    <!-- Animated grid background -->
    <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div class="absolute inset-0 bg-grid-dark [background-size:40px_40px] opacity-20 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      <div class="absolute inset-0 bg-radial-cyber opacity-60" />
      <div class="absolute -top-24 left-1/2 h-64 w-[60rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl animate-pulse-glow" />
    </div>

    <!-- Top bar -->
    <header class="sticky top-0 z-30 border-b border-cyan-500/10 bg-cyber-bg/70 backdrop-blur-xl">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div class="flex items-center gap-3">
          <div class="relative">
            <svg class="h-10 w-10 animate-flicker" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#22d3ee"/>
                  <stop offset="50%" style="stop-color:#3b82f6"/>
                  <stop offset="100%" style="stop-color:#6366f1"/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <circle cx="50" cy="50" r="42" stroke="url(#logoGrad)" stroke-width="2" fill="none" opacity="0.3"/>
              <ellipse cx="50" cy="35" rx="28" ry="8" fill="url(#logoGrad)" filter="url(#glow)"/>
              <ellipse cx="50" cy="35" rx="24" ry="6" fill="#030712"/>
              <rect x="47" y="43" width="6" height="35" fill="url(#logoGrad)" rx="2" filter="url(#glow)"/>
              <rect x="35" y="58" width="30" height="18" fill="#0f172a" stroke="url(#logoGrad)" stroke-width="1.5" rx="2"/>
              <text x="50" y="71" text-anchor="middle" fill="#22d3ee" font-size="10" font-family="Orbitron, sans-serif" font-weight="bold" letter-spacing="1">85</text>
              <text x="78" y="71" text-anchor="middle" fill="#22d3ee" font-size="6" font-family="Orbitron, sans-serif" font-weight="bold">KG</text>
              <circle cx="25" cy="25" r="2" fill="#22d3ee" opacity="0.6"/>
              <circle cx="75" cy="75" r="2" fill="#6366f1" opacity="0.6"/>
            </svg>
          </div>
          <div>
            <div class="font-display text-lg font-bold tracking-[0.25em] text-cyan-100 glow-text">
              WEIGHT · OPS
            </div>
            <div class="text-[10px] uppercase tracking-[0.4em] text-cyber-muted">
              cyber weight tracker v1.0
            </div>
          </div>
        </div>

        <nav class="flex items-center gap-2">
          <button
            v-for="item in navItems"
            :key="item.key"
            class="flex items-center gap-2 rounded-md border px-4 py-2 text-xs font-semibold tracking-widest transition"
            :class="
              route.name === item.key
                ? 'border-cyan-300/60 bg-cyan-500/15 text-cyan-100 shadow-neon'
                : 'border-cyan-500/20 bg-transparent text-cyber-muted hover:border-cyan-400/40 hover:text-cyan-100'
            "
            @click="router.push({ name: item.key })"
          >
            <component :is="item.icon" :size="14" />
            {{ item.label }}
          </button>
        </nav>

        <div class="hidden items-center gap-4 text-xs text-cyber-muted md:flex">
          <div class="flex items-center gap-2 font-mono">
            <Cpu :size="14" class="text-cyan-300" />
            <span>{{ clock }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Zap :size="14" class="text-amber-300" />
            <span class="font-mono">
              {{ profile.name }} · {{ stats.current || "—" }} kg
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="mx-auto max-w-7xl px-6 py-8">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="mx-auto max-w-7xl px-6 pb-8 pt-4 text-xs text-cyber-muted">
      <div class="flex flex-wrap items-center justify-between gap-2 border-t border-cyan-500/10 pt-4 font-mono">
        <span>// 数据仅保存在你的浏览器中 · 请定期导出备份</span>
        <span>SYSTEM_STATUS :: ONLINE</span>
      </div>
    </footer>
  </div>
</template>
