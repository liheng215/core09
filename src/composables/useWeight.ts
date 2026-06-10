import { computed, ref, watch } from "vue";
import type { Profile, WeightRecord, WeightStats } from "@/types/weight";

const STORAGE_KEY = "cyber-weight.records.v1";
const PROFILE_KEY = "cyber-weight.profile.v1";

function loadRecords(): WeightRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedDemoData();
    const parsed = JSON.parse(raw) as WeightRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw) as Profile;
  } catch {
    /* noop */
  }
  return { name: "Operator", height: 175, targetWeight: 70 };
}

function seedDemoData(): WeightRecord[] {
  const today = new Date();
  const base = 78;
  const out: WeightRecord[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const weight = +(base - i * 0.12 + (Math.random() - 0.5) * 0.8).toFixed(1);
    out.push({
      id: `demo-${d.getTime()}`,
      date: d.toISOString().slice(0, 10),
      weight,
      createdAt: d.getTime(),
    });
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
  } catch {
    /* noop */
  }
  return out;
}

const records = ref<WeightRecord[]>(loadRecords());
const profile = ref<Profile>(loadProfile());

watch(
  records,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    } catch {
      /* noop */
    }
  },
  { deep: true },
);

watch(
  profile,
  (val) => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(val));
    } catch {
      /* noop */
    }
  },
  { deep: true },
);

function bmiLabelOf(bmi: number): string {
  if (bmi < 18.5) return "偏瘦";
  if (bmi < 24) return "正常";
  if (bmi < 28) return "超重";
  return "肥胖";
}

function parseDate(s: string): number {
  return new Date(s + "T00:00:00").getTime();
}

export function useWeight() {
  const sorted = computed<WeightRecord[]>(() =>
    [...records.value].sort((a, b) => parseDate(a.date) - parseDate(b.date)),
  );

  const stats = computed<WeightStats>(() => {
    const list = sorted.value;
    if (list.length === 0) {
      return {
        current: 0,
        start: 0,
        min: 0,
        max: 0,
        avg: 0,
        delta: 0,
        deltaToTarget: 0,
        daysTracked: 0,
        bmi: 0,
        bmiLabel: "—",
        records: [],
      };
    }
    const weights = list.map((r) => r.weight);
    const current = list[list.length - 1].weight;
    const start = list[0].weight;
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const avg = +(weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(2);
    const delta = +(current - start).toFixed(2);
    const deltaToTarget = +(current - profile.value.targetWeight).toFixed(2);
    const heightM = profile.value.height / 100;
    const bmi = +(current / (heightM * heightM)).toFixed(2);
    const uniqueDays = new Set(list.map((r) => r.date)).size;
    return {
      current,
      start,
      min,
      max,
      avg,
      delta,
      deltaToTarget,
      daysTracked: uniqueDays,
      bmi,
      bmiLabel: bmiLabelOf(bmi),
      records: list,
    };
  });

  function addRecord(input: {
    date?: string;
    weight: number;
    height?: number;
    note?: string;
  }) {
    const date = input.date || new Date().toISOString().slice(0, 10);
    const record: WeightRecord = {
      id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      date,
      weight: Number(input.weight),
      height: input.height ? Number(input.height) : undefined,
      note: input.note,
      createdAt: Date.now(),
    };
    // Replace record with same date to avoid duplicates
    const idx = records.value.findIndex((r) => r.date === date);
    if (idx >= 0) {
      records.value[idx] = record;
    } else {
      records.value.push(record);
    }
  }

  function removeRecord(id: string) {
    records.value = records.value.filter((r) => r.id !== id);
  }

  function updateProfile(next: Partial<Profile>) {
    profile.value = { ...profile.value, ...next };
  }

  function resetData() {
    records.value = [];
  }

  function exportJSON() {
    const payload = { profile: profile.value, records: records.value, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `weight-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return {
    records,
    profile,
    sorted,
    stats,
    addRecord,
    removeRecord,
    updateProfile,
    resetData,
    exportJSON,
  };
}
