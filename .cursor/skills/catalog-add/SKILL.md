---
name: catalog-add
description: >-
  向 iume-ai-catalog 仓库新增 MCP、Cursor Skill、Prompt 或在线工具条目。
  在用户说「收录到工具箱」「推到 catalog」「保存这个 MCP/Skill」时使用。
---

# 收录到 iume-ai-catalog

## 仓库位置

优先顺序：

1. 工作区内的 `iume-ai-catalog/`（与 iume-atelier 同级）
2. 用户指定的 catalog 克隆路径
3. 若不存在，提示用户 clone：`git clone https://github.com/follower-ding/iume-ai-catalog.git`

## 工作流

1. **确认类型**：`mcp` | `skill` | `prompt` | `online`
2. **生成 slug**：小写连字符，如 `mcp-context7`、`skill-api-sync`
3. **创建文件**：`entries/{slug}.json`（复制 `entries/_template.json` 结构）
4. **填写内容**（中文、可执行）：
   - `description`：卡片一句话
   - `detail.install` / `setup` / `usage`：步骤列表
   - `detail.configs[0].content`：**完整可复制**的 mcp.json / SKILL.md / Prompt
   - MCP 必须含 `mcpServers` 片段；Skill 放 SKILL 正文；Prompt 放全文
5. **更新** `catalog.json` 的 `entries` 数组（追加 slug，`updatedAt` 改为今天）
6. **校验**：在 catalog 根目录运行 `npm run validate`
7. **提交**（用户明确要求时）：
   ```bash
   git add entries/{slug}.json catalog.json
   git commit -m "feat(catalog): add {slug}"
   git push origin main
   ```
8. **同步博客**（若 iume-atelier 在同一工作区）：
   ```bash
   cd ../iume-atelier && npm run catalog:sync
   ```

## 质量要求

- 从官方 README / 用户粘贴文档提取**真实**配置，勿编造包名
- 密钥用 `YOUR_API_KEY` 占位，禁止提交真实 sk- 密钥
- `id` 与文件名一致；不与 `catalog.json` 已有 slug 重复
- 若用户只给了链接，可简要搜索或请用户粘贴官方 MCP 配置后再写入

## 示例触发语

- 「把这个 MCP 收录到工具箱并 push」
- 「Web to MCP 加到 catalog」
- 「发现一个好用的 Skill，推到 iume-ai-catalog」
