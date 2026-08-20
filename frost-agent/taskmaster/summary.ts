import type { HealthEvent, JsonObject } from './contracts';

export interface DailySummary {
  protocol: 'frost-daily-summary/v1';
  user_id: string;
  day: string;
  meals: { count: number; calories_kcal?: number; protein_g?: number; carbs_g?: number; fat_g?: number };
  workout: { sessions: number; distance_m?: number; duration_s?: number; steps?: number };
  nature: Array<{ label: string; confidence: number; event_id: string }>;
  next_action: string;
  source_event_ids: string[];
  disclaimer: string;
}

function number(value: unknown): number | undefined { return typeof value === 'number' && Number.isFinite(value) ? value : undefined; }
function add(target: JsonObject, key: string, value: unknown): void {
  const numeric = number(value);
  if (numeric !== undefined) target[key] = Number(target[key] || 0) + numeric;
}

export function compileDailySummary(userId: string, day: string, events: HealthEvent[]): DailySummary {
  const relevant = events.filter((event) => event.user_id === userId && event.occurred_at.slice(0, 10) === day);
  const activeSuperseded = new Set(relevant.map((event) => event.supersedes_event_id).filter((id): id is string => Boolean(id)));
  const active = relevant.filter((event) => !activeSuperseded.has(event.event_id));
  const mealTotals: JsonObject = {};
  const workoutTotals: JsonObject = {};
  let meals = 0;
  let sessions = 0;
  const nature: DailySummary['nature'] = [];

  for (const event of active) {
    if (event.type === 'meal_confirmed' && event.facts.confirmed !== false) {
      meals += 1;
      add(mealTotals, 'calories_kcal', event.facts.calories_kcal);
      add(mealTotals, 'protein_g', event.facts.protein_g);
      add(mealTotals, 'carbs_g', event.facts.carbs_g);
      add(mealTotals, 'fat_g', event.facts.fat_g);
    }
    if (event.type === 'run_completed') {
      sessions += 1;
      add(workoutTotals, 'distance_m', event.facts.distance_m);
      add(workoutTotals, 'duration_s', event.facts.duration_s);
      add(workoutTotals, 'steps', event.facts.steps);
    }
    if (event.type === 'nature_captured') {
      const rawLabel = typeof event.facts.label === 'string' ? event.facts.label : 'unknown';
      nature.push({ label: event.confidence >= 0.7 ? rawLabel : '待确认的自然时刻', confidence: event.confidence, event_id: event.event_id });
    }
  }

  const nextAction = sessions === 0
    ? '如果身体状态合适，明天安排一次轻量步行或短时活动。'
    : meals === 0 ? '明天可补记一餐，让 Frost 的饮食与运动建议更完整。' : '保持今天的节奏，并根据身体感受安排恢复。';
  return {
    protocol: 'frost-daily-summary/v1', user_id: userId, day,
    meals: { count: meals, ...mealTotals },
    workout: { sessions, ...workoutTotals },
    nature,
    next_action: nextAction,
    source_event_ids: active.map((event) => event.event_id),
    disclaimer: '仅作生活运动记录与一般性建议，不构成医疗诊断或治疗意见。',
  } as DailySummary;
}
