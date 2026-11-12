# Phase 2 — Requirement Analysis

## Step 2.1 Coordinator 蒐集需求

透過對話取得：

| 項目 | 必填 | 說明 |
|---|---|---|
| 需求 ID | 否 | 例如 Jira 單號；未提供時產生 `REQ-YYYYMMDD-HHMM` |
| 需求背景 | 是 | 為什麼需要、目前遇到什麼問題 |
| 需求目標 | 是 | 預期達成的結果 |
| 包含項目 | 否 | 涵蓋的模組、服務及服務對象 |
| 不包含項目 | 否 | 本期不處理的範圍 |

- 啟動參數已提供的內容不重複詢問。
- 範圍不明確時進一步詢問，不得自行推定。
- 將結果寫入工作紀錄「需求概要」。

## Step 2.2 Analyst 檢視既有系統

派遣 `feature-analyst`，提供需求概要、規格路徑、相關 `PROJECT_MEMORY`／ADR 項目。Analyst：

1. 檢視既有 System Specification 與相關程式碼。
2. 找出需求與現有系統的關聯，檢查規格與程式碼是否不一致。
3. 分析可能影響的模組、服務、資料結構及 API。
4. 產出 `requirement.md` 初稿與待確認事項清單。

## Step 2.3 逐項釐清

1. Coordinator 將待確認事項轉為問題詢問使用者（`AskUserQuestion` 一次最多 4 題，可分批）。
2. 不同方案須說明差異及影響。
3. 將答案以 `SendMessage` 交給同一個 Analyst 更新 `requirement.md`；Analyst 若產生新問題，重複本步驟。
4. 使用者未回答的項目保持「待確認」。
5. 本步驟不受 auto mode 影響。

## Step 2.4 需求整理文件

`requirement.md` 至少包含：需求背景、需求目標、功能需求、業務規則、系統行為、涉及模組與服務、包含項目、不包含項目、限制條件、待確認事項、驗收條件。

## Step 2.5 使用者確認（關卡）

1. Coordinator 提供 `requirement.md` 路徑與重點摘要，請使用者確認。
2. 依 `core/approval-gates.md` 處理；auto mode 可直接放行。
3. 使用者提出修改時，回到 Step 2.3。
4. 尚有影響範圍或驗收條件的「待確認」事項時，不得通過本關卡。

## Step 2.6 決定評審模式

依 `core/review-modes.md` 建議並確認評審模式，寫入工作紀錄。

完成後 `current_phase` 設為 3，進入 `workflows/specification-management.md`。
