# Python 重构后端 + 自动化数据爬取计划

## 概述

将现有 Node.js Express 后端用 Python FastAPI 重构，并新增数据爬取模块 + GitHub Actions 定时任务，实现每日自动更新比赛结果数据。

## 可行性分析

**完全可行**，理由：
- 后端逻辑简单（6个文件，~600行JS），Python 生态有更好的爬虫库
- FastAPI 性能优于 Express，自带 OpenAPI 文档
- Python 爬虫库（httpx + BeautifulSoup）远比 Node.js 成熟
- Vercel 支持 Python（Serverless Functions），零成本部署

## 当前架构

```
backend/src/
├── index.js        # Express 入口（45行）
├── routes.js       # API 路由（129行）- 5个端点
├── engine.js       # 预测引擎（247行）- Logistic回归+Poisson分布
├── aggregator.js   # 外部预测聚合（116行）- 模拟7个平台
├── repository.js   # 数据层（172行）- Supabase/JSON双模式
├── models.js       # 模型定义（69行）- 常量+验证
└── seedData.js     # 种子数据（~800行）- 16场比赛
```

API 端点：
- `GET /api/matches?date=` — 按日期查询比赛
- `GET /api/matches/:id` — 单场比赛详情
- `GET /api/predict/:matchId/full` — 完整预测数据
- `POST /api/admin/seed` — 初始化种子数据
- `POST /api/admin/matches` — 手动录入比赛

## 重构方案

### 新目录结构

```
backend/
├── api/                     # FastAPI 应用（Vercel Serverless）
│   ├── __init__.py
│   ├── main.py              # FastAPI 入口 + 路由
│   ├── engine.py            # 预测引擎（1:1移植）
│   ├── aggregator.py        # 外部预测聚合（1:1移植）
│   ├── repository.py        # 数据层（JSON文件存储）
│   ├── models.py            # Pydantic 数据模型
│   └── seed_data.py         # 种子数据（1:1移植）
├── scraper/                 # 数据爬取模块（新增）
│   ├── __init__.py
│   ├── fifa.py              # FIFA官网爬取
│   ├── flashscore.py        # FlashScore爬取
│   ├── merger.py            # 多源数据合并+校验
│   └── run.py               # 爬取入口脚本
├── data/                    # JSON数据存储
├── requirements.txt
├── vercel.json              # Vercel部署配置
└── pyproject.toml
```

### 文件变更详情

#### 1. `api/main.py` — FastAPI 入口+路由
- 替代 `index.js` + `routes.js`
- 5个API端点 1:1 对应
- 新增 `GET /api/health` 健康检查
- 使用 Pydantic 模型做请求/响应校验

#### 2. `api/engine.py` — 预测引擎
- 1:1 移植 `engine.js` 的 PredictionEngine 类
- Logistic回归 + Poisson分布算法不变
- Python 的 `math` 库完全覆盖所需函数

#### 3. `api/aggregator.py` — 外部预测聚合
- 1:1 移植 `aggregator.js`
- 7个平台模板保持一致

#### 4. `api/repository.py` — 数据层
- 移植 `repository.js` 的 JSON 文件存储模式
- 暂不集成 Supabase（后续按需添加）
- 使用 `aiofiles` 异步读写 JSON

#### 5. `api/models.py` — Pydantic 数据模型
- 替代 `models.js`
- 用 Pydantic BaseModel 定义 Match、Team、Prediction 等
- 自动生成 OpenAPI 文档

#### 6. `api/seed_data.py` — 种子数据
- 1:1 移植 `seedData.js` 的16场比赛数据
- Python 字典格式

#### 7. `scraper/fifa.py` — FIFA 官网爬取
- 爬取 https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/2026
- 获取：比赛日程、比分、进球时间轴、球员信息
- 使用 httpx + BeautifulSoup

#### 8. `scraper/flashscore.py` — FlashScore 爬取
- 爬取 https://www.flashscore.com/football/world/world-championship/
- 作为第二数据源交叉验证
- 获取：比分、进球详情、比赛状态

#### 9. `scraper/merger.py` — 多源数据合并
- 合并 FIFA + FlashScore 数据
- 比对验证：比分一致性、球员名一致性
- 冲突时以 FIFA 为准
- 输出合并后的 JSON 到 `data/matches.json`

#### 10. `scraper/run.py` — 爬取入口
- CLI 入口：`python -m scraper.run`
- 支持参数：`--date 2026-06-16`（指定日期）
- 输出更新后的数据文件

#### 11. `vercel.json` — Vercel 部署配置
- 将 FastAPI 应用配置为 Vercel Serverless Function
- 路由映射：`/api/*` → `api/main.py`

#### 12. `.github/workflows/scrape.yml` — GitHub Actions 定时任务
- cron: `0 6,14 * *`（北京时间14:00和22:00，覆盖比赛结束时段）
- 执行爬取脚本
- 检测数据变更后自动 commit + push
- 触发 Vercel 自动部署

#### 13. `requirements.txt` — Python 依赖
- fastapi, uvicorn, httpx, beautifulsoup4, aiofiles, pydantic

### 前端适配

#### `src/repository/apiRepository.ts`
- 修改 API 基础路径指向 Vercel 部署地址
- 响应格式不变（`{ success, data }`）

#### `src/manifest.json`
- `mp-weixin.setting.urlCheck` 保持 `true`
- 需在微信公众平台添加 Vercel 域名到白名单

### 删除旧文件
- `backend/src/` 目录下所有 `.js` 文件
- `backend/package.json`（替换为 requirements.txt）

## 执行步骤

1. 创建 Python 后端目录结构和依赖文件
2. 移植 engine.py（预测引擎）
3. 移植 aggregator.py（外部预测聚合）
4. 移植 models.py（Pydantic 模型）
5. 移植 seed_data.py（种子数据）
6. 移植 repository.py（数据层）
7. 编写 main.py（FastAPI 路由）
8. 编写 vercel.json（部署配置）
9. 编写爬取模块（scraper/）
10. 编写 GitHub Actions 工作流
11. 更新前端 apiRepository.ts
12. 本地测试 API
13. 部署到 Vercel

## 假设与决策

- **不集成 Supabase**：当前用 JSON 文件存储足够，Vercel Serverless 有只读文件系统限制，数据通过 GitHub 仓库存储
- **爬取源优先级**：FIFA 官网 > FlashScore，冲突以 FIFA 为准
- **Vercel 部署**：使用 Python Runtime，免费额度足够
- **数据更新方式**：GitHub Actions 爬取 → commit 到 data/ → Vercel 自动重新部署
- **API 响应格式**：保持 `{ success: true, data: {...} }` 不变，前端无需改动

## 验证步骤

1. 本地启动 FastAPI：`uvicorn api.main:app --reload`
2. 测试所有5个API端点返回正确数据
3. 运行爬取脚本验证数据获取
4. 部署到 Vercel 后测试线上 API
5. 小程序切换到 API 模式验证完整功能
