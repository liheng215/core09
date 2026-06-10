<script setup lang="ts">
import { computed } from "vue";
import { useWeight } from "@/composables/useWeight";
import StatsGrid from "@/components/StatsGrid.vue";
import RecordForm from "@/components/RecordForm.vue";
import RecordList from "@/components/RecordList.vue";
import TrendChart from "@/components/TrendChart.vue";
import DeltaChart from "@/components/DeltaChart.vue";
import BmiGauge from "@/components/BmiGauge.vue";
import DistributionChart from "@/components/DistributionChart.vue";

const { sorted, stats, profile, addRecord, removeRecord } = useWeight();

const today = new Date().toISOString().slice(0, 10);
const todayWeight = computed(
  () => sorted.value.find((r) => r.date === today)?.weight,
);

function handleSubmit(payload: { date: string; weight: number; note?: string }) {
  addRecord(payload);
}
</script>

<template>
  <div class="space-y-6">
    <StatsGrid :stats="stats" :profile="profile" />

    <RecordForm :today-weight="todayWeight" @submit="handleSubmit" />

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div class="xl:col-span-2">
        <TrendChart :records="sorted" :target="profile.targetWeight" />
      </div>
      <BmiGauge :bmi="stats.bmi" :label="stats.bmiLabel" />
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <DeltaChart :records="sorted" />
      <DistributionChart :records="sorted" />
    </div>

    <RecordList :records="sorted" @remove="removeRecord" />
  </div>
</template>
