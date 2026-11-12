# 任務與狀態管理

## 狀態

| 狀態 | 說明 |
|---|---|
| `PENDING` | 尚未開始 |
| `IN_PROGRESS` | 執行中 |
| `WAITING_APPROVAL` | 等待使用者確認 |
| `REVIEWING` | 審查中 |
| `REVISION_REQUIRED` | 需要修正 |
| `PASSED` | 已通過 |
| `BLOCKED` | 遇到阻礙 |
| `CANCELLED` | 已取消 |

## Task 定義

每個 Task 至少定義：任務 ID（`T-01` 起編）及名稱、任務目標、修改範圍（檔案清單）、前置依賴、實作內容、驗收條件、測試方式（含建議測試範圍）、完成判斷標準。

- 依需求複雜度及異動範圍拆分，不強制固定階段。
- 不得在前置任務尚未 `PASSED` 時執行依賴任務。
- 一次只執行一個 Task。

## 工作紀錄

- 位置：`SESSION_DIR/work-record.md`，格式見 `templates/work-record.md`。
- Coordinator 於每次階段轉換、Task 狀態變更、關卡決策、Agent 失敗時更新。
- frontmatter 的 `harness_status` 標示整個流程：`ACTIVE`（進行中）、`CLOSED`（已結束）、`CANCELLED`（已取消）。Phase 1 以此判斷是否有未完成流程。
- 接續舊流程時，於 `sessions` 追加新的 Session ID，不建立新目錄。

## SESSION_DIR 結構

```text
SESSION_DIR/
├── work-record.md
├── requirement.md
├── spec-draft.md
├── plan/
│   ├── initial-plan.md
│   ├── architect-A.md / architect-B.md / architect-C.md
│   ├── architecture-review.md
│   └── implementation-plan.md
├── tasks/
│   └── T-01-report.md ...
├── review/
│   ├── reviewer-A.md / reviewer-B.md / reviewer-C.md
│   ├── reviewer-A-cross.md ...（第二輪交叉審核）
│   ├── round-N/reviewer-A.md ...（修正後重新審查，N 自 1 起算）
│   └── code-review.md
└── final-report.md
```
