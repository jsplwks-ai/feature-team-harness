---
name: feature-team-harness
description: Feature Team Harness 入口。多 Agent 協作的需求分析與開發流程（需求分析→規格草稿→架構評審→實作→獨立審查→回饋）。僅能由使用者輸入 /feature-team-harness 手動啟動。
disable-model-invocation: true
---

# Feature Team Harness 入口

本 Skill 只負責啟動，流程內容全部位於 `~/.claude/harness/feature-team-harness/`。

- 初始需求描述（可為空）：$ARGUMENTS
- Claude Code Session ID：${CLAUDE_SESSION_ID}

## 啟動步驟

1. 以 Bash 解析 Harness 絕對路徑，作為 `HARNESS_ROOT`：
   `cd ~/.claude/harness/feature-team-harness && (pwd -W 2>/dev/null || pwd)`
2. 確認上方 Session ID 是否為實際 ID（UUID 格式）。若仍是未替換的變數字面，改用 `date +%Y%m%d-%H%M%S` 產生識別碼，並在工作紀錄註明「非 Claude Session ID」。
3. Read `HARNESS_ROOT/AGENTS.md`，以 **Coordinator** 身分依其指示執行。
4. 將初始需求描述帶入 Phase 1。
