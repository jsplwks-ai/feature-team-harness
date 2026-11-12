# Phase 7 — Feedback & Shutdown

## Step 7.1 最終執行報告

依 `templates/final-report.md` 產出 `SESSION_DIR/final-report.md`，包含：需求摘要、最終修改內容、修改檔案清單、System Specification 異動、任務完成狀態、測試結果、Reviewer 最終審查結果、尚未處理的改善建議、待使用者執行的 git 指令。

提供報告路徑與重點摘要給使用者。

## Step 7.2 使用者品質評分

以一般對話請使用者評分（1–5 分，可附意見，可略過任一項）：

| 評分項目 | 評估內容 |
|---|---|
| 需求理解 | 是否正確理解需求 |
| 分析品質 | 是否找出重要影響與風險 |
| 架構品質 | 設計是否合理 |
| 實作品質 | 程式是否符合預期 |
| 審查品質 | 是否有效發現問題 |
| 執行效率 | 是否有不必要的重複工作 |
| 整體滿意度 | 本次 Harness 整體表現 |

評分與意見寫入 `HARNESS_ROOT/evaluations/PROJECT/SESSION.md`（`templates/evaluation.md`）與 `final-report.md`。

## Step 7.3 Harness 自我改善

根據回饋及工作紀錄評估：角色職責、Prompt、Agent 協作方式、評審及投票機制、實作計畫格式、審查標準、工作流程、Context 管理、Token 使用效率、執行時間。

- 區分單次需求問題與 Harness 通用問題。
- 不因單次主觀意見直接變更核心流程。
- 改善建議列給使用者；涉及核心流程或角色權限的變更必須取得確認（不受 auto mode 放行）。
- 採用的變更寫入 `evaluations/harness-changelog.md`（版本、變更內容、原因、影響），並更新 `AGENTS.md` 版本號。
- 不得因優化而降低既有品質門檻。

## Step 7.4 專案記憶與 ADR

1. 整理本次值得保留的事項：
   - **ADR**：最終計畫中已實作並通過審查的重大設計決策（`templates/adr.md`）。
   - **專案記憶**：踩坑、使用者修正、文件未記載的系統行為。
2. 列出完整內容，詢問使用者是否寫入；確認後才寫入 `ADR_DIR` 或 `PROJECT_MEMORY`。
3. 不記錄程式碼結構、git 歷史或專案文件已記載的內容。

## Step 7.5 結束

1. 工作紀錄 `harness_status` 改為 `CLOSED`，記錄結束時間。
2. 列出 `SESSION_DIR` 內的檔案，以 `AskUserQuestion` 詢問：
   - 刪除中間產物（保留 `final-report.md`、`work-record.md`）
   - 全部保留
   - 全部刪除
3. 依選擇處理後，告知使用者 Harness 已結束，回到一般對話模式。
