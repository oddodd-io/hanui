import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../test/setup';
import { Sidebar, type SidebarMenuItem } from './sidebar';

const MENU: SidebarMenuItem[] = [
  { label: '대시보드', href: '/admin', active: true },
  {
    label: '게시판',
    children: [
      { label: '공지사항', href: '/admin/notice' },
      { label: '자료실', href: '/admin/files', active: true },
    ],
  },
  { label: '설정', href: '/admin/settings' },
];

describe('Sidebar', () => {
  it('이름을 가진 complementary 랜드마크여야 합니다', () => {
    render(<Sidebar menuItems={MENU} />);
    expect(
      screen.getByRole('complementary', { name: '사이드바 메뉴' })
    ).toBeInTheDocument();
  });

  it('활성 하위 항목이 있는 메뉴는 처음부터 펼쳐져야 합니다', () => {
    render(<Sidebar menuItems={MENU} />);
    expect(screen.getByRole('button', { name: /게시판/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByText('자료실')).toBeInTheDocument();
  });

  it('하위 메뉴를 접었다 펼 수 있어야 합니다', async () => {
    const user = userEvent.setup();
    render(<Sidebar menuItems={MENU} />);
    const toggle = screen.getByRole('button', { name: /게시판/ });

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('자료실')).toBeNull();
  });

  it('활성 항목에 aria-current="page"가 있어야 합니다', () => {
    render(<Sidebar menuItems={MENU} />);
    expect(screen.getByRole('link', { name: '대시보드' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('메뉴 클릭 시 onMenuClick이 호출되어야 합니다', async () => {
    const user = userEvent.setup();
    const onMenuClick = vi.fn();
    render(<Sidebar menuItems={MENU} onMenuClick={onMenuClick} />);

    await user.click(screen.getByRole('link', { name: '설정' }));
    expect(onMenuClick).toHaveBeenCalledWith('/admin/settings');
  });

  it('접기 버튼이 상태에 따라 접근명을 바꿔야 합니다', async () => {
    const user = userEvent.setup();
    const onCollapsedChange = vi.fn();
    render(<Sidebar menuItems={MENU} onCollapsedChange={onCollapsedChange} />);

    await user.click(screen.getByRole('button', { name: '사이드바 접기' }));
    expect(
      screen.getByRole('button', { name: '사이드바 펼치기' })
    ).toBeInTheDocument();
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });

  it('href 없는 항목은 링크가 아니라 버튼이어야 합니다', () => {
    // <a>에 href가 없으면 링크 역할이 없어 aria-label을 쓸 수 없다
    // (axe aria-prohibited-attr)
    render(<Sidebar menuItems={MENU} defaultCollapsed />);
    expect(screen.getByRole('button', { name: '게시판' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '게시판' })).toBeNull();
  });

  it('접힌 상태에서도 메뉴가 접근명을 가져야 합니다', () => {
    render(<Sidebar menuItems={MENU} defaultCollapsed />);
    expect(screen.getByRole('link', { name: '대시보드' })).toBeInTheDocument();
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const { container } = render(<Sidebar menuItems={MENU} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('접힌 상태에서도 접근성 위반이 없어야 합니다', async () => {
    const { container } = render(<Sidebar menuItems={MENU} defaultCollapsed />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
