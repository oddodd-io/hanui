import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from '../test/setup';
import { FileUpload } from './file-upload';

describe('FileUpload', () => {
  it('제목이 렌더링되어야 합니다', () => {
    render(<FileUpload title="서류 첨부" />);
    expect(screen.getByText('서류 첨부')).toBeInTheDocument();
  });

  it('파일 선택 버튼이 보이는 텍스트로 접근 가능해야 합니다', () => {
    render(<FileUpload />);
    // 보이는 이름과 접근명이 일치해야 음성 제어로 조작할 수 있다 (WCAG 2.5.3)
    expect(
      screen.getByRole('button', { name: '파일 선택' })
    ).toBeInTheDocument();
  });

  it('uploadButtonText를 바꾸면 접근명도 함께 바뀌어야 합니다', () => {
    render(<FileUpload uploadButtonText="첨부하기" />);
    expect(screen.getByRole('button', { name: '첨부하기' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '파일 선택' })).toBeNull();
  });

  it('숨겨진 file input은 포커스를 받지 않아야 합니다', () => {
    const { container } = render(<FileUpload />);
    const input = container.querySelector('input[type="file"]');

    // aria-hidden 요소가 포커스를 받으면 axe aria-hidden-focus 위반이 된다
    expect(input).toHaveAttribute('aria-hidden', 'true');
    expect(input).toHaveAttribute('tabindex', '-1');
  });

  it('FileUpload가 여러 개여도 input id가 겹치지 않아야 합니다', () => {
    const { container } = render(
      <>
        <FileUpload title="첫 번째" />
        <FileUpload title="두 번째" />
      </>
    );

    const ids = Array.from(
      container.querySelectorAll('input[type="file"]')
    ).map((el) => el.id);

    expect(ids).toHaveLength(2);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(2);
  });

  it('disabled일 때 버튼이 비활성화되어야 합니다', () => {
    render(<FileUpload disabled />);
    expect(screen.getByRole('button', { name: '파일 선택' })).toBeDisabled();
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const { container } = render(
      <FileUpload
        title="서류 첨부"
        description="최대 5개, 각 10MB 이하"
        accept=".pdf,.hwp"
        bordered
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('FileUpload가 여러 개일 때도 접근성 위반이 없어야 합니다', async () => {
    const { container } = render(
      <>
        <FileUpload title="첫 번째" />
        <FileUpload title="두 번째" />
      </>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
