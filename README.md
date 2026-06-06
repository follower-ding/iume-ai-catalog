# iume-ai-catalog

精选 **MCP · Cursor Skill · Prompt · 在线工具** 的独立维护仓库。  
博客 [iume-atelier](https://github.com/follower-ding/iume-atelier) 前台 `/tools` 通过同步脚本读取本仓库 JSON，**不进数据库**。

## 目录

```
entries/           每条工具一个 JSON（与 iume-atelier AiToolEntry 同结构）
entries/_template.json
catalog.json       索引清单
scripts/           校验与脚手架
```

## 新增一条（命令行）

```bash
npm run add -- mcp-foo "Foo MCP" mcp 🔌
# 编辑 entries/mcp-foo.json
npm run validate
git add . && git commit -m "feat: add mcp-foo" && git push
```

## 在 Cursor 里收录（推荐）

对 Agent 说：

> **收录到 AI 工具箱**：把 xxx MCP 推到 iume-ai-catalog

会触发技能 `iume-ai-catalog`（见 `.cursor/skills/catalog-add/`）。

## 同步到博客项目

在 `iume-atelier` 根目录：

```bash
npm run catalog:sync
```

将 `entries/*.json` 复制到前端 `src/data/ai-tools/catalog/`，Netlify 构建前执行一次即可。

## 条目 JSON 字段

| 字段 | 说明 |
|------|------|
| `id` | 小写连字符，与文件名一致 |
| `category` | `mcp` \| `skill` \| `prompt` \| `online` |
| `detail.configs` | 可复制的 mcp.json / SKILL.md / Prompt 全文 |
| `url` | 官方链接 |

**勿提交真实 API Key**，用占位符 `YOUR_API_KEY`。

## 首次推 GitHub

```bash
cd iume-ai-catalog
git init
git add .
git commit -m "chore: init iume-ai-catalog with web-to-mcp"
gh repo create iume-ai-catalog --public --source=. --push
```

仓库 URL 示例：`https://github.com/follower-ding/iume-ai-catalog`
