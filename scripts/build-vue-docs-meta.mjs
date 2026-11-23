/**
 * Vue 컴포넌트 API를 **소스에서 뽑아** 문서 사이트에 넘긴다.
 * → `apps/docs/src/lib/vue-api.json`
 *
 * 왜 생성하나 — 컴포넌트 문서 63개 중 프레임워크를 구분하는 건 `button` 하나뿐이고,
 * 나머지는 React 코드를 Vue 주소에서도 그대로 보여준다. 이걸 문서 21개를 손으로
 * 고쳐 메우면 **다음에 Vue 컴포넌트가 바뀔 때 또 어긋난다.** props 표는 지어낼 수도 없다.
 * 그래서 `.vue`에서 뽑아 문서가 그대로 렌더하게 한다.
 *
 * 뽑는 것: 설명(JSDoc 첫 줄) · props(이름·타입·필수·기본값·설명) · emits · 이름 있는 slot
 * 뽑지 않는 것: 예제 코드. 소스에서 안전하게 뽑을 수 없는 건 만들지 않는다.
 *
 *   node scripts/build-vue-docs-meta.mjs           # 생성
 *   node scripts/build-vue-docs-meta.mjs --check   # 다르면 exit 1 (CI)
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'packages/vue/src/components';
const OUT = 'apps/docs/src/lib/vue-api.json';

/** 문서 슬러그가 Vue 이름과 다른 경우 (build-registry-vue.mjs와 같은 규칙) */
const DOC_SLUG = { SkipLink: 'skiplink', CardList: 'structured-list' };

const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

/** 바로 앞 줄들의 JSDoc(`/** … *\/`) 또는 `//` 주석을 설명으로 쓴다 */
function docCommentBefore(lines, index) {
  const out = [];
  for (let i = index - 1; i >= 0; i--) {
    const line = lines[i].trim();
    // 한 줄짜리 `/** 설명 */` — 대부분의 prop 주석이 이 모양이다
    const oneLine = line.match(/^\/\*\*\s*(.*?)\s*\*\/$/);
    if (oneLine) {
      out.unshift(oneLine[1]);
      break;
    }
    if (line === '*/' || line === '/**') continue;
    if (line.startsWith('*')) {
      out.unshift(line.replace(/^\*\s?/, '').trim());
      continue;
    }
    if (line.startsWith('//')) {
      out.unshift(line.replace(/^\/\/\s?/, '').trim());
      continue;
    }
    break;
  }
  return out.filter(Boolean).join(' ');
}

/** `export interface XProps { … }` 본문에서 prop을 읽는다 */
function readProps(text, comp) {
  const m = text.match(
    new RegExp(`export interface ${comp}Props[^{]*\\{([\\s\\S]*?)\\n\\}`)
  );
  if (!m) return [];
  const lines = m[1].split('\n');
  const props = [];
  lines.forEach((raw, i) => {
    const line = raw.trim();
    // `name?: Type;` / `name: Type;`  (주석·중첩은 건너뛴다)
    const pm = line.match(/^([a-zA-Z_$][\w$]*)(\?)?:\s*(.+?);\s*$/);
    if (!pm) return;
    props.push({
      name: pm[1],
      type: pm[3].trim(),
      required: !pm[2],
      description: docCommentBefore(lines, i),
    });
  });
  return props;
}

/** `withDefaults(defineProps<…>(), { … })`에서 기본값 */
function readDefaults(text) {
  const m = text.match(/withDefaults\([\s\S]*?,\s*\{([\s\S]*?)\n\}\s*\)/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const dm = line.trim().match(/^([a-zA-Z_$][\w$]*):\s*(.+?),?\s*$/);
    if (dm && dm[2] !== 'undefined') out[dm[1]] = dm[2].replace(/,$/, '');
  }
  return out;
}

/** `defineEmits<{ … }>()`에서 이벤트 */
function readEmits(text) {
  const m = text.match(/defineEmits<\{([\s\S]*?)\n\}>\(\)/);
  if (!m) return [];
  const lines = m[1].split('\n');
  const out = [];
  lines.forEach((raw, i) => {
    const em = raw.trim().match(/^'?([\w:-]+)'?:\s*\[(.*)\];\s*$/);
    if (!em) return;
    out.push({
      name: em[1],
      payload: em[2].trim(),
      description: docCommentBefore(lines, i),
    });
  });
  return out;
}

/** 템플릿의 slot */
function readSlots(text) {
  const named = [...text.matchAll(/<slot[^>]*\bname="([a-zA-Z-]+)"/g)].map(
    (m) => m[1]
  );
  const hasDefault = /<slot(?![^>]*\bname=)[^>]*\/?>/.test(text);
  return [...new Set([...(hasDefault ? ['default'] : []), ...named])];
}

/**
 * `export type BadgeVariant = 'outline' | 'bg' | …` 같은 별칭을 펼친다.
 * 표에 `BadgeVariant`라고만 적히면 무엇을 넣어야 할지 알 수 없다.
 */
function readTypeAliases(text) {
  const out = {};
  for (const m of text.matchAll(/export type (\w+)\s*=\s*([\s\S]*?);/g)) {
    const body = m[2]
      .split('\n')
      .map((l) => l.trim())
      .join(' ')
      .replace(/\s*\|\s*/g, ' | ')
      .trim()
      .replace(/^\|\s*/, ''); // 여러 줄 union은 `|`로 시작한다
    if (body.length <= 120) out[m[1]] = body;
  }
  return out;
}

function describe(text) {
  const m = text.match(/\/\*\*\s*\n\s*\*\s*(.+)/);
  return m ? m[1].trim() : '';
}

const comps = fs
  .readdirSync(SRC, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((n) => fs.existsSync(path.join(SRC, n, `${n}.vue`)))
  .sort();

const api = {};
for (const comp of comps) {
  const text = fs.readFileSync(path.join(SRC, comp, `${comp}.vue`), 'utf-8');
  const defaults = readDefaults(text);
  const aliases = readTypeAliases(text);
  const slug = DOC_SLUG[comp] ?? kebab(comp);
  api[slug] = {
    component: comp,
    install: kebab(comp),
    description: describe(text),
    props: readProps(text, comp).map((p) => ({
      ...p,
      type: aliases[p.type] ?? p.type,
      default: defaults[p.name] ?? null,
    })),
    emits: readEmits(text),
    slots: readSlots(text),
  };
}

async function format(value) {
  const text = JSON.stringify(value, null, 2) + '\n';
  try {
    const prettier = await import('prettier');
    const options = (await prettier.resolveConfig(OUT)) ?? {};
    return await prettier.format(text, { ...options, filepath: OUT });
  } catch {
    return text;
  }
}

const output = await format(api);

if (process.argv.includes('--check')) {
  let same = false;
  try {
    same =
      JSON.stringify(JSON.parse(fs.readFileSync(OUT, 'utf-8'))) ===
      JSON.stringify(api);
  } catch {
    same = false;
  }
  if (same) {
    console.log(`✅ ${OUT} 이(가) 소스와 일치합니다 (${comps.length}개).`);
    process.exit(0);
  }
  console.error(
    `❌ ${OUT} 이(가) 소스와 다릅니다. \`node scripts/build-vue-docs-meta.mjs\`로 다시 생성하세요.`
  );
  process.exit(1);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, output);
console.log(`${OUT} — ${comps.length}개 생성`);
