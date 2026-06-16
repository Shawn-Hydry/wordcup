/**
 * 数据仓库
 * 策略：优先 Supabase 云数据库，不可用时回退到本地 JSON 文件存储
 */
const fs = require('fs')
const path = require('path')

// Supabase 配置（可通过环境变量覆盖）
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_KEY || ''

let supabase = null
if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    const { createClient } = require('@supabase/supabase-js')
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    console.log('[Repo] Supabase 已连接')
  } catch (e) {
    console.warn('[Repo] Supabase 初始化失败，使用 JSON 存储:', e.message)
  }
}

// JSON 文件存储路径
const DATA_DIR = path.join(__dirname, '..', 'data')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readJSON(filename) {
  ensureDir()
  const filePath = path.join(DATA_DIR, filename)
  if (!fs.existsSync(filePath)) return null
  try { return JSON.parse(fs.readFileSync(filePath, 'utf-8')) } catch { return null }
}

function writeJSON(filename, data) {
  ensureDir()
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8')
}

// ============ 比赛数据 CRUD ============

async function getMatchesByDate(date) {
  if (supabase) {
    const { data } = await supabase.from('matches').select('*').eq('match_date', date)
    return data || []
  }
  const all = readJSON('matches.json') || []
  return all.filter(m => m.matchDate === date)
}

async function getAllMatches() {
  if (supabase) {
    const { data } = await supabase.from('matches').select('*').order('match_date', { ascending: true })
    return data || []
  }
  return readJSON('matches.json') || []
}

async function saveMatch(match) {
  if (supabase) {
    const { data, error } = await supabase.from('matches').upsert(match).select()
    if (error) throw error
    return data[0]
  }
  const all = readJSON('matches.json') || []
  const idx = all.findIndex(m => m.id === match.id)
  if (idx >= 0) all[idx] = match
  else all.push(match)
  writeJSON('matches.json', all)
  return match
}

// ============ 预测数据 ============

async function getFullPrediction(matchId) {
  if (supabase) {
    const [matchRes, predRes] = await Promise.all([
      supabase.from('matches').select('*').eq('id', matchId).single(),
      supabase.from('predictions').select('*').eq('match_id', matchId).single()
    ])
    return { match: matchRes.data, prediction: predRes.data }
  }
  const match = (readJSON('matches.json') || []).find(m => m.id === matchId)
  const prediction = (readJSON('predictions.json') || []).find(p => p.matchId === matchId)
  return { match, prediction }
}

async function savePrediction(prediction) {
  if (supabase) {
    const { data, error } = await supabase.from('predictions').upsert({
      match_id: prediction.matchId,
      prediction_data: prediction,
      generated_at: new Date().toISOString()
    }).select()
    if (error) throw error
    return data[0]
  }
  const all = readJSON('predictions.json') || []
  const idx = all.findIndex(p => p.matchId === prediction.matchId)
  if (idx >= 0) all[idx] = prediction
  else all.push(prediction)
  writeJSON('predictions.json', all)
  return prediction
}

// ============ 外部预测 ============

async function getExternalPredictions(matchId) {
  if (supabase) {
    const { data } = await supabase.from('external_predictions').select('*').eq('match_id', matchId)
    return data || []
  }
  const all = readJSON('external_predictions.json') || []
  return all.filter(p => p.matchId === matchId)
}

async function saveExternalPredictions(matchId, predictions) {
  if (supabase) {
    // 先删除旧的
    await supabase.from('external_predictions').delete().eq('match_id', matchId)
    if (predictions.length > 0) {
      const rows = predictions.map(p => ({ match_id: matchId, ...p }))
      await supabase.from('external_predictions').insert(rows)
    }
  }
  const all = readJSON('external_predictions.json') || []
  const filtered = all.filter(p => p.matchId !== matchId)
  const newItems = predictions.map(p => ({ matchId, ...p }))
  writeJSON('external_predictions.json', [...filtered, ...newItems])
  return predictions
}

// ============ 球员状态 ============

async function getPlayerStatus(matchId) {
  if (supabase) {
    const { data } = await supabase.from('player_status').select('*').eq('match_id', matchId).single()
    return data?.player_data || null
  }
  const all = readJSON('player_status.json') || []
  return all.find(p => p.matchId === matchId) || null
}

async function savePlayerStatus(matchId, statusData) {
  if (supabase) {
    await supabase.from('player_status').upsert({
      match_id: matchId,
      player_data: statusData,
      updated_at: new Date().toISOString()
    })
  }
  const all = readJSON('player_status.json') || []
  const idx = all.findIndex(p => p.matchId === matchId)
  if (idx >= 0) all[idx] = { matchId, ...statusData }
  else all.push({ matchId, ...statusData })
  writeJSON('player_status.json', all)
  return statusData
}

module.exports = {
  getMatchesByDate,
  getAllMatches,
  saveMatch,
  getFullPrediction,
  savePrediction,
  getExternalPredictions,
  saveExternalPredictions,
  getPlayerStatus,
  savePlayerStatus
}