<script setup lang="ts">
import { computed, ref } from "vue";
import { Trash2, SortAsc, SortDesc, ListChecks } from "lucide-vue-next";
import type { WeightRecord } from "@/types/weight";

const props = defineProps<{ records: WeightRecord[] }>();
const emit = defineEmits<{ remove: [id: string] }>();

const asc = ref(false);
const query = ref("");

const filtered = computed(() => {
  let list = [...props.records];
  if (query.value.trim()) {
    const q = query.value.trim().toLowerCase();
    list = list.filter(
      (r) =>
        r.date.includes(q) ||
        String(r.weight).includes(q) ||
        (r.note?.toLowerCase().includes(q) ?? false),
    );
  }
  list.sort((a, b) => {
    const da = new Date(a.date + "T00:00:00").getTime();
    const db = new Date(b.date + "T00:00:00").getTime();
    return asc.value ? da - db : db - da;
  });
  return list;
});
</script>

<template>
  <div class="cyber-panel cyber-corner p-5">
    <div class="relative flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-400 to-pink-500 text-slate-900 shadow-neon">
          <ListChecks :size="16" />
        </div>
        <div>
          <div class="font-display text-sm font-bold tracking-widest text-cyber-text">
            记录明细
          </div>
          <div class="text-xs text-cyber-muted">共 {{ records.length }} 条</div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <input
          v-model="query"
          placeholder="搜索日期 / 体重 / 备注"
          class="cyber-input max-w-[220px] text-sm"
        />
        <button class="cyber-btn" @click="asc = !asc">
          <component :is="asc ? SortAsc : SortDesc" :size="14" />
          {{ asc ? "升序" : "降序" }}
        </button>
      </div>
    </div>

    <div class="relative mt-4 max-h-[380px] overflow-auto rounded-lg border border-cyan-500/10">
      <table class="w-full text-left text-sm">
        <thead class="sticky top-0 z-10 bg-slate-900/90 text-xs uppercase tracking-widest text-cyber-muted backdrop-blur">
          <tr>
            <th class="px-4 py-2">日期</th>
            <th class="px-4 py-2">体重 (kg)</th>
            <th class="px-4 py-2">变化</th>
            <th class="px-4 py-2">备注</th>
            <th class="px-4 py-2 text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(rec, idx) in filtered"
            :key="rec.id"
            class="border-t border-cyan-500/10 transition hover:bg-cyan-500/5"
          >
            <td class="px-4 py-2 font-mono text-cyan-200">{{ rec.date }}</td>
            <td class="px-4 py-2 font-mono text-cyber-text">{{ rec.weight }}</td>
            <td class="px-4 py-2">
              <span
                v-if="idx < filtered.length - 1"
                class="font-mono"
                :class="
                  rec.weight - filtered[idx + 1].weight <= 0
                    ? 'text-emerald-400'
                    : 'text-pink-400'
                "
              >
                {{ rec.weight - filtered[idx + 1].weight > 0 ? '+' : '' }}{{
                  (rec.weight - filtered[idx + 1].weight).toFixed(1)
                }}
              </span>
              <span v-else class="text-cyber-muted">—</span>
            </td>
            <td class="px-4 py-2 text-cyber-muted">{{ rec.note || "—" }}</td>
            <td class="px-4 py-2 text-right">
              <button
                class="inline-flex items-center gap-1 rounded-md border border-rose-400/30 bg-rose-500/10 px-2 py-1 text-xs text-rose-300 transition hover:border-rose-300 hover:bg-rose-500/20"
                @click="emit('remove', rec.id)"
              >
                <Trash2 :size="12" /> 删除
              </button>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="5" class="px-4 py-8 text-center text-cyber-muted">
              暂无记录，先录入一条吧。
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
