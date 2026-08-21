/**
 * SOUND WALK integration boundary.
 *
 * Product components import the map canvas and runtime types from here. This
 * keeps the shared workspace dependency out of screen code and gives us one
 * place to replace it with a published package later.
 */
export { default as SoundWalkCanvas } from '@soundwalk/app/components/MyMapTab';

export interface CityMapRuntime {
  flyTo(options: { center: [number, number]; zoom?: number; duration?: number }): void;
  off(event: 'move', listener: () => void): void;
  on(event: 'move', listener: () => void): void;
  project(point: [number, number]): { x: number; y: number };
}
