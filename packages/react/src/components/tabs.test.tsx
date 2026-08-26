import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../test/setup';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

const TestTabs = () => (
  <Tabs defaultValue="tab1">
    <TabsList>
      <TabsTrigger value="tab1">탭 1</TabsTrigger>
      <TabsTrigger value="tab2">탭 2</TabsTrigger>
    </TabsList>
    <TabsContent value="tab1">탭 1 내용</TabsContent>
    <TabsContent value="tab2">탭 2 내용</TabsContent>
  </Tabs>
);

describe('Tabs', () => {
  it('tablist role로 렌더링되어야 합니다', () => {
    render(<TestTabs />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('tab role 요소들이 렌더링되어야 합니다', () => {
    render(<TestTabs />);
    expect(screen.getAllByRole('tab')).toHaveLength(2);
  });

  it('기본 탭의 콘텐츠가 표시되어야 합니다', () => {
    render(<TestTabs />);
    expect(screen.getByText('탭 1 내용')).toBeInTheDocument();
  });

  it('탭 클릭 시 콘텐츠가 전환되어야 합니다', async () => {
    const user = userEvent.setup();
    render(<TestTabs />);
    await user.click(screen.getByText('탭 2'));
    expect(screen.getByText('탭 2 내용')).toBeInTheDocument();
  });

  it('활성 탭에 aria-selected="true"가 있어야 합니다', () => {
    render(<TestTabs />);
    expect(screen.getByText('탭 1')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('탭 2')).toHaveAttribute('aria-selected', 'false');
  });

  it('탭 패널의 aria-labelledby가 실제 탭 요소를 가리켜야 합니다', () => {
    const { container } = render(<TestTabs />);
    const panel = screen.getByRole('tabpanel');
    const labelledBy = panel.getAttribute('aria-labelledby');

    expect(labelledBy).toBeTruthy();
    // 존재하지 않는 id를 가리키면 패널의 접근명이 비어버린다
    const label = container.ownerDocument.getElementById(labelledBy as string);
    expect(label).not.toBeNull();
    expect(label).toHaveTextContent('탭 1');
  });

  it('활성 탭의 aria-controls가 실제 패널을 가리켜야 합니다', () => {
    const { container } = render(<TestTabs />);
    const activeTab = screen.getByText('탭 1');
    const controls = activeTab.getAttribute('aria-controls');

    expect(controls).toBeTruthy();
    expect(container.ownerDocument.getElementById(controls as string)).toBe(
      screen.getByRole('tabpanel')
    );
  });

  it('비활성 탭은 언마운트된 패널을 참조하지 않아야 합니다', () => {
    render(<TestTabs />);
    // 비활성 패널은 렌더링되지 않으므로 aria-controls가 없어야 한다
    expect(screen.getByText('탭 2')).not.toHaveAttribute('aria-controls');
  });

  it('Tabs가 여러 개여도 tab/panel id가 겹치지 않아야 합니다', () => {
    render(
      <>
        <TestTabs />
        <TestTabs />
      </>
    );

    const tabIds = screen.getAllByRole('tab').map((t) => t.id);
    expect(tabIds.every(Boolean)).toBe(true);
    expect(new Set(tabIds).size).toBe(tabIds.length);

    const panelIds = screen.getAllByRole('tabpanel').map((p) => p.id);
    expect(new Set(panelIds).size).toBe(panelIds.length);
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const { container } = render(<TestTabs />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Tabs가 여러 개일 때도 접근성 위반이 없어야 합니다', async () => {
    const { container } = render(
      <>
        <TestTabs />
        <TestTabs />
      </>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
