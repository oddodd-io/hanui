'use client';

import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Swiper CSS (pagination은 커스텀으로 구현하므로 제외)
import 'swiper/css';
import 'swiper/css/navigation';

/**
 * 반응형 slidesPerView 설정
 */
export interface PreviewCarouselBreakpoints {
  /** 모바일 (기본) */
  mobile?: number;
  /** 태블릿 (768px 이상) */
  tablet?: number;
  /** 데스크톱 (1024px 이상) */
  desktop?: number;
}

/**
 * Preview 캐러셀 슬라이드 타입
 */
export interface PreviewCarouselSlide {
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
  /** 클릭 링크 */
  href?: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
}

/**
 * PreviewCarousel Props
 */
export interface PreviewCarouselProps {
  /** 슬라이드 데이터 배열 */
  slides: PreviewCarouselSlide[];
  /** 반응형 slidesPerView 설정 */
  slidesPerView?: PreviewCarouselBreakpoints | number;
  /** 슬라이드 간격 (px) */
  spaceBetween?: number;
  /** 무한 루프 */
  loop?: boolean;
  /** 화살표 표시 여부 */
  showArrows?: boolean;
  /** 페이지네이션 표시 여부 */
  showPagination?: boolean;
  /** 추가 className */
  className?: string;
  /** 슬라이드 변경 시 콜백 */
  onSlideChange?: (index: number) => void;
}

/**
 * Preview 스타일 캐러셀 컴포넌트
 *
 * 부분적으로 다음 슬라이드가 보이는 캐러셀입니다.
 * 이미지와 텍스트를 포함한 카드형 슬라이드를 표시합니다.
 *
 * @example
 * <PreviewCarousel
 *   slides={[
 *     {
 *       id: 1,
 *       title: "정책 안내",
 *       description: "국민을 위한 정책 설명입니다.",
 *       imageSrc: "/policy-image.png",
 *       href: "/policy/1"
 *     }
 *   ]}
 *   slidesPerView={{ mobile: 1.2, tablet: 2.2, desktop: 3.2 }}
 *   showArrows
 *   showPagination
 * />
 */
export const PreviewCarousel = React.forwardRef<
  HTMLDivElement,
  PreviewCarouselProps
>(
  (
    {
      slides,
      slidesPerView = { mobile: 1.2, tablet: 2.2, desktop: 3.2 },
      spaceBetween = 16,
      loop = false,
      showArrows = false,
      showPagination = false,
      className,
      onSlideChange,
    },
    ref
  ) => {
    const [swiperInstance, setSwiperInstance] =
      React.useState<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = React.useState(0);

    const hasMultipleSlides = slides.length > 1;

    // slidesPerView 설정 처리
    const getSlidesPerView = () => {
      if (typeof slidesPerView === 'number') {
        return slidesPerView;
      }
      return slidesPerView.mobile ?? 1.2;
    };

    // breakpoints 설정
    const getBreakpoints = () => {
      if (typeof slidesPerView === 'number') {
        return undefined;
      }
      return {
        768: {
          slidesPerView: slidesPerView.tablet ?? 2.2,
        },
        1024: {
          slidesPerView: slidesPerView.desktop ?? 3.2,
        },
      };
    };

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

    // 이전/다음 버튼 핸들러
    const handlePrev = React.useCallback(() => {
      swiperInstance?.slidePrev();
    }, [swiperInstance]);

    const handleNext = React.useCallback(() => {
      swiperInstance?.slideNext();
    }, [swiperInstance]);

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
      slide: PreviewCarouselSlide;
      children: React.ReactNode;
    }) => {
      if (slide.href) {
        return (
          <a href={slide.href} onClick={slide.onClick} className="block h-full">
            {children}
          </a>
        );
      }
      if (slide.onClick) {
        return (
          <button
            type="button"
            onClick={slide.onClick}
            className="block w-full text-left h-full"
          >
            {children}
          </button>
        );
      }
      return <div className="h-full">{children}</div>;
    };

    return (
      <div ref={ref} className={cn('relative', className)}>
        <Swiper
          modules={[Navigation, A11y]}
          slidesPerView={getSlidesPerView()}
          spaceBetween={spaceBetween}
          speed={400}
          loop={loop && hasMultipleSlides}
          breakpoints={getBreakpoints()}
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
                <div className="bg-white h-full">
                  {slide.imageSrc && (
                    <div className="aspect-square relative overflow-hidden rounded-lg after:content-[''] after:absolute after:inset-0 after:border after:border-krds-gray-20 after:rounded-[inherit] after:bg-black/5">
                      <img
                        src={slide.imageSrc}
                        alt={slide.imageAlt || slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="py-4">
                    <h3 className="text-krds-heading-sm font-semibold text-krds-gray-90 mb-2">
                      {slide.title}
                    </h3>
                    {slide.description && (
                      <p className="text-krds-body-sm text-krds-gray-60 line-clamp-2 min-h-11">
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardWrapper>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 컨트롤 영역 */}
        {(showArrows || showPagination) && hasMultipleSlides && (
          <div className="flex items-center justify-end gap-3 mt-4">
            {/* 커스텀 Pagination */}
            {showPagination && (
              <div className="flex items-center gap-1.5">
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

            {/* Navigation Arrows */}
            {showArrows && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className={buttonBaseClass}
                  aria-label="이전"
                >
                  <ChevronLeft className="w-5 h-5 text-krds-gray-70" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={buttonBaseClass}
                  aria-label="다음"
                >
                  <ChevronRight className="w-5 h-5 text-krds-gray-70" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

PreviewCarousel.displayName = 'PreviewCarousel';
