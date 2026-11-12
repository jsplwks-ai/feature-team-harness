# Phase 5 — Implementation

依任務清單逐一執行，一次只處理一個 Task；前置依賴未 `PASSED` 的 Task 不得開始。

## Step 5.1 準備 Task

1. 選出下一個可執行的 Task，狀態改為 `IN_PROGRESS`。
2. 依 `core/testing-and-git.md` 確認本 Task 的測試範圍（取自計畫的「測試方式」，預設縮到最小）。

## Step 5.2 派遣 Developer

派遣新的 `feature-developer`，訊息包含：Task ID、`implementation-plan.md` 路徑、`spec-draft.md` 路徑、修改範圍、已確認的測試範圍（或「未確認，不得執行測試」）、前置 Task 回報路徑。

Developer 依 `agents/developer/role.md` 實作並產出 `tasks/{Task ID}-report.md`。

## Step 5.3 Task 完成檢查

Coordinator Read 回報並以 `git status`、`git diff --stat` 核對：

- 實作符合任務目標，驗收條件逐項達成。
- 未修改計畫外的檔案（對照修改範圍與 Git 基準）。
- 必要測試已在確認範圍內執行且通過，有命令與結果證據。
- 未發現未處理的明確回歸問題。
- 規格影響：回報為不一致時，派 Analyst 更新 `spec-draft.md`。

結果：

| 結果 | 處理 |
|---|---|
| 全部符合 | 狀態改為 `PASSED`，進行下一個 Task |
| 未達成但在範圍內可修正 | `REVISION_REQUIRED`，以 `SendMessage` 請同一個 Developer 修正；同一 Task 至多修正 3 次，仍未達成則 `BLOCKED`，向使用者回報並詢問處理方式 |
| 修改了計畫外檔案 | 告知使用者，詢問保留或還原；還原屬 git 寫入時依規範詢問 |
| 需求或架構問題 | `BLOCKED`，進行影響分析；重大變更依關卡確認後回到 Phase 2 或 4 |
| 回報需要 git 指令 | 依 `core/testing-and-git.md` 詢問使用者 |

## Step 5.4 完成

所有 Task `PASSED` 後，`current_phase` 設為 6，進入 `workflows/code-review.md`。
