import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from '../test/setup';
import { FormField, FormLabel, FormError, FormHelperText } from './form-field';
import { Input } from './input';

describe('FormField', () => {
  it('레이블이 입력과 연결되어야 합니다', () => {
    render(
      <FormField id="email">
        <FormLabel>이메일</FormLabel>
        <Input type="email" />
      </FormField>
    );
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
  });

  it('id를 주지 않아도 레이블 연결이 되어야 합니다', () => {
    render(
      <FormField>
        <FormLabel>이름</FormLabel>
        <Input />
      </FormField>
    );
    expect(screen.getByLabelText('이름')).toBeInTheDocument();
  });

  it('FormField가 여러 개여도 id가 겹치지 않아야 합니다', () => {
    render(
      <>
        <FormField>
          <FormLabel>이름</FormLabel>
          <Input />
        </FormField>
        <FormField>
          <FormLabel>소속</FormLabel>
          <Input />
        </FormField>
      </>
    );
    const ids = screen.getAllByRole('textbox').map((el) => el.id);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(2);
  });

  it('required일 때 필수 여부가 스크린리더로 전달되어야 합니다', () => {
    render(
      <FormField required>
        <FormLabel>이메일</FormLabel>
        <Input />
      </FormField>
    );
    // 시각 기호 *는 aria-hidden이고 sr-only 텍스트가 대신 읽힌다
    expect(screen.getByLabelText(/이메일/)).toBeInTheDocument();
    expect(screen.getByText('(필수)')).toBeInTheDocument();
  });

  it('에러 메시지가 입력의 aria-describedby로 연결되어야 합니다', () => {
    render(
      <FormField status="error">
        <FormLabel>이메일</FormLabel>
        <Input />
        <FormError>이메일 형식이 올바르지 않습니다</FormError>
      </FormField>
    );

    const input = screen.getByRole('textbox');
    const describedBy = input.getAttribute('aria-describedby') || '';
    const error = screen.getByRole('alert');

    expect(describedBy.split(/\s+/)).toContain(error.id);
    expect(error).toHaveTextContent('이메일 형식이 올바르지 않습니다');
  });

  it('에러 상태일 때 aria-invalid가 붙어야 합니다', () => {
    render(
      <FormField status="error">
        <FormLabel>이메일</FormLabel>
        <Input />
        <FormError>오류</FormError>
      </FormField>
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('도움말이 입력의 aria-describedby로 연결되어야 합니다', () => {
    render(
      <FormField>
        <FormLabel>이메일</FormLabel>
        <Input />
        <FormHelperText>example@email.com 형식으로 입력하세요</FormHelperText>
      </FormField>
    );

    const input = screen.getByRole('textbox');
    // FormHelperText는 children을 <span>으로 감싸므로 id는 바깥 컨테이너에 있다
    const helper = screen
      .getByText('example@email.com 형식으로 입력하세요')
      .closest('[id]');
    const describedBy = input.getAttribute('aria-describedby') || '';

    expect(helper).not.toBeNull();
    expect(describedBy.split(/\s+/)).toContain(helper!.id);
  });

  it('에러는 alert로 즉시 알려져야 합니다', () => {
    render(
      <FormField status="error">
        <FormLabel>이메일</FormLabel>
        <Input />
        <FormError>오류</FormError>
      </FormField>
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });

  it('기본 상태에서 접근성 위반이 없어야 합니다', async () => {
    const { container } = render(
      <FormField required>
        <FormLabel>이메일</FormLabel>
        <Input type="email" placeholder="example@email.com" />
        <FormHelperText>업무용 주소를 입력하세요</FormHelperText>
      </FormField>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('에러 상태에서도 접근성 위반이 없어야 합니다', async () => {
    const { container } = render(
      <FormField status="error" required>
        <FormLabel>이메일</FormLabel>
        <Input type="email" />
        <FormError>이메일 형식이 올바르지 않습니다</FormError>
      </FormField>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
