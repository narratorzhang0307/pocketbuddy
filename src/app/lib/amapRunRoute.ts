import { loadAmap } from './amap';
import {
  distanceInMeters,
  readRunRouteSession,
  routeDistance,
  targetDistanceMeters,
  updateRunRouteSession,
  type RoutePoint,
  type RunRouteSession,
} from './runRouteSkill';

type AmapNamespace = {
  Map: new (container: HTMLElement, options: Record<string, unknown>) => AmapMap;
  LngLat: new (longitude: number, latitude: number) => unknown;
  Polyline: new (options: Record<string, unknown>) => AmapPolyline;
  Marker: new (options: Record<string, unknown>) => AmapMarker;
  Walking: new (options?: Record<string, unknown>) => AmapWalking;
  PlaceSearch: new (options?: Record<string, unknown>) => AmapPlaceSearch;
  plugin: (names: string | string[], callback: () => void) => void;
  convertFrom?: (position: RoutePoint, type: string, callback: (status: string, result: { locations?: Array<{ getLng(): number; getLat(): number }> }) => void) => void;
};

export type AmapMap = {
  destroy(): void;
  add(item: unknown): void;
  remove(item: unknown): void;
  setFitView(items?: unknown[], immediately?: boolean, avoid?: number[]): void;
  setCenter(position: RoutePoint): void;
};

export type AmapPolyline = { setPath(path: RoutePoint[]): void; setMap(map: AmapMap | null): void };
export type AmapMarker = { setPosition(position: RoutePoint): void; setMap(map: AmapMap | null): void };
type AmapWalking = { search(start: unknown, destination: unknown, callback: (status: string, result: unknown) => void): void };
type AmapPlaceSearch = {
  search(query: string, callback: (status: string, result: unknown) => void): void;
  searchNearBy?: (query: string, center: RoutePoint, radius: number, callback: (status: string, result: unknown) => void) => void;
};

interface RoutePlan {
  points: RoutePoint[];
  distance_m: number;
  destination: RoutePoint;
  destination_label?: string;
  warning?: string;
}

function pointFromUnknown(value: unknown): RoutePoint | null {
  if (Array.isArray(value)) {
    const lng = Number(value[0]);
    const lat = Number(value[1]);
    return Number.isFinite(lng) && Number.isFinite(lat) ? [lng, lat] : null;
  }
  if (!value || typeof value !== 'object') return null;
  const point = value as { lng?: number; lat?: number; getLng?: () => number; getLat?: () => number };
  const lng = Number(point.getLng?.() ?? point.lng);
  const lat = Number(point.getLat?.() ?? point.lat);
  return Number.isFinite(lng) && Number.isFinite(lat) ? [lng, lat] : null;
}

function deduplicate(points: RoutePoint[]): RoutePoint[] {
  return points.filter((point, index) => index === 0 || distanceInMeters(point, points[index - 1]) > 0.5);
}

let nextWalkingRequestAt = 0;

async function requestWalking(AMap: AmapNamespace, start: RoutePoint, destination: RoutePoint, timeoutMs = 8_000): Promise<RoutePoint[] | null> {
  const now = Date.now();
  const scheduledAt = Math.max(now, nextWalkingRequestAt);
  nextWalkingRequestAt = scheduledAt + 1_100;
  if (scheduledAt > now) await new Promise((resolve) => setTimeout(resolve, scheduledAt - now));
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (value: RoutePoint[] | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    try {
      AMap.plugin('AMap.Walking', () => {
        try {
          const origin = new AMap.LngLat(start[0], start[1]);
          const end = new AMap.LngLat(destination[0], destination[1]);
          new AMap.Walking().search(origin, end, (status, result) => {
            if (status !== 'complete' || !result || typeof result !== 'object') {
              const detail = typeof result === 'string'
                ? result
                : result && typeof result === 'object' && 'info' in result
                  ? (result as { info?: unknown }).info
                  : 'no result';
              console.warn('[run-route] AMap.Walking failed', status, detail);
              if (String(detail).includes('HAS_EXCEEDED_THE_LIMIT')) {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                reject(new Error('高德路线服务当前调用过快，请稍等几秒后重试。'));
                return;
              }
              return finish(null);
            }
            const routes = (result as { routes?: Array<{ steps?: Array<{ path?: unknown[] }> }> }).routes;
            const points = routes?.[0]?.steps?.flatMap((step) => step.path || []).map(pointFromUnknown).filter((point): point is RoutePoint => point !== null) || [];
            finish(points.length >= 2 ? deduplicate(points) : null);
          });
        } catch { finish(null); }
      });
    } catch { finish(null); }
  });
}

function placeFromResult(query: string, result: unknown): { position: RoutePoint; label: string } | null {
  if (!result || typeof result !== 'object') return null;
  const poiList = (result as { poiList?: { pois?: Array<{ name?: string; location?: unknown }> } }).poiList;
  const poi = poiList?.pois?.find((item) => pointFromUnknown(item.location));
  const position = pointFromUnknown(poi?.location);
  return position ? { position, label: poi?.name || query } : null;
}

function searchPlace(AMap: AmapNamespace, query: string, start: RoutePoint, timeoutMs = 8_000): Promise<{ position: RoutePoint; label: string } | null> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value: { position: RoutePoint; label: string } | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    };
    const timer = setTimeout(() => finish(null), timeoutMs);
    try {
      AMap.plugin('AMap.PlaceSearch', () => {
        try {
          const search = new AMap.PlaceSearch({ pageSize: 5 });
          const searchGlobal = () => search.search(query, (status, result) => finish(status === 'complete' ? placeFromResult(query, result) : null));
          if (!search.searchNearBy) return searchGlobal();
          search.searchNearBy(query, start, 50_000, (status, result) => {
            const nearby = status === 'complete' ? placeFromResult(query, result) : null;
            if (nearby) finish(nearby);
            else searchGlobal();
          });
        } catch { finish(null); }
      });
    } catch { finish(null); }
  });
}

function coordinateAt(origin: RoutePoint, distanceM: number, bearingDegrees: number): RoutePoint {
  const bearing = bearingDegrees * Math.PI / 180;
  const latitude = origin[1] * Math.PI / 180;
  return [
    origin[0] + Math.sin(bearing) * distanceM / (111_320 * Math.max(Math.cos(latitude), 0.2)),
    origin[1] + Math.cos(bearing) * distanceM / 110_540,
  ];
}

async function planOutAndBackFallback(AMap: AmapNamespace, start: RoutePoint, targetM: number): Promise<RoutePlan | null> {
  let radialDistanceM = targetM / 2;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const waypoint = coordinateAt(start, radialDistanceM, 90);
    const outbound = await requestWalking(AMap, start, waypoint);
    if (!outbound) return null;
    const points = deduplicate([...outbound, ...outbound.slice(0, -1).reverse()]);
    const distanceM = routeDistance(points);
    if (attempt === 1 || Math.abs(distanceM - targetM) / targetM <= 0.15) {
      return {
        points,
        distance_m: distanceM,
        destination: start,
        warning: '为保证路线服务稳定，已生成一条回到起点的往返方案。',
      };
    }
    radialDistanceM *= Math.max(0.5, Math.min(1.5, targetM / Math.max(distanceM, 1)));
  }
  return null;
}

async function planRoute(AMap: AmapNamespace, session: RunRouteSession, start: RoutePoint): Promise<RoutePlan | null> {
  if (session.input.goal.type === 'destination') {
    const place = await searchPlace(AMap, session.input.goal.query, start);
    if (!place) throw new Error(`未找到“${session.input.goal.query}”，请换一个更明确的地点`);
    const outbound = await requestWalking(AMap, start, place.position);
    if (!outbound) return null;
    const points = session.input.shape === 'out_and_back'
      ? deduplicate([...outbound, ...outbound.slice(0, -1).reverse()])
      : outbound;
    return { points, distance_m: routeDistance(points), destination: session.input.shape === 'out_and_back' ? start : place.position, destination_label: place.label };
  }
  const targetM = targetDistanceMeters(session.input.goal) || 5000;
  if (session.input.shape === 'out_and_back') {
    const destination = coordinateAt(start, targetM / 2, 30);
    const outbound = await requestWalking(AMap, start, destination);
    if (!outbound) return null;
    const points = deduplicate([...outbound, ...outbound.slice(0, -1).reverse()]);
    return { points, distance_m: routeDistance(points), destination: start };
  }
  return planOutAndBackFallback(AMap, start, targetM);
}

export function requestBrowserPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('当前设备不支持 GPS 定位'));
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15_000, maximumAge: 5_000 });
  });
}

function routeErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = Number((error as { code?: unknown }).code);
    if (code === 1) return '定位权限未开启。请允许定位后重试，或先使用杭州示例起点预览路线。';
    if (code === 2) return '暂时无法获取当前位置，请检查系统定位服务或先使用示例起点。';
    if (code === 3) return '获取当前位置超时，请到开阔处重试或先使用示例起点。';
  }
  return error instanceof Error ? error.message : '路线规划失败';
}

export function toAmapPosition(AMap: AmapNamespace, position: RoutePoint): Promise<RoutePoint> {
  if (!AMap.convertFrom) return Promise.reject(new Error('高德 GPS 坐标转换不可用'));
  return new Promise((resolve, reject) => {
    AMap.convertFrom?.(position, 'gps', (status, result) => {
      const converted = status === 'complete' ? pointFromUnknown(result.locations?.[0]) : null;
      if (converted) resolve(converted);
      else reject(new Error('GPS 坐标转换失败，请稍后重试'));
    });
  });
}

export async function planRunRouteSession(sessionId: string, startOverride?: RoutePoint): Promise<RunRouteSession> {
  const current = readRunRouteSession(sessionId);
  if (!current) throw new Error(`run_route_session_not_found:${sessionId}`);
  updateRunRouteSession(sessionId, { status: startOverride ? 'planning' : 'locating', error: undefined });
  try {
    const AMap = await loadAmap() as AmapNamespace;
    let start = startOverride;
    if (!start) {
      const geolocation = await requestBrowserPosition();
      start = await toAmapPosition(AMap, [geolocation.coords.longitude, geolocation.coords.latitude]);
    }
    updateRunRouteSession(sessionId, { status: 'planning', start, start_source: startOverride ? (current.start_source || 'gps') : 'gps' });
    const session = readRunRouteSession(sessionId)!;
    const plan = await planRoute(AMap, session, start);
    if (!plan) throw new Error('高德未返回可步行路线，请换个起点或距离重试');
    const warnings = [...session.warnings];
    if (plan.warning) warnings.push(plan.warning);
    if (session.input.preferences.length) warnings.push('偏好已记录；高德步行路由不验证照明、人流或治安，仍需现场判断');
    return updateRunRouteSession(sessionId, {
      status: 'ready',
      start,
      destination: plan.destination,
      destination_label: plan.destination_label,
      planned_path: plan.points,
      metrics: { ...session.metrics, planned_distance_m: Math.round(plan.distance_m) },
      warnings,
      error: undefined,
    });
  } catch (error) {
    return updateRunRouteSession(sessionId, {
      status: 'failed',
      error: routeErrorMessage(error),
    });
  }
}

/** 偏航后不重新生成一条新环线，只从当前点重算到原路线终点。 */
export async function replanRunRouteFromPosition(sessionId: string, current: RoutePoint): Promise<RunRouteSession> {
  const session = readRunRouteSession(sessionId);
  if (!session?.destination) throw new Error('run_route_destination_missing');
  updateRunRouteSession(sessionId, { status: 'planning', error: undefined });
  try {
    const AMap = await loadAmap() as AmapNamespace;
    const points = await requestWalking(AMap, current, session.destination);
    if (!points) throw new Error('偏航重算失败，请先停在安全位置后重试');
    return updateRunRouteSession(sessionId, {
      status: 'navigating',
      start: current,
      planned_path: points,
      metrics: { ...session.metrics, planned_distance_m: Math.round(routeDistance(points)), deviation_m: 0 },
      warnings: [...session.warnings, '已根据当前 GPS 位置重新规划到原终点'],
    });
  } catch (error) {
    return updateRunRouteSession(sessionId, {
      status: 'off_route',
      error: error instanceof Error ? error.message : '偏航重算失败',
    });
  }
}

export async function loadAmapNamespace(): Promise<AmapNamespace> {
  return loadAmap() as Promise<AmapNamespace>;
}
