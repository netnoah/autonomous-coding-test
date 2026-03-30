import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read frontend port from .claude_settings.json
const claudeSettings = JSON.parse(fs.readFileSync(`${__dirname}/.claude_settings.json`, 'utf8'))
const frontendPort = claudeSettings.frontend_port || 3000

export default defineConfig({
  plugins: [react()],
  server: {
    port: frontendPort,
    host: true
  }
})
