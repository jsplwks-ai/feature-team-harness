# Feature Team Harness

版本：v0.1.1（變更紀錄見 `evaluations/harness-changelog.md`）

## 系統概述

Feature Team Harness 是由多個專業 Agent 協作的需求分析與開發流程。使用者以 `/feature-team-harness` 手動啟動後，由 Coordinator 依序安排七個階段：

| Phase | 名稱 | Workflow |
|---|---|---|
| 1 | Initialization 初始化 | `workflows/initialization.md` |
| 2 | Requirement Analysis 需求分析 | `workflows/requirement-analysis.md` |
| 3 | Specification Management 規格草稿 | `workflows/specification-management.md` |
| 4 | Architecture & Planning 架構與實作計畫 | `workflows/architecture-planning.md` |
| 5 | Implementation 實作 | `workflows/implementation.md` |
| 6 | Independent Review 獨立審查（含正式寫入規格） | `workflows/code-review.md` |
| 7 | Feedback & Shutdown 回饋與結束 | `workflows/feedback-shutdown.md` |

### 角色

| 角色 | 執行方式 | 角色文件 |
|---|---|---|
| Coordinator | 主線（執行 Skill 的 Claude） | `agents/coordinator/role.md` |
| Analyst | Subagent `feature-analyst` | `agents/analyst/role.md` |
| Architect | Subagent `feature-architect` | `agents/architect/role.md` |
| Developer | Subagent `feature-developer` | `agents/developer/role.md` |
| Reviewer | Subagent `feature-reviewer`（對專案唯讀） | `agents/reviewer/role.md` |

## 路徑變數

| 變數 | 內容 |
|---|---|
| `HARNESS_ROOT` | `~/.claude/harness/feature-team-harness/` 的絕對路徑（啟動時解析） |
| `PROJECT_ROOT` | 目前專案的 git 根目錄（`git rev-parse --show-toplevel`） |
| `PROJECT` | `PROJECT_ROOT` 的目錄名稱 |
| `SESSION` | Claude Code Session ID |
| `SESSION_DIR` | `HARNESS_ROOT/output/PROJECT/SESSION/`；接續舊流程時為原流程目錄 |
| `PROJECT_MEMORY` | `HARNESS_ROOT/PROJECT/memory/` |
| `ADR_DIR` | `HARNESS_ROOT/PROJECT/memory/adr/` |

派遣 Subagent 時，一律在訊息中提供 `HARNESS_ROOT`、`PROJECT_ROOT`、`SESSION_DIR` 的絕對路徑。

## 文件導覽

| 位置 | 內容 |
|---|---|
| `core/principles.md` | 核心設計原則與全域執行規範 |
| `core/approval-gates.md` | 使用者確認關卡與 auto mode 放行規則 |
| `core/agent-isolation.md` | Agent 獨立性、派遣、轉達與失敗重試 |
| `core/voting-rules.md` | 交叉審核、投票、整合與評審紀錄格式 |
| `core/review-modes.md` | 標準模式與輕量模式 |
| `core/review-criteria.md` | 程式碼審查項目、嚴重程度與通過條件 |
| `core/task-management.md` | 任務定義、狀態、依賴與工作紀錄 |
| `core/specification-rules.md` | 規格草稿與正式規格規則 |
| `core/testing-and-git.md` | 測試執行與 Git 寫入規範 |
| `workflows/` | 七個階段的執行程序 |
| `agents/${agent}/role.md` | 各角色工作規範 |
| `agents/${agent}/skills/` | 角色專屬技能（需要時建立） |
| `skills/` | 跨角色可重複呼叫的技能 |
| `templates/` | 工作紀錄、需求、規格草稿、計畫、評審、審查、報告、評估、ADR 模板 |
| `hooks/` | Claude Code hook 攔截腳本（須由 settings.json 註冊才生效） |
| `evaluations/` | 品質評估紀錄與 Harness 變更紀錄 |
| `install/` | 安裝、解除安裝、匯出腳本，及 Skill 入口與 Subagent 定義的原始檔（見 `install/README.md`） |
| `output/PROJECT/SESSION/` | 單次流程的工作紀錄與暫存產物 |
| `PROJECT/memory/`、`PROJECT/memory/adr/` | 專案記憶與設計決策紀錄 |

## AI 工作守則（所有角色適用）

1. 本流程只能由使用者手動輸入 `/feature-team-harness` 啟動，不得自行啟動或隱式進入。
2. 不自行假設需求或系統行為；未確認的內容標記「待確認」。
3. 使用者確認關卡依 `core/approval-gates.md` 執行，不得跳過。
4. 不擴大工作範圍；計畫外問題回報 Coordinator。
5. 測試執行與 Git 寫入依 `core/testing-and-git.md`。
6. 所有結論須附證據；未執行的驗證不得宣稱通過。
7. 流程狀態寫入 `SESSION_DIR/work-record.md`，不得只存在對話 Context。
8. 使用者與專案的指示（全域規則、專案 `CLAUDE.md`）優先於本 Harness；兩者衝突時停止並回報使用者。
9. 輸出語言依使用者設定；未設定時使用繁體中文，程式碼、識別字、指令、路徑維持原文。
10. Harness 內的腳本（安裝、hooks、skills 等）一律使用 JavaScript（Node.js）。
11. 修改 Skill 入口或 Subagent 定義時，改 `install/claude/` 內的原始檔後重新安裝，不直接改 `~/.claude/skills`、`~/.claude/agents`。

## 啟動

Coordinator 依序 Read：

1. `agents/coordinator/role.md`
2. 「文件導覽」列出的 `core/` 文件
3. `workflows/initialization.md`，開始 Phase 1

之後進入每個 Phase 時（含接續舊流程），重新 Read 該 Phase 的 workflow 及其引用的 `core/` 文件。
