'use client';

import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight, Play, Pause, Plus } from 'lucide-react';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * Content 캐러셀 슬라이드 타입
 */
export interface ContentCarouselSlide {
  /** 슬라이드 고유 ID */
  id: string | number;
  /** 메인 타이틀 */
  title: string;
  /** 서브타이틀 (카테고리 등) */
  subtitle?: string;
  /** 이미지 URL */
  imageSrc?: string;
  /** 이미지 alt 텍스트 */
  imageAlt?: string;
  /** 클릭 링크 */
  href?: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
}

/**
 * ContentCarousel Props
 */
export interface ContentCarouselProps {
  /** 슬라이드 데이터 배열 */
  slides: ContentCarouselSlide[];
  /** 자동 재생 여부 */
  autoPlay?: boolean;
  /** 자동 재생 간격 (ms) */
  interval?: number;
  /** 무한 루프 */
  loop?: boolean;
  /** 화살표 표시 여부 */
  showArrows?: boolean;
  /** 페이지네이션 타입 - bullets: 도트, fraction: 분수형 */
  paginationType?: 'bullets' | 'fraction';
  /** 재생/정지 버튼 표시 여부 */
  showPlayPause?: boolean;
  /** 더보기 버튼 링크 */
  moreHref?: string;
  /** 호버시 자동재생 일시정지 */
  pauseOnHover?: boolean;
  /** 추가 className */
  className?: string;
  /** 슬라이드 변경 시 콜백 */
  onSlideChange?: (index: number) => void;
}

/**
 * Content 스타일 캐러셀 컴포넌트
 *
 * 카드형 섹션 배너용 캐러셀입니다.
 * 분수형 페이지네이션, 더보기 버튼을 지원합니다.
 *
 * @example
 * <ContentCarousel
 *   slides={[
 *     {
 *       id: 1,
 *       title: "콘텐츠 제목",
 *       subtitle: "카테고리",
 *       imageSrc: "/content-image.png",
 *       href: "/content/1"
 *     }
 *   ]}
 *   autoPlay
 *   showPlayPause
 *   paginationType="fraction"
 *   moreHref="/contents"
 * />
 */
export const ContentCarousel = React.forwardRef<
  HTMLDivElement,
  ContentCarouselProps
>(
  (
    {
      slides,
      autoPlay = false,
      interval = 5000,
      loop = true,
      showArrows = true,
      paginationType = 'fraction',
      showPlayPause = false,
      moreHref,
      pauseOnHover = true,
      className,
      onSlideChange,
    },
    ref
  ) => {
    const [swiperInstance, setSwiperInstance] =
      React.useState<SwiperType | null>(null);
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);

    const hasMultipleSlides = slides.length > 1;

    // 자동재생 토글
    const toggleAutoplay = React.useCallback(() => {
      if (!swiperInstance) return;

      if (isPlaying) {
        swiperInstance.autoplay.stop();
        setIsPlaying(false);
      } else {
        swiperInstance.autoplay.start();
        setIsPlaying(true);
      }
    }, [swiperInstance, isPlaying]);

    // 슬라이드 변경 핸들러
    const handleSlideChange = React.useCallback(
      (swiper: SwiperType) => {
        onSlideChange?.(swiper.realIndex);
      },
      [onSlideChange]
    );

    // 버튼 공통 스타일
    const buttonBaseClass = cn(
      'flex items-center justify-center flex-shrink-0',
      'w-9 h-9 rounded-full',
      'border border-krds-gray-30 bg-white',
      'hover:bg-krds-gray-10 active:bg-krds-gray-20',
      'disabled:bg-krds-gray-10 disabled:cursor-not-allowed',
      'transition-colors'
    );

    // 카드 래퍼 컴포넌트
    const CardWrapper = ({
      slide,
      children,
    }: {
      slide: ContentCarouselSlide;
      children: React.ReactNode;
    }) => {
      if (slide.href) {
        return (
          <a href={slide.href} onClick={slide.onClick} className="block">
            {children}
          </a>
        );
      }
      if (slide.onClick) {
        return (
          <button
            type="button"
            onClick={slide.onClick}
            className="block w-full text-left"
          >
            {children}
          </button>
        );
      }
      return <div>{children}</div>;
    };

    return (
      <div ref={ref} className={cn(className)}>
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, A11y]}
            slidesPerView={1}
            spaceBetween={16}
            speed={400}
            loop={loop && hasMultipleSlides}
            autoplay={
              autoPlay && hasMultipleSlides
                ? {
                    delay: interval,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: pauseOnHover,
                  }
                : false
            }
            pagination={
              hasMultipleSlides
                ? {
                    el: '.content-carousel-pagination',
                    clickable: paginationType === 'bullets',
                    type: paginationType,
                  }
                : false
            }
            a11y={{
              prevSlideMessage: '이전 슬라이드',
              nextSlideMessage: '다음 슬라이드',
              firstSlideMessage: '첫 번째 슬라이드',
              lastSlideMessage: '마지막 슬라이드',
              paginationBulletMessage: '{{index}}번째 슬라이드로 이동',
            }}
            onSwiper={setSwiperInstance}
            onSlideChange={handleSlideChange}
            className="w-full"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <CardWrapper slide={slide}>
                  {/* Card 슬라이드 */}
                  <div>
                    <div className="mb-3">
                      {slide.subtitle && (
                        <p className="text-krds-body-sm text-krds-gray-50 mb-1">
                          {slide.subtitle}
                        </p>
                      )}
                      <strong className="block text-krds-heading-md font-semibold text-krds-gray-90 line-clamp-2">
                        {slide.title}
                      </strong>
                    </div>
                    {slide.imageSrc && (
                      <div className="aspect-video rounded-lg overflow-hidden bg-krds-gray-10 mt-10">
                        <img
                          src={slide.imageSrc}
                          alt={slide.imageAlt || slide.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </CardWrapper>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Indicator (페이지네이션 + 컨트롤) */}
          {hasMultipleSlides && (
            <div className="flex items-center justify-end gap-2 mt-4">
              {/* Pagination */}
              <div
                className={cn(
                  'content-carousel-pagination',
                  'flex items-center justify-end',
                  paginationType === 'bullets' &&
                    'gap-1.5 h-9 px-3 bg-krds-gray-90/10 rounded-full',
                  paginationType === 'fraction' && 'gap-2 px-4 h-9 font-bold',
                  // Swiper bullet 커스텀 스타일
                  '[&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:h-2',
                  '[&_.swiper-pagination-bullet]:bg-krds-gray-40 [&_.swiper-pagination-bullet]:rounded-full',
                  '[&_.swiper-pagination-bullet]:opacity-100',
                  '[&_.swiper-pagination-bullet-active]:w-8 [&_.swiper-pagination-bullet-active]:bg-krds-primary-60',
                  // Fraction 스타일
                  '[&_.swiper-pagination-current]:text-krds-primary-60'
                )}
              />

              {/* Play/Pause 버튼 */}
              {showPlayPause && (
                <button
                  type="button"
                  onClick={toggleAutoplay}
                  className={buttonBaseClass}
                  aria-label={isPlaying ? '슬라이드 멈춤' : '슬라이드 재생'}
                >
                  {isPlaying ? (
                    <Pause
                      className="w-4 h-4 text-krds-gray-70"
                      fill="currentColor"
                    />
                  ) : (
                    <Play
                      className="w-4 h-4 text-krds-gray-70"
                      fill="currentColor"
                    />
                  )}
                </button>
              )}

              {/* Navigation */}
              {showArrows && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => swiperInstance?.slidePrev()}
                    className={buttonBaseClass}
                    aria-label="이전"
                  >
                    <ChevronLeft className="w-5 h-5 text-krds-gray-70" />
                  </button>
                  <button
                    type="button"
                    onClick={() => swiperInstance?.slideNext()}
                    className={buttonBaseClass}
                    aria-label="다음"
                  >
                    <ChevronRight className="w-5 h-5 text-krds-gray-70" />
                  </button>
                </div>
              )}

              {/* More 버튼 */}
              {moreHref && (
                <a
                  href={moreHref}
                  className={buttonBaseClass}
                  aria-label="더 보기"
                >
                  <Plus className="w-5 h-5 text-krds-gray-70" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ContentCarousel.displayName = 'ContentCarousel';
