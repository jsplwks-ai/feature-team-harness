#!/usr/bin/env node
'use strict';

// 匯出 Feature Team Harness 安裝套件（不含 output/、各專案 memory 與評估等使用者資料）。
// 用法：node export.js [--dest <目錄>] [--force]
//   --dest   預設為 ~/Downloads/feature-team-harness
//   --force  目的目錄已存在時，先刪除再匯出

const fs = require('fs');
const os = require('os');
const path = require('path');
const lib = require('./lib');

// 已安裝的入口檔若被直接修改，與套件內的原始檔會不同步，匯出前提醒
function warnIfEntryFilesDiverged(files) {
  const claudeDir = lib.resolveClaudeDir();
  for (const file of files.filter(lib.isEntrySource)) {
    const installed = lib.entryTargetPath(claudeDir, file);
    if (fs.existsSync(installed) && !lib.sameContent(path.join(lib.PACKAGE_ROOT, file), installed)) {
      console.warn(`警告：${installed} 與套件內的 ${file} 不同，匯出的是套件版本。`);
    }
  }
}

lib.run(() => {
  const { flags, options } = lib.parseArgs(process.argv.slice(2), { flags: ['force'], options: ['dest'] });
  lib.assertPackageRoot();

  const dest = path.resolve(options.dest || path.join(os.homedir(), 'Downloads', lib.HARNESS_NAME));
  if (dest === lib.PACKAGE_ROOT || lib.PACKAGE_ROOT.startsWith(dest + path.sep)) {
    throw new Error(`目的目錄不可為套件本身或其上層：${dest}`);
  }
  if (fs.existsSync(dest)) {
    if (!flags.has('force')) throw new Error(`目的目錄已存在：${dest}（加 --force 覆蓋）`);
    fs.rmSync(dest, { recursive: true });
  }

  const files = lib.listPackageFiles(lib.PACKAGE_ROOT);
  warnIfEntryFilesDiverged(files);
  for (const file of files) lib.copyFile(path.join(lib.PACKAGE_ROOT, file), path.join(dest, file));
  console.log(`已匯出 ${files.length} 個檔案至 ${dest}`);
});
