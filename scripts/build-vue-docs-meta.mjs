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

/**
 * Vue 블록. React는 `packages/react/src/components/blocks/`에 47개가 있는데
 * Vue에는 폴더 자체가 없다 — 그래서 **오늘은 빈 목록**이 나온다.
 *
 * 빈 목록도 생성한다. 문서가 "Vue 블록 없음"을 손으로 적어 두면, 나중에 블록을
 * 만들고 그 문장을 지우는 걸 잊는다. 폴더가 생기면 저절로 목록에 뜬다.
 */
const BLOCKS_SRC = 'packages/vue/src/components/blocks';
const BLOCKS_OUT = 'apps/docs/src/lib/vue-blocks.json';

/**
 * React 대응이 없는 컴포넌트. 목록·사이드바에서 **React 쪽에 숨긴다.**
 *
 * 왜 손으로 적나 — React는 레지스트리 이름과 문서 슬러그가 많이 어긋나 있어
 * (레지스트리에만 있고 문서가 없는 항목이 15개) 이름 매칭으로 "React에 있나"를
 * 판정하면 틀린다. 틀린 자동 판정보다 **맞는 작은 목록**이 낫다.
 *
 * 늘어나면 그때 생성으로 바꾼다. 지금은 테스트가 이 목록을 지킨다
 * (`component-links.test.mjs`: Vue에 실재하고 문서 페이지가 있어야 한다).
 */
const VUE_ONLY = ['drop-menu', 'mobile-menu'];
const VUE_ONLY_OUT = 'apps/docs/src/lib/vue-only.json';

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

/** `<dir>/<Name>/<Name>.vue` 묶음을 읽어 슬러그→API 맵으로 */
function collect(dir) {
  if (!fs.existsSync(dir)) return {}; // 폴더가 없으면 빈 목록 (Vue 블록이 오늘 그렇다)
  const names = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((n) => fs.existsSync(path.join(dir, n, `${n}.vue`)))
    .sort();

  const out = {};
  for (const comp of names) {
    const text = fs.readFileSync(path.join(dir, comp, `${comp}.vue`), 'utf-8');
    const defaults = readDefaults(text);
    const aliases = readTypeAliases(text);
    const slug = DOC_SLUG[comp] ?? kebab(comp);
    out[slug] = {
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
  return out;
}

// 블록 폴더는 components 아래에 있으므로 컴포넌트 수집에서 빼야 섞이지 않는다.
const api = collect(SRC);
delete api.blocks;
const blocks = collect(BLOCKS_SRC);
const comps = Object.keys(api);

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

// 목록에 적은 슬러그가 실제로 Vue에 있는지 여기서 먼저 막는다.
for (const slug of VUE_ONLY) {
  if (!api[slug]) {
    console.error(`❌ VUE_ONLY에 적힌 '${slug}'가 Vue 컴포넌트에 없습니다.`);
    process.exit(1);
  }
}

const outputs = [
  [OUT, api, await format(api)],
  [BLOCKS_OUT, blocks, await format(blocks)],
  [VUE_ONLY_OUT, VUE_ONLY, await format(VUE_ONLY)],
];

if (process.argv.includes('--check')) {
  const stale = outputs.filter(([file, expected]) => {
    try {
      return (
        JSON.stringify(JSON.parse(fs.readFileSync(file, 'utf-8'))) !==
        JSON.stringify(expected)
      );
    } catch {
      return true;
    }
  });
  if (stale.length === 0) {
    console.log(
      `✅ 소스와 일치합니다 — 컴포넌트 ${comps.length}개, 블록 ${Object.keys(blocks).length}개, Vue 전용 ${VUE_ONLY.length}개`
    );
    process.exit(0);
  }
  for (const [file] of stale)
    console.error(`❌ ${file} 이(가) 소스와 다릅니다.`);
  console.error('`node scripts/build-vue-docs-meta.mjs`로 다시 생성하세요.');
  process.exit(1);
}

for (const [file, , text] of outputs) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
  console.log(`${file} — ${Object.keys(JSON.parse(text)).length}개 생성`);
}
