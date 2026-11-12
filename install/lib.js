'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const HARNESS_NAME = 'feature-team-harness';
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const ENTRY_SOURCE_DIR = 'install/claude';

// Harness 本體。未列出的項目（output/、各專案 memory、各專案評估）屬於使用者資料：
// 不安裝、不匯出，解除安裝時預設保留。
const PACKAGE_ENTRIES = [
  'AGENTS.md',
  'core',
  'workflows',
  'skills',
  'agents',
  'hooks',
  'templates',
  'install',
  'evaluations/harness-changelog.md',
];

function parseArgs(argv, allowed) {
  const flags = new Set();
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const key = arg.startsWith('--') ? arg.slice(2) : null;
    if (key && allowed.flags.includes(key)) {
      flags.add(key);
    } else if (key && allowed.options.includes(key) && i + 1 < argv.length) {
      options[key] = argv[++i];
    } else {
      throw new Error(`無法辨識的參數：${arg}`);
    }
  }
  return { flags, options };
}

function resolveClaudeDir(target) {
  return path.resolve(target || process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude'));
}

function harnessDirOf(claudeDir) {
  return path.join(claudeDir, 'harness', HARNESS_NAME);
}

// 回傳 root 底下 entry 的所有檔案，路徑以 / 分隔並相對於 root
function listFiles(root, entry) {
  const full = path.join(root, entry);
  if (!fs.existsSync(full)) return [];
  if (fs.statSync(full).isFile()) return [entry];
  return fs.readdirSync(full).flatMap((name) => listFiles(root, path.posix.join(entry, name)));
}

function listPackageFiles(root) {
  return PACKAGE_ENTRIES.flatMap((entry) => listFiles(root, entry));
}

function isEntrySource(packageFile) {
  return packageFile.startsWith(`${ENTRY_SOURCE_DIR}/`);
}

// install/claude/<rest> 安裝到 <claudeDir>/<rest>
function entryTargetPath(claudeDir, packageFile) {
  return path.join(claudeDir, path.posix.relative(ENTRY_SOURCE_DIR, packageFile));
}

function sameContent(a, b) {
  return fs.existsSync(b) && fs.readFileSync(a).equals(fs.readFileSync(b));
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

// 由檔案所在目錄往上刪除空目錄，遇到 stopDirs 或非空目錄即停止
function removeEmptyParents(file, stopDirs) {
  let dir = path.dirname(file);
  while (!stopDirs.includes(dir) && fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
    dir = path.dirname(dir);
  }
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
}

function assertPackageRoot() {
  if (!fs.existsSync(path.join(PACKAGE_ROOT, 'AGENTS.md'))) {
    throw new Error(`套件根目錄缺少 AGENTS.md：${PACKAGE_ROOT}`);
  }
}

function run(main) {
  try {
    main();
  } catch (error) {
    console.error(`錯誤：${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  HARNESS_NAME,
  PACKAGE_ROOT,
  parseArgs,
  resolveClaudeDir,
  harnessDirOf,
  listPackageFiles,
  isEntrySource,
  entryTargetPath,
  sameContent,
  copyFile,
  removeEmptyParents,
  timestamp,
  assertPackageRoot,
  run,
};
