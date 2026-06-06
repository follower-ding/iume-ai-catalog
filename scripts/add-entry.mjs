#!/usr/bin/env node
/**
 * 新增 catalog 条目
 * npm run add -- web-to-mcp "Web to MCP" online 🌐
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const entriesDir = join(root, 'entries')
const catalogPath = join(root, 'catalog.json')
const templatePath = join(entriesDir, '_template.json')

const [id, name, category, icon = '🔌'] = process.argv.slice(2)
const valid = new Set(['mcp', 'skill', 'prompt', 'online'])

if (!id || !name || !category) {
  console.error('用法: npm run add -- <id> "<名称>" <category> [icon]')
  process.exit(1)
}

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
  console.error('❌ id 须小写连字符，如 mcp-playwright')
  process.exit(1)
}

if (!valid.has(category)) {
  console.error(`❌ category: ${[...valid].join(' | ')}`)
  process.exit(1)
}

const target = join(entriesDir, `${id}.json`)
if (existsSync(target)) {
  console.error(`❌ 已存在 ${target}`)
  process.exit(1)
}

copyFileSync(templatePath, target)
let raw = readFileSync(target, 'utf8')
const entry = JSON.parse(raw)
entry.id = id
entry.name = name
entry.category = category
entry.icon = icon
if (entry.detail?.configs?.[0]) {
  entry.detail.configs[0].id = `${id}-config`
}
writeFileSync(target, JSON.stringify(entry, null, 2) + '\n', 'utf8')

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'))
if (!catalog.entries.includes(id)) {
  catalog.entries.push(id)
  catalog.updatedAt = new Date().toISOString().slice(0, 10)
  writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + '\n', 'utf8')
}

console.log(`✅ 已创建 entries/${id}.json 并更新 catalog.json\n下一步: 编辑 JSON → npm run validate → git commit → git push`)
