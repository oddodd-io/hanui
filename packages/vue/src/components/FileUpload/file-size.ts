/** 바이트를 KRDS 예제 표기(17KB, 1.5MB)로 */
export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(/\.0$/, '')}MB`;
};
