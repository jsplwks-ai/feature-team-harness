# Phase 4 — Architecture & Planning

## Step 4.1 初版實作計畫

派遣 `feature-architect`（身分：初版計畫作者），提供 `requirement.md`、`spec-draft.md`、規格路徑、專案指令。產出 `plan/initial-plan.md`，內容依 `templates/implementation-plan.md`：

需求摘要、影響範圍、預計修改及新增的檔案、技術實作方案、資料庫異動、API 或服務介面異動、業務流程異動、相容性及既有功能影響、測試計畫、風險及回復方案、ADR 候選、分階段實作任務。

## Step 4.2 拆分實作任務

Task 定義依 `core/task-management.md`。Coordinator 檢查每個 Task 皆有驗收條件、測試方式及依賴關係。

## Step 4.3 架構評審

### 標準模式

1. **第一輪**：同一則訊息平行派遣三個新的 `feature-architect`（評審者 A／B／C），各自產出 `plan/architect-{A,B,C}.md`。派遣訊息只提供共同材料與 `initial-plan.md`。
2. **第二輪**：三者皆完成後，以 `SendMessage` 分別提供另外兩份檔案路徑，請其投票並提出檢查意見。
3. **計票**：Coordinator 依 `core/voting-rules.md` 計票，寫入 `plan/architecture-review.md`（`templates/architecture-review.md`）。
4. **平票**：整理各方案差異及取捨，交由使用者選定。
5. **整合**：以 `SendMessage` 請採用方案的提出者產出 `plan/implementation-plan.md`。

### 輕量模式

派遣一個 `feature-architect`（評審者 A）評審 `initial-plan.md`，並直接整合成 `plan/implementation-plan.md`；`architecture-review.md` 只記錄評審者 A 的意見。

## Step 4.4 Coordinator 檢查最終計畫

- 評審發現的缺漏已處理，未採用方案及原因已保留。
- 重大分歧已解決或列為使用者決策事項；無法合理解決的需求或架構歧義交由使用者決定。
- 計畫修改的檔案若與 Git 基準的既有變更重疊，記錄並於 Step 4.5 告知使用者。
- 設計與 `spec-draft.md` 不一致時，派 Analyst 更新草稿。

## Step 4.5 使用者確認實作計畫（關卡）

1. 提供：`implementation-plan.md` 路徑、最終方案摘要、異動範圍、任務拆分、主要風險、評審分歧及處理方式、檔案重疊情形。
2. 依 `core/approval-gates.md` 處理；auto mode 可直接放行。
3. 使用者提出修改時，依修改性質回到 Step 4.1、4.3 或 Phase 2。

## Step 4.6 建立任務清單

將 Task 寫入工作紀錄「任務清單」，狀態皆為 `PENDING`。

完成後 `current_phase` 設為 5，進入 `workflows/implementation.md`。
