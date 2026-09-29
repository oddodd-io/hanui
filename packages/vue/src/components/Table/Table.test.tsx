import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { axe } from '../../test/setup';
import Table, { type TableRow } from './Table.vue';

const columns = [
  { key: 'title', label: '제목', width: '50%', rowHeader: true },
  { key: 'author', label: '작성자' },
  { key: 'date', label: '등록일', width: '8rem' },
];

const rows = [
  { id: 11, title: '공지사항 1', author: '홍길동', date: '2026-09-01' },
  { id: 12, title: '공지사항 2', author: '김철수', date: '2026-09-02' },
];

const caption = '공지사항 목록으로 제목, 작성자, 등록일로 구성되어 있다.';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Table 구조 (KRDS table.html 기준)', () => {
  it('.krds-table-wrap > table.tbl.col.data 구조로 렌더한다', () => {
    const wrapper = mount(Table, { props: { caption, columns, rows } });
    expect(wrapper.element.className).toBe('krds-table-wrap');
    const table = wrapper.find('table');
    expect(table.classes()).toEqual(['tbl', 'col', 'data']);
  });

  it('caption prop을 <caption>에 넣는다', () => {
    const wrapper = mount(Table, { props: { caption, columns, rows } });
    expect(wrapper.find('caption').text()).toBe(caption);
  });

  it('caption 슬롯으로 대신할 수 있다', () => {
    const wrapper = mount(Table, {
      props: { columns, rows },
      slots: { caption: '<span>슬롯 캡션</span>' },
    });
    expect(wrapper.find('caption span').text()).toBe('슬롯 캡션');
  });

  it('thead th는 scope="col"이고 열 제목을 표시한다', () => {
    const wrapper = mount(Table, { props: { caption, columns, rows } });
    const ths = wrapper.findAll('thead th');
    expect(ths.map((th) => th.text())).toEqual(['제목', '작성자', '등록일']);
    expect(ths.every((th) => th.attributes('scope') === 'col')).toBe(true);
  });

  it('width가 있으면 colgroup/col에 너비를 준다', () => {
    const wrapper = mount(Table, { props: { caption, columns, rows } });
    const cols = wrapper.findAll('colgroup col');
    expect(cols).toHaveLength(3);
    expect(cols[0].attributes('style')).toContain('width: 50%');
    expect(cols[1].attributes('style')).toBeUndefined();
    expect(cols[2].attributes('style')).toContain('width: 8rem');
  });

  it('width가 하나도 없으면 colgroup을 렌더하지 않는다', () => {
    const wrapper = mount(Table, {
      props: {
        caption,
        columns: columns.map(({ key, label }) => ({ key, label })),
        rows,
      },
    });
    expect(wrapper.find('colgroup').exists()).toBe(false);
  });

  it('rowHeader 열은 tbody에서 th scope="row", 나머지는 td로 렌더한다', () => {
    const wrapper = mount(Table, { props: { caption, columns, rows } });
    const firstRow = wrapper.findAll('tbody tr')[0];
    const cells = firstRow.findAll('th, td');
    expect(cells[0].element.tagName).toBe('TH');
    expect(cells[0].attributes('scope')).toBe('row');
    expect(cells[0].text()).toBe('공지사항 1');
    expect(cells[1].element.tagName).toBe('TD');
    expect(cells[1].attributes('scope')).toBeUndefined();
    expect(cells[2].text()).toBe('2026-09-01');
  });

  it('rows 순서대로 행을 렌더하고 null/undefined 값은 빈 셀로 둔다', () => {
    const wrapper = mount(Table, {
      props: {
        caption,
        columns,
        rows: [...rows, { id: 13, title: '제목만', author: null }],
      },
    });
    const trs = wrapper.findAll('tbody tr');
    expect(trs).toHaveLength(3);
    const last = trs[2].findAll('th, td');
    expect(last[1].text()).toBe('');
    expect(last[2].text()).toBe('');
  });
});

describe('Table 슬롯', () => {
  it('#cell-{key} 슬롯에 row·value·column·index를 넘긴다', () => {
    const wrapper = mount(Table, {
      props: { caption, columns, rows },
      slots: {
        'cell-title': ({
          row,
          value,
          index,
        }: {
          row: TableRow;
          value: unknown;
          index: number;
        }) => h('a', { href: `/notice/${row.id}` }, `${index + 1}. ${value}`),
      },
    });
    const link = wrapper.find('tbody tr th a');
    expect(link.attributes('href')).toBe('/notice/11');
    expect(link.text()).toBe('1. 공지사항 1');
  });

  it('#head-{key} 슬롯으로 열 제목을 바꿀 수 있다', () => {
    const wrapper = mount(Table, {
      props: { caption, columns, rows },
      slots: {
        'head-date': ({ column }: { column: { label: string } }) =>
          h('span', `${column.label}(KST)`),
      },
    });
    expect(wrapper.findAll('thead th')[2].text()).toBe('등록일(KST)');
  });

  it('columns 없이 default 슬롯으로 원본 마크업을 직접 넣을 수 있다', () => {
    const wrapper = mount(Table, {
      props: { caption },
      slots: {
        default:
          '<thead><tr><th scope="col">제목1</th><th scope="col">제목2</th></tr></thead><tbody><tr><th scope="row">제목1-1</th><td>내용</td></tr></tbody>',
      },
    });
    expect(wrapper.findAll('thead th')).toHaveLength(2);
    expect(wrapper.find('tbody th').attributes('scope')).toBe('row');
    expect(wrapper.find('caption').text()).toBe(caption);
  });
});

describe('Table 빈 상태', () => {
  it('rows가 비면 전체 열을 합친 한 칸에 emptyText를 표시한다', () => {
    const wrapper = mount(Table, { props: { caption, columns, rows: [] } });
    const tds = wrapper.findAll('tbody td');
    expect(tds).toHaveLength(1);
    expect(tds[0].attributes('colspan')).toBe('3');
    expect(tds[0].text()).toBe('데이터가 없습니다.');
  });

  it('emptyText와 #empty 슬롯으로 문구를 바꿀 수 있다', () => {
    const byProp = mount(Table, {
      props: { caption, columns, emptyText: '등록된 공지가 없습니다.' },
    });
    expect(byProp.find('tbody td').text()).toBe('등록된 공지가 없습니다.');

    const bySlot = mount(Table, {
      props: { caption, columns },
      slots: { empty: '<strong>검색 결과 없음</strong>' },
    });
    expect(bySlot.find('tbody td strong').text()).toBe('검색 결과 없음');
  });
});

describe('Table 행 key', () => {
  it('rowKey 필드 이름 또는 함수로 행을 식별한다 (재정렬 시 DOM 재사용)', async () => {
    const wrapper = mount(Table, {
      props: { caption, columns, rows, rowKey: 'id' },
    });
    const firstTr = wrapper.findAll('tbody tr')[0].element;
    await wrapper.setProps({ rows: [...rows].reverse() });
    // key가 id이므로 '공지사항 1' 행 요소는 두 번째 자리로 이동만 한다
    expect(wrapper.findAll('tbody tr')[1].element).toBe(firstTr);

    const byFn = mount(Table, {
      props: {
        caption,
        columns,
        rows,
        rowKey: (row: TableRow) => `n-${row.id}`,
      },
    });
    expect(byFn.findAll('tbody tr')).toHaveLength(2);
  });
});

describe('Table 스크롤 래퍼', () => {
  it('기본 래퍼는 region·tabindex를 붙이지 않는다', () => {
    const wrapper = mount(Table, { props: { caption, columns, rows } });
    expect(wrapper.attributes('role')).toBeUndefined();
    expect(wrapper.attributes('tabindex')).toBeUndefined();
  });

  it.each([
    ['scroll', 'scroll'],
    ['mobScroll', 'mob-scroll'],
  ] as const)(
    '%s면 .%s 클래스와 키보드 스크롤용 role="region" tabindex="0"을 붙이고 caption으로 이름을 준다',
    (prop, className) => {
      const wrapper = mount(Table, {
        props: { caption, columns, rows, [prop]: true },
      });
      expect(wrapper.classes()).toContain(className);
      expect(wrapper.attributes('role')).toBe('region');
      expect(wrapper.attributes('tabindex')).toBe('0');
      const captionId = wrapper.find('caption').attributes('id');
      expect(captionId).toBeTruthy();
      expect(wrapper.attributes('aria-labelledby')).toBe(captionId);
    }
  );
});

describe('Table 개발 경고', () => {
  it('caption이 없으면 경고한다', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(Table, { props: { columns, rows } });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('caption'));
  });

  it('caption이 있으면 경고하지 않는다', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mount(Table, { props: { caption, columns, rows } });
    mount(Table, { props: { columns, rows }, slots: { caption: '슬롯' } });
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('Table 접근성', () => {
  it('데이터 표 axe 위반이 없다', async () => {
    const wrapper = mount(Table, {
      props: { caption, columns, rows },
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });

  it('스크롤 표 axe 위반이 없다', async () => {
    const wrapper = mount(Table, {
      props: { caption, columns, rows, scroll: true },
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });

  it('빈 표 axe 위반이 없다', async () => {
    const wrapper = mount(Table, {
      props: { caption, columns, rows: [] },
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });
});
