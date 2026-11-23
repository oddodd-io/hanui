/**
 * Vue 레지스트리 생성기 — `packages/registry/registry-vue.json`을 **소스에서 만든다.**
 *
 * 왜 만들었나 — 이 파일은 2025-12-12 이후 손으로만 관리됐는데, 2026-09-22에
 * `packages/vue`가 KRDS 기반으로 통째로 재구축되면서 구조가 바뀌었다(평면 → 중첩
 * PascalCase). 레지스트리는 안 따라왔고, 그 뒤로 **67개 항목이 전부 404**였다.
 * 2개월 동안 아무도 몰랐다 — 둘이 맞는지 확인하는 게 없었기 때문이다.
 *
 * 그래서 손으로 쓰지 않는다. 소스에 없는 컴포넌트는 **생성될 수가 없다.**
 *
 * 뽑는 것
 *   name                  디렉터리 이름 → kebab-case
 *   description           컴포넌트 JSDoc 첫 줄
 *   files                 X.vue + 그 컴포넌트가 끌어쓰는 같은 폴더 파일(전이적) + composables
 *   dependencies          외부 npm import (vue는 peer라 뺀다)
 *   registryDependencies  다른 컴포넌트 import → 그쪽 kebab 이름
 *
 * 못 뽑는 것 — 없다. 지금은 전부 소스에서 나온다. 못 뽑는 게 생기면 사이드카 파일을
 * 두되, **"소스에 없으면 생성 안 됨"이라는 성질은 깨지 않는다.**
 *
 * 사용
 *   node scripts/build-registry-vue.mjs           # 파일을 쓴다
 *   node scripts/build-registry-vue.mjs --check   # 차이만 보고 다르면 exit 1 (CI용)
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'packages/vue/src';
const OUT = 'packages/registry/registry-vue.json';
const COMPONENTS = path.join(SRC, 'components');

/** PascalCase → kebab-case (InPageNavigation → in-page-navigation) */
const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

/** 테스트·스토리·배럴은 배포 대상이 아니다 */
const isShippable = (f) =>
  !/\.(test|spec|stories)\.[jt]sx?$/.test(f) && f !== 'index.ts';

/** 소스에서 import 경로를 전부 긁는다 (import / from / dynamic import) */
function importsOf(file) {
  const text = fs.readFileSync(file, 'utf-8');
  return [
    ...text.matchAll(/from\s+['"]([^'"]+)['"]|import\(['"]([^'"]+)['"]\)/g),
  ]
    .map((m) => m[1] ?? m[2])
    .filter(Boolean);
}

/** JSDoc 블록의 첫 설명 줄 */
function describe(file) {
  const text = fs.readFileSync(file, 'utf-8');
  const m = text.match(/\/\*\*\s*\n\s*\*\s*(.+)/);
  return m ? m[1].trim() : '';
}

/** 확장자가 생략된 import를 실제 파일로 되돌린다 */
function resolveFile(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  for (const cand of [
    base,
    base + '.ts',
    base + '.vue',
    path.join(base, 'index.ts'),
  ]) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) return cand;
  }
  return null;
}

const dirs = fs
  .readdirSync(COMPONENTS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((n) => fs.existsSync(path.join(COMPONENTS, n, `${n}.vue`)))
  .sort();

const items = [];
const warnings = [];

for (const name of dirs) {
  const entry = path.join(COMPONENTS, name, `${name}.vue`);
  const files = new Set();
  const deps = new Set();
  const regDeps = new Set();
  const seen = new Set();

  // 이 컴포넌트가 실제로 끌어쓰는 파일만 전이적으로 모은다.
  // 폴더를 통째로 넣지 않는 이유 — 안 쓰는 파일까지 사용자 프로젝트에 떨어진다.
  const walk = (file) => {
    if (seen.has(file)) return;
    seen.add(file);
    files.add(path.relative(SRC, file));
    for (const spec of importsOf(file)) {
      if (!spec.startsWith('.')) {
        if (spec !== 'vue') deps.add(spec); // vue는 peer
        continue;
      }
      const target = resolveFile(file, spec);
      if (!target) {
        warnings.push(`${name}: import를 찾지 못했습니다 — ${spec}`);
        continue;
      }
      const rel = path.relative(SRC, target);
      // 다른 컴포넌트면 파일로 넣지 않고 registryDependencies로 넘긴다
      const other = rel.match(/^components\/([^/]+)\//);
      if (other && other[1] !== name) {
        regDeps.add(kebab(other[1]));
        continue;
      }
      walk(target); // 같은 폴더 파일 · composables는 따라 들어간다
    }
  };
  walk(entry);

  const description = describe(entry);
  if (!description) warnings.push(`${name}: JSDoc 설명이 없습니다`);

  items.push({
    name: kebab(name),
    type: 'ui',
    description,
    ...(deps.size ? { dependencies: [...deps].sort() } : {}),
    ...(regDeps.size ? { registryDependencies: [...regDeps].sort() } : {}),
    files: [...files]
      .filter((f) => isShippable(path.basename(f)))
      .sort()
      .map((f) => ({
        path: f,
        type: f.includes('/composables/')
          ? 'lib'
          : f.endsWith('.vue')
            ? 'component'
            : 'lib',
      })),
  });
}

// CLI는 레지스트리를 **이름을 키로 하는 객체**로 읽는다 (`Registry = Record<string, RegistryComponent>`).
// 배열로 내보내면 `registry[name]`이 undefined가 되어 전부 "Invalid component"로 떨어진다 —
// 받아지지 않는 것(404)이 찾아지지 않는 것으로 바뀔 뿐이다. React 레지스트리도 같은 모양이다.
const output =
  JSON.stringify(Object.fromEntries(items.map((i) => [i.name, i])), null, 2) +
  '\n';

if (process.argv.includes('--check')) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf-8') : '';
  if (current === output) {
    console.log(`✅ ${OUT} 이(가) 소스와 일치합니다 (${items.length}개).`);
    process.exit(0);
  }
  console.error(
    `❌ ${OUT} 이(가) 소스와 다릅니다. \`node scripts/build-registry-vue.mjs\`로 다시 생성하세요.`
  );
  process.exit(1);
}

fs.writeFileSync(OUT, output);
console.log(`${OUT} — ${items.length}개 생성`);
if (warnings.length) {
  console.log('\n경고:');
  for (const w of warnings) console.log('  ' + w);
}
