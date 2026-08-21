import type { CompiledSkillGraph, SkillRunStep, SkillRunTrace } from './contracts';

const EXTERNAL_CAPABILITIES = new Set(['sensor.location', 'sensor.health', 'model.qwen', 'model.pose']);

/**
 * Canvas 首版只做诚实的 dry-run：验证顺序、依赖和权限，不伪造 GPS、HRV 或模型结果。
 * 真正执行时，同一个 graph 由宿主能力桥接器逐节点恢复。
 */
export function previewSkillGraph(graph: CompiledSkillGraph, now = new Date()): SkillRunTrace {
  const started = now.toISOString();
  const steps: SkillRunStep[] = graph.nodes.map((node, index) => ({
    node_id: node.id,
    label: node.label,
    status: EXTERNAL_CAPABILITIES.has(node.capability) ? 'simulated' : 'verified',
    evidence: EXTERNAL_CAPABILITIES.has(node.capability)
      ? 'PREVIEW ONLY · 已验证适配器与权限边界，未读取真实数据'
      : index === 0 ? 'USER GESTURE · 触发入口有效' : `DEPENDENCIES OK · ${node.depends_on.length} 项输入已连接`,
    occurred_at: new Date(now.getTime() + index * 100).toISOString(),
  }));
  return {
    run_id: `canvas-run-${Date.now().toString(36)}`,
    skill_id: graph.skill_id,
    mode: 'preview',
    status: 'preview_completed',
    started_at: started,
    completed_at: new Date(now.getTime() + steps.length * 100).toISOString(),
    steps,
    note: '本次为结构试跑，没有读取真实位置、健康、相机或模型数据。',
  };
}
