/**
 * 컴포넌트 링크가 실제 라우트를 가리키는지 검사한다.
 * 실행: node --test apps/docs/src/lib/component-links.test.mjs
 *
 * 왜 — overview 페이지가 Main Menu를 `/components/mainmenu`로 걸고 있었는데
 * 실제 라우트는 `main-menu`라 **줄곧 404**였다. 눈으로는 안 보인다(링크가 있긴 하니까).
 * 반대로 라우트는 있는데 목록에 빠진 것도 있었다(`sidebar`, `structured-list`).
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const routesOf = (section) =>
  new Set(
    fs
      .readdirSync(path.join(ROOT, 'src/app', section), { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
      .map((d) => d.name)
  );

const hrefsIn = (file, section) =>
  [
    ...fs
      .readFileSync(path.join(ROOT, file), 'utf-8')
      .matchAll(new RegExp(`href: '/${section}/([a-z0-9-]+)'`, 'g')),
  ].map((m) => m[1]);

const routes = routesOf('components');

describe('컴포넌트 링크', () => {
  it('overview의 모든 링크가 실제 라우트를 가리킨다', () => {
    const dead = hrefsIn('src/app/components/page.tsx', 'components').filter(
      (h) => !routes.has(h)
    );
    assert.deepEqual(dead, [], `죽은 링크: ${dead.join(', ')}`);
  });

  it('사이드바의 모든 링크가 실제 라우트를 가리킨다', () => {
    const dead = hrefsIn(
      'src/components/layout/Sidebar.tsx',
      'components'
    ).filter((h) => !routes.has(h));
    assert.deepEqual(dead, [], `죽은 링크: ${dead.join(', ')}`);
  });

  it('모든 라우트가 overview에 올라 있다 — 만들고 목록에 안 넣으면 아무도 못 찾는다', () => {
    const listed = new Set(
      hrefsIn('src/app/components/page.tsx', 'components')
    );
    const orphans = [...routes].filter((r) => !listed.has(r));
    assert.deepEqual(orphans, [], `목록에 없는 라우트: ${orphans.join(', ')}`);
  });

  it('모든 라우트가 사이드바에도 올라 있다', () => {
    // 목록과 사이드바는 따로 관리돼 한쪽에만 빠지는 일이 실제로 있었다
    // (link·structured-list·visually-hidden이 사이드바에만 없었다).
    const listed = new Set(
      hrefsIn('src/components/layout/Sidebar.tsx', 'components')
    );
    const orphans = [...routes].filter((r) => !listed.has(r));
    assert.deepEqual(
      orphans,
      [],
      `사이드바에 없는 라우트: ${orphans.join(', ')}`
    );
  });

  it('Vue 전용 목록이 실제와 맞는다 — Vue에 있고 문서 페이지도 있다', () => {
    const api = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'src/lib/vue-api.json'), 'utf-8')
    );
    const only = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'src/lib/vue-only.json'), 'utf-8')
    );
    const notInVue = only.filter((s) => !api[s]);
    assert.deepEqual(notInVue, [], `Vue에 없음: ${notInVue.join(', ')}`);
    const noDoc = only.filter((s) => !routes.has(s));
    assert.deepEqual(noDoc, [], `문서 없음: ${noDoc.join(', ')}`);
  });

  it('Vue API의 슬러그가 전부 실제 라우트다', () => {
    const api = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'src/lib/vue-api.json'), 'utf-8')
    );
    // 예외 없음 — Vue 컴포넌트 23개 전부 문서 페이지가 있다.
    const unknown = Object.keys(api).filter((s) => !routes.has(s));
    assert.deepEqual(
      unknown,
      [],
      `라우트 없는 Vue 슬러그: ${unknown.join(', ')}`
    );
  });
});

/**
 * 블록도 같은 병을 앓고 있었다 — 라우트 28개 중 **9개가 overview 목록에만 없었다**
 * (차트 4종과 CMS 관리 5종). 사이드바엔 있어서 눈으로는 안 보였다.
 */
describe('블록 링크', () => {
  const blockRoutes = routesOf('blocks');

  it('overview의 모든 링크가 실제 라우트를 가리킨다', () => {
    const dead = hrefsIn('src/app/blocks/page.tsx', 'blocks').filter(
      (h) => !blockRoutes.has(h)
    );
    assert.deepEqual(dead, [], `죽은 링크: ${dead.join(', ')}`);
  });

  it('사이드바의 모든 링크가 실제 라우트를 가리킨다', () => {
    const dead = hrefsIn('src/components/layout/Sidebar.tsx', 'blocks').filter(
      (h) => !blockRoutes.has(h)
    );
    assert.deepEqual(dead, [], `죽은 링크: ${dead.join(', ')}`);
  });

  it('모든 라우트가 overview에 올라 있다', () => {
    const listed = new Set(hrefsIn('src/app/blocks/page.tsx', 'blocks'));
    const orphans = [...blockRoutes].filter((r) => !listed.has(r));
    assert.deepEqual(orphans, [], `목록에 없는 라우트: ${orphans.join(', ')}`);
  });

  it('모든 라우트가 사이드바에도 올라 있다', () => {
    const listed = new Set(
      hrefsIn('src/components/layout/Sidebar.tsx', 'blocks')
    );
    const orphans = [...blockRoutes].filter((r) => !listed.has(r));
    assert.deepEqual(
      orphans,
      [],
      `사이드바에 없는 라우트: ${orphans.join(', ')}`
    );
  });

  it('Vue 블록 슬러그가 전부 실제 라우트다 (오늘은 0개)', () => {
    const vb = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'src/lib/vue-blocks.json'), 'utf-8')
    );
    const unknown = Object.keys(vb).filter((s) => !blockRoutes.has(s));
    assert.deepEqual(
      unknown,
      [],
      `라우트 없는 Vue 블록: ${unknown.join(', ')}`
    );
  });
});
