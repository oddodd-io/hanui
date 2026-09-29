<script setup lang="ts">
/**
 * Modal — KRDS `section.krds-modal` 래퍼
 *
 * 마크업·클래스 전환(shown → in, 닫을 때 in 제거 후 350ms 뒤 shown 제거)·첫 초점·
 * 바깥 클릭 시 첫 요소로 초점 이동·중첩 z-index는 KRDS ui-script.js krds_modal을 따른다.
 * 원본 JS의 결함은 여기서 바로잡는다.
 * - Esc 리스너가 `{ once: true }`라 다른 키를 먼저 누르면 Esc로 닫히지 않음 → 항상 동작
 * - 초점 가두기 대상 요소를 열 때 한 번만 계산 → Tab마다 다시 계산
 * - `#wrap` inert·`body.scroll-no`(CSS 없음)에 의존 → 바깥 전체 inert, body 스크롤 직접 잠금
 * - aria-modal 누락 → 추가
 * 기준: reference/krds-uiux/html/code/modal.html, resources/js/component/ui-script.js (krds_modal),
 *       resources/scss/component/_modal.scss
 */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  watch,
} from 'vue';
import { popModal, pushModal } from './modal-stack';

export type ModalSize = 'sm' | 'md' | 'lg';
export type ModalType = 'default' | 'full' | 'bottom-sheet';

export interface ModalProps {
  /** 열림 상태 (v-model:open) */
  open?: boolean;
  /** 제목 (.modal-title, 대화상자 이름). title 슬롯으로 대신할 수 있다 */
  title?: string;
  /** `.modal-dialog.modal-{size}` 최대 너비. 없으면 KRDS 기본 large 너비 */
  size?: ModalSize;
  /** full: 전체 화면 팝업 / bottom-sheet: 모바일 바텀시트 (`data-type`) */
  type?: ModalType;
  /** 닫기(X) 버튼의 스크린리더 이름 */
  closeLabel?: string;
  /** 닫기(X) 버튼 숨김. 이 경우 footer에 닫는 버튼을 반드시 둔다 */
  hideClose?: boolean;
  /** 배경 클릭으로 닫기. KRDS 기본은 닫지 않고 첫 요소로 초점을 옮긴다 */
  closeOnBackdrop?: boolean;
  /** Esc로 닫기 */
  closeOnEsc?: boolean;
  /** Teleport 대상. false면 제자리에 렌더한다 */
  teleport?: string | false;
  id?: string;
}

const props = withDefaults(defineProps<ModalProps>(), {
  open: false,
  title: undefined,
  size: undefined,
  type: 'default',
  closeLabel: '닫기',
  hideClose: false,
  closeOnBackdrop: false,
  closeOnEsc: true,
  teleport: 'body',
  id: undefined,
});

const emit = defineEmits<{
  'update:open': [open: boolean];
  /** 열림 전환이 끝나고 초점이 들어간 뒤 */
  opened: [];
  /** 닫힘 전환(350ms)이 끝난 뒤 */
  closed: [];
}>();

defineSlots<{
  /** 본문 (.modal-conts > .conts-area) */
  default?: (scope: { close: () => void }) => unknown;
  /** 제목 내용 (title prop 대신) */
  title?: () => unknown;
  /** 하단 버튼 영역 (.modal-btn.btn-wrap) */
  footer?: (scope: { close: () => void }) => unknown;
}>();

const autoId = useId();
const modalId = computed(() => props.id ?? `modal-${autoId}`);
const titleId = computed(() => `${modalId.value}-title`);

const rootRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const contsRef = ref<HTMLElement | null>(null);

const shown = ref(false);
const isIn = ref(false);
const backIn = ref(false);
const zIndex = ref<number | undefined>(undefined);
const contsScrollable = ref(false);

let returnFocusTo: HTMLElement | null = null;
let closeTimer: ReturnType<typeof setTimeout> | undefined;
let isRegistered = false;

// KRDS 초점 대상 선택자 (ui-script.js common.focusTrap 과 같음) + 비활성·숨김 제외
const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex="0"], input:not([disabled]), textarea:not([disabled]), select:not([disabled])';

const getFocusables = () =>
  Array.from(
    contentRef.value?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
  ).filter(
    (el) => !el.closest('[inert]') && el.getAttribute('aria-hidden') !== 'true'
  );

const focusFirst = () => {
  const [first] = getFocusables();
  (first ?? contentRef.value)?.focus();
};

/**
 * KRDS CSS는 visibility를 전환하고(.krds-modal .15s) 버튼 등 자식도 자체 transition을 가져
 * 열린 직후 몇 프레임 동안은 대상이 아직 hidden이라 focus()가 무시된다
 * (KRDS 원본이 350ms를 기다리는 이유). 초점이 실제로 들어갈 때까지 프레임마다 다시 시도한다.
 */
const focusWhenReady = async (maxFrames = 30) => {
  for (let i = 0; i <= maxFrames; i++) {
    // 기다리는 사이 닫혔으면 중단
    if (!isIn.value) return false;
    const [first] = getFocusables();
    const target = first ?? contentRef.value;
    target?.focus();
    if (!target || document.activeElement === target) return true;
    if (typeof requestAnimationFrame !== 'function') return false;
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return false;
};

const show = async () => {
  clearTimeout(closeTimer);
  if (typeof document !== 'undefined') {
    const active = document.activeElement;
    returnFocusTo =
      active instanceof HTMLElement && active !== document.body ? active : null;
  }

  shown.value = true;
  await nextTick();
  const root = rootRef.value;
  if (!root) return;

  const stackInfo = pushModal(root);
  isRegistered = true;
  zIndex.value = stackInfo?.zIndex;
  // 중첩 모달은 KRDS처럼 배경(dim)을 겹쳐 그리지 않는다
  backIn.value = !stackInfo?.isNested;

  // display:block 적용 후 리플로우를 강제해 opacity 전환이 실행되게 한다 (KRDS의 150ms 지연 대신)
  void root.offsetWidth;
  isIn.value = true;
  await nextTick();

  // 본문이 스크롤되면 키보드로 스크롤할 수 있게 tabindex="0" (KRDS 동작)
  const conts = contsRef.value;
  contsScrollable.value = !!conts && conts.scrollHeight > conts.clientHeight;
  await nextTick();

  await focusWhenReady();
  if (isIn.value) emit('opened');
};

const release = () => {
  if (isRegistered && rootRef.value) popModal(rootRef.value);
  isRegistered = false;
};

const hide = () => {
  if (!shown.value) return;
  isIn.value = false;
  backIn.value = false;
  release();

  // 모달을 열었던 요소로 초점 복귀
  const target = returnFocusTo;
  returnFocusTo = null;
  if (target?.isConnected) target.focus();

  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    shown.value = false;
    zIndex.value = undefined;
    emit('closed');
  }, 350);
};

const close = () => emit('update:open', false);

watch(
  () => props.open,
  (open) => {
    if (open) show();
    else hide();
  }
);

onMounted(() => {
  if (props.open) show();
});

onBeforeUnmount(() => {
  clearTimeout(closeTimer);
  release();
  if (returnFocusTo?.isConnected) returnFocusTo.focus();
});

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' || event.key === 'Esc') {
    if (!props.closeOnEsc) return;
    event.stopPropagation();
    close();
    return;
  }
  if (event.key !== 'Tab') return;

  const focusables = getFocusables();
  if (!focusables.length) {
    event.preventDefault();
    contentRef.value?.focus();
    return;
  }
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && (active === first || active === contentRef.value)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  } else if (!contentRef.value?.contains(active)) {
    event.preventDefault();
    first.focus();
  }
};

const onRootClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement).closest('.modal-content')) return;
  if (props.closeOnBackdrop) close();
  else focusFirst();
};

const rootClasses = computed(() => [
  'krds-modal',
  'fade',
  { in: isIn.value, shown: shown.value },
]);
const dialogClasses = computed(() => [
  'modal-dialog',
  props.size && `modal-${props.size}`,
]);

defineExpose({
  /** .krds-modal 루트 요소 */
  el: rootRef,
  close,
});
</script>

<template>
  <Teleport :to="teleport || 'body'" :disabled="teleport === false">
    <section
      :id="modalId"
      ref="rootRef"
      :class="rootClasses"
      :style="zIndex ? { zIndex } : undefined"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :data-type="type === 'default' ? undefined : type"
      @keydown="onKeydown"
      @click="onRootClick"
    >
      <div :class="dialogClasses">
        <div ref="contentRef" class="modal-content" tabindex="-1">
          <div class="modal-header">
            <h2 :id="titleId" class="modal-title">
              <slot name="title">{{ title }}</slot>
            </h2>
          </div>
          <div
            ref="contsRef"
            class="modal-conts"
            :tabindex="contsScrollable ? 0 : undefined"
          >
            <div class="conts-area">
              <slot :close="close" />
            </div>
          </div>
          <div v-if="$slots.footer" class="modal-btn btn-wrap">
            <slot name="footer" :close="close" />
          </div>
          <button
            v-if="!hideClose"
            type="button"
            class="krds-btn medium icon btn-close"
            @click="close"
          >
            <span class="sr-only">{{ closeLabel }}</span>
            <i class="svg-icon ico-popup-close" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div :class="['modal-back', { in: backIn }]"></div>
    </section>
  </Teleport>
</template>
