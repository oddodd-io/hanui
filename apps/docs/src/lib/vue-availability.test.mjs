/** 실행: node --test apps/docs/src/lib/vue-availability.test.mjs */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { vueDocMode } from './vue-availability.mjs';

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
