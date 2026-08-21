import type { ReactNode } from 'react';
import type { CityMapRuntime } from './soundWalk';

interface Props {
  renderMapOverlay?: (map: CityMapRuntime | null) => ReactNode;
}

/**
 * Portable build fallback for checkouts that do not include the SOUND WALK
 * workspace. Local product development points SOUND_WALK_ROOT at that project;
 * the Pocket Buddy repository remains independently installable and testable.
 */
export default function SoundWalkUnavailable({ renderMapOverlay }: Props) {
  return (
    <div className="relative grid h-full place-items-center bg-[#f4f0df] px-6 text-center text-black">
      <div className="max-w-sm border-[3px] border-black bg-white p-6">
        <div className="font-pixel text-[9px]">SOUND WALK</div>
        <p className="mt-3 text-[11px] font-bold leading-relaxed">原城市地图工作区尚未连接</p>
        <p className="mt-2 text-[9px] leading-relaxed text-black/55">
          设置 SOUND_WALK_ROOT 后即会载入原高德地图、城市花草与观鸟手帐；不会用其他地图页面覆盖。
        </p>
      </div>
      {renderMapOverlay?.(null)}
    </div>
  );
}
