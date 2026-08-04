# Tailwind CSS v4 마이그레이션 가이드

> 이 글의 원본은 **<a href="https://hanui.io/blog/tips-tailwind-v4-migration" target="_blank" rel="noopener noreferrer">hanui 블로그</a>로 이전**했어요.
> 더 나은 가독성과 최신 내용은 원본 링크에서 확인해주세요!
>
> 👉 https://hanui.io/blog/tips-tailwind-v4-migration

---

Tailwind v3에서 v4로 넘어가면서 바뀐 것들을 정리한 글이에요. `tailwind.config.js` 없이 CSS에서 바로 설정하는 CSS-first 방식, `@tailwind` → `@import 'tailwindcss'` 문법 변경, 모든 값이 네이티브 CSS 변수로 생성되는 변화까지 다뤘어요.

마이그레이션 3단계와 자주 나는 오류(PostCSS 플러그인 설정, `@apply` 경고, 플러그인 호환성), 그리고 "지금 해도 되는 경우 vs 좀 기다려야 하는 경우" 판단 기준도 함께 담았어요.

전체 내용은 hanui 블로그에서 확인하세요 → **https://hanui.io/blog/tips-tailwind-v4-migration**
