#!/usr/bin/env node
'use strict';

// 解除安裝 Feature Team Harness。
// 用法：node uninstall.js [--target <Claude 設定目錄>] [--purge] [--yes]
//   --target  預設為 CLAUDE_CONFIG_DIR 或 ~/.claude
//   --purge   連同使用者資料（output/、各專案 memory 與評估）一併刪除整個 Harness 目錄
//   --yes     實際刪除；未加時只列出將刪除的檔案

const fs = require('fs');
const path = require('path');
const lib = require('./lib');

lib.run(() => {
  const { flags, options } = lib.parseArgs(process.argv.slice(2), { flags: ['purge', 'yes'], options: ['target'] });
  lib.assertPackageRoot();

  const claudeDir = lib.resolveClaudeDir(options.target);
  const harnessDir = lib.harnessDirOf(claudeDir);
  const purge = flags.has('purge');

  const entryFiles = lib.listPackageFiles(lib.PACKAGE_ROOT)
    .filter(lib.isEntrySource)
    .map((file) => lib.entryTargetPath(claudeDir, file))
    .filter((file) => fs.existsSync(file));
  const packageFiles = lib.listPackageFiles(harnessDir).map((file) => path.join(harnessDir, file));
  const userData = fs.existsSync(harnessDir)
    ? fs.readdirSync(harnessDir, { recursive: true })
      .map((file) => path.join(harnessDir, file))
      .filter((file) => fs.statSync(file).isFile() && !packageFiles.includes(file))
    : [];

  const toDelete = [...entryFiles, ...packageFiles, ...(purge ? userData : [])];
  if (toDelete.length === 0) {
    console.log(`未發現已安裝的 Harness：${claudeDir}`);
    return;
  }

  console.log(`解除安裝目標：${claudeDir}`);
  for (const file of toDelete) console.log(`  刪除  ${path.relative(claudeDir, file)}`);
  if (!purge && userData.length > 0) {
    console.log(`保留使用者資料 ${userData.length} 個檔案（加 --purge 一併刪除）：`);
    for (const file of userData) console.log(`  保留  ${path.relative(claudeDir, file)}`);
  }

  if (!flags.has('yes')) {
    console.log('以上為預覽，加 --yes 才會實際刪除。');
    return;
  }

  const stopDirs = [claudeDir, path.join(claudeDir, 'skills'), path.join(claudeDir, 'agents'), path.join(claudeDir, 'harness')];
  for (const file of toDelete) {
    fs.rmSync(file);
    lib.removeEmptyParents(file, stopDirs);
  }
  console.log(`已刪除 ${toDelete.length} 個檔案。`);
});
