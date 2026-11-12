# Feature Team Harness

多個專業 Agent 協作的 Claude Code 需求分析與開發流程。

版本：v0.1.1（變更紀錄見 [`evaluations/harness-changelog.md`](evaluations/harness-changelog.md)）

## 專案目的

把一個功能需求從「模糊描述」推進到「經過審查的實作」，並在過程中：

- **分工明確**：由 Coordinator 調度 Analyst、Architect、Developer、Reviewer 四個獨立 Subagent，各自只做份內工作。
- **以交叉審核降低錯誤**：實作計畫與程式碼皆經多位評審者交叉審核與投票（小型需求可改用輕量模式）。
- **人在關鍵點把關**：需求範圍、實作計畫、重大風險、刪除檔案等關卡須使用者確認；測試執行與 Git 寫入另有確認規範。
- **流程可追溯**：狀態寫入工作紀錄檔，不依賴對話 Context；設計決策以 ADR 保存於專案記憶。

## 流程概覽

| Phase | 名稱 | 說明 |
|---|---|---|
| 1 | Initialization 初始化 | 解析路徑、建立或接續工作紀錄 |
| 2 | Requirement Analysis 需求分析 | 釐清需求、確認範圍、決定評審模式 |
| 3 | Specification Management 規格草稿 | 產出規格草稿 |
| 4 | Architecture & Planning 架構與實作計畫 | 初版計畫、交叉評審、整合最終計畫 |
| 5 | Implementation 實作 | 依核准 Task 逐一實作並撰寫測試 |
| 6 | Independent Review 獨立審查 | 唯讀審查 Diff 與測試結果，通過後正式寫入規格 |
| 7 | Feedback & Shutdown 回饋與結束 | 最終報告、品質評估、清理 |

各階段細節見 [`workflows/`](workflows/)。

### 角色

| 角色 | 執行方式 | 職責 |
|---|---|---|
| Coordinator | 主線（執行 Skill 的 Claude） | 調度流程、轉達、關卡確認 |
| Analyst | Subagent `feature-analyst` | 需求整理、規格草稿 |
| Architect | Subagent `feature-architect` | 實作計畫、架構評審與投票（不改功能程式） |
| Developer | Subagent `feature-developer` | 一次只做一個核准 Task，不做 Git 寫入 |
| Reviewer | Subagent `feature-reviewer` | 審查（對專案唯讀，只寫入審查結果檔） |

### 評審模式

- **標準模式**：架構評審與程式碼審查各有三位評審者，兩輪交叉審核與投票。
- **輕量模式**：各只有一位評審者，不投票，適用小型需求以降低 Token 成本。

Phase 2 由 Coordinator 依需求規模建議模式，詳見 [`core/review-modes.md`](core/review-modes.md)。

## 安裝

需求：Node.js 20 以上、Claude Code。

```bash
node install/install.js --dry-run   # 預覽要安裝的檔案
node install/install.js             # 安裝或更新
```

- 預設安裝到 `CLAUDE_CONFIG_DIR` 或 `~/.claude`，可用 `--target <目錄>` 指定。Skill 入口固定讀取 `~/.claude/harness/feature-team-harness/`，安裝到其他目錄時流程無法啟動。
- Harness 本體安裝到 `~/.claude/harness/feature-team-harness/`；Skill 入口與 Subagent 定義安裝到 `~/.claude/skills/`、`~/.claude/agents/`。
- 被覆蓋的既有檔案會先備份到 `~/.claude/backups/feature-team-harness/<時間>/`。
- 安裝後須重新啟動 Claude Code。

解除安裝與匯出：

```bash
node install/uninstall.js                  # 預覽
node install/uninstall.js --yes            # 刪除 Harness 與入口檔，保留使用者資料
node install/uninstall.js --purge --yes    # 連同使用者資料一併刪除
node install/export.js                     # 匯出套件（不含使用者資料）
```

完整說明見 [`install/README.md`](install/README.md)。

## 使用方式

在目標專案（git repository）中啟動 Claude Code，輸入：

```text
/feature-team-harness <需求描述>
```

- 需求描述可留空，由 Coordinator 在 Phase 2 引導釐清。
- 本流程只能由使用者手動輸入指令啟動，Claude 不會自動進入。
- 在 auto mode 下，部分關卡（需求範圍、輕量模式、最終計畫）可直接放行；重大風險、Harness 變更、評審平票、刪除檔案仍須確認。詳見 [`core/approval-gates.md`](core/approval-gates.md)。
- 使用者與專案的指示（全域規則、專案 `CLAUDE.md`）優先於本 Harness。

### 產出位置

| 位置 | 內容 |
|---|---|
| `~/.claude/harness/feature-team-harness/output/<專案>/<Session>/` | 單次流程的工作紀錄、需求、計畫、評審、報告 |
| `~/.claude/harness/feature-team-harness/<專案>/memory/` | 專案記憶 |
| `~/.claude/harness/feature-team-harness/<專案>/memory/adr/` | 設計決策紀錄（ADR） |

## 目錄結構

```text
feature-team-harness/
├── AGENTS.md          # Coordinator 入口與全域守則
├── core/              # 設計原則、關卡、隔離、投票、審查、任務、規格、測試與 Git 規範
├── workflows/         # 七個階段的執行程序
├── agents/            # 各角色工作規範（role.md）
├── skills/            # 跨角色技能（目前為空）
├── templates/         # 工作紀錄、需求、規格、計畫、評審、報告、ADR 等模板
├── hooks/             # Claude Code hook 腳本（目前為空，需在 settings.json 註冊才生效）
├── evaluations/       # 品質評估與 Harness 變更紀錄
└── install/           # 安裝／解除安裝／匯出腳本，及 Skill 入口與 Subagent 定義原始檔
```

## 修改 Harness

- Skill 入口或 Subagent 定義請改 `install/claude/` 內的原始檔後重新安裝，不要直接改 `~/.claude/skills`、`~/.claude/agents`。
- Harness 內的腳本一律使用 JavaScript（Node.js）。
- Harness 變更記錄於 `evaluations/harness-changelog.md`。

## 授權

Apache License 2.0，見 [`LICENSE.txt`](LICENSE.txt) 與 [`NOTICE.txt`](NOTICE.txt)。
