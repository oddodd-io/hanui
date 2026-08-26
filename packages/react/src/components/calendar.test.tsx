import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../test/setup';
import { Calendar } from './calendar';

// value를 주면 표시 연/월이 그 값에서 시작하므로 오늘 날짜와 무관하게 검증할 수 있다
const AUG_15 = new Date(2026, 7, 15);

describe('Calendar', () => {
  it('이름을 가진 group으로 렌더링되어야 합니다', () => {
    render(<Calendar value={AUG_15} />);
    // role 없는 div의 aria-label은 스크린리더가 읽지 않는다
    expect(screen.getByRole('group', { name: '달력' })).toBeInTheDocument();
  });

  it('날짜 표가 grid role과 caption을 가져야 합니다', () => {
    render(<Calendar value={AUG_15} />);
    expect(screen.getByRole('grid', { name: '2026년 8월' })).toBeInTheDocument();
  });

  it('요일 헤더에 scope="col"이 있어야 합니다', () => {
    render(<Calendar value={AUG_15} />);
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(7);
    headers.forEach((th) => expect(th).toHaveAttribute('scope', 'col'));
  });

  it('날짜 셀에 읽을 수 있는 접근명이 있어야 합니다', () => {
    render(<Calendar value={AUG_15} />);
    expect(
      screen.getByRole('button', { name: '2026년 8월 15일 선택됨' })
    ).toBeInTheDocument();
  });

  it('선택 상태가 aria-selected로 전달되어야 합니다', () => {
    render(<Calendar value={AUG_15} />);
    const selected = screen
      .getAllByRole('gridcell')
      .filter((cell) => cell.getAttribute('aria-selected') === 'true');
    expect(selected).toHaveLength(1);
  });

  it('날짜를 클릭하면 onChange가 호출되어야 합니다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Calendar value={AUG_15} onChange={onChange} />);

    await user.click(
      screen.getByRole('button', { name: '2026년 8월 20일' })
    );
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBeInstanceOf(Date);
    expect(onChange.mock.calls[0][0].getDate()).toBe(20);
  });

  it('이전/다음 달 버튼으로 표시 월이 바뀌어야 합니다', async () => {
    const user = userEvent.setup();
    render(<Calendar value={AUG_15} />);

    await user.click(screen.getByRole('button', { name: '이전 달' }));
    expect(screen.getByRole('grid', { name: '2026년 7월' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다음 달' }));
    await user.click(screen.getByRole('button', { name: '다음 달' }));
    expect(screen.getByRole('grid', { name: '2026년 9월' })).toBeInTheDocument();
  });

  it('12월에서 다음 달로 넘어가면 해가 바뀌어야 합니다', async () => {
    const user = userEvent.setup();
    render(<Calendar value={new Date(2026, 11, 1)} />);

    await user.click(screen.getByRole('button', { name: '다음 달' }));
    expect(screen.getByRole('grid', { name: '2027년 1월' })).toBeInTheDocument();
  });

  it('minDate 이전 날짜는 선택할 수 없어야 합니다', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Calendar
        value={AUG_15}
        minDate={new Date(2026, 7, 10)}
        onChange={onChange}
      />
    );

    await user.click(screen.getByRole('button', { name: '2026년 8월 5일' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('연도/월 선택 드롭다운에 접근명이 있어야 합니다', () => {
    render(<Calendar value={AUG_15} />);
    expect(
      screen.getByRole('button', { name: '연도 선택' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '월 선택' })).toBeInTheDocument();
  });

  it('연도 목록이 listbox로 열려야 합니다', async () => {
    const user = userEvent.setup();
    render(<Calendar value={AUG_15} />);

    await user.click(screen.getByRole('button', { name: '연도 선택' }));
    expect(
      screen.getByRole('listbox', { name: '연도 목록' })
    ).toBeInTheDocument();
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const { container } = render(<Calendar value={AUG_15} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('range 모드에서도 접근성 위반이 없어야 합니다', async () => {
    const { container } = render(
      <Calendar
        mode="range"
        range={{ start: new Date(2026, 7, 10), end: new Date(2026, 7, 20) }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
