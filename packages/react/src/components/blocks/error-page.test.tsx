import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test/setup';
import { ErrorPage } from './error-page';

describe('ErrorPage', () => {
  it('404 에러 페이지가 렌더링되어야 합니다', () => {
    render(<ErrorPage code="404" />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('500 에러 페이지가 렌더링되어야 합니다', () => {
    render(<ErrorPage code="500" />);
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('onGoHome 제공 시 홈으로 돌아가기 버튼이 있어야 합니다', () => {
    render(<ErrorPage code="404" onGoHome={() => {}} />);
    expect(screen.getByText('홈으로 돌아가기')).toBeInTheDocument();
  });

  it('홈 버튼 클릭 시 onGoHome이 호출되어야 합니다', async () => {
    const user = userEvent.setup();
    let called = false;
    render(<ErrorPage code="404" onGoHome={() => (called = true)} />);
    await user.click(screen.getByText('홈으로 돌아가기'));
    expect(called).toBe(true);
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const { container } = render(<ErrorPage code="404" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('h1은 하나여야 합니다', () => {
    // 에러 코드를 Display 기본값(h1)으로 두면 페이지에 h1이 둘이 된다
    const { container } = render(<ErrorPage code="404" />);
    const h1s = container.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('페이지를 찾을 수 없습니다');
  });
});
