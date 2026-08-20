import { beforeEach, describe, expect, it } from 'vitest';
import {
  appendRunRouteTrackPoint,
  createRunRouteSession,
  createRunRouteSessionFromTaskmaster,
  distanceInMeters,
  nearestDistanceToRoute,
  parseRunRouteText,
  readRunRouteSession,
  resetRunRouteSkillForTests,
  runRouteTaskInput,
  targetDistanceMeters,
  updateRunRouteSession,
} from './runRouteSkill';

describe('run route skill', () => {
  beforeEach(() => resetRunRouteSkillForTests());

  it('normalizes distance, duration, destination and preferences', () => {
    expect(parseRunRouteText('带我跑 5 公里，要沿湖、平坦一点')).toMatchObject({
      goal: { type: 'distance', distance_m: 5000 }, shape: 'loop', preferences: ['flat', 'lakeside'],
    });
    expect(targetDistanceMeters(parseRunRouteText('跑 30 分钟').goal)).toBe(4286);
    expect(parseRunRouteText('从这里跑到西湖').goal).toEqual({ type: 'destination', query: '西湖' });
  });

  it('persists a route session without inventing a start or path', () => {
    const session = createRunRouteSession(parseRunRouteText('带我跑 3 公里'));
    expect(session.status).toBe('created');
    expect(session.start).toBeUndefined();
    expect(session.planned_path).toEqual([]);
    expect(readRunRouteSession(session.session_id)?.metrics.target_distance_m).toBe(3000);
  });

  it('keeps the structured request and local evidence text across the Taskmaster handoff', () => {
    const input = parseRunRouteText('帮我规划一条 5 公里沿湖、少爬坡的跑步路线');
    const payload = runRouteTaskInput(input);
    expect(payload).toMatchObject({
      goal_type: 'distance', distance_m: 5000, shape: 'loop',
      preferences: ['flat', 'lakeside'], user_text: input.request_text,
    });
    const session = createRunRouteSessionFromTaskmaster({ ...payload, source_task_id: 'task-route-1' });
    expect(session.input).toMatchObject({
      source: 'taskmaster', source_task_id: 'task-route-1', request_text: input.request_text,
    });
  });

  it('measures deviation and rejects impossible GPS jumps', () => {
    const session = createRunRouteSession(parseRunRouteText('带我跑 3 公里'));
    updateRunRouteSession(session.session_id, {
      status: 'ready', start: [120, 30], destination: [120, 30.001], planned_path: [[120, 30], [120, 30.001]],
    });
    appendRunRouteTrackPoint(session.session_id, { position: [120, 30], accuracy_m: 8, recorded_at: '2026-08-20T08:00:00.000Z' });
    appendRunRouteTrackPoint(session.session_id, { position: [120.001, 30.0005], accuracy_m: 8, recorded_at: '2026-08-20T08:01:00.000Z' });
    const offRoute = readRunRouteSession(session.session_id)!;
    expect(offRoute.status).toBe('off_route');
    expect(offRoute.metrics.deviation_m).toBeGreaterThan(55);
    const count = offRoute.actual_track.length;
    appendRunRouteTrackPoint(session.session_id, { position: [125, 35], accuracy_m: 8, recorded_at: '2026-08-20T08:02:00.000Z' });
    expect(readRunRouteSession(session.session_id)?.actual_track).toHaveLength(count);
    appendRunRouteTrackPoint(session.session_id, { position: [120.0005, 30.0005], accuracy_m: 8, recorded_at: '2026-08-20T08:00:30.000Z' });
    expect(readRunRouteSession(session.session_id)?.actual_track).toHaveLength(count);
  });

  it('computes point and route distance in meters', () => {
    const route = [[120, 30], [120, 30.001]] as [number, number][];
    expect(distanceInMeters(route[0], route[1])).toBeGreaterThan(100);
    expect(nearestDistanceToRoute([120, 30.0005], route)).toBeLessThan(1);
  });
});
