/**
 * Vue 주소에서 컴포넌트 문서를 볼 때 무엇을 덧붙일지 정한다.
 *
 * 왜 분리했나 — 이 판단은 **주소(hostname)로 프레임워크를 고른 뒤 브라우저에서만** 일어나
 * 로컬 서버로는 재현이 안 된다(localhost는 늘 react로 떨어진다). 화면으로 확인할 수 없는
 * 로직은 순수 함수로 빼서 테스트로 고정한다.
 *
 * 왜 필요한가 — 컴포넌트 문서 63개 중 프레임워크를 구분하는 건 `button` 하나뿐이고,
 * 나머지는 React 코드를 Vue 주소에서도 그대로 보여준다. 예를 들어 Badge 문서는
 * `NumberBadge`·`DotBadge`를 import하라고 하는데 Vue에는 그런 이름이 없다.
 *
 * @param {string} framework 'react' | 'vue'
 * @param {string|null|undefined} pathname 예: '/components/badge'
 * @param {Record<string, unknown>} vueApi 문서 슬러그 → Vue API (소스에서 생성)
 * @returns {{mode: 'none'} | {mode: 'unsupported'} | {mode: 'api', slug: string}}
 */
export function vueDocMode(framework, pathname, vueApi) {
  if (framework !== 'vue') return { mode: 'none' };

  const segments = String(pathname ?? '')
    .split('/')
    .filter(Boolean);

  // '/components' 목록 페이지는 특정 컴포넌트 얘기가 아니다
  if (segments[0] !== 'components' || segments.length < 2)
    return { mode: 'none' };

  const slug = segments[1];
  return Object.prototype.hasOwnProperty.call(vueApi, slug)
    ? { mode: 'api', slug }
    : { mode: 'unsupported' };
}

/**
 * 컴포넌트 목록을 현재 프레임워크에서 **실제로 쓸 수 있는 것만** 남긴다.
 *
 * 목록 페이지와 사이드바가 쓴다. 거르지 않으면 vue.hanui.io 사이드바에 63개가 뜨는데
 * 그중 42개는 Vue에 없다 — 눌러서 들어가야 없다는 걸 알게 된다.
 *
 * href에서 슬러그를 뽑아 판단한다. 이름(`Main Menu`)과 슬러그(`main-menu`)가
 * 달라서 이름으로 맞추면 어긋난다.
 *
 * @template {{href: string}} T
 * @param {T[]} components
 * @param {string} framework 'react' | 'vue'
 * @param {Record<string, unknown>} vueApi
 * @returns {T[]}
 */
export function filterByFramework(components, framework, vueApi) {
  if (framework !== 'vue') return components;
  return components.filter((c) => {
    const segments = String(c?.href ?? '')
      .split('/')
      .filter(Boolean);
    // 컴포넌트 **상세** 링크(`/components/<슬러그>`)만 거른다.
    // 사이드바의 'Overview'(`/components`)처럼 상세가 아닌 항목은 그대로 둔다 —
    // 걸러버리면 Vue에서 목록으로 돌아갈 길이 사라진다.
    if (segments[0] !== 'components' || segments.length < 2) return true;
    return Object.prototype.hasOwnProperty.call(vueApi, segments[1]);
  });
}
