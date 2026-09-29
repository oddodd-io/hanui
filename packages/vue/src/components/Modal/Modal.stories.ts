import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { Modal } from './index';
import { Button } from '../Button';

const longText = Array.from(
  { length: 20 },
  () =>
    '대화 상자는 사용자에게 작업에 대해 알리고 중요한 정보를 포함하거나 결정이 필요하거나 여러 작업을 포함할 수 있습니다.'
);

/**
 * KRDS `section.krds-modal` 래퍼. 마크업·전환·첫 초점·중첩 z-index는 KRDS ui-script.js를 따르고,
 * 원본 결함(Esc once 리스너, 고정 초점 목록, #wrap 의존 inert, 동작하지 않는 scroll-no, aria-modal 누락)은 바로잡았다.
 * 원본 예제: reference/krds-uiux/html/code/modal.html
 */
const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: [undefined, 'sm', 'md', 'lg'] },
    type: { control: 'select', options: ['default', 'full', 'bottom-sheet'] },
    closeOnBackdrop: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    hideClose: { control: 'boolean' },
  },
  args: { title: '모달 제목', size: 'md' },
  render: (args) => ({
    components: { Modal, Button },
    setup: () => ({ args, open: ref(false) }),
    template: `
      <div>
        <Button @click="open = true">모달 열기</Button>
        <Modal v-bind="args" v-model:open="open">
          <p>대화 상자는 사용자에게 작업에 대해 알리고 중요한 정보를 포함하거나 결정이 필요하거나 여러 작업을 포함할 수 있습니다.</p>
          <template #footer="{ close }">
            <Button size="medium" variant="tertiary" @click="close">아니요</Button>
            <Button size="medium" @click="close">예</Button>
          </template>
        </Modal>
      </div>
    `,
  }),
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** modal_sample.html — 기본 확인 대화상자 */
export const Default: Story = {};

/** modal.html — 본문이 길면 .modal-conts가 스크롤되고 tabindex="0"으로 키보드 스크롤 가능 */
export const LongContent: Story = {
  render: () => ({
    components: { Modal, Button },
    setup: () => ({ open: ref(false), longText }),
    template: `
      <div>
        <Button @click="open = true">긴 내용 모달 열기</Button>
        <Modal v-model:open="open" title="이용약관">
          <p>시작</p>
          <p v-for="(text, i) in longText" :key="i">{{ text }}</p>
          <p>끝</p>
          <template #footer="{ close }">
            <Button size="medium" variant="tertiary" @click="close">닫기</Button>
            <Button size="medium" @click="close">동의</Button>
          </template>
        </Modal>
      </div>
    `,
  }),
};

/** size — sm(40rem) · md(56rem) · lg(76rem) */
export const Sizes: Story = {
  render: () => ({
    components: { Modal, Button },
    setup: () => ({ size: ref<'sm' | 'md' | 'lg'>('sm'), open: ref(false) }),
    template: `
      <div style="display:flex;gap:8px">
        <Button v-for="s in ['sm', 'md', 'lg']" :key="s" variant="secondary" @click="size = s; open = true">{{ s }}</Button>
        <Modal v-model:open="open" :title="'크기 ' + size" :size="size">
          <p>modal-{{ size }}</p>
        </Modal>
      </div>
    `,
  }),
};

/** M03 관리자 — 공지 삭제 확인. 배경 클릭으로 닫기 허용 */
export const DeleteConfirm: Story = {
  render: () => ({
    components: { Modal, Button },
    setup: () => {
      const open = ref(false);
      const result = ref('');
      const confirm = () => {
        result.value = '삭제했습니다.';
        open.value = false;
      };
      return { open, result, confirm };
    },
    template: `
      <div>
        <Button variant="secondary" @click="open = true; result = ''">공지 삭제</Button>
        <p v-if="result" role="status" style="margin-top:12px">{{ result }}</p>
        <Modal v-model:open="open" title="공지를 삭제할까요?" size="sm" close-on-backdrop>
          <p>삭제한 공지는 휴지통에서 30일 동안 복구할 수 있습니다.</p>
          <template #footer="{ close }">
            <Button size="medium" variant="tertiary" @click="close">취소</Button>
            <Button size="medium" @click="confirm">삭제</Button>
          </template>
        </Modal>
      </div>
    `,
  }),
};

/** 중첩 — 두 번째 모달은 z-index 1012, 배경(dim)을 겹치지 않고 바깥 모달은 inert */
export const Nested: Story = {
  render: () => ({
    components: { Modal, Button },
    setup: () => ({ outer: ref(false), inner: ref(false) }),
    template: `
      <div>
        <Button @click="outer = true">첫 번째 모달 열기</Button>
        <Modal v-model:open="outer" title="첫 번째 모달" size="md">
          <p>안에서 다른 모달을 열 수 있습니다.</p>
          <template #footer>
            <Button size="medium" @click="inner = true">두 번째 모달 열기</Button>
          </template>
        </Modal>
        <Modal v-model:open="inner" title="두 번째 모달" size="sm">
          <p>Esc를 누르면 이 모달만 닫히고 초점은 "두 번째 모달 열기" 버튼으로 돌아갑니다.</p>
        </Modal>
      </div>
    `,
  }),
};

/** KRDS 고대비 모드 */
export const HighContrast: Story = {
  globals: { krdsMode: 'high-contrast' },
};
