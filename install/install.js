#!/usr/bin/env node
'use strict';

// 安裝或更新 Feature Team Harness。
// 用法：node install.js [--target <Claude 設定目錄>] [--dry-run]
//   --target   預設為 CLAUDE_CONFIG_DIR 或 ~/.claude
//   --dry-run  只列出將建立／更新的檔案
// 被覆蓋的既有檔案先備份到 <Claude 設定目錄>/backups/feature-team-harness/<時間>/。
// 不會刪除任何檔案；output/、各專案 memory 與評估等使用者資料不受影響。

const fs = require('fs');
const path = require('path');
const lib = require('./lib');

function classify(src, dest) {
  if (!fs.existsSync(dest)) return 'create';
  return lib.sameContent(src, dest) ? 'unchanged' : 'update';
}

function buildPlan(claudeDir) {
  const harnessDir = lib.harnessDirOf(claudeDir);
  return lib.listPackageFiles(lib.PACKAGE_ROOT).flatMap((file) => {
    const src = path.join(lib.PACKAGE_ROOT, file);
    const targets = [path.join(harnessDir, file)];
    if (lib.isEntrySource(file)) targets.push(lib.entryTargetPath(claudeDir, file));
    return targets.map((dest) => ({ src, dest, action: classify(src, dest) }));
  });
}

lib.run(() => {
  const { flags, options } = lib.parseArgs(process.argv.slice(2), { flags: ['dry-run'], options: ['target'] });
  lib.assertPackageRoot();

  const claudeDir = lib.resolveClaudeDir(options.target);
  const plan = buildPlan(claudeDir);
  const changes = plan.filter((item) => item.action !== 'unchanged');

  console.log(`安裝目標：${claudeDir}`);
  for (const item of changes) {
    console.log(`  ${item.action === 'create' ? '新增' : '更新'}  ${path.relative(claudeDir, item.dest)}`);
  }
  console.log(`新增 ${plan.filter((i) => i.action === 'create').length}、更新 ${plan.filter((i) => i.action === 'update').length}、未變更 ${plan.length - changes.length}`);

  if (flags.has('dry-run') || changes.length === 0) return;

  const backupDir = path.join(claudeDir, 'backups', lib.HARNESS_NAME, lib.timestamp());
  for (const item of changes) {
    if (item.action === 'update') lib.copyFile(item.dest, path.join(backupDir, path.relative(claudeDir, item.dest)));
    lib.copyFile(item.src, item.dest);
  }
  if (changes.some((item) => item.action === 'update')) console.log(`已備份被覆蓋的檔案：${backupDir}`);
  console.log('安裝完成。新的 Subagent 定義可能需要重新啟動 Claude Code 才會載入。');
});
