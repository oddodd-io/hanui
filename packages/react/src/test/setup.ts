// jsdom에 없는 API 폴리필
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom은 레이아웃을 계산하지 않아 scrollIntoView가 구현돼 있지 않다.
// (목록에서 활성 항목을 보이게 스크롤하는 컴포넌트들이 호출한다)
Element.prototype.scrollIntoView = function scrollIntoView() {};

import '@testing-library/jest-dom/vitest';
import * as matchers from 'vitest-axe/matchers';
import { expect } from 'vitest';
import { configureAxe, axe as originalAxe } from 'vitest-axe';
import type { AxeResults } from 'axe-core';

expect.extend(matchers);

// 개별 컴포넌트 테스트에서는 region 규칙 비활성화
// (실제 페이지에서는 landmark가 있지만 단일 컴포넌트 테스트에서는 없음)
const axeOptions = {
  rules: {
    region: { enabled: false },
  },
};

export const axe = async (element: Element): Promise<AxeResults> => {
  return originalAxe(element, axeOptions);
};
