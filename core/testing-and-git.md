# 測試執行與 Git 規範

## 測試執行

1. 執行測試前，由 Coordinator 向使用者說明：測試範圍、目的（驗證什麼）、預估耗時，並取得確認後，才在派遣訊息中提供「已確認的測試範圍」給 Developer。
2. 詢問使用 `AskUserQuestion`，header 為 `Testing`，選項文字固定：
   - `允許這次`
   - `本 session 一律允許執行測試`
   - `不執行`
3. 使用者已選過「本 session 一律允許執行測試」時，只需告知範圍，不再詢問。
4. 測試範圍預設縮到最小：單一測試類別優於整個模組，整個模組優於全量。
5. Developer 只能執行派遣訊息中已確認範圍的測試；需要擴大範圍時回報 Coordinator。
6. 使用者選「不執行」時，測試結果標記「未驗證」，不得標示為通過。
7. 撰寫或修改測試檔不需確認。

## 測試證據

紀錄實際執行的命令、結果摘要（通過／失敗數、失敗名稱）、未執行項目及原因。

## Git 寫入

- Subagent 不執行任何 git 寫入操作（`add`、`commit`、`stash`、`checkout`、`switch`、`reset`、`restore`、`merge`、`rebase`、`rm`、`mv` 等）；需要時將確切指令回報 Coordinator。
- Coordinator 執行 git 寫入前，以 `AskUserQuestion`（header `Git`）列出確切指令與影響範圍，選項為 `允許這次`、`不執行`；不執行時輸出指令讓使用者手動執行。
- `git push`、`git pull` 一律由使用者手動執行，Coordinator 只輸出指令。
- 唯讀指令（`status`、`log`、`diff`、`show`、`blame`、`branch` 僅列出）所有角色皆可執行。

## 工作區基準與審查範圍

- Phase 1 記錄 Git 基準：`HEAD` commit、`git status --porcelain` 的既有變更檔案清單。
- 工作區已有變更時，列出並詢問使用者是否繼續；繼續則既有變更不納入本次審查。
- Phase 4 確認計畫時，若計畫修改的檔案與既有變更檔案重疊，須告知使用者，因為審查 Diff 將混入既有變更。
- 審查範圍：實作計畫內檔案相對於基準 `HEAD` 的 Diff（`git diff <HEAD> -- <files>`）及計畫內新增的未追蹤檔案。
