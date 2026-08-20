import { describe, expect, it } from 'vitest';
import { toAmapPosition } from './amapRunRoute';

describe('AMap run route adapter', () => {
  it('converts browser WGS84 GPS points before putting them on the AMap route', async () => {
    const AMap = {
      convertFrom(_point: [number, number], type: string, callback: (status: string, result: unknown) => void) {
        expect(type).toBe('gps');
        callback('complete', { locations: [{ getLng: () => 120.01, getLat: () => 30.02 }] });
      },
    };
    await expect(toAmapPosition(AMap as never, [120, 30])).resolves.toEqual([120.01, 30.02]);
  });

  it('fails closed instead of drawing unconverted GPS coordinates', async () => {
    await expect(toAmapPosition({} as never, [120, 30])).rejects.toThrow('坐标转换不可用');
  });
});
