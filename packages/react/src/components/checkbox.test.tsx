import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../test/setup';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxGroupItem,
  ChipCheckbox,
} from './checkbox';

describe('Checkbox', () => {
  it('checkbox role로 렌더링되어야 합니다', () => {
    render(<Checkbox aria-label="동의" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('label이 올바르게 렌더링되어야 합니다', () => {
    render(<Checkbox label="이용약관 동의" />);
    expect(screen.getByText('이용약관 동의')).toBeInTheDocument();
  });

  it('클릭하면 체크 상태가 변경되어야 합니다', async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="동의" />);
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('disabled일 때 클릭이 동작하지 않아야 합니다', async () => {
    const user = userEvent.setup();
    render(<Checkbox disabled aria-label="비활성" />);
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('error 상태일 때 aria-invalid="true"여야 합니다', () => {
    render(<Checkbox status="error" aria-label="에러" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('기본 Checkbox는 접근성 위반이 없어야 합니다', async () => {
    const { container } = render(<Checkbox label="동의합니다" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('CheckboxGroup', () => {
  it('여러 체크박스를 렌더링해야 합니다', () => {
    render(
      <CheckboxGroup>
        <CheckboxGroupItem value="a" label="옵션 A" />
        <CheckboxGroupItem value="b" label="옵션 B" />
      </CheckboxGroup>
    );
    expect(screen.getByText('옵션 A')).toBeInTheDocument();
    expect(screen.getByText('옵션 B')).toBeInTheDocument();
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const { container } = render(
      <CheckboxGroup>
        <CheckboxGroupItem value="a" label="옵션 A" />
        <CheckboxGroupItem value="b" label="옵션 B" />
      </CheckboxGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('ChipCheckbox', () => {
  it('checkbox role로 렌더링되어야 합니다', () => {
    render(<ChipCheckbox label="서울" />);
    expect(screen.getByRole('checkbox', { name: '서울' })).toBeInTheDocument();
  });

  it('키보드로 토글할 수 있어야 합니다', async () => {
    const user = userEvent.setup();
    render(<ChipCheckbox label="서울" />);
    const chip = screen.getByRole('checkbox', { name: '서울' });

    await user.tab();
    expect(chip).toHaveFocus();

    await user.keyboard(' ');
    expect(chip).toBeChecked();
  });

  it('클릭 한 번에 한 번만 토글되어야 합니다', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    // label이 감싼 input의 클릭이 label로 되돌아오면 두 번 토글된다
    render(
      <ChipCheckbox label="서울" value="seoul" onCheckedChange={onCheckedChange} />
    );

    await user.click(screen.getByRole('checkbox', { name: '서울' }));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('checkbox', { name: '서울' })).toBeChecked();
  });

  it('제어 컴포넌트로 동작해야 합니다', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <ChipCheckbox
        label="서울"
        checked={false}
        onCheckedChange={onCheckedChange}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: '서울' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    // 제어 상태이므로 prop이 바뀌기 전까지는 그대로여야 한다
    expect(screen.getByRole('checkbox', { name: '서울' })).not.toBeChecked();
  });

  it('disabled일 때 토글되지 않아야 합니다', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <ChipCheckbox label="서울" disabled onCheckedChange={onCheckedChange} />
    );

    const chip = screen.getByRole('checkbox', { name: '서울' });
    expect(chip).toBeDisabled();
    await user.click(chip);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('name과 value가 폼에 전달되어야 합니다', () => {
    render(
      <ChipCheckbox label="서울" name="region" value="seoul" defaultChecked />
    );
    const chip = screen.getByRole('checkbox', { name: '서울' });
    expect(chip).toHaveAttribute('name', 'region');
    expect(chip).toHaveAttribute('value', 'seoul');
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const { container } = render(
      <div>
        <ChipCheckbox label="서울" value="seoul" />
        <ChipCheckbox label="부산" value="busan" defaultChecked />
        <ChipCheckbox label="대구" value="daegu" disabled />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
