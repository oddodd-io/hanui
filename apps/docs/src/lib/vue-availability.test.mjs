/** 실행: node --test apps/docs/src/lib/vue-availability.test.mjs */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  vueDocMode,
  filterByFramework,
  hideVueOnly,
} from './vue-availability.mjs';

const API = { badge: {}, button: {}, skiplink: {}, 'structured-list': {} };

describe('vueDocMode', () => {
  it('React로 보면 아무것도 덧붙이지 않는다 — React 문서엔 React 코드가 맞다', () => {
    assert.deepEqual(vueDocMode('react', '/components/accordion', API), {
      mode: 'none',
    });
    assert.deepEqual(vueDocMode('react', '/components/badge', API), {
      mode: 'none',
    });
  });

  it('Vue 버전이 있으면 API를 붙인다', () => {
    assert.deepEqual(vueDocMode('vue', '/components/badge', API), {
      mode: 'api',
      slug: 'badge',
    });
  });

  it('Vue 버전이 없으면 안내를 띄운다', () => {
    assert.deepEqual(vueDocMode('vue', '/components/accordion', API), {
      mode: 'unsupported',
    });
  });

  it('이름이 다른 짝도 지원으로 본다 — skiplink↔SkipLink, structured-list↔CardList', () => {
    assert.equal(vueDocMode('vue', '/components/skiplink', API).mode, 'api');
    assert.equal(
      vueDocMode('vue', '/components/structured-list', API).mode,
      'api'
    );
  });

  it('컴포넌트 목록 페이지에는 아무것도 안 띄운다', () => {
    assert.deepEqual(vueDocMode('vue', '/components', API), { mode: 'none' });
    assert.deepEqual(vueDocMode('vue', '/components/', API), { mode: 'none' });
  });

  it('컴포넌트 문서가 아니면 안 띄운다', () => {
    assert.deepEqual(vueDocMode('vue', '/blocks/login-form', API), {
      mode: 'none',
    });
    assert.deepEqual(vueDocMode('vue', '/', API), { mode: 'none' });
  });

  it('pathname이 없어도 터지지 않는다 — 첫 렌더에 null이 올 수 있다', () => {
    assert.deepEqual(vueDocMode('vue', null, API), { mode: 'none' });
    assert.deepEqual(vueDocMode('vue', undefined, API), { mode: 'none' });
  });

  it('하위 경로가 있어도 컴포넌트 이름으로 판단한다', () => {
    assert.equal(
      vueDocMode('vue', '/components/badge/examples', API).mode,
      'api'
    );
    assert.equal(
      vueDocMode('vue', '/components/accordion/examples', API).mode,
      'unsupported'
    );
  });

  it('프로토타입 키에 속지 않는다', () => {
    assert.deepEqual(vueDocMode('vue', '/components/constructor', API), {
      mode: 'unsupported',
    });
    assert.deepEqual(vueDocMode('vue', '/components/toString', API), {
      mode: 'unsupported',
    });
  });
});

describe('filterByFramework', () => {
  const LIST = [
    { name: 'Badge', href: '/components/badge' },
    { name: 'Accordion', href: '/components/accordion' },
    { name: 'Main Menu', href: '/components/main-menu' },
  ];
  const API = { badge: {}, 'main-menu': {} };

  it('React면 그대로 둔다 — React에는 다 있다', () => {
    assert.deepEqual(filterByFramework(LIST, 'react', API), LIST);
  });

  it('Vue면 Vue에 있는 것만 남긴다', () => {
    assert.deepEqual(
      filterByFramework(LIST, 'vue', API).map((c) => c.name),
      ['Badge', 'Main Menu']
    );
  });

  it('이름이 아니라 href 슬러그로 맞춘다 — "Main Menu" vs "main-menu"', () => {
    assert.equal(
      filterByFramework(LIST, 'vue', API).some((c) => c.name === 'Main Menu'),
      true
    );
  });

  it('Overview(/components)는 남긴다 — 걸러내면 목록으로 돌아갈 길이 없다', () => {
    const withOverview = [{ title: 'Overview', href: '/components' }, ...LIST];
    assert.deepEqual(
      filterByFramework(withOverview, 'vue', API).map((c) => c.title ?? c.name),
      ['Overview', 'Badge', 'Main Menu']
    );
  });

  it('컴포넌트 상세가 아닌 링크는 건드리지 않는다', () => {
    const other = [
      { title: 'Blocks', href: '/blocks' },
      { title: 'Docs', href: '/docs/introduction' },
    ];
    assert.deepEqual(filterByFramework(other, 'vue', API), other);
  });

  it('href가 없으면 남긴다 — 컴포넌트 링크인지 판단할 수 없으므로 건드리지 않는다', () => {
    assert.deepEqual(filterByFramework([{ name: 'X' }], 'vue', API), [
      { name: 'X' },
    ]);
  });

  it('전부 빠지면 빈 배열 — 그 묶음은 화면에서 사라진다', () => {
    assert.deepEqual(
      filterByFramework([{ name: 'A', href: '/components/alert' }], 'vue', API),
      []
    );
  });

  it('프로토타입 키에 속지 않는다', () => {
    assert.deepEqual(
      filterByFramework(
        [{ name: 'C', href: '/components/constructor' }],
        'vue',
        API
      ),
      []
    );
  });
});

describe('filterByFramework — blocks 구역', () => {
  const BLOCKS = [
    { title: 'Overview', href: '/blocks' },
    { title: 'Login Form', href: '/blocks/login-form' },
    { title: 'Search Bar', href: '/blocks/search-bar' },
  ];

  it('Vue 블록이 하나도 없으면 상세는 전부 빠지고 Overview만 남는다', () => {
    assert.deepEqual(
      filterByFramework(BLOCKS, 'vue', {}, 'blocks').map((b) => b.title),
      ['Overview']
    );
  });

  it('Vue 블록이 생기면 저절로 남는다', () => {
    assert.deepEqual(
      filterByFramework(BLOCKS, 'vue', { 'login-form': {} }, 'blocks').map(
        (b) => b.title
      ),
      ['Overview', 'Login Form']
    );
  });

  it('React면 그대로', () => {
    assert.deepEqual(filterByFramework(BLOCKS, 'react', {}, 'blocks'), BLOCKS);
  });

  it('구역이 다르면 건드리지 않는다 — blocks 기준으로 components 링크를 거르지 않는다', () => {
    const mixed = [{ href: '/components/accordion' }];
    assert.deepEqual(filterByFramework(mixed, 'vue', {}, 'blocks'), mixed);
  });

  it('기본 구역은 components다', () => {
    assert.deepEqual(
      filterByFramework([{ href: '/components/accordion' }], 'vue', {}),
      []
    );
  });
});

describe('hideVueOnly', () => {
  const LIST = [
    { title: 'Overview', href: '/components' },
    { title: 'Badge', href: '/components/badge' },
    { title: 'DropMenu', href: '/components/drop-menu' },
  ];
  const ONLY = ['drop-menu', 'mobile-menu'];

  it('React에서는 Vue 전용을 뺀다', () => {
    assert.deepEqual(
      hideVueOnly(LIST, 'react', ONLY).map((c) => c.title),
      ['Overview', 'Badge']
    );
  });

  it('Vue에서는 그대로 둔다 — 거기선 쓸 수 있다', () => {
    assert.deepEqual(hideVueOnly(LIST, 'vue', ONLY), LIST);
  });

  it('Overview는 남긴다', () => {
    assert.ok(
      hideVueOnly(LIST, 'react', ONLY).some((c) => c.title === 'Overview')
    );
  });

  it('목록이 비면 아무것도 안 뺀다', () => {
    assert.deepEqual(hideVueOnly(LIST, 'react', []), LIST);
  });
});
