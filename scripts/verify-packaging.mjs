/**
 * 패키징 무결성 검사
 *
 * 1) package.json의 exports가 가리키는 dist 산출물이 실제로 존재하는가
 *    (vite lib entry에 빠지면 선언만 있고 파일은 없는 상태가 된다)
 * 2) registry.json이 가리키는 원본 파일이 실제로 존재하는가
 *    (CLI는 GitHub raw에서 이 경로를 그대로 받아온다)
 *
 * 사용: node scripts/verify-packaging.mjs
 *       빌드 산출물까지 검사하려면 pnpm build 이후에 실행한다.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

let failed = 0;
const fail = (msg) => {
  failed++;
  console.error(`  ✗ ${msg}`);
};
const ok = (msg) => console.log(`  ✓ ${msg}`);

// ---------------------------------------------------------------- exports
function collectExportPaths(node, out = []) {
  if (typeof node === 'string') {
    if (node.startsWith('./')) out.push(node);
  } else if (node && typeof node === 'object') {
    for (const v of Object.values(node)) collectExportPaths(v, out);
  }
  return out;
}

function checkExports(pkgDir) {
  const pkgPath = path.join(ROOT, pkgDir, 'package.json');
  if (!fs.existsSync(pkgPath)) return;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const targets = [
    ...collectExportPaths(pkg.exports ?? {}),
    ...[pkg.main, pkg.module, pkg.types].filter(Boolean),
  ];
  const unique = [...new Set(targets)];

  const distExists = fs.existsSync(path.join(ROOT, pkgDir, 'dist'));
  console.log(`\n[${pkg.name}] exports ${unique.length}개`);
  if (!distExists) {
    console.log('  - dist 없음 → 빌드 산출물 검사 건너뜀 (pnpm build 후 다시 실행)');
    return;
  }
  for (const t of unique) {
    const p = path.join(ROOT, pkgDir, t);
    if (fs.existsSync(p)) ok(t);
    else fail(`${pkg.name}: ${t} 선언됐지만 산출물 없음`);
  }
}

// --------------------------------------------------------------- registry
function checkRegistry(registryFile, srcDir) {
  const rp = path.join(ROOT, 'packages/registry', registryFile);
  if (!fs.existsSync(rp)) return;
  const raw = JSON.parse(fs.readFileSync(rp, 'utf8'));
  const items = raw.items ?? raw;
  const entries = Object.entries(items);

  let checked = 0;
  console.log(`\n[${registryFile}] 항목 ${entries.length}개`);
  for (const [name, entry] of entries) {
    for (const file of entry.files ?? []) {
      checked++;
      const p = path.join(ROOT, srcDir, file.path);
      if (!fs.existsSync(p)) fail(`${name}: ${file.path} 원본 없음`);
    }
    // registryDependencies가 실제 항목을 가리키는지
    for (const dep of entry.registryDependencies ?? []) {
      if (!items[dep]) fail(`${name}: registryDependency "${dep}" 항목이 없음`);
    }
  }
  ok(`파일 참조 ${checked}건 검사 완료`);
}

console.log('=== hanui 패키징 무결성 검사 ===');
checkExports('packages/react');
checkExports('packages/vue');
checkRegistry('registry.json', 'packages/react/src');
checkRegistry('registry-vue.json', 'packages/vue/src');

console.log(
  failed === 0
    ? '\n✅ 문제 없음'
    : `\n❌ ${failed}건 실패`
);
process.exit(failed === 0 ? 0 : 1);
