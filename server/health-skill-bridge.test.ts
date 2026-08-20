import { describe, expect, it } from 'vitest';
// @ts-expect-error Plain ESM server module intentionally has no client-facing types.
import { normalizeOpenFoodFactsProduct } from './health-skill-bridge.mjs';

describe('health skill server bridge', () => {
  it('normalizes only declared per-100g nutrition fields and keeps unknowns explicit', () => {
    expect(normalizeOpenFoodFactsProduct({
      code: '3017620422003',
      product_name: 'Test food',
      brands: 'Frost',
      nutriments: { 'energy-kcal_100g': 210, proteins_100g: 5, fat_100g: 'unknown' },
    })).toMatchObject({
      barcode: '3017620422003',
      nutritionPer100g: { energyKcal: 210, proteinG: 5, fatG: null },
      missing: expect.arrayContaining(['fatG', 'carbsG']),
      source: 'Open Food Facts',
    });
  });

  it('rejects non-product payloads', () => {
    expect(normalizeOpenFoodFactsProduct(null)).toBeNull();
  });
});
