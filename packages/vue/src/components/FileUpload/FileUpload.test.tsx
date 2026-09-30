import { describe, it, expect, afterEach } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { defineComponent, ref, type Ref } from 'vue';
import { axe } from '../../test/setup';
import FileUpload, { type FileUploadItem } from './FileUpload.vue';
import { formatFileSize } from './file-size';

const mounted: VueWrapper[] = [];

afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount());
  document.body.innerHTML = '';
});

const makeFile = (name: string, size = 17 * 1024, type = '') => {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

/** v-model로 연결한 상위 컴포넌트를 마운트한다. items ref를 함께 돌려준다 */
const mountWithModel = (
  props: Record<string, unknown> = {},
  initial: FileUploadItem[] = []
) => {
  const items: Ref<FileUploadItem[]> = ref(initial);
  const events: { add: FileUploadItem[][]; reject: [File[], string][] } = {
    add: [],
    reject: [],
  };
  const wrapper = mount(
    defineComponent({
      components: { FileUpload },
      setup: () => ({
        items,
        props,
        onAdd: (added: FileUploadItem[]) => events.add.push(added),
        onReject: (files: File[], reason: string) =>
          events.reject.push([files, reason]),
      }),
      template:
        '<FileUpload v-model="items" v-bind="props" @add="onAdd" @reject="onReject" />',
    }),
    { attachTo: document.body }
  );
  mounted.push(wrapper);
  return { wrapper, items, events };
};

const selectFiles = async (wrapper: VueWrapper, files: File[]) => {
  const input = wrapper.find('input[type="file"]');
  Object.defineProperty(input.element, 'files', {
    value: files,
    configurable: true,
  });
  await input.trigger('change');
  await flushPromises();
};

const dropFiles = async (wrapper: VueWrapper, files: File[]) => {
  await wrapper
    .find('.file-upload')
    .trigger('drop', { dataTransfer: { files } });
  await flushPromises();
};

const liveText = () =>
  document.querySelector('[aria-live="polite"]')?.textContent ?? '';

describe('FileUpload 구조 (KRDS file_upload.html 기준)', () => {
  it('.krds-file-upload.line > .file-upload > .txt · .file-upload-btn-wrap 구조로 렌더한다', () => {
    const { wrapper } = mountWithModel();
    const root = wrapper.find('.krds-file-upload');
    expect(root.classes()).toEqual(['krds-file-upload', 'line']);
    expect(root.find('.file-upload .txt').text()).toContain('끌어다 놓거나');
    const input = root.find('.file-upload-btn-wrap input[type="file"]');
    expect(input.attributes('hidden')).toBeDefined();
    const btn = root.find('.file-upload-btn-wrap button');
    expect(btn.classes()).toEqual(['krds-btn', 'medium']);
    expect(btn.text()).toBe('파일선택');
    expect(btn.find('i.svg-icon.ico-upload').attributes('aria-hidden')).toBe(
      'true'
    );
  });

  it('KRDS 원본의 <label> 안 <button> 중첩을 쓰지 않는다', () => {
    const { wrapper } = mountWithModel();
    expect(wrapper.find('label button').exists()).toBe(false);
  });

  it('line=false면 .line 클래스가 없다', () => {
    const { wrapper } = mountWithModel({ line: false });
    expect(wrapper.find('.krds-file-upload').classes()).toEqual([
      'krds-file-upload',
    ]);
  });

  it('title·기본 슬롯은 .file-head에 렌더한다', () => {
    const wrapper = mount(FileUpload, {
      props: { title: '첨부파일', titleTag: 'h2' },
      slots: { default: '<p>hwp, pdf 파일을 올려주세요.</p>' },
    });
    mounted.push(wrapper);
    expect(wrapper.find('.file-head h2.tit').text()).toBe('첨부파일');
    expect(wrapper.find('.file-head > div p').text()).toBe(
      'hwp, pdf 파일을 올려주세요.'
    );
  });

  it('제목·설명이 없으면 .file-head를 렌더하지 않는다', () => {
    const { wrapper } = mountWithModel();
    expect(wrapper.find('.file-head').exists()).toBe(false);
  });

  it('accept·multiple·name을 input에 전달한다', () => {
    const { wrapper } = mountWithModel({
      accept: '.hwp,.pdf',
      multiple: false,
      name: 'attach',
    });
    const input = wrapper.find('input[type="file"]')
      .element as HTMLInputElement;
    expect(input.accept).toBe('.hwp,.pdf');
    expect(input.multiple).toBe(false);
    expect(input.name).toBe('attach');
  });

  it('파일선택 버튼을 누르면 input을 연다 (KRDS 원본 JS 동작)', async () => {
    const { wrapper } = mountWithModel();
    const input = wrapper.find('input[type="file"]')
      .element as HTMLInputElement;
    let opened = 0;
    input.addEventListener('click', () => opened++);
    await wrapper.find('.file-upload-btn-wrap button').trigger('click');
    expect(opened).toBe(1);
  });
});

describe('FileUpload 파일 추가', () => {
  it('선택한 파일을 목록에 추가하고 add 이벤트를 보낸다', async () => {
    const { wrapper, items, events } = mountWithModel();
    await selectFiles(wrapper, [
      makeFile('위임장.hwp'),
      makeFile('신고서.pdf', 2048),
    ]);
    expect(items.value.map((i) => i.name)).toEqual([
      '위임장.hwp',
      '신고서.pdf',
    ]);
    expect(items.value.every((i) => i.status === 'idle' && i.file)).toBe(true);
    expect(events.add).toHaveLength(1);
    expect(events.add[0]).toHaveLength(2);
  });

  it('선택 후 input 값을 비워 같은 파일을 다시 고를 수 있다', async () => {
    const { wrapper } = mountWithModel();
    const input = wrapper.find('input[type="file"]')
      .element as HTMLInputElement;
    await selectFiles(wrapper, [makeFile('a.hwp')]);
    expect(input.value).toBe('');
  });

  it('드롭한 파일을 추가한다', async () => {
    const { wrapper, items } = mountWithModel();
    await dropFiles(wrapper, [makeFile('a.hwp')]);
    expect(items.value).toHaveLength(1);
  });

  it('드래그 중에는 .file-upload.active, 떠나거나 놓으면 해제한다', async () => {
    const { wrapper } = mountWithModel();
    const zone = wrapper.find('.file-upload');
    await zone.trigger('dragenter');
    expect(zone.classes()).toContain('active');
    // 자식 요소로 들어갔다 나와도 유지
    await zone.trigger('dragenter');
    await zone.trigger('dragleave');
    expect(zone.classes()).toContain('active');
    await zone.trigger('dragleave');
    expect(zone.classes()).not.toContain('active');
    await zone.trigger('dragenter');
    await dropFiles(wrapper, [makeFile('a.hwp')]);
    expect(zone.classes()).not.toContain('active');
  });

  it('multiple=false면 한 개만 받고 기존 파일을 교체한다', async () => {
    const { wrapper, items } = mountWithModel({ multiple: false });
    await selectFiles(wrapper, [makeFile('a.hwp'), makeFile('b.hwp')]);
    expect(items.value.map((i) => i.name)).toEqual(['a.hwp']);
    await selectFiles(wrapper, [makeFile('c.hwp')]);
    expect(items.value.map((i) => i.name)).toEqual(['c.hwp']);
  });

  it('추가 결과를 스크린리더에 알린다', async () => {
    const { wrapper } = mountWithModel();
    await selectFiles(wrapper, [makeFile('a.hwp'), makeFile('b.hwp')]);
    expect(liveText()).toBe('파일 2개를 추가했습니다.');
  });

  it('disabled면 버튼이 비활성이고 드롭해도 추가하지 않는다', async () => {
    const { wrapper, items } = mountWithModel({ disabled: true });
    expect(
      (
        wrapper.find('.file-upload-btn-wrap button')
          .element as HTMLButtonElement
      ).disabled
    ).toBe(true);
    await dropFiles(wrapper, [makeFile('a.hwp')]);
    expect(items.value).toHaveLength(0);
  });
});

describe('FileUpload 검사', () => {
  it('maxSize 초과 파일은 is-error 항목과 KRDS 안내 문구로 표시하고 add에서 뺀다', async () => {
    const { wrapper, items, events } = mountWithModel({
      maxSize: 20 * 1024 * 1024,
    });
    await selectFiles(wrapper, [
      makeFile('큰파일.hwp', 25 * 1024 * 1024),
      makeFile('작은.hwp'),
    ]);
    expect(items.value[0].status).toBe('error');
    expect(events.add[0].map((i) => i.name)).toEqual(['작은.hwp']);
    const li = wrapper.findAll('.upload-list > li')[0];
    expect(li.classes()).toContain('is-error');
    const hint = li.find('p.file-hint-invalid');
    expect(hint.text()).toContain('등록 가능한 파일 용량을 초과하였습니다.');
    expect(hint.text()).toContain('20MB 이하의 파일만 등록할 수 있습니다.');
    expect(hint.find('br').exists()).toBe(true);
    expect(liveText()).toBe(
      '파일 2개를 추가했습니다. 이 중 1개는 오류가 있습니다.'
    );
  });

  it('accept에 맞지 않는 파일은 형식 오류로 표시한다 (확장자·MIME·와일드카드)', async () => {
    const { wrapper, items } = mountWithModel({
      accept: '.hwp, application/pdf, image/*',
    });
    await selectFiles(wrapper, [
      makeFile('a.HWP'),
      makeFile('b.pdf', 10, 'application/pdf'),
      makeFile('c.png', 10, 'image/png'),
      makeFile('d.exe', 10, 'application/x-msdownload'),
    ]);
    expect(items.value.map((i) => i.status)).toEqual([
      'idle',
      'idle',
      'idle',
      'error',
    ]);
    expect(items.value[3].error).toContain('등록할 수 없는 파일 형식입니다.');
  });

  it('maxFiles를 넘는 파일은 추가하지 않고 reject로 알린다', async () => {
    const { wrapper, items, events } = mountWithModel({ maxFiles: 2 });
    await selectFiles(wrapper, [
      makeFile('a.hwp'),
      makeFile('b.hwp'),
      makeFile('c.hwp'),
    ]);
    expect(items.value.map((i) => i.name)).toEqual(['a.hwp', 'b.hwp']);
    expect(events.reject).toHaveLength(1);
    expect(events.reject[0][0].map((f) => f.name)).toEqual(['c.hwp']);
    expect(events.reject[0][1]).toBe('max-files');
    expect(liveText()).toContain(
      '최대 2개까지 등록할 수 있어 1개 파일은 추가하지 않았습니다.'
    );
  });

  it('maxFiles에 도달하면 파일선택 버튼을 비활성화한다', async () => {
    const { wrapper } = mountWithModel({ maxFiles: 1 });
    await selectFiles(wrapper, [makeFile('a.hwp')]);
    expect(
      (
        wrapper.find('.file-upload-btn-wrap button')
          .element as HTMLButtonElement
      ).disabled
    ).toBe(true);
  });
});

describe('FileUpload 목록 표시', () => {
  const existing: FileUploadItem[] = [
    { id: '1', name: '위임장.hwp', size: 17 * 1024, status: 'uploading' },
    { id: '2', name: '신고서.hwp', size: 17 * 1024, status: 'done' },
    { id: '3', name: '첨부.pdf', size: 1536 * 1024 },
  ];

  it('파일명은 "이름 [확장자, 크기]"로 표시한다', () => {
    const { wrapper } = mountWithModel({}, existing);
    const names = wrapper.findAll('.file-name').map((n) => n.text());
    expect(names).toEqual([
      '위임장 [hwp, 17KB]',
      '신고서 [hwp, 17KB]',
      '첨부 [pdf, 1.5MB]',
    ]);
  });

  it('개수를 .total .current로 표시하고 maxFiles가 있으면 "/ N개"를 붙인다', () => {
    const { wrapper } = mountWithModel({ maxFiles: 10 }, existing);
    expect(wrapper.find('.total').text()).toBe('3개 / 10개');
    expect(wrapper.find('.total .current').text()).toBe('3개');
  });

  it('파일도 maxFiles도 없으면 .file-list를 렌더하지 않는다', () => {
    const { wrapper } = mountWithModel();
    expect(wrapper.find('.file-list').exists()).toBe(false);
  });

  it('업로드 중은 KRDS 스피너만, 완료는 완료 아이콘 + 삭제, 대기는 삭제 버튼', () => {
    const { wrapper } = mountWithModel({}, existing);
    const [uploading, done, idle] = wrapper.findAll('.upload-list > li');
    const spinner = uploading.find('.btn-wrap .krds-spinner');
    expect(spinner.attributes('role')).toBe('status');
    expect(spinner.find('.sr-only').text()).toBe('업로드 중');
    expect(uploading.find('button').exists()).toBe(false);
    expect(done.find('.ico-invalid.complete .sr-only').text()).toBe(
      '업로드 완료'
    );
    expect(done.find('button').exists()).toBe(true);
    expect(idle.find('button.krds-btn.medium.text').exists()).toBe(true);
  });

  it('삭제 버튼 이름에 파일명을 포함한다 (sr-only)', () => {
    const { wrapper } = mountWithModel({}, existing);
    const btn = wrapper.findAll('.upload-list > li')[2].find('button');
    expect(btn.text()).toContain('삭제');
    expect(btn.find('.sr-only').text()).toBe('첨부.pdf');
    expect(btn.find('i.ico-delete-fill').attributes('aria-hidden')).toBe(
      'true'
    );
  });

  it('#actions 슬롯으로 다운로드·바로보기 버튼을 넣으면 .m-column이 붙는다', () => {
    const wrapper = mount(FileUpload, {
      props: { modelValue: [existing[2]] },
      slots: {
        actions: `<template #actions="{ item }"><a :href="'/files/' + item.id" class="krds-btn medium text">다운로드</a></template>`,
      },
    });
    mounted.push(wrapper);
    expect(wrapper.find('.file-info').classes()).toContain('m-column');
    expect(wrapper.find('.btn-wrap a').attributes('href')).toBe('/files/3');
  });

  it('파일이 2개 이상이면 전체 파일 삭제 버튼을 보인다', () => {
    const one = mountWithModel({}, [existing[2]]).wrapper;
    expect(one.find('.upload-delete-btn').exists()).toBe(false);
    const many = mountWithModel({}, existing).wrapper;
    expect(
      many.find('.upload-delete-btn button.krds-btn.xsmall.tertiary').exists()
    ).toBe(true);
  });
});

describe('FileUpload 삭제', () => {
  const three = (): FileUploadItem[] => [
    { id: 'a', name: 'a.hwp', size: 10 },
    { id: 'b', name: 'b.hwp', size: 10 },
    { id: 'c', name: 'c.hwp', size: 10 },
  ];

  it('삭제하면 목록에서 빼고 remove를 보내며 다음 항목 삭제 버튼으로 초점을 옮긴다', async () => {
    const { wrapper, items } = mountWithModel({}, three());
    const buttons = wrapper.findAll('.upload-list .btn-wrap button');
    (buttons[1].element as HTMLButtonElement).focus();
    await buttons[1].trigger('click');
    await flushPromises();
    expect(items.value.map((i) => i.id)).toEqual(['a', 'c']);
    expect(document.activeElement?.textContent).toContain('c.hwp');
    expect(liveText()).toBe('b.hwp 파일을 삭제했습니다.');
  });

  it('마지막 항목을 삭제하면 이전 항목으로 초점을 옮긴다', async () => {
    const { wrapper } = mountWithModel({}, three());
    await wrapper.findAll('.upload-list .btn-wrap button')[2].trigger('click');
    await flushPromises();
    expect(document.activeElement?.textContent).toContain('b.hwp');
  });

  it('하나 남은 파일을 삭제하면 파일선택 버튼으로 초점을 옮긴다', async () => {
    const { wrapper } = mountWithModel({}, [three()[0]]);
    await wrapper.find('.upload-list .btn-wrap button').trigger('click');
    await flushPromises();
    expect(document.activeElement).toBe(
      wrapper.find('.file-upload-btn-wrap button').element
    );
  });

  it('전체 파일 삭제는 목록을 비우고 파일선택 버튼으로 초점을 옮긴다', async () => {
    const { wrapper, items } = mountWithModel({}, three());
    await wrapper.find('.upload-delete-btn button').trigger('click');
    await flushPromises();
    expect(items.value).toEqual([]);
    expect(document.activeElement).toBe(
      wrapper.find('.file-upload-btn-wrap button').element
    );
    expect(liveText()).toBe('첨부한 파일을 모두 삭제했습니다.');
  });
});

describe('formatFileSize', () => {
  it.each([
    [512, '512B'],
    [17 * 1024, '17KB'],
    [1024 * 1024, '1MB'],
    [1536 * 1024, '1.5MB'],
  ])('%i → %s', (bytes, expected) => {
    expect(formatFileSize(bytes)).toBe(expected);
  });
});

describe('FileUpload 접근성', () => {
  it('빈 상태·목록·오류 상태 axe 위반이 없다', async () => {
    const { wrapper } = mountWithModel({ maxFiles: 10, title: '첨부파일' }, [
      { id: '1', name: '위임장.hwp', size: 17 * 1024, status: 'uploading' },
      { id: '2', name: '신고서.hwp', size: 17 * 1024, status: 'done' },
      {
        id: '3',
        name: '큰파일.hwp',
        size: 30 * 1024 * 1024,
        status: 'error',
        error: '용량 초과',
      },
    ]);
    expect(await axe(wrapper.element)).toHaveNoViolations();
  });
});
