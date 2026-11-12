# Phase 6 — Independent Review

審查標準見 `core/review-criteria.md`，投票見 `core/voting-rules.md`。

## Step 6.1 建立審查基準

Coordinator 整理審查範圍：基準 commit、計畫內修改檔案清單、計畫內新增的未追蹤檔案，以及 `requirement.md`、`spec-draft.md`、`implementation-plan.md`、`tasks/` 回報的路徑。

## Step 6.2 第一輪獨立審查

- **標準模式**：同一則訊息平行派遣三個新的 `feature-reviewer`（Reviewer A／B／C），提供相同材料。
- **輕量模式**：只派遣 Reviewer A。

Reviewer 唯讀，以回傳內容交付結果；Coordinator 寫入 `review/reviewer-{A,B,C}.md`。

## Step 6.3 第二輪交叉審核（標準模式）

三者皆完成後，以 `SendMessage` 分別提供另外兩份結果的路徑，請其檢查漏報、誤判、缺乏證據並投票。Coordinator 將回傳內容追加至各自檔案。

## Step 6.4 Coordinator 整合

產出 `review/code-review.md`（`templates/code-review.md`），確認：

- 三方結論是否存在分歧；是否有重複或錯誤問題。
- 是否有缺乏證據的意見（要求補證，無法補證則不採用並記錄原因）。
- 是否有少數意見提出尚未排除的重大風險。
- 爭議無法解決時，要求 Reviewer 重新檢查；仍無法解決則交由使用者決策。

## Step 6.5 處理決策

- Critical：必須修正。
- Major：必須修正，或由使用者明確接受風險（不受 auto mode 放行）。
- Minor：詢問使用者修正或接受（可整批詢問）。
- Suggestion：記錄為後續改善事項。

## Step 6.6 Developer 修正及重新審查

1. Coordinator 整理修正清單（問題 ID、檔案、建議修正方式），對應回原 Task。
2. 依 `core/testing-and-git.md` 確認修正後的測試範圍。
3. 派遣 Developer 修正（同 Task 可以 `SendMessage` 延續，否則新派遣並提供原 Task 回報）。
4. Developer 回報修正內容。
5. 依 `core/review-criteria.md`「修正後重新審查」決定重審者，以 `SendMessage` 請其審查受影響 Diff；結果寫入 `review/round-N/`。
6. 重新整合，更新 `code-review.md`。重複至符合通過條件。

## Step 6.7 最終通過條件

依 `core/review-criteria.md`「最終通過條件」逐項確認並記錄於 `code-review.md`。

## Step 6.8 正式寫入 System Specification

1. 以 `SendMessage` 延續 Analyst（或新派遣並提供 `spec-draft.md`），提供最終程式碼範圍與規格路徑。
2. Analyst 依實際程式行為將草稿寫入專案 repo 的 System Specification，並將草稿變更紀錄的實作狀態改為「已寫入」。
3. Coordinator 檢查寫入內容未超出已實作範圍；發現實作與已確認需求不一致時，先處理差異，不得反向修改需求文件。

完成後 `current_phase` 設為 7，進入 `workflows/feedback-shutdown.md`。
