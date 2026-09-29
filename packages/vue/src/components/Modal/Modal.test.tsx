import { describe, it, expect, afterEach, vi } from 'vitest';
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { axe } from '../../test/setup';
import Modal from './Modal.vue';
import { resetModalStack } from './modal-stack';

const mounted: VueWrapper[] = [];

/** 템플릿 문자열로 상위 컴포넌트를 만들어 마운트한다 */
const mountTemplate = (
  template: string,
  state: () => Record<string, unknown>,
  attachTo: HTMLElement = document.body
) => {
  const wrapper = mount(
    defineComponent({ components: { Modal }, setup: state, template }),
    {
      attachTo,
    }
  );
  mounted.push(wrapper);
  return wrapper;
};

/** 열기 버튼 + 모달 + 바깥 콘텐츠를 가진 페이지를 마운트한다 */
const mountPage = (
  modalProps: Record<string, unknown> = {},
  initialOpen = false
) => {
  const page = document.createElement('div');
  page.id = 'app';
  document.body.appendChild(page);
  return mountTemplate(
    `
      <main id="page">
        <button id="trigger" type="button" @click="open = true">열기</button>
        <a id="outside" href="#">바깥 링크</a>
      </main>
      <Modal v-model:open="open" title="공지 삭제" v-bind="modalProps">
        <p>선택한 공지를 삭제할까요?</p>
        <template #footer="{ close }">
          <button id="cancel" type="button" class="krds-btn medium tertiary" @click="close">아니요</button>
          <button id="ok" type="button" class="krds-btn medium primary">예</button>
        </template>
      </Modal>
    `,
    () => ({ open: ref(initialOpen), modalProps }),
    page
  );
};

const modalEl = () => document.querySelector<HTMLElement>('.krds-modal')!;
const $ = <T extends HTMLElement = HTMLElement>(sel: string) =>
  document.querySelector<T>(sel)!;

const openViaTrigger = async (wrapper: VueWrapper) => {
  const trigger = $('#trigger');
  trigger.focus();
  await wrapper.find('#trigger').trigger('click');
  await flushPromises();
};

const press = async (key: string, opts: KeyboardEventInit = {}) => {
  const target = document.activeElement ?? document.body;
  target.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...opts,
    })
  );
  await flushPromises();
};

afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount());
  resetModalStack();
  document.body.innerHTML = '';
  document.body.removeAttribute('style');
  document.body.className = '';
  vi.useRealTimers();
});

describe('Modal 구조 (KRDS modal.html 기준)', () => {
  it('body로 Teleport된 section.krds-modal.fade에 KRDS 하위 구조를 렌더한다', () => {
    mountPage();
    const el = modalEl();
    expect(el.parentElement).toBe(document.body);
    expect(el.tagName).toBe('SECTION');
    expect(el.classList.contains('krds-modal')).toBe(true);
    expect(el.classList.contains('fade')).toBe(true);
    expect(
      el.querySelector(
        '.modal-dialog > .modal-content > .modal-header > h2.modal-title'
      )
    ).not.toBeNull();
    expect(el.querySelector('.modal-conts > .conts-area p')?.textContent).toBe(
      '선택한 공지를 삭제할까요?'
    );
    expect(el.querySelector('.modal-btn.btn-wrap #ok')).not.toBeNull();
    expect(el.querySelector(':scope > .modal-back')).not.toBeNull();
  });

  it('role="dialog" aria-modal="true"이고 제목으로 이름을 준다', () => {
    mountPage();
    const el = modalEl();
    expect(el.getAttribute('role')).toBe('dialog');
    expect(el.getAttribute('aria-modal')).toBe('true');
    const titleId = el.getAttribute('aria-labelledby')!;
    expect(document.getElementById(titleId)?.textContent?.trim()).toBe(
      '공지 삭제'
    );
  });

  it('닫기 버튼은 KRDS btn-close 마크업이고 sr-only 이름을 가진다', () => {
    mountPage({ closeLabel: '삭제 창 닫기' });
    const btn = $('.btn-close');
    expect(btn.className).toBe('krds-btn medium icon btn-close');
    expect(btn.querySelector('.sr-only')?.textContent).toBe('삭제 창 닫기');
    expect(
      btn
        .querySelector('i.svg-icon.ico-popup-close')
        ?.getAttribute('aria-hidden')
    ).toBe('true');
  });

  it('size·type을 KRDS 클래스/data-type으로 옮긴다', () => {
    mountPage({ size: 'sm', type: 'bottom-sheet' });
    expect($('.modal-dialog').classList.contains('modal-sm')).toBe(true);
    expect(modalEl().dataset.type).toBe('bottom-sheet');
  });

  it('hideClose면 닫기 버튼이 없고, footer가 없으면 .modal-btn도 없다', () => {
    const wrapper = mount(Modal, {
      props: { title: 't', hideClose: true },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    expect(document.querySelector('.btn-close')).toBeNull();
    expect(document.querySelector('.modal-btn')).toBeNull();
  });

  it('teleport=false면 제자리에 렌더한다', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const wrapper = mount(Modal, {
      props: { title: 't', teleport: false },
      attachTo: host,
    });
    mounted.push(wrapper);
    expect(host.contains(modalEl())).toBe(true);
    expect(modalEl().parentElement).not.toBe(document.body);
  });
});

describe('Modal 열기', () => {
  it('닫힌 상태에서는 shown·in 클래스가 없다', () => {
    mountPage();
    expect(modalEl().classList.contains('shown')).toBe(false);
    expect(modalEl().classList.contains('in')).toBe(false);
  });

  it('열면 shown·in 클래스와 .modal-back.in이 붙는다', async () => {
    const wrapper = mountPage();
    await openViaTrigger(wrapper);
    expect(modalEl().classList.contains('shown')).toBe(true);
    expect(modalEl().classList.contains('in')).toBe(true);
    expect($('.modal-back').classList.contains('in')).toBe(true);
  });

  it('열면 첫 번째 초점 가능한 요소로 초점을 옮긴다 (KRDS 동작)', async () => {
    const wrapper = mountPage();
    await openViaTrigger(wrapper);
    expect(document.activeElement?.id).toBe('cancel');
  });

  it('처음부터 open이면 마운트 직후 열린다', async () => {
    mountPage({}, true);
    await flushPromises();
    expect(modalEl().classList.contains('in')).toBe(true);
    expect(document.activeElement?.id).toBe('cancel');
  });

  it('열린 동안 body 스크롤을 잠그고 scroll-no 클래스를 붙인다', async () => {
    document.body.style.overflow = 'auto';
    const wrapper = mountPage();
    await openViaTrigger(wrapper);
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.classList.contains('scroll-no')).toBe(true);
    await press('Escape');
    expect(document.body.style.overflow).toBe('auto');
    expect(document.body.classList.contains('scroll-no')).toBe(false);
  });

  it('열린 동안 모달 바깥을 inert로 막고, 닫으면 되돌린다', async () => {
    const wrapper = mountPage();
    await openViaTrigger(wrapper);
    expect($('#app').hasAttribute('inert')).toBe(true);
    expect(modalEl().hasAttribute('inert')).toBe(false);
    await press('Escape');
    expect($('#app').hasAttribute('inert')).toBe(false);
  });

  it('원래 inert였던 요소는 닫아도 inert로 남긴다', async () => {
    const other = document.createElement('div');
    other.setAttribute('inert', '');
    document.body.appendChild(other);
    const wrapper = mountPage();
    await openViaTrigger(wrapper);
    await press('Escape');
    expect(other.hasAttribute('inert')).toBe(true);
  });

  it('열림 후 opened 이벤트를 보낸다', async () => {
    const wrapper = mount(Modal, {
      props: { title: 't' },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await wrapper.setProps({ open: true });
    await flushPromises();
    expect(wrapper.emitted('opened')).toHaveLength(1);
  });
});

describe('Modal 닫기', () => {
  it('닫기(X) 버튼을 누르면 닫고 여는 버튼으로 초점을 돌려준다', async () => {
    const wrapper = mountPage();
    await openViaTrigger(wrapper);
    $('.btn-close').click();
    await flushPromises();
    expect(modalEl().classList.contains('in')).toBe(false);
    expect(document.activeElement?.id).toBe('trigger');
  });

  it('footer 슬롯의 close로 닫을 수 있다', async () => {
    const wrapper = mountPage();
    await openViaTrigger(wrapper);
    $('#cancel').click();
    await flushPromises();
    expect(modalEl().classList.contains('in')).toBe(false);
  });

  it('Esc로 닫는다', async () => {
    const wrapper = mountPage();
    await openViaTrigger(wrapper);
    await press('Escape');
    expect(modalEl().classList.contains('in')).toBe(false);
    expect(document.activeElement?.id).toBe('trigger');
  });

  it('다른 키를 먼저 눌러도 Esc로 닫힌다 (KRDS 원본 once 리스너 결함 수정)', async () => {
    const wrapper = mountPage();
    await openViaTrigger(wrapper);
    await press('Tab');
    await press('a');
    await press('Escape');
    expect(modalEl().classList.contains('in')).toBe(false);
  });

  it('closeOnEsc=false면 Esc로 닫지 않는다', async () => {
    const wrapper = mountPage({ closeOnEsc: false });
    await openViaTrigger(wrapper);
    await press('Escape');
    expect(modalEl().classList.contains('in')).toBe(true);
  });

  it('배경 클릭은 기본적으로 닫지 않고 첫 요소로 초점을 옮긴다 (KRDS 동작)', async () => {
    const wrapper = mountPage();
    await openViaTrigger(wrapper);
    $('#ok').focus();
    $('.modal-back').click();
    await flushPromises();
    expect(modalEl().classList.contains('in')).toBe(true);
    expect(document.activeElement?.id).toBe('cancel');
  });

  it('closeOnBackdrop이면 배경 클릭으로 닫는다', async () => {
    const wrapper = mountPage({ closeOnBackdrop: true });
    await openViaTrigger(wrapper);
    $('.modal-back').click();
    await flushPromises();
    expect(modalEl().classList.contains('in')).toBe(false);
  });

  it('모달 내용 클릭으로는 닫히지 않는다', async () => {
    const wrapper = mountPage({ closeOnBackdrop: true });
    await openViaTrigger(wrapper);
    $('.conts-area p').click();
    await flushPromises();
    expect(modalEl().classList.contains('in')).toBe(true);
  });

  it('in 제거 350ms 뒤 shown을 제거하고 closed 이벤트를 보낸다 (KRDS 전환 시간)', async () => {
    const wrapper = mount(Modal, {
      props: { title: 't', open: true },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await flushPromises();
    vi.useFakeTimers();
    await wrapper.setProps({ open: false });
    expect(modalEl().classList.contains('in')).toBe(false);
    expect(modalEl().classList.contains('shown')).toBe(true);
    vi.advanceTimersByTime(349);
    await wrapper.vm.$nextTick();
    expect(modalEl().classList.contains('shown')).toBe(true);
    vi.advanceTimersByTime(1);
    await wrapper.vm.$nextTick();
    expect(modalEl().classList.contains('shown')).toBe(false);
    expect(wrapper.emitted('closed')).toHaveLength(1);
  });

  it('열린 채로 언마운트되면 스크롤·inert를 복원한다', async () => {
    const wrapper = mountPage({}, true);
    await flushPromises();
    expect(document.body.style.overflow).toBe('hidden');
    mounted.splice(mounted.indexOf(wrapper), 1);
    wrapper.unmount();
    expect(document.body.style.overflow).toBe('');
    expect($('#app').hasAttribute('inert')).toBe(false);
  });
});

describe('Modal 초점 가두기', () => {
  it('마지막 요소에서 Tab이면 첫 요소로 돌아간다', async () => {
    const wrapper = mountPage();
    await openViaTrigger(wrapper);
    $('.btn-close').focus();
    await press('Tab');
    expect(document.activeElement?.id).toBe('cancel');
  });

  it('첫 요소에서 Shift+Tab이면 마지막 요소(닫기)로 간다', async () => {
    const wrapper = mountPage();
    await openViaTrigger(wrapper);
    await press('Tab', { shiftKey: true });
    expect(document.activeElement).toBe($('.btn-close'));
  });

  it('열린 뒤 추가된 요소도 가두기 대상에 포함한다 (Tab마다 다시 계산)', async () => {
    mountTemplate(
      `
          <Modal v-model:open="open" title="t" hide-close>
            <button id="first" type="button">첫</button>
            <button v-if="extra" id="added" type="button">추가</button>
            <button id="toggle" type="button" @click="extra = true">추가하기</button>
          </Modal>`,
      () => ({ open: ref(true), extra: ref(false) })
    );
    await flushPromises();
    $('#toggle').click();
    await flushPromises();
    $('#toggle').focus();
    await press('Tab');
    expect(document.activeElement?.id).toBe('first');
    await press('Tab', { shiftKey: true });
    expect(document.activeElement?.id).toBe('toggle');
  });

  it('비활성 버튼은 가두기 대상에서 뺀다', async () => {
    mountTemplate(
      `
          <Modal v-model:open="open" title="t" hide-close>
            <button id="a" type="button">A</button>
            <button id="b" type="button" disabled>B</button>
          </Modal>`,
      () => ({ open: ref(true) })
    );
    await flushPromises();
    expect(document.activeElement?.id).toBe('a');
    await press('Tab');
    expect(document.activeElement?.id).toBe('a');
  });

  it('초점 가능한 요소가 없으면 .modal-content에 초점을 둔다', async () => {
    const wrapper = mount(Modal, {
      props: { title: 't', open: true, hideClose: true },
      slots: { default: '<p>내용만</p>' },
      attachTo: document.body,
    });
    mounted.push(wrapper);
    await flushPromises();
    expect(document.activeElement).toBe($('.modal-content'));
  });
});

describe('Modal 중첩', () => {
  const mountNested = () => {
    const wrapper = mountTemplate(
      `
          <Modal v-model:open="outer" title="바깥" id="outer" hide-close>
            <button id="open-inner" type="button" @click="inner = true">안쪽 열기</button>
          </Modal>
          <Modal v-model:open="inner" title="안쪽" id="inner" hide-close>
            <button id="inner-btn" type="button">안쪽 버튼</button>
          </Modal>`,
      () => ({ outer: ref(true), inner: ref(false) })
    );
    return wrapper;
  };

  it('두 번째 모달은 z-index 1012이고 배경(dim)을 겹치지 않으며 바깥 모달을 inert로 막는다', async () => {
    mountNested();
    await flushPromises();
    $('#open-inner').focus();
    $('#open-inner').click();
    await flushPromises();
    const outer = $('#outer');
    const inner = $('#inner');
    expect(inner.style.zIndex).toBe('1012');
    expect(inner.querySelector('.modal-back')!.classList.contains('in')).toBe(
      false
    );
    expect(outer.hasAttribute('inert')).toBe(true);
    expect(document.activeElement?.id).toBe('inner-btn');
  });

  it('안쪽 모달을 Esc로 닫으면 바깥 모달은 열린 채 초점이 안쪽 열기 버튼으로 돌아온다', async () => {
    mountNested();
    await flushPromises();
    $('#open-inner').focus();
    $('#open-inner').click();
    await flushPromises();
    await press('Escape');
    expect($('#inner').classList.contains('in')).toBe(false);
    expect($('#outer').classList.contains('in')).toBe(true);
    expect($('#outer').hasAttribute('inert')).toBe(false);
    expect(document.activeElement?.id).toBe('open-inner');
    // 바깥 모달이 아직 열려 있으므로 스크롤 잠금 유지
    expect(document.body.style.overflow).toBe('hidden');
  });
});

describe('Modal 접근성', () => {
  it('열린 모달 axe 위반이 없다', async () => {
    const wrapper = mountPage();
    await openViaTrigger(wrapper);
    expect(await axe(modalEl())).toHaveNoViolations();
  });
});
