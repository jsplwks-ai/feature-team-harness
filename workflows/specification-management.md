# Phase 3 — Specification Management（規格草稿）

本 Phase 不修改專案 repo 內的 System Specification，正式寫入於 Step 6.8 進行。規則見 `core/specification-rules.md`。

## Step 3.1 Analyst 撰寫規格草稿

以 `SendMessage` 延續 Phase 2 的 Analyst（無法延續時新派遣，並提供 `requirement.md` 與規格路徑），依已確認需求產出 `SESSION_DIR/spec-draft.md`（`templates/spec-draft.md`）：

- 依專案既有規格文件結構，列出每份預計新增或修改的規格文件及其變更內容。
- 修改既有功能時，檢查對應規格是否需要更新。
- 記錄既有規格與程式碼的不一致。

## Step 3.2 規格變更紀錄

草稿的「變更紀錄」區記錄：規格文件、變更原因、影響模組、對應需求 ID、實作狀態（此時為「草稿」）。

## Step 3.3 Coordinator 檢查

- 草稿是否涵蓋 `requirement.md` 的功能需求與業務規則。
- 「既有不一致」區若有項目，詢問使用者是否納入本次範圍；納入即視為需求變更，回到 Phase 2 更新需求。

完成後 `current_phase` 設為 4，進入 `workflows/architecture-planning.md`。

## 後續草稿更新

- Phase 4 設計變動、Phase 5 Task 回報「規格影響」不一致時，Coordinator 派 Analyst 更新草稿。
- 正式寫入見 `workflows/code-review.md` Step 6.8。
