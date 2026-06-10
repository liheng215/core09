<script setup lang="ts">
import { computed, ref } from "vue";
import { Plus, Weight, Calendar, PenLine } from "lucide-vue-next";

const props = defineProps<{ todayWeight?: number }>();
const emit = defineEmits<{ submit: [payload: { date: string; weight: number; note?: string }] }>();

const date = ref<string>(new Date().toISOString().slice(0, 10));
const weight = ref<number | "">("");
const note = ref("");

const valid = computed(() => {
  const w = Number(weight.value);
  return date.value && w > 20 && w < 300;
});

function submit() {
  if (!valid.value) return;
  emit("submit", {
    date: date.value,
    weight: Number(weight.value),
    note: note.value || undefined,
  });
  weight.value = "";
  note.value = "";
}
</script>

<template>
  <div class="cyber-panel cyber-corner p-5">
    <div class="relative flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-indigo-500 text-slate-900 shadow-neon">
          <Weight :size="16" />
        </div>
        <div>
          <div class="font-display text-sm font-bold tracking-widest text-cyber-text">
            录入数据
          </div>
          <div class="text-xs text-cyber-muted">每日打卡 / 快速记录</div>
        </div>
      </div>
      <span v-if="todayWeight" class="cyber-tag">今日已录入 · {{ todayWeight }} kg</span>
    </div>

    <form class="relative mt-4 grid grid-cols-1 gap-4 md:grid-cols-12" @submit.prevent="submit">
      <div class="md:col-span-4">
        <label class="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyber-muted">
          <Calendar :size="12" /> 日期
        </label>
        <input v-model="date" type="date" class="cyber-input font-mono" />
      </div>
      <div class="md:col-span-4">
        <label class="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyber-muted">
          <Weight :size="12" /> 体重 (kg)
        </label>
        <input
          v-model.number="weight"
          type="number"
          step="0.1"
          min="30"
          max="250"
          placeholder="例如 72.5"
          class="cyber-input font-mono"
        />
      </div>
      <div class="md:col-span-4">
        <label class="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyber-muted">
          <PenLine :size="12" /> 备注 (可选)
        </label>
        <input v-model="note" type="text" placeholder="如：早餐后" class="cyber-input" />
      </div>

      <div class="md:col-span-12 flex items-center justify-end gap-3">
        <div class="text-xs text-cyber-muted">
          提示：同一天再次录入会覆盖当日数据。
        </div>
        <button
          type="submit"
          class="cyber-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!valid"
        >
          <Plus :size="16" /> 提交记录
        </button>
      </div>
    </form>
  </div>
</template>
