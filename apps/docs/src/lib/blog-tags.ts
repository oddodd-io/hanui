/**
 * 블로그 태그 고정 어휘 — 기준 문서: docs/blog/tag-guide.md
 *
 * 글당 3~5개. 독자 축에서 정확히 1개(필수) + 주제 1~2개 + 기술 0~3개.
 * 여기 없는 태그는 새로 만들지 않는다. 추가 기준은 "앞으로 3편 이상에 붙을까".
 * 이 파일과 tag-guide.md는 같이 고친다.
 */

export interface TagAxis {
  /** 필터 UI에 보이는 축 이름 */
  label: string;
  tags: string[];
}

export const TAG_AXES: TagAxis[] = [
  {
    label: '독자',
    tags: ['개발자', '사무직'],
  },
  {
    label: '주제',
    tags: [
      '접근성',
      '성능',
      '디자인시스템',
      '아키텍처',
      '자동화',
      '공공',
      '납품·운영',
      '협업',
      'AI로 만들기',
      '경리',
    ],
  },
  {
    label: '기술',
    tags: [
      'React',
      'Vue',
      'Next.js',
      'Tailwind CSS',
      'TypeScript',
      'KRDS',
      'KWCAG',
      'Claude Code',
      'Figma',
      'CSS',
      'CI',
    ],
  },
];

export const ALL_TAGS = TAG_AXES.flatMap((axis) => axis.tags);
