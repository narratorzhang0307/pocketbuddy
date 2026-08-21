// The restored SOUND WALK source lazily imports its optional 3D viewers.
// These packages do not ship complete declarations, and the viewers already
// treat their runtime APIs dynamically.
declare module 'three';
declare module 'three/examples/jsm/*';
declare module '@mkkellogg/gaussian-splats-3d';

declare module '@soundwalk/app/components/MyMapTab' {
  import type { ComponentType, ReactNode } from 'react';

  const SoundWalkCanvas: ComponentType<{
    workspace?: 'city' | 'universe';
    journalContent?: 'zine' | 'nature-deck';
    renderMapOverlay?: (map: import('../app/integrations/soundWalk').CityMapRuntime | null) => ReactNode;
  }>;

  export default SoundWalkCanvas;
}
