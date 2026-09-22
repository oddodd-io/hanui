import * as matchers from 'vitest-axe/matchers';
import { expect } from 'vitest';
import { axe as originalAxe } from 'vitest-axe';
import type { AxeResults } from 'axe-core';

expect.extend(matchers);

// 단일 컴포넌트 테스트에는 landmark가 없으므로 region 규칙만 끈다.
const axeOptions = {
  rules: {
    region: { enabled: false },
  },
};

export const axe = async (element: Element): Promise<AxeResults> =>
  originalAxe(element, axeOptions);
