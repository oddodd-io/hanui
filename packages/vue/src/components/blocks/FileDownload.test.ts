import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test/setup';
import FileDownload from './FileDownload.vue';
import type { FileItem } from './FileDownload.vue';

const FILES: FileItem[] = [
  { name: '사업계획서', size: '2.3MB', extension: 'hwp', href: '/a.hwp' },
  { name: '동의서', size: '150KB', extension: 'pdf', href: '/b.pdf' },
];

describe('FileDownload', () => {
  it('제목으로 이름지어진 region이어야 합니다', () => {
    const wrapper = mount(FileDownload, { props: { files: FILES } });
    expect(wrapper.element.tagName).toBe('SECTION');
    expect(wrapper.attributes('aria-label')).toBe('첨부파일');
  });

  it('파일 개수를 제목에 표시해야 합니다', () => {
    const wrapper = mount(FileDownload, { props: { files: FILES } });
    expect(wrapper.get('h4').text()).toBe('첨부파일 (2)');
  });

  it('파일명·크기·확장자가 렌더링되어야 합니다', () => {
    const wrapper = mount(FileDownload, { props: { files: FILES } });
    expect(wrapper.text()).toContain('사업계획서');
    expect(wrapper.text()).toContain('2.3MB');
    expect(wrapper.text()).toContain('HWP');
  });

  it('다운로드 버튼이 파일별로 구분되는 접근명을 가져야 합니다', () => {
    // 버튼 텍스트가 전부 "다운로드"라 이름만으로는 구분되지 않는다
    const wrapper = mount(FileDownload, { props: { files: FILES } });
    const labels = wrapper
      .findAll('[aria-label]')
      .map((el) => el.attributes('aria-label'))
      .filter((l) => l?.includes('다운로드'));
    expect(labels).toEqual(['사업계획서 다운로드', '동의서 다운로드']);
  });

  it('기본값은 href 링크로 렌더링되어야 합니다', () => {
    const wrapper = mount(FileDownload, { props: { files: FILES } });
    expect(wrapper.findAll('a[href="/a.hwp"]')).toHaveLength(1);
  });

  it('handleDownload면 링크 대신 download를 emit해야 합니다', async () => {
    const wrapper = mount(FileDownload, {
      props: { files: FILES, handleDownload: true },
    });
    expect(wrapper.find('a[href="/a.hwp"]').exists()).toBe(false);

    await wrapper.findAll('button')[0].trigger('click');
    expect(wrapper.emitted('download')?.[0]).toEqual([FILES[0]]);
  });

  it('파일이 없으면 아무것도 렌더링하지 않아야 합니다', () => {
    const wrapper = mount(FileDownload, { props: { files: [] } });
    expect(wrapper.find('section').exists()).toBe(false);
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const wrapper = mount(FileDownload, { props: { files: FILES } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
