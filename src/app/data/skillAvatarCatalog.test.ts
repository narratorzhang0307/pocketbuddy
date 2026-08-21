import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { BUILTIN_SKILL_AVATAR_IDS, getBuiltinSkillAvatar } from './skillAvatarCatalog';

const BUILTIN_HEALTH_SKILL_IDS = [
  'frost-run-route',
  'her-motion',
  'lianlema-coach',
  'frost-wger-planner',
  'frost-mealie-kitchen',
  'frost-healthsync',
  'frost-motion-vision',
  'frost-openfoodfacts',
  'frost-cn-health-library',
  'frost-outdoor-window',
  'frost-sleep-detective',
  'frost-meal-lens',
] as const;

describe('内置健康 Skill 动物形象', () => {
  it('延续 Agents 页已经确认过的 Skill 与小动物绑定', () => {
    expect(BUILTIN_SKILL_AVATAR_IDS).toMatchObject({
      'frost-run-route': 'location-giraffe',
      'her-motion': 'pose-rabbit',
      'lianlema-coach': 'pose-rabbit',
      'frost-wger-planner': 'semantic-owl',
      'frost-mealie-kitchen': 'health-tiger',
      'frost-healthsync': 'evidence-elephant',
      'frost-motion-vision': 'pose-rabbit',
      'frost-openfoodfacts': 'health-tiger',
      'frost-cn-health-library': 'evidence-elephant',
      'frost-outdoor-window': 'location-giraffe',
      'frost-sleep-detective': 'semantic-owl',
      'frost-meal-lens': 'health-tiger',
    });
  });

  it('为全部 12 个内置 Skill 提供仓库内可用的头像文件', () => {
    expect(Object.keys(BUILTIN_SKILL_AVATAR_IDS).sort()).toEqual([...BUILTIN_HEALTH_SKILL_IDS].sort());

    for (const skillId of BUILTIN_HEALTH_SKILL_IDS) {
      const avatar = getBuiltinSkillAvatar(skillId);
      expect(avatar, skillId).toBeDefined();
      const assetPath = fileURLToPath(new URL(`../../../public/assets/skill-cards/city-agent-avatars/${avatar!.id}.png`, import.meta.url));
      expect(existsSync(assetPath), `${skillId} -> ${assetPath}`).toBe(true);
    }
  });
});
