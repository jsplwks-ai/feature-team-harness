# Feature Team Harness 安裝說明

需求：Node.js 20 以上、Claude Code。

## 套件內容

```text
feature-team-harness/          → 安裝到 ~/.claude/harness/feature-team-harness/
├── AGENTS.md、core/、workflows/、agents/、skills/、hooks/、templates/
├── evaluations/harness-changelog.md
└── install/
    ├── install.js / uninstall.js / export.js / lib.js
    └── claude/                → 入口檔，安裝到 ~/.claude/ 對應位置
        ├── skills/feature-team-harness/SKILL.md
        └── agents/feature-{analyst,architect,developer,reviewer}.md
```

## 安裝／更新

```bash
node install/install.js --dry-run   # 預覽
node install/install.js
```

- 預設安裝到 `CLAUDE_CONFIG_DIR` 或 `~/.claude`，可用 `--target <目錄>` 指定。Skill 入口固定讀取 `~/.claude/harness/feature-team-harness/`，安裝到其他目錄時流程無法啟動。
- 被覆蓋的既有檔案會先備份到 `~/.claude/backups/feature-team-harness/<時間>/`。
- 不刪除任何檔案；`output/`、各專案 memory 與評估不受影響。
- 安裝後重新啟動 Claude Code，再輸入 `/feature-team-harness` 啟動。

## 解除安裝

```bash
node install/uninstall.js          # 預覽
node install/uninstall.js --yes    # 刪除 Harness 本體與入口檔，保留使用者資料
node install/uninstall.js --purge --yes   # 連同使用者資料一併刪除
```

## 匯出

```bash
node install/export.js                       # 匯出到 ~/Downloads/feature-team-harness
node install/export.js --dest <目錄> --force
```

匯出內容不含使用者資料。入口檔以 `install/claude/` 為原始檔；修改 Skill 入口或 Subagent 定義時請改 `install/claude/` 後重新安裝，若直接改 `~/.claude/` 下的檔案，匯出時會出現不同步警告。
