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
const COMPONENTS_DIR = path.join(ROOT, 'src/app/components');

const routes = new Set(
  fs
    .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
    .map((d) => d.name)
);

const hrefsIn = (file) =>
  [
    ...fs
      .readFileSync(path.join(ROOT, file), 'utf-8')
      .matchAll(/href: '\/components\/([a-z0-9-]+)'/g),
  ].map((m) => m[1]);

describe('컴포넌트 링크', () => {
  it('overview의 모든 링크가 실제 라우트를 가리킨다', () => {
    const dead = hrefsIn('src/app/components/page.tsx').filter(
      (h) => !routes.has(h)
    );
    assert.deepEqual(dead, [], `죽은 링크: ${dead.join(', ')}`);
  });

  it('사이드바의 모든 링크가 실제 라우트를 가리킨다', () => {
    const dead = hrefsIn('src/components/layout/Sidebar.tsx').filter(
      (h) => !routes.has(h)
    );
    assert.deepEqual(dead, [], `죽은 링크: ${dead.join(', ')}`);
  });

  it('모든 라우트가 overview에 올라 있다 — 만들고 목록에 안 넣으면 아무도 못 찾는다', () => {
    const listed = new Set(hrefsIn('src/app/components/page.tsx'));
    const orphans = [...routes].filter((r) => !listed.has(r));
    assert.deepEqual(orphans, [], `목록에 없는 라우트: ${orphans.join(', ')}`);
  });

  it('Vue API의 슬러그가 전부 실제 라우트다', () => {
    const api = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'src/lib/vue-api.json'), 'utf-8')
    );
    // 문서 페이지가 아직 없는 Vue 컴포넌트는 알고 있는 예외로 둔다.
    const known = new Set(['drop-menu', 'mobile-menu']);
    const unknown = Object.keys(api).filter(
      (s) => !routes.has(s) && !known.has(s)
    );
    assert.deepEqual(
      unknown,
      [],
      `라우트 없는 Vue 슬러그: ${unknown.join(', ')}`
    );
  });
});
