import { useSyncExternalStore } from 'react';
import { SoundWalkCanvas } from '../integrations/soundWalk';
import RunRouteOverlay from './RunRouteOverlay';
import { getActiveRunRouteSessionId, subscribeRunRouteOpen } from '../lib/runRouteSkill';

/**
 * Pocket Earth 中间 Tab 的唯一入口。
 *
 * 城市花草、观鸟手帐和高德地图都由原 SOUND WALK 画布提供；
 * Pocket Buddy 的跑步能力只能通过 renderMapOverlay 叠加，不能替换原地图。
 */
export default function EarthSoundWalkTab() {
  const routeSessionId = useSyncExternalStore(
    subscribeRunRouteOpen,
    getActiveRunRouteSessionId,
    () => null,
  );

  return (
    <SoundWalkCanvas
      workspace="city"
      journalContent="nature-deck"
      renderMapOverlay={(map) => routeSessionId
        ? <RunRouteOverlay map={map} sessionId={routeSessionId} />
        : null}
    />
  );
}
