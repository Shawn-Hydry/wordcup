# 数据获取计划：从 Mock 到真实数据

## 现状分析

### 当前数据流路径

```
前端页面(index.vue)
  → Pinia Store (prediction.ts)
    → Repository 工厂 (index.ts) → 当前始终返回 MockRepository
      → MockRepository (mockRepository.ts) → 返回硬编码的本地 Mock 数据

后端 API（已就绪但前端未对接）
  Express (index.js:3001)
    → Routes (/api/matches, /api/predict/:matchId/full)
      → Engine (AI预测引擎: Logistic回归+多因子+Poisson比分)
      → Aggregator (7个外部预测源模板)
      → Repository (Supabase/JSON双模式持久化)
      → SeedData (4场比赛种子数据)
```

### 各展示区域当前数据来源

| 展示区域 | 前端组件 | 数据类型 | 当前来源 | 后端API |
|---------|---------|---------|---------|---------|
| 日期选择器 | index.vue 内联 | 日期字符串 | 前端计算 | 无需 |
| 比赛选择器 | index.vue 内联 | Match[] | MockRepository (1场) | GET /api/matches?date= |
| 比赛信息头 | index.vue 内联 | Match | MockRepository | GET /api/matches/:id |
| 胜负预测 | WinPredict.vue | WinPrediction | MockRepository (硬编码) | engine.generate() |
| 球员状态 | PlayerStatus.vue | PlayerStatusData | MockRepository (硬编码) | seedPlayerData |
| 比分预测 | ScorePredict.vue | ScorePrediction | MockRepository (硬编码) | engine._predictScores() |
| 平台汇总 | ExternalPredict.vue | ExternalPredictData | MockRepository (硬编码) | aggregator (7源模板) |

### 核心问题

1. **前端未对接后端API**：Repository 工厂始终返回 MockRepository，未实现 ApiRepository
2. **Mock 数据只有1场比赛**：seedData 有4场，但前端 mock/data.ts 只导出1场
3. **后端数据也是模拟的**：engine/aggregator 基于模板生成，非真实数据
4. **seedPlayerData 不完整**：只有 match-001 有球员数据，其余3场为空
5. **后端 seedData 的 Team 模型与前端 types.ts 不一致**：后端 Team 有 style/defenseStyle/attackStyle/starPlayer/coach/coachStyle 等字段，前端 Team 只有基础字段

---

## 实施计划

### 阶段一：前端对接后端 API（MockRepository → ApiRepository）

**目标**：让前端通过 HTTP 请求获取后端已生成的预测数据，替代硬编码 Mock

#### 1.1 新建 `src/repository/apiRepository.ts`

实现 `IPredictionRepository` 接口，通过 `uni.request` 调用后端 API：

- `getMatchesByDate(date)` → `GET /api/matches?date={date}`
- `getFullPrediction(matchId)` → `GET /api/predict/{matchId}/full`
- `getWinPrediction(matchId)` → 从 fullPrediction 中提取
- `getPlayerStatus(matchId)` → 从 fullPrediction 中提取
- `getScorePrediction(matchId)` → 从 fullPrediction 中提取
- `getExternalPredict(matchId)` → 从 fullPrediction 中提取

API 基地址配置：从环境变量或配置文件读取，开发环境默认 `http://localhost:3001`

#### 1.2 更新 `src/repository/index.ts` 工厂函数

```typescript
// 根据环境变量切换
const USE_API = import.meta.env.VITE_USE_API === 'true'
const repo = USE_API ? new ApiRepository() : new MockRepository()
```

#### 1.3 补全 Mock 数据（保持离线可用）

在 `src/mock/data.ts` 中补充其余3场比赛数据（match-002/003/004），使 Mock 模式也能展示完整内容。

#### 1.4 修复后端 API 返回格式与前端类型对齐

后端 `/api/predict/:matchId/full` 返回的 Team 对象包含额外字段（style, defenseStyle 等），前端需兼容处理（忽略多余字段即可，TypeScript 结构子类型天然兼容）。

---

### 阶段二：后端数据源真实化

**目标**：将后端从"模板生成"升级为"真实数据驱动"

#### 2.1 比赛数据源

| 数据项 | 当前 | 目标 | 方案 |
|-------|------|------|------|
| 赛程/对阵 | seedData 硬编码 | 真实世界杯赛程 | 方案A: API-Football (api-football.com) 付费接口<br>方案B: 手动录入 + Admin API 管理<br>方案C: 爬取 FIFA 官网赛程 |
| 球队排名 | seedData 硬编码 | FIFA 官方实时排名 | 同上，API-Football 包含排名数据 |

**推荐**：方案B（手动录入）作为 MVP，后续接入 API-Football

#### 2.2 AI 预测引擎数据输入

| 数据项 | 当前 | 目标 | 方案 |
|-------|------|------|------|
| 近期战绩 (homeRecent/awayRecent) | seedStats 硬编码 | 真实近5场结果 | API-Football `fixtures` 接口 |
| 交锋记录 (h2hWins) | seedStats 硬编码 | 真实 H2H 数据 | API-Football `fixtures/headtohead` |
| 场均进球 (homeGoalsAvg) | seedStats 硬编码 | 真实赛季统计 | API-Football `teams/statistics` |
| 伤病 (homeInjuries) | seedStats 硬编码 | 真实伤病名单 | API-Football `injuries` 接口 |

**推荐**：先保持 seedStats 模式，增加 Admin API 手动更新入口；后续接入 API-Football

#### 2.3 球员状态数据

| 数据项 | 当前 | 目标 | 方案 |
|-------|------|------|------|
| 球员名单 | seedPlayerData (仅match-001) | 全部比赛完整名单 | 方案A: API-Football `players/squads`<br>方案B: 手动维护 JSON 文件 |
| 近期表现 (recentForm/Goals/Assists) | 硬编码 | 真实赛季数据 | API-Football `players/{id}` 统计 |
| 伤病状态 | 硬编码 | 真实伤病报告 | API-Football `injuries` |

**推荐**：先补全4场比赛的 seedPlayerData，后续接入 API

#### 2.4 外部预测聚合

| 数据项 | 当前 | 目标 | 方案 |
|-------|------|------|------|
| OPTA/FiveThirtyEight 等 | 模板生成文本 | 真实平台预测 | 方案A: 爬虫抓取（法律风险）<br>方案B: 人工录入 + Admin API<br>方案C: 仅保留 AI 引擎自研预测 |
| 专家评论 | 模板生成 | 真实评论摘要 | 人工摘录 |

**推荐**：方案B+C，保留 AI 引擎预测作为核心，外部来源改为人工录入

---

### 阶段三：数据更新自动化

**目标**：比赛日自动更新数据，无需人工干预

#### 3.1 定时任务（Node.js cron）

- **每日 08:00**：拉取次日赛程，更新比赛列表
- **赛前 4 小时**：更新球员伤病状态、首发阵容预测
- **赛前 1 小时**：更新外部预测来源
- **赛后**：更新实际比分，校准预测模型

#### 3.2 缓存策略

- 比赛列表：缓存到次日过期
- 预测数据：生成后缓存，赛前1小时刷新
- 球员状态：赛前4小时刷新
- 外部预测：赛前1小时刷新

#### 3.3 数据版本管理

- 每次预测生成记录 `generatedAt` 时间戳
- 前端展示"预测更新时间"
- 支持预测历史对比

---

### 阶段四：微信小程序部署适配

**目标**：适配小程序网络请求限制

#### 4.1 网络请求

- 小程序要求 HTTPS + 域名备案
- `uni.request` 替代 `fetch/axios`
- API 基地址从 localhost 改为正式域名

#### 4.2 数据安全

- API Key 不暴露到前端
- 后端代理第三方 API 调用
- 请求频率限制

---

## 实施优先级

| 优先级 | 任务 | 工作量 | 价值 |
|-------|------|-------|------|
| **P0** | 1.1 新建 ApiRepository | 小 | 前后端打通，数据实时化 |
| **P0** | 1.2 更新工厂函数 | 小 | 支持环境切换 |
| **P0** | 1.3 补全 Mock 数据 | 中 | 离线可用，4场比赛完整展示 |
| **P1** | 2.3 补全 seedPlayerData | 小 | 4场比赛球员数据完整 |
| **P1** | 2.1 Admin API 管理比赛 | 中 | 支持手动录入赛程 |
| **P2** | 2.2 接入 API-Football | 大 | 数据真实化 |
| **P2** | 3.1 定时任务 | 中 | 自动化更新 |
| **P3** | 3.2-3.3 缓存与版本 | 中 | 性能与可追溯 |
| **P3** | 4.x 小程序部署适配 | 大 | 生产环境上线 |

---

## 假设与决策

1. **先打通前后端再真实化数据**：ApiRepository 优先于真实数据源接入
2. **Mock 模式长期保留**：作为离线开发/演示用途
3. **API-Football 为最终数据源**：但 MVP 阶段用手动录入
4. **外部预测保留模板生成**：真实爬取有法律风险，改为人工录入 + AI 引擎自研
5. **后端 Team 额外字段不破坏前端**：TypeScript 结构子类型兼容，前端忽略多余字段
