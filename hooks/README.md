# hooks/

Claude Code hook 攔截腳本。目前尚無腳本。腳本一律使用 JavaScript（Node.js）。

- 腳本放在此目錄不會自動生效，必須在 `~/.claude/settings.json` 註冊；修改 settings 前須取得使用者確認。
- 可能的用途：在 Reviewer 執行期間阻擋寫入類工具、阻擋 Subagent 的 git 寫入指令。目前 Reviewer 的唯讀限制由 Subagent 定義檔的 `tools` 欄位（無 Write／Edit）與角色規範達成，但 `Bash` 仍可寫檔，屬已知缺口。
- 新增 hook 屬於 Harness 變更，記錄於 `evaluations/harness-changelog.md`。
