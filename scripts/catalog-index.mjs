#!/usr/bin/env node
/** 根据 entries/*.json 重建 catalog.json 索引 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const entriesDir = join(root, 'entries')
const catalogPath = join(root, 'catalog.json')

const ids = readdirSync(entriesDir)
  .filter((f) => f.endsWith('.json') && f !== '_template.json')
  .map((f) => f.replace(/\.json$/, ''))
  .sort()

const prev = JSON.parse(readFileSync(catalogPath, 'utf8'))
const catalog = {
  ...prev,
  updatedAt: new Date().toISOString().slice(0, 10),
  entries: ids,
}

writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')
console.log(`✅ catalog.json — ${ids.length} 条`)
