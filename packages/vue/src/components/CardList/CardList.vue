<script setup lang="ts">
/**
 * CardList — KRDS `ul.krds-structured-list` (구조화 목록) 래퍼
 *
 * KRDS 구조화 목록은 JS 동작이 없는 순수 마크업이다. 이 컴포넌트는 카드 한 장의 구성
 * (뱃지 → 썸네일·제목·설명·부가정보 → 태그)과 링크 하나 규칙, 새 창 알림만 담당한다.
 * 3열 → 2열 → 1열 접힘, 간격·모서리·글자 크기는 KRDS CSS가 한다.
 * 기준: reference/krds-uiux/html/code/structured_list.html,
 *       resources/scss/component/_structured_list.scss
 *
 * 썸네일은 KRDS에 없는 영역이라 `hanui-card-thumb`으로 더했다(styles/_hanui-additions.scss).
 *
 * 접근성 — 카드 하나에 링크 하나
 * 제목·설명·부가정보·썸네일이 모두 한 `<a>`(`.c-text`) 안에 들어가고, 그 링크의 이름은 제목이다.
 * 그래서 썸네일은 장식이며 `alt=""`로 둔다. 썸네일에 설명을 넣으면 스크린리더가 제목과
 * 같은 내용을 두 번 읽는다. 사진 자체가 내용인 경우는 목록이 아니라 상세 화면 본문에서 다룬다.
 * 카드 안에 또 다른 링크·버튼을 두지 않는다 — 링크 안의 링크는 만들 수 없고,
 * 옆에 두면 목록을 훑을 때 초점이 두 배로 늘어난다.
 */
import { computed } from 'vue';
import Badge, { type BadgeColor } from '../Badge/Badge.vue';

export interface CardListMeta {
  /** 항목 이름 (굵게). 예: '접수 기간' */
  key: string;
  value: string;
}

export interface CardListItem {
  /**
   * 목록에서 이 카드를 구별하는 값 (Vue key).
   * 없으면 `href`를 쓰는데, 같은 글이 목록에 두 번 나오는 경우(상단고정 글은 맨 위와 원래 자리에
   * 모두 보인다) 주소가 겹쳐 키가 중복된다. 그런 목록은 이 칸을 직접 채운다.
   */
  key?: string;
  /** 카드 제목 — 링크의 이름이 된다. 목록에서 카드를 구별하는 유일한 수단이므로 비울 수 없다 */
  title: string;
  href: string;
  /** 썸네일 주소. 없으면 빈 자리를 같은 비율로 둔다(카드 높이가 들쭉날쭉해지지 않게) */
  thumbSrc?: string;
  /** 설명. KRDS CSS가 3줄로 자른다 */
  text?: string;
  /** 제목 아래 부가정보 줄 */
  meta?: CardListMeta[];
  /** 분류 뱃지 */
  badge?: string;
  badgeColor?: BadgeColor;
  /** 태그 (카드 아래) */
  tags?: string[];
  /** 새 창으로 연다 */
  external?: boolean;
}

export interface CardListProps {
  items: CardListItem[];
  /**
   * card: KRDS 기본 카드 격자(1280px↑ 3열 → 2열 → 1열)
   * full: KRDS `.type-full` 한 줄 전체 너비
   */
  variant?: 'card' | 'full';
  /** 썸네일 가로세로 비율 (CSS aspect-ratio 값) */
  thumbRatio?: string;
  /** 목록 이름 — 한 화면에 목록이 둘 이상일 때 구별용 */
  label?: string;
  /** 항목이 없을 때 보여줄 문구. 비우면 아무것도 렌더하지 않는다 */
  emptyText?: string;
}

const props = withDefaults(defineProps<CardListProps>(), {
  variant: 'card',
  thumbRatio: undefined,
  label: undefined,
  emptyText: undefined,
});

const listClass = computed(() => [
  'krds-structured-list',
  ...(props.variant === 'full' ? ['type-full'] : []),
]);

const listStyle = computed(() =>
  props.thumbRatio ? { '--hanui-card-thumb-ratio': props.thumbRatio } : undefined
);

// 새 창은 KRDS Footer와 같은 방식으로 알린다 (title + rel)
const newWindow = (external?: boolean) =>
  external
    ? { target: '_blank', title: '새 창 열기', rel: 'noopener noreferrer' }
    : {};
</script>

<template>
  <ul
    v-if="items.length"
    :class="listClass"
    :style="listStyle"
    :aria-label="label"
  >
    <li v-for="(item, index) in items" :key="item.key ?? item.href ?? index" class="structured-item">
      <div class="in">
        <div v-if="item.badge" class="card-top">
          <Badge variant="bg-light" :color="item.badgeColor ?? 'primary'">
            {{ item.badge }}
          </Badge>
        </div>
        <div class="card-body">
          <a :href="item.href" class="c-text" v-bind="newWindow(item.external)">
            <span class="hanui-card-thumb">
              <!-- 장식 — 링크 이름은 제목이 맡는다 -->
              <img
                v-if="item.thumbSrc"
                :src="item.thumbSrc"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </span>
            <p class="c-tit"><span class="span">{{ item.title }}</span></p>
            <p v-if="item.text" class="c-txt">{{ item.text }}</p>
            <p v-for="meta in item.meta" :key="meta.key" class="c-date">
              <strong class="key">{{ meta.key }}</strong>
              <span class="value">{{ meta.value }}</span>
            </p>
          </a>
        </div>
        <div v-if="item.tags?.length" class="card-btm">
          <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </li>
  </ul>
  <p v-else-if="emptyText">{{ emptyText }}</p>
</template>
