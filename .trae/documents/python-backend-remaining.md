# Python 后端重构计划 - 完成剩余工作

## 概要

Python FastAPI 后端重构已完成 10/12 步骤，核心模块全部就绪。本计划聚焦剩余 2 步 + 部署验证。

## 当前状态分析

### 已完成（10/12）

| 模块 | 文件 | 状态 |
|------|------|------|
| FastAPI 入口 | `backend/api/main.py` | 5个API端点，1:1对应Express路由 |
| 预测引擎 | `backend/api/engine.py` | Logistic回归+Poisson分布，完整移植 |
| 外部预测聚合 | `backend/api/aggregator.py` | 7个平台模板，完整移植 |
| 数据模型 | `backend/api/models.py` | Pydantic模型，含Team/Match/GoalEvent等 |
| 种子数据 | `backend/api/seed_data.py` | 16场比赛+球员+统计，完整移植 |
| 数据仓库 | `backend/api/repository.py` | JSON文件存储，异步读写 |
| 爬虫-FIFA | `backend/scraper/fifa.py` | httpx+BeautifulSoup框架 |
| 爬虫-FlashScore | `backend/scraper/flashscore.py` | 第二数据源框架 |
| 数据合并 | `backend/scraper/merger.py` | FIFA优先+FlashScore验证 |
| 部署配置 | `backend/vercel.json` + `requirements.txt` + `.github/workflows/scrape.yml` | Vercel Python Runtime + GitHub Actions |

### 待完成（2/12 + 部署）

1. **更新前端 apiRepository.ts** - API基础路径从 `localhost:3001` 改为环境变量配置
2. **本地测试 Python FastAPI** - 安装依赖、启动服务、验证5个API端点
3. **部署到 Vercel** - 推送代码、配置项目、验证线上API
4. **微信域名白名单** - 添加Vercel域名
5. **清理旧Node.js后端** - 删除 `backend/src/` 目录

## 可行性评估

**结论：完全可行，且已基本完成。**

优势：
- Python FastAPI 与原 Express 路由 1:1 对应，API契约不变
- Pydantic 提供运行时类型校验，比 JS 更安全
- httpx 异步HTTP客户端，与 FastAPI 异步生态一致
- Vercel 原生支持 Python Runtime（@vercel/python）
- GitHub Actions + Python 成熟稳定

风险点：
- `models.py` 第92行 `Optional[Any]` 未导入 `Any`，需修复
- Vercel Serverless Functions 冷启动约1-2秒，首次请求偏慢
- 爬虫模块的选择器是框架代码，需根据实际页面调整
- Vercel 免费版有执行时间限制（10秒/函数），爬虫可能超时

## 实施步骤

### 步骤1：修复 models.py 导入问题

**文件**: `backend/api/models.py`
**问题**: 第92行使用了 `Optional[Any]` 但未导入 `Any`
**修改**: 添加 `from typing import Optional, Any`

### 步骤2：更新前端 apiRepository.ts

**文件**: `src/repository/apiRepository.ts`
**当前**: `const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'`
**修改为**: 支持开发/生产环境切换
```typescript
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
```
> FastAPI 默认端口是 8000（uvicorn），不是 3001（Express）

### 步骤3：本地测试 Python FastAPI

1. 安装依赖: `cd backend && pip install -r requirements.txt`
2. 启动服务: `uvicorn api.main:app --reload --port 8000`
3. 测试端点:
   - `GET /health`
   - `POST /api/admin/seed` (初始化种子数据)
   - `GET /api/matches?date=2026-06-16`
   - `GET /api/matches/A1`
   - `GET /api/predict/match-001/full`

### 步骤4：部署到 Vercel

1. 推送代码到 GitHub
2. 在 Vercel 导入项目，Root Directory 设为 `backend`
3. 验证线上API可访问
4. 获取 Vercel 分配的域名

### 步骤5：微信域名白名单

在微信公众平台 → 开发管理 → 服务器域名，添加 Vercel 域名到 request 合法域名

### 步骤6：清理旧 Node.js 后端

删除 `backend/src/` 目录下的7个文件：
- `index.js`, `routes.js`, `engine.js`, `aggregator.js`, `repository.js`, `models.js`, `seedData.js`

## 验证标准

- [ ] `GET /health` 返回 `{"status": "ok"}`
- [ ] `POST /api/admin/seed` 返回16场比赛初始化成功
- [ ] `GET /api/matches?date=2026-06-16` 返回当日比赛
- [ ] `GET /api/predict/match-001/full` 返回完整预测数据
- [ ] 前端切换 `VITE_USE_API=true` 后能正常加载数据
- [ ] Vercel 线上API可正常访问
