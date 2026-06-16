const express = require('express')
const cors = require('cors')
const routes = require('./routes')

const path = require('path')
const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())

// 请求日志
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - start
    console.log(`${req.method} ${req.url} ${res.statusCode} ${ms}ms`)
  })
  next()
})

// API 路由（优先于静态文件）
app.use('/api', routes)

// 静态文件: 允许前端通过同一端口访问
app.use(express.static(path.join(__dirname, '..', '..')))

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() })
})

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not Found' })
})

app.listen(PORT, () => {
  console.log(`\n🏆 世界杯预测 API 已启动`)
  console.log(`📡 地址: http://localhost:${PORT}`)
  console.log(`📋 接口: http://localhost:${PORT}/api/matches`)
  console.log(`🔮 预测: http://localhost:${PORT}/api/predict/match-001/full`)
  console.log(`⚙️  初始化: POST http://localhost:${PORT}/api/admin/seed\n`)
})