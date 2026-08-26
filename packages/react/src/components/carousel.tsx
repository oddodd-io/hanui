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
 * 캐러셀 슬라이드 타입
 */
export interface CarouselSlide {
  /** 슬라이드 고유 ID */
  id: string | number;
  /** 타이틀 */
  title: string;
  /** 설명 텍스트 (visual variant에서 사용) */
  description?: string;
  /** 서브타이틀 (card variant에서 사용) */
  subtitle?: string;
  /** 이미지 URL */
  image?: string;
  /** 이미지 alt 텍스트 */
  imageAlt?: string;
  /** CTA 버튼 텍스트 */
  buttonText?: string;
  /** CTA 버튼 링크 */
  buttonHref?: string;
  /** 버튼 클릭 핸들러 */
  onButtonClick?: () => void;
}

/**
 * 캐러셀 Props
 */
export interface CarouselProps {
  /** 슬라이드 데이터 배열 */
  slides: CarouselSlide[];
  /** 캐러셀 variant - visual: 메인 비주얼 배너, card: 카드형 배너 */
  variant?: 'visual' | 'card';
  /** 자동 재생 여부 */
  autoPlay?: boolean;
  /** 자동 재생 간격 (ms) */
  interval?: number;
  /** 무한 루프 */
  loop?: boolean;
  /** 화살표 표시 여부 (auto: 슬라이드 2개 이상일 때 자동 표시) */
  showArrows?: boolean | 'auto';
  /** 페이지네이션 표시 여부 (auto: 슬라이드 2개 이상일 때 자동 표시) */
  showPagination?: boolean | 'auto';
  /** 페이지네이션 타입 - bullets: 도트, fraction: 분수형 */
  paginationType?: 'bullets' | 'fraction';
  /** 재생/정지 버튼 표시 여부 */
  showPlayPause?: boolean;
  /** 더보기 버튼 링크 */
  moreHref?: string;
  /** 호버시 자동재생 일시정지 */
  pauseOnHover?: boolean;
  /** 섹션 타이틀 (card variant에서 사용) */
  sectionTitle?: string;
  /** 추가 className */
  className?: string;
  /** 슬라이드 변경 시 콜백 */
  onSlideChange?: (index: number) => void;
}

/**
 * KRDS 스타일 캐러셀 컴포넌트
 *
 * @example
 * // Visual Banner (메인 비주얼)
 * <Carousel
 *   variant="visual"
 *   slides={[
 *     { id: 1, title: "타이틀", description: "설명", buttonText: "자세히 보기", buttonHref: "#" }
 *   ]}
 * />
 *
 * @example
 * // Card Carousel (카드형)
 * <Carousel
 *   variant="card"
 *   sectionTitle="배너영역 타이틀"
 *   slides={[...]}
 *   autoPlay
 *   showPlayPause
 *   paginationType="fraction"
 * />
 */
export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      slides,
      variant = 'visual',
      autoPlay = false,
      interval = 5000,
      loop = true,
      showArrows = 'auto',
      showPagination = 'auto',
      paginationType = 'bullets',
      showPlayPause = false,
      moreHref,
      pauseOnHover = true,
      sectionTitle,
      className,
      onSlideChange,
    },
    ref
  ) => {
    const [swiperInstance, setSwiperInstance] =
      React.useState<SwiperType | null>(null);
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);

    const hasMultipleSlides = slides.length > 1;

    // 화살표/페이지네이션 표시 여부 계산
    const shouldShowArrows =
      showArrows === 'auto' ? hasMultipleSlides : showArrows;
    const shouldShowPagination =
      showPagination === 'auto' ? hasMultipleSlides : showPagination;

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
      'flex items-center justify-center',
      'w-9 h-9 rounded-full',
      'border border-krds-gray-30 bg-white',
      'hover:bg-krds-gray-10 active:bg-krds-gray-20',
      'disabled:bg-krds-gray-10 disabled:cursor-not-allowed',
      'transition-colors'
    );

    return (
      <div
        ref={ref}
        className={cn(variant === 'visual' && 'bg-krds-gray-5', className)}
      >
        <div
          className={cn(variant === 'visual' && 'max-w-screen-xl mx-auto px-4')}
        >
          {/* Card variant 섹션 타이틀 */}
          {variant === 'card' && sectionTitle && (
            <h2 className="text-krds-heading-sm font-bold text-krds-gray-90 mb-4">
              {sectionTitle}
            </h2>
          )}

          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay, A11y]}
              slidesPerView={1}
              spaceBetween={variant === 'card' ? 16 : 0}
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
              navigation={
                shouldShowArrows
                  ? {
                      nextEl: '.carousel-button-next',
                      prevEl: '.carousel-button-prev',
                    }
                  : false
              }
              pagination={
                shouldShowPagination
                  ? {
                      el: '.carousel-pagination',
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
                  {variant === 'visual' ? (
                    // Visual Banner 슬라이드
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-10 px-4">
                      <div className="flex-1 text-center md:text-left">
                        <p className="text-krds-heading-lg font-bold text-krds-gray-90 mb-3">
                          {slide.title}
                        </p>
                        {slide.description && (
                          <p className="text-krds-body-md text-krds-gray-60 mb-6">
                            {slide.description}
                          </p>
                        )}
                        {slide.buttonText && (
                          <a
                            href={slide.buttonHref || '#'}
                            onClick={slide.onButtonClick}
                            className={cn(
                              'inline-flex items-center justify-center',
                              'px-6 py-3 rounded-lg',
                              'bg-krds-primary-60 text-white font-medium',
                              'hover:bg-krds-primary-70 transition-colors'
                            )}
                          >
                            {slide.buttonText}
                          </a>
                        )}
                      </div>
                      {slide.image && (
                        <div className="flex-shrink-0">
                          <img
                            src={slide.image}
                            alt={slide.imageAlt || slide.title}
                            className="max-w-[243px] h-auto rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    // Card 슬라이드
                    <div className="bg-white rounded-lg overflow-hidden border border-krds-gray-20 p-4">
                      <div className="mb-3">
                        {slide.subtitle && (
                          <p className="text-krds-body-sm text-krds-gray-50 mb-1">
                            {slide.subtitle}
                          </p>
                        )}
                        <p className="text-krds-body-lg font-semibold text-krds-gray-90">
                          {slide.title}
                        </p>
                      </div>
                      {slide.image && (
                        <div className="aspect-video rounded-lg overflow-hidden bg-krds-gray-10">
                          <img
                            src={slide.image}
                            alt={slide.imageAlt || slide.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Arrows (Visual variant - 외부 배치) */}
            {shouldShowArrows && variant === 'visual' && (
              <>
                <button
                  type="button"
                  className={cn(
                    buttonBaseClass,
                    'carousel-button-prev',
                    'absolute left-2 top-1/2 -translate-y-1/2 z-10'
                  )}
                  aria-label="이전"
                >
                  <ChevronLeft className="w-5 h-5 text-krds-gray-70" />
                </button>
                <button
                  type="button"
                  className={cn(
                    buttonBaseClass,
                    'carousel-button-next',
                    'absolute right-2 top-1/2 -translate-y-1/2 z-10'
                  )}
                  aria-label="다음"
                >
                  <ChevronRight className="w-5 h-5 text-krds-gray-70" />
                </button>
              </>
            )}

            {/* Indicator (페이지네이션 + 컨트롤) */}
            {(shouldShowPagination ||
              shouldShowArrows ||
              showPlayPause ||
              moreHref) && (
              <div
                className={cn(
                  'flex items-center gap-3 mt-4',
                  variant === 'visual' ? 'justify-center' : 'justify-end'
                )}
              >
                {/* Pagination */}
                {shouldShowPagination && (
                  <div
                    className={cn(
                      'carousel-pagination',
                      'flex items-center',
                      paginationType === 'bullets' &&
                        'gap-1.5 h-9 px-3 bg-krds-gray-90/10 rounded-full',
                      paginationType === 'fraction' &&
                        'gap-2 px-4 h-9 border border-krds-gray-30 rounded-full bg-white font-bold text-krds-body-sm',
                      // Swiper bullet 커스텀 스타일
                      '[&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:h-2',
                      '[&_.swiper-pagination-bullet]:bg-krds-gray-40 [&_.swiper-pagination-bullet]:rounded-full',
                      '[&_.swiper-pagination-bullet]:opacity-100',
                      '[&_.swiper-pagination-bullet-active]:w-8 [&_.swiper-pagination-bullet-active]:bg-krds-primary-60',
                      // Fraction 스타일
                      '[&_.swiper-pagination-current]:text-krds-primary-60'
                    )}
                  />
                )}

                {/* Play/Pause 버튼 */}
                {showPlayPause && hasMultipleSlides && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleAutoplay}
                      className={buttonBaseClass}
                      aria-label={isPlaying ? '슬라이드 멈춤' : '슬라이드 재생'}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 text-krds-gray-70" />
                      ) : (
                        <Play className="w-4 h-4 text-krds-gray-70" />
                      )}
                    </button>
                  </div>
                )}

                {/* Card variant Navigation */}
                {shouldShowArrows && variant === 'card' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className={cn(buttonBaseClass, 'carousel-button-prev')}
                      aria-label="이전"
                    >
                      <ChevronLeft className="w-5 h-5 text-krds-gray-70" />
                    </button>
                    <button
                      type="button"
                      className={cn(buttonBaseClass, 'carousel-button-next')}
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
      </div>
    );
  }
);

Carousel.displayName = 'Carousel';
