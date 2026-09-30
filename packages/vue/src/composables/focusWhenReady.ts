/**
 * KRDS CSS는 모달·전체메뉴 등을 visibility로 전환하므로 열린 직후 몇 프레임 동안은 대상이 아직 hidden이라
 * focus()가 무시된다 (KRDS 원본은 setTimeout·transitionend로 기다린다).
 * 초점이 실제로 들어갈 때까지 프레임마다 다시 시도한다.
 *
 * @param getTarget 매 시도마다 초점 대상을 돌려준다 (없으면 중단)
 * @param shouldContinue false가 되면 중단 (기다리는 사이 닫힌 경우)
 * @returns 초점이 들어갔는지
 */
export const focusWhenReady = async (
  getTarget: () => HTMLElement | null | undefined,
  shouldContinue: () => boolean = () => true,
  maxFrames = 30
): Promise<boolean> => {
  for (let i = 0; i <= maxFrames; i++) {
    if (!shouldContinue()) return false;
    const target = getTarget();
    if (!target) return false;
    target.focus();
    if (document.activeElement === target) return true;
    if (typeof requestAnimationFrame !== 'function') return false;
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return false;
};
