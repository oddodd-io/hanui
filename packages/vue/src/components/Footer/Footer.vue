<script setup lang="ts">
/**
 * Footer — KRDS `footer#krds-footer`
 *
 * JS 동작이 없는 순수 마크업이다. 구조: .foot-quick(관련 사이트) → .inner > .f-logo · .f-cnt(.f-info 주소·연락처 / .f-link 바로가기·SNS)
 * · .f-btm(.f-menu 정책 링크·.f-copy 저작권 / .krds-identifier). KRDS CSS가 id 선택자이므로 레이아웃에 하나만 둔다.
 * 원본 보완: 장식 아이콘 aria-hidden, 새 창 링크 rel.
 * 기준: reference/krds-uiux/html/code/footer.html, resources/scss/component/_footer.scss
 */
import Identifier from '../Identifier/Identifier.vue';

export interface FooterContact {
  /** 굵게 표시 (예: "대표전화 1577-1000") */
  title: string;
  /** 보조 문구 (예: "(유료, 평일 09시~18시)") */
  note?: string;
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export type FooterSnsIcon =
  | 'instagram'
  | 'youtube'
  | 'sns-x'
  | 'facebook'
  | 'blog';

export interface FooterSns {
  /** 스크린리더 이름 (예: "인스타그램") */
  label: string;
  href: string;
  icon: FooterSnsIcon;
}

export interface FooterPolicy {
  label: string;
  href: string;
  /** 강조 (개인정보처리방침 — KRDS .point) */
  point?: boolean;
}

export interface FooterProps {
  /** 로고 대체 텍스트 (기관명) */
  logoText?: string;
  /** 기관 로고 이미지. 없으면 KRDS CSS 기본 로고 */
  logoSrc?: string;
  /** 주소 (.info-addr) */
  address?: string;
  contacts?: FooterContact[];
  /** 바로가기 (.link-go) */
  links?: FooterLink[];
  sns?: FooterSns[];
  /** 정책 링크 (.f-menu) */
  policies?: FooterPolicy[];
  /** 저작권 (.f-copy) */
  copyright?: string;
  /** 운영기관 식별자 문구. 없으면 식별자를 렌더하지 않는다 */
  identifier?: string;
  /** 식별자 로고 대체 텍스트 */
  identifierLogoText?: string;
  identifierLogoSrc?: string;
}

withDefaults(defineProps<FooterProps>(), {
  logoText: 'KRDS - Korea Design System',
  logoSrc: undefined,
  address: undefined,
  contacts: () => [],
  links: () => [],
  sns: () => [],
  policies: () => [],
  copyright: undefined,
  identifier: undefined,
  identifierLogoText: 'KRDS - Korea Design System',
  identifierLogoSrc: undefined,
});

defineSlots<{
  /** 관련 사이트 영역 (.foot-quick .inner 안, button.link 등) */
  quick?: () => unknown;
}>();

const newWindow = (external?: boolean) =>
  external
    ? { target: '_blank', title: '새 창 열기', rel: 'noopener noreferrer' }
    : {};
</script>

<template>
  <footer id="krds-footer">
    <div v-if="$slots.quick" class="foot-quick">
      <div class="inner">
        <slot name="quick" />
      </div>
    </div>
    <div class="inner">
      <div
        class="f-logo"
        :style="logoSrc ? { backgroundImage: 'none' } : undefined"
      >
        <img
          v-if="logoSrc"
          :src="logoSrc"
          :alt="logoText"
          style="display: block; width: 100%; height: 100%; object-fit: contain"
        />
        <span v-else class="sr-only">{{ logoText }}</span>
      </div>
      <div class="f-cnt">
        <div class="f-info">
          <p v-if="address" class="info-addr">{{ address }}</p>
          <ul v-if="contacts.length" class="info-cs">
            <li v-for="contact in contacts" :key="contact.title">
              <strong class="strong">{{ contact.title }}</strong>
              <span v-if="contact.note" class="span">{{ contact.note }}</span>
            </li>
          </ul>
        </div>
        <div v-if="links.length || sns.length" class="f-link">
          <div v-if="links.length" class="link-go">
            <a
              v-for="link in links"
              :key="link.label"
              :href="link.href"
              class="krds-btn medium text"
              v-bind="newWindow(link.external)"
            >
              {{ link.label }}
              <i
                :class="[
                  'svg-icon',
                  link.external ? 'ico-go' : 'ico-angle right',
                ]"
                aria-hidden="true"
              ></i>
            </a>
          </div>
          <div v-if="sns.length" class="link-sns">
            <a
              v-for="item in sns"
              :key="item.icon"
              :href="item.href"
              class="krds-btn xlarge icon border"
              v-bind="newWindow(true)"
            >
              <span class="sr-only">{{ item.label }}</span>
              <i
                :class="['svg-icon', `ico-${item.icon}`]"
                aria-hidden="true"
              ></i>
            </a>
          </div>
        </div>
      </div>
      <div class="f-btm">
        <div class="f-btm-text">
          <div v-if="policies.length" class="f-menu">
            <a
              v-for="policy in policies"
              :key="policy.label"
              :href="policy.href"
              :class="{ point: policy.point }"
            >
              {{ policy.label }}
            </a>
          </div>
          <p v-if="copyright" class="f-copy">{{ copyright }}</p>
        </div>
        <Identifier
          v-if="identifier"
          :text="identifier"
          :logo-text="identifierLogoText"
          :logo-src="identifierLogoSrc"
        />
      </div>
    </div>
  </footer>
</template>
