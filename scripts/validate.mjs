#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const entriesDir = join(root, 'entries')
const catalogPath = join(root, 'catalog.json')

const validCategories = new Set(['mcp', 'skill', 'prompt', 'online'])
const slugRe = /^[a-z0-9]+(-[a-z0-9]+)*$/

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'))
const files = readdirSync(entriesDir).filter((f) => f.endsWith('.json') && f !== '_template.json')
const ids = files.map((f) => f.replace(/\.json$/, ''))

let ok = true

for (const id of catalog.entries) {
  if (!ids.includes(id)) {
    console.error(`❌ catalog.json 引用了不存在的条目: ${id}`)
    ok = false
  }
}

for (const file of files) {
  const path = join(entriesDir, file)
  const entry = JSON.parse(readFileSync(path, 'utf8'))
  const id = file.replace(/\.json$/, '')

  if (entry.id !== id) {
    console.error(`❌ ${file}: id 字段 "${entry.id}" 与文件名不一致`)
    ok = false
  }
  if (!slugRe.test(entry.id)) {
    console.error(`❌ ${file}: id 须小写连字符格式`)
    ok = false
  }
  if (!entry.name?.trim() || !entry.description?.trim()) {
    console.error(`❌ ${file}: 缺少 name 或 description`)
    ok = false
  }
  if (!validCategories.has(entry.category)) {
    console.error(`❌ ${file}: category 无效`)
    ok = false
  }
  if (!entry.detail?.features?.length) {
    console.warn(`⚠️  ${file}: detail.features 为空`)
  }
}

const extra = ids.filter((id) => !catalog.entries.includes(id))
if (extra.length) {
  console.warn(`⚠️  未写入 catalog.json 的条目: ${extra.join(', ')}（运行 npm run catalog:index 修复）`)
}

if (ok) {
  console.log(`✅ catalog OK — ${ids.length} 条`)
} else {
  process.exit(1)
}
