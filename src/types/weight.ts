export interface WeightRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // kg
  height?: number; // cm (optional snapshot)
  note?: string;
  createdAt: number;
}

export interface Profile {
  name: string;
  height: number; // cm
  targetWeight: number; // kg
}

export interface WeightStats {
  current: number;
  start: number;
  min: number;
  max: number;
  avg: number;
  delta: number;
  deltaToTarget: number;
  daysTracked: number;
  bmi: number;
  bmiLabel: string;
  records: WeightRecord[];
}
