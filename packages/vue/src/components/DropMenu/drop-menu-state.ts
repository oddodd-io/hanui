/**
 * 열린 DropMenu 하나를 공유한다 — KRDS krds_dropEvent.closeAllDropdowns 처럼 한 번에 하나만 열린다.
 */
let closeCurrent: (() => void) | null = null;

/** 다른 드롭다운을 닫고 이 드롭다운을 현재 열린 것으로 등록한다 */
export const claimOpen = (close: () => void) => {
  if (closeCurrent && closeCurrent !== close) closeCurrent();
  closeCurrent = close;
};

export const releaseOpen = (close: () => void) => {
  if (closeCurrent === close) closeCurrent = null;
};
