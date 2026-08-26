'use client';

import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

// Swiper CSS (pagination은 커스텀으로 구현하므로 제외)
import 'swiper/css';
import 'swiper/css/navigation';

/**
 * Hero 캐러셀 슬라이드 타입
 */
export interface HeroCarouselSlide {
  /** 슬라이드 고유 ID */
  id: string | number;
  /** 메인 타이틀 */
  title: string;
  /** 설명 텍스트 */
  description?: string;
  /** 이미지 URL */
  imageSrc?: string;
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
 * HeroCarousel Props
 */
export interface HeroCarouselProps {
  /** 슬라이드 데이터 배열 */
  slides: HeroCarouselSlide[];
  /** 자동 재생 여부 */
  autoPlay?: boolean;
  /** 자동 재생 간격 (ms) */
  interval?: number;
  /** 무한 루프 */
  loop?: boolean;
  /** 화살표 표시 여부 */
  showArrows?: boolean;
  /** 페이지네이션 표시 여부 */
  showPagination?: boolean;
  /** 재생/정지 버튼 표시 여부 */
  showPlayPause?: boolean;
  /** 호버시 자동재생 일시정지 */
  pauseOnHover?: boolean;
  /** 추가 className */
  className?: string;
  /** 슬라이드 변경 시 콜백 */
  onSlideChange?: (index: number) => void;
}

/**
 * Hero 스타일 캐러셀 컴포넌트
 *
 * 메인 비주얼/인트로 배너용 캐러셀입니다.
 * 텍스트는 왼쪽, 이미지는 오른쪽에 배치됩니다.
 *
 * @example
 * <HeroCarousel
 *   slides={[
 *     {
 *       id: 1,
 *       title: "새로운 서비스를 소개합니다",
 *       description: "더 나은 경험을 위한 혁신적인 기능",
 *       buttonText: "자세히 보기",
 *       buttonHref: "/about",
 *       image: "/hero-image.png"
 *     }
 *   ]}
 *   autoPlay
 *   showPlayPause
 * />
 */
export const HeroCarousel = React.forwardRef<HTMLDivElement, HeroCarouselProps>(
  (
    {
      slides,
      autoPlay = false,
      interval = 5000,
      loop = true,
      showArrows = true,
      showPagination = true,
      showPlayPause = false,
      pauseOnHover = true,
      className,
      onSlideChange,
    },
    ref
  ) => {
    const [swiperInstance, setSwiperInstance] =
      React.useState<SwiperType | null>(null);
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);
    const [activeIndex, setActiveIndex] = React.useState(0);

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
        setActiveIndex(swiper.realIndex);
        onSlideChange?.(swiper.realIndex);
      },
      [onSlideChange]
    );

    // 특정 슬라이드로 이동
    const goToSlide = React.useCallback(
      (index: number) => {
        if (swiperInstance) {
          swiperInstance.slideToLoop(index);
        }
      },
      [swiperInstance]
    );

    // 버튼 공통 스타일
    const buttonBaseClass = cn(
      'flex items-center justify-center',
      'w-12 h-12 rounded-full',
      'bg-[rgba(255,255,255,0.5)]',
      'hover:bg-krds-gray-10 active:bg-krds-gray-20',
      'disabled:bg-krds-gray-10 disabled:cursor-not-allowed',
      'transition-colors'
    );

    return (
      <div ref={ref} className={cn('bg-krds-white', className)}>
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay, A11y]}
            slidesPerView={1}
            spaceBetween={0}
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
              showArrows && hasMultipleSlides
                ? {
                    nextEl: '.hero-carousel-button-next',
                    prevEl: '.hero-carousel-button-prev',
                  }
                : false
            }
            pagination={false}
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
                {/* Hero 슬라이드: 배경 이미지 + 텍스트 오버레이 */}
                <div className="relative min-h-96 flex items-center py-10 overflow-hidden">
                  {/* 배경 이미지 (mask-image로 자연스러운 페이드) */}
                  {slide.imageSrc && (
                    <img
                      src={slide.imageSrc}
                      alt=""
                      aria-hidden="true"
                      className="absolute top-0 right-0 bottom-0 w-2/3 h-full object-cover object-center [mask-image:linear-gradient(to_right,transparent,black_50%)]"
                    />
                  )}
                  {/* 텍스트 영역 */}
                  <div className="relative z-10 max-w-screen-xl w-full mx-auto text-center md:text-left">
                    <h2 className="text-krds-display-md font-bold text-krds-gray-90 mb-3">
                      {slide.title}
                    </h2>
                    {slide.description && (
                      <p className="text-krds-body-lg text-krds-gray-60 mb-6">
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
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows (텍스트 영역 기준 외부 배치) */}
          {showArrows && hasMultipleSlides && (
            <div className="absolute inset-0 max-w-screen-xl mx-auto pointer-events-none">
              <button
                type="button"
                className={cn(
                  buttonBaseClass,
                  'hero-carousel-button-prev',
                  'absolute -left-20 top-1/2 -translate-y-1/2 z-10 pointer-events-auto'
                )}
                aria-label="이전"
              >
                <ChevronLeft className="w-8 h-8 text-krds-primary-60" />
              </button>
              <button
                type="button"
                className={cn(
                  buttonBaseClass,
                  'hero-carousel-button-next',
                  'absolute -right-20 top-1/2 -translate-y-1/2 z-10 pointer-events-auto'
                )}
                aria-label="다음"
              >
                <ChevronRight className="w-8 h-8 text-krds-primary-60" />
              </button>
            </div>
          )}

          {/* Indicator (페이지네이션 + 컨트롤) */}
          {(showPagination || showPlayPause) && hasMultipleSlides && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center gap-3 mt-4">
              {/* 커스텀 Pagination */}
              {showPagination && (
                <div className="flex items-center justify-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => goToSlide(index)}
                      aria-label={`${index + 1}번째 슬라이드로 이동`}
                      className={cn(
                        'h-2 rounded-full transition-all duration-300',
                        activeIndex === index
                          ? 'w-6 bg-krds-primary-60'
                          : 'w-2 bg-krds-gray-30 hover:bg-krds-gray-40'
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Play/Pause 버튼 */}
              {showPlayPause && (
                <button
                  type="button"
                  onClick={toggleAutoplay}
                  className="flex items-center justify-center w-6 h-6 hover:opacity-70 transition-opacity"
                  aria-label={isPlaying ? '슬라이드 멈춤' : '슬라이드 재생'}
                >
                  {isPlaying ? (
                    <Pause
                      className="w-4 h-4 text-krds-gray-40"
                      fill="currentColor"
                    />
                  ) : (
                    <Play
                      className="w-4 h-4 text-krds-gray-40"
                      fill="currentColor"
                    />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

HeroCarousel.displayName = 'HeroCarousel';
