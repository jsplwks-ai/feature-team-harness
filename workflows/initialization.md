# Phase 1 — Initialization

## Step 1.1 解析路徑

1. `PROJECT_ROOT`：`git rev-parse --show-toplevel`。不是 git repo 時，告知使用者「審查 Diff 與工作區基準依賴 git」，詢問是否中止。
2. `PROJECT`：`PROJECT_ROOT` 的目錄名稱。若與 `HARNESS_ROOT` 下的 Harness 目錄同名（`core`、`workflows`、`agents`、`skills`、`templates`、`hooks`、`evaluations`、`install`、`output`），告知使用者專案資料會與 Harness 檔案混在一起，中止啟動。
3. `SESSION`：由 Skill 入口提供的 Session ID。

## Step 1.2 檢查未完成流程

同一專案一次只執行一個流程。

1. 搜尋 `HARNESS_ROOT/output/PROJECT/*/work-record.md` 中 `harness_status: ACTIVE` 的紀錄。
2. 紀錄的 `PROJECT_ROOT` 與目前不同時，代表另一個同名專案（或 worktree）共用此目錄：不得接續或取消該紀錄，告知使用者 output 與專案記憶將共用，詢問是否繼續。不繼續則結束 Harness；繼續則該紀錄不列入下一點。
3. 有 `PROJECT_ROOT` 與目前相同的未完成紀錄時，列出（需求 ID、目前 Phase、最後更新時間、目錄），以 `AskUserQuestion` 詢問：
   - **接續**：`SESSION_DIR` 設為該目錄；在 `sessions` 追加目前 Session ID；Read 工作紀錄，從記錄的 Phase／步驟繼續，跳過 Step 1.3–1.5 中已完成的部分。
   - **開新流程**：將舊紀錄 `harness_status` 改為 `CANCELLED` 並記錄原因後繼續。
   - **取消啟動**：結束 Harness。

## Step 1.3 記錄 Git 基準

1. 記錄 `git rev-parse HEAD`、目前分支、`git status --porcelain` 的既有變更清單。
2. 有既有變更時，列出並詢問使用者是否繼續；繼續則註明「既有變更不納入本次審查」。

## Step 1.4 讀取專案脈絡

1. Read `PROJECT_ROOT/CLAUDE.md`（如存在），取得：System Specification／知識集路徑、建置與測試指令、專案慣例。
2. 規格路徑找不到時，詢問使用者。
3. Read `PROJECT_MEMORY/` 與 `ADR_DIR/` 的索引或檔案清單（如存在），記下與本次可能相關的項目。

## Step 1.5 建立工作紀錄

1. 建立 `SESSION_DIR`。
2. 依 `templates/work-record.md` 建立 `work-record.md`，填入路徑、Session ID、Git 基準、規格路徑、專案指令。
3. 需求 ID 於 Phase 2 取得後補上。
4. `current_phase` 設為 2，進入 `workflows/requirement-analysis.md`。
