import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'database', 'magic_tower.db'))

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS save_games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    slot_number INTEGER,
    save_data TEXT,
    score INTEGER,
    play_time_seconds INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT,
    score INTEGER,
    floors_cleared INTEGER,
    monsters_killed INTEGER,
    play_time_seconds INTEGER,
    difficulty TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS game_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    music_volume REAL DEFAULT 1.0,
    sfx_volume REAL DEFAULT 1.0,
    movement_speed TEXT DEFAULT 'smooth',
    theme TEXT DEFAULT 'classic',
    auto_save_enabled INTEGER DEFAULT 1,
    show_monster_stats INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`)

// API Routes

// Save/Load
app.post('/api/saves', (req, res) => {
  try {
    const { user_id, slot_number, save_data, score, play_time_seconds } = req.body

    const stmt = db.prepare(`
      INSERT INTO save_games (user_id, slot_number, save_data, score, play_time_seconds)
      VALUES (?, ?, ?, ?, ?)
    `)

    const result = stmt.run(user_id || 'default', slot_number, JSON.stringify(save_data), score, play_time_seconds)

    res.json({ success: true, id: result.lastInsertRowid })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/saves', (req, res) => {
  try {
    const { user_id } = req.query
    const stmt = db.prepare('SELECT * FROM save_games WHERE user_id = ? ORDER BY updated_at DESC')
    const saves = stmt.all(user_id || 'default')

    res.json({ success: true, saves })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.get('/api/saves/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM save_games WHERE id = ?')
    const save = stmt.get(req.params.id)

    if (!save) {
      return res.status(404).json({ success: false, error: 'Save not found' })
    }

    res.json({ success: true, save: { ...save, save_data: JSON.parse(save.save_data) } })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.put('/api/saves/:id', (req, res) => {
  try {
    const { save_data, score, play_time_seconds } = req.body

    const stmt = db.prepare(`
      UPDATE save_games
      SET save_data = ?, score = ?, play_time_seconds = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    stmt.run(JSON.stringify(save_data), score, play_time_seconds, req.params.id)

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.delete('/api/saves/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM save_games WHERE id = ?')
    stmt.run(req.params.id)

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
  try {
    const { limit = 10 } = req.query
    const stmt = db.prepare('SELECT * FROM leaderboard ORDER BY score DESC LIMIT ?')
    const leaderboard = stmt.all(limit)

    res.json({ success: true, leaderboard })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.post('/api/leaderboard', (req, res) => {
  try {
    const { player_name, score, floors_cleared, monsters_killed, play_time_seconds, difficulty } = req.body

    const stmt = db.prepare(`
      INSERT INTO leaderboard (player_name, score, floors_cleared, monsters_killed, play_time_seconds, difficulty)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(player_name, score, floors_cleared, monsters_killed, play_time_seconds, difficulty)

    res.json({ success: true, id: result.lastInsertRowid })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Settings
app.get('/api/settings', (req, res) => {
  try {
    const { user_id } = req.query
    const stmt = db.prepare('SELECT * FROM game_settings WHERE user_id = ?')
    const settings = stmt.get(user_id || 'default')

    if (!settings) {
      // Return default settings
      return res.json({
        success: true,
        settings: {
          music_volume: 1.0,
          sfx_volume: 1.0,
          movement_speed: 'smooth',
          theme: 'classic',
          auto_save_enabled: true,
          show_monster_stats: true
        }
      })
    }

    res.json({ success: true, settings })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

app.put('/api/settings', (req, res) => {
  try {
    const { user_id, music_volume, sfx_volume, movement_speed, theme, auto_save_enabled, show_monster_stats } = req.body

    const stmt = db.prepare(`
      INSERT INTO game_settings (user_id, music_volume, sfx_volume, movement_speed, theme, auto_save_enabled, show_monster_stats)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        music_volume = excluded.music_volume,
        sfx_volume = excluded.sfx_volume,
        movement_speed = excluded.movement_speed,
        theme = excluded.theme,
        auto_save_enabled = excluded.auto_save_enabled,
        show_monster_stats = excluded.show_monster_stats,
        updated_at = CURRENT_TIMESTAMP
    `)

    stmt.run(user_id || 'default', music_volume, sfx_volume, movement_speed, theme, auto_save_enabled ? 1 : 0, show_monster_stats ? 1 : 0)

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Magic Tower backend server running on port ${PORT}`)
  console.log(`API available at http://localhost:${PORT}`)
})
