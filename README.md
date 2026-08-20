# Pocket Buddy

Pocket Buddy 是一个以运动、恢复、营养和日常健康为主线的私人 Agent 应用。Frost 负责理解目标、选择 Skill、声明权限并把任务交给可验证的执行层。

当前代码仅保留产品正在使用的健康与健身链路，不包含旧的内容整理、展示项目、私人文档、API 密钥、模型权重或 APK。

## 当前能力

- Frost 任务路由、Taskmaster、确认门、证据记录与本地长期记忆
- 基于高德 JSAPI 的 Action Map：跑步路线、GPS 实际轨迹、偏航重规划
- Her Motion 私有动作会话与本地摄像头兜底运行时
- 餐食照片、包装食品、中国食品范围与恢复餐入口
- Running Coach、healthsync、MediaPipe、Section 11、OpenFoodFacts、Garmin 与 health-coach 的 Frost 协议适配
- Qwen3-4B 统一语义基座的服务器验证脚本与端侧 MNN 路由契约

## Skill 分层

1. **原生专属 Skill**：对摄像头、GPS、地图、持续动画等高频能力，由可信宿主执行。
2. **声明式 Skill**：声明输入、输出、权限、工具和 UI schema，由通用运行时渲染。
3. **Web 沙箱 Skill**：面向第三方开发者的隔离容器；默认无法读取宿主数据，只能通过授权能力桥请求必要数据。

路径规划使用混合方式：Skill 生成标准化 `RouteSession`，宿主中间 Tab 负责地图渲染、定位权限和后台 GPS。这会减少跨沙箱桥接，同时保留 Skill 的可装卸与可测试边界。

## 本地开发

需要 Node.js 18.17 或更高版本。

```bash
cp .env.example .env.local
npm ci
npm run dev -- --host 127.0.0.1 --port 5174
```

打开 `http://127.0.0.1:5174/`。

地图开发者需自行申请高德「Web 端 JS API」Key 和安全密钥，然后填入本机 `.env.local`：

```dotenv
VITE_AMAP_KEY=your_amap_web_jsapi_key_here
VITE_AMAP_SECURITY_JSCODE=your_amap_security_jscode_here
```

真实 Key 不应提交到 Git。生产环境建议通过 `VITE_AMAP_SERVICE_HOST` 配置高德安全代理。

## Qwen 与健康连接器

DashScope Key 必须只配置在服务端，不得使用 `VITE_` 前缀。本地端侧服务可以通过 `MNN_URL` 接入；CPU 服务器上的 Qwen3-4B/llama.cpp 验证见 [`deploy/qwen3-4b-server`](deploy/qwen3-4b-server/README.md)。部署脚本会按需下载约 2.7 GB 的 GGUF 权重，权重不在仓库、项目包或 APK 内。

可选连接器：

```bash
npm run health:install-connectors
npm run health:verify-connectors
```

`HEALTH_SKILL_LOCAL_BRIDGE` 在公网服务上默认必须保持关闭，除非已加入身份验证、限流与审计。

## 可选运行时

- 开发环境内置 Her Motion 的私有摄像头会话兜底。完整 Her Motion 静态运行时在生产环境可单独挂载到 `/her-motion/`。
- 「练了吗」可通过 `VITE_LIANLEMA_URL` 指向本机或授信服务。
- 舌苔观察页随本仓库的 `public/tongue-observer/` 提供，只做观察，不作医疗诊断。

## 验证

```bash
npm run typecheck
npm test
npm run build
```

本仓库尚未添加开源许可证。在正式引入新外部代码或资产前，请先确认上游许可证与再分发条件。
