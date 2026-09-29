/**
 * 열린 모달 스택 — 중첩 모달의 z-index · 배경 스크롤 잠금 · 바깥 inert를 한곳에서 관리한다.
 * KRDS ui-script.js krds_modal(updateZIndex, scroll-no, #wrap inert)과 같은 역할이지만
 * `#wrap` 같은 특정 마크업에 의존하지 않는다.
 */

interface ModalEntry {
  el: HTMLElement;
  /** 이 모달이 inert로 만든 요소 (닫을 때 이것만 되돌린다) */
  inerted: HTMLElement[];
}

const stack: ModalEntry[] = [];
let savedBodyOverflow = '';

// KRDS 기준 z-index: 첫 모달 1010(.in CSS), 두 번째부터 1010 + 열린 개수
const BASE_Z_INDEX = 1010;

/** el에서 body까지 올라가며 형제 요소를 inert로 만든다 (Teleport 여부와 무관하게 동작) */
const inertOutside = (el: HTMLElement): HTMLElement[] => {
  const inerted: HTMLElement[] = [];
  let node: HTMLElement | null = el;
  while (node && node !== document.body && node.parentElement) {
    for (const sibling of Array.from(node.parentElement.children)) {
      if (
        sibling !== node &&
        sibling instanceof HTMLElement &&
        !sibling.hasAttribute('inert') &&
        sibling.tagName !== 'SCRIPT' &&
        sibling.tagName !== 'STYLE'
      ) {
        sibling.setAttribute('inert', '');
        inerted.push(sibling);
      }
    }
    node = node.parentElement;
  }
  return inerted;
};

export const pushModal = (el: HTMLElement) => {
  if (stack.some((entry) => entry.el === el)) return;

  if (stack.length === 0) {
    savedBodyOverflow = document.body.style.overflow;
    // KRDS는 body.scroll-no 클래스만 붙이고 CSS 정의가 없어 스크롤이 잠기지 않는다 → 직접 잠근다
    document.body.style.overflow = 'hidden';
    document.body.classList.add('scroll-no');
  }

  // 닫힌 모달도 DOM에 남아 있으므로, 먼저 열린 모달이 이 모달(또는 조상)을 inert로 만들었을 수 있다 → 푼다
  for (let node: HTMLElement | null = el; node; node = node.parentElement) {
    for (const entry of stack) {
      const i = entry.inerted.indexOf(node);
      if (i !== -1) {
        node.removeAttribute('inert');
        entry.inerted.splice(i, 1);
      }
    }
  }

  const depth = stack.length + 1;
  const isNested = depth > 1;
  stack.push({ el, inerted: inertOutside(el) });
  return { zIndex: isNested ? BASE_Z_INDEX + depth : undefined, isNested };
};

export const popModal = (el: HTMLElement) => {
  const index = stack.findIndex((entry) => entry.el === el);
  if (index === -1) return;
  const [entry] = stack.splice(index, 1);
  entry.inerted.forEach((node) => node.removeAttribute('inert'));

  if (stack.length === 0) {
    document.body.style.overflow = savedBodyOverflow;
    document.body.classList.remove('scroll-no');
  }
};

/** 테스트용: 스택 초기화 */
export const resetModalStack = () => {
  [...stack].reverse().forEach((entry) => popModal(entry.el));
};
