<script setup lang="ts">
import { computed, ref } from "vue";
import { Settings, Ruler, Target, User, Download, Trash2, AlertTriangle, CalendarX } from "@lucide/vue";
import { useWeight } from "@/composables/useWeight";

const { profile, updateProfile, clearBeforeDate, resetData, exportJSON, records } = useWeight();

const name = ref(profile.value.name);
const height = ref(profile.value.height);
const target = ref(profile.value.targetWeight);
const confirmReset = ref(false);

const dirty = computed(
  () =>
    name.value !== profile.value.name ||
    Number(height.value) !== profile.value.height ||
    Number(target.value) !== profile.value.targetWeight,
);

function save() {
  updateProfile({
    name: name.value.trim() || "Operator",
    height: Number(height.value) || 170,
    targetWeight: Number(target.value) || 65,
  });
}

function doReset() {
  resetData();
  confirmReset.value = false;
}
</script>

<template>
  <div class="space-y-6">
    <div class="cyber-panel cyber-corner p-6">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-900 shadow-neon">
          <Settings :size="18" />
        </div>
        <div>
          <div class="font-display text-base font-bold tracking-widest text-cyber-text">
            参数设置
          </div>
          <div class="text-xs text-cyber-muted">个性化你的统计与目标</div>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <label class="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyber-muted">
            <User :size="12" /> 昵称
          </label>
          <input v-model="name" class="cyber-input" placeholder="Operator" />
        </div>
        <div>
          <label class="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyber-muted">
            <Ruler :size="12" /> 身高 (cm)
          </label>
          <input v-model.number="height" type="number" min="100" max="250" class="cyber-input font-mono" />
        </div>
        <div>
          <label class="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyber-muted">
            <Target :size="12" /> 目标体重 (kg)
          </label>
          <input v-model.number="target" type="number" step="0.1" min="30" max="200" class="cyber-input font-mono" />
        </div>
      </div>

      <div class="mt-6 flex items-center justify-between">
        <div class="text-xs text-cyber-muted">
          本地存储：共 {{ records.length }} 条记录 · 浏览器 LocalStorage 持久化
        </div>
        <div class="flex items-center gap-3">
          <button class="cyber-btn" @click="exportJSON">
            <Download :size="14" /> 导出 JSON
          </button>
          <button
            class="cyber-btn-primary"
            :disabled="!dirty"
            @click="save"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>

    <div class="cyber-panel cyber-corner p-6">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-rose-400 to-pink-600 text-slate-900 shadow-neon">
            <Trash2 :size="18" />
          </div>
          <div>
            <div class="font-display text-base font-bold tracking-widest text-cyber-text">
              危险区
            </div>
            <div class="text-xs text-cyber-muted">清除所有记录（不可恢复）</div>
          </div>
        </div>
      </div>

      <div v-if="!confirmReset" class="mt-4 flex flex-wrap items-center gap-3">
        <button class="cyber-btn border-rose-400/40 text-rose-300" @click="clearBeforeDate('2026-06-08')">
          <CalendarX :size="14" /> 清除 6 月 8 日前数据
        </button>
        <button class="cyber-btn border-rose-400/40 text-rose-300" @click="confirmReset = true">
          <Trash2 :size="14" /> 清除全部记录
        </button>
      </div>
      <div v-else class="mt-4 flex flex-wrap items-center gap-3 rounded-md border border-rose-500/30 bg-rose-500/5 p-4">
        <AlertTriangle class="text-rose-400" :size="18" />
        <div class="text-sm text-rose-200">确认要清除全部 {{ records.length }} 条记录吗？此操作不可撤销。</div>
        <div class="ml-auto flex gap-2">
          <button class="cyber-btn" @click="confirmReset = false">取消</button>
          <button
            class="inline-flex items-center gap-2 rounded-md border border-rose-400/60 bg-rose-500/20 px-4 py-2 text-sm font-bold text-rose-200 hover:bg-rose-500/30"
            @click="doReset"
          >
            确认清除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
