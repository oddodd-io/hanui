'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './button';

// ============================================================================
// Calendar 컴포넌트
// KRDS 가이드라인을 따르는 접근성 있는 달력
// ============================================================================

// 한국어 요일
const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

// 한국어 월 이름
const MONTHS_KO = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

// ============================================================================
// Types
// ============================================================================

export interface CalendarProps {
  /** 선택 모드 */
  mode?: 'single' | 'range';
  /** 선택된 날짜 (single 모드) */
  value?: Date | null;
  /** 선택된 범위 (range 모드) */
  range?: { start: Date | null; end: Date | null };
  /** 날짜 변경 핸들러 (single 모드) */
  onChange?: (date: Date | null) => void;
  /** 범위 변경 핸들러 (range 모드) */
  onRangeChange?: (range: { start: Date | null; end: Date | null }) => void;
  /** 최소 선택 가능 날짜 */
  minDate?: Date;
  /** 최대 선택 가능 날짜 */
  maxDate?: Date;
  /** 비활성화할 날짜들 */
  disabledDates?: Date[] | ((date: Date) => boolean);
  /** 공휴일 날짜들 */
  holidayDates?: Date[];
  /** 이벤트가 있는 날짜들 */
  eventDates?: Date[];
  /** 오늘 버튼 표시 */
  showTodayButton?: boolean;
  /** 하단 액션 버튼 표시 (취소, 확인) */
  showFooterActions?: boolean;
  /** 확인 버튼 클릭 핸들러 */
  onConfirm?: () => void;
  /** 취소 버튼 클릭 핸들러 */
  onCancel?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(date1: Date | null | undefined, date2: Date): boolean {
  if (!date1) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isDateInRange(
  date: Date,
  start: Date | null,
  end: Date | null
): boolean {
  if (!start || !end) return false;
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
}

function isDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[] | ((date: Date) => boolean)
): boolean {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  if (disabledDates) {
    if (typeof disabledDates === 'function') {
      return disabledDates(date);
    }
    return disabledDates.some((d) => isSameDay(d, date));
  }
  return false;
}

function generateYearOptions(
  currentYear: number,
  startYear: number = 2001
): number[] {
  const years: number[] = [];
  // 2001년부터 현재년도 + 10년까지
  for (let i = startYear; i <= currentYear + 10; i++) {
    years.push(i);
  }
  return years;
}

// ============================================================================
// Calendar 컴포넌트
// ============================================================================

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      mode = 'single',
      value,
      range,
      onChange,
      onRangeChange,
      minDate,
      maxDate,
      disabledDates,
      holidayDates,
      eventDates,
      showTodayButton = true,
      showFooterActions = true,
      onConfirm,
      onCancel,
      className,
    },
    ref
  ) => {
    const today = new Date();

    // 현재 표시 중인 년/월
    const [displayYear, setDisplayYear] = React.useState(
      () => value?.getFullYear() ?? today.getFullYear()
    );
    const [displayMonth, setDisplayMonth] = React.useState(
      () => value?.getMonth() ?? today.getMonth()
    );

    // 년/월 선택 드롭다운 열림 상태
    const [isYearOpen, setIsYearOpen] = React.useState(false);
    const [isMonthOpen, setIsMonthOpen] = React.useState(false);

    // Range 선택 중인 상태 (시작일만 선택됨)
    const [rangeSelecting, setRangeSelecting] = React.useState<Date | null>(
      null
    );

    // 포커스된 날짜 (키보드 네비게이션용)
    const [focusedDate, setFocusedDate] = React.useState<Date | null>(null);

    // refs
    const yearListRef = React.useRef<HTMLUListElement>(null);
    const monthListRef = React.useRef<HTMLUListElement>(null);
    const prevButtonRef = React.useRef<HTMLButtonElement>(null);
    const calendarGridRef = React.useRef<HTMLTableElement>(null);

    // 년도 옵션
    // today는 매 렌더 새 Date 객체라 의존성으로 쓰면 메모가 걸리지 않는다.
    // 실제로 바뀌는 값(연도)만 의존성으로 둔다.
    const currentYear = today.getFullYear();
    const yearOptions = React.useMemo(
      () => generateYearOptions(currentYear),
      [currentYear]
    );

    // 이전 달로 이동
    const goToPrevMonth = () => {
      if (displayMonth === 0) {
        setDisplayYear((y) => y - 1);
        setDisplayMonth(11);
      } else {
        setDisplayMonth((m) => m - 1);
      }
    };

    // 다음 달로 이동
    const goToNextMonth = () => {
      if (displayMonth === 11) {
        setDisplayYear((y) => y + 1);
        setDisplayMonth(0);
      } else {
        setDisplayMonth((m) => m + 1);
      }
    };

    // 오늘로 이동
    const goToToday = () => {
      setDisplayYear(today.getFullYear());
      setDisplayMonth(today.getMonth());
      if (mode === 'single' && onChange) {
        onChange(today);
      }
    };

    // 날짜 선택 핸들러
    const handleDateSelect = (date: Date) => {
      if (isDateDisabled(date, minDate, maxDate, disabledDates)) return;

      if (mode === 'single') {
        onChange?.(date);
      } else if (mode === 'range') {
        if (!rangeSelecting) {
          // 첫 번째 날짜 선택 (시작일)
          setRangeSelecting(date);
          onRangeChange?.({ start: date, end: null });
        } else {
          // 두 번째 날짜 선택 (종료일)
          const start = rangeSelecting;
          const end = date;
          if (start <= end) {
            onRangeChange?.({ start, end });
          } else {
            onRangeChange?.({ start: end, end: start });
          }
          setRangeSelecting(null);
        }
      }
    };

    // 키보드 네비게이션
    const handleKeyDown = (e: React.KeyboardEvent, date: Date) => {
      let newDate = new Date(date);

      switch (e.key) {
        case 'ArrowLeft':
          newDate.setDate(date.getDate() - 1);
          break;
        case 'ArrowRight':
          newDate.setDate(date.getDate() + 1);
          break;
        case 'ArrowUp':
          newDate.setDate(date.getDate() - 7);
          break;
        case 'ArrowDown':
          newDate.setDate(date.getDate() + 7);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleDateSelect(date);
          return;
        case 'Escape':
          onCancel?.();
          return;
        default:
          return;
      }

      e.preventDefault();
      setFocusedDate(newDate);

      // 월이 바뀌었으면 표시 월 업데이트
      if (
        newDate.getMonth() !== displayMonth ||
        newDate.getFullYear() !== displayYear
      ) {
        setDisplayMonth(newDate.getMonth());
        setDisplayYear(newDate.getFullYear());
      }
    };

    // 년도 선택 드롭다운 열릴 때 현재 년도로 스크롤
    React.useEffect(() => {
      if (isYearOpen && yearListRef.current) {
        const activeItem = yearListRef.current.querySelector('.active');
        activeItem?.scrollIntoView({ block: 'center' });
      }
    }, [isYearOpen]);

    // 월 선택 드롭다운 열릴 때 현재 월로 스크롤
    React.useEffect(() => {
      if (isMonthOpen && monthListRef.current) {
        const activeItem = monthListRef.current.querySelector('.active');
        activeItem?.scrollIntoView({ block: 'center' });
      }
    }, [isMonthOpen]);

    // 캘린더 마운트 시 이전달 버튼으로 포커스 이동
    React.useEffect(() => {
      // 짧은 지연 후 포커스 (Popover 애니메이션 후)
      const timeoutId = setTimeout(() => {
        prevButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timeoutId);
    }, []);

    // 달력 그리드 생성
    const calendarGrid = React.useMemo(() => {
      const daysInMonth = getDaysInMonth(displayYear, displayMonth);
      const firstDay = getFirstDayOfMonth(displayYear, displayMonth);

      // 이전 달 날짜들
      const prevMonthDays: { date: Date; isOtherMonth: boolean }[] = [];
      if (firstDay > 0) {
        const prevMonth = displayMonth === 0 ? 11 : displayMonth - 1;
        const prevYear = displayMonth === 0 ? displayYear - 1 : displayYear;
        const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
        for (let i = firstDay - 1; i >= 0; i--) {
          prevMonthDays.push({
            date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
            isOtherMonth: true,
          });
        }
      }

      // 현재 달 날짜들
      const currentMonthDays: { date: Date; isOtherMonth: boolean }[] = [];
      for (let i = 1; i <= daysInMonth; i++) {
        currentMonthDays.push({
          date: new Date(displayYear, displayMonth, i),
          isOtherMonth: false,
        });
      }

      // 다음 달 날짜들
      const nextMonthDays: { date: Date; isOtherMonth: boolean }[] = [];
      const totalDays = prevMonthDays.length + currentMonthDays.length;
      const remainingDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
      const nextMonth = displayMonth === 11 ? 0 : displayMonth + 1;
      const nextYear = displayMonth === 11 ? displayYear + 1 : displayYear;
      for (let i = 1; i <= remainingDays; i++) {
        nextMonthDays.push({
          date: new Date(nextYear, nextMonth, i),
          isOtherMonth: true,
        });
      }

      return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    }, [displayYear, displayMonth]);

    // 주 단위로 그룹화
    const weeks = React.useMemo(() => {
      const result: { date: Date; isOtherMonth: boolean }[][] = [];
      for (let i = 0; i < calendarGrid.length; i += 7) {
        result.push(calendarGrid.slice(i, i + 7));
      }
      return result;
    }, [calendarGrid]);

    return (
      <div
        ref={ref}
        className={cn(
          'krds-calendar-area bg-white border border-krds-gray-30 rounded-lg shadow-lg',
          className
        )}
        role="group"
        aria-label="달력"
      >
        <div className="calendar-wrap p-4">
          {/* 헤더: 이전/다음 버튼 + 년/월 선택 */}
          <div className="calendar-head flex items-center justify-between mb-4">
            {/* 이전 달 버튼 */}
            <button
              ref={prevButtonRef}
              type="button"
              className="btn-cal-move prev p-2 rounded-md hover:bg-krds-gray-10 transition-colors focus:outline-none focus:ring-2 focus:ring-krds-primary-base"
              onClick={goToPrevMonth}
            >
              <span className="sr-only">이전 달</span>
              <ChevronLeft className="w-5 h-5 text-krds-gray-70" />
            </button>

            {/* 년/월 선택 */}
            <div className="calendar-switch-wrap flex items-center gap-2">
              {/* 년도 선택 */}
              <div className="calendar-drop-down relative">
                <button
                  type="button"
                  className="btn-cal-switch year px-3 py-1.5 text-krds-body-md font-medium text-krds-gray-90 hover:bg-krds-gray-10 rounded-md transition-colors flex items-center gap-1"
                  aria-label="연도 선택"
                  aria-expanded={isYearOpen}
                  aria-haspopup="listbox"
                  onClick={() => {
                    setIsYearOpen(!isYearOpen);
                    setIsMonthOpen(false);
                  }}
                >
                  {displayYear}년
                  <span
                    className={cn(
                      'text-[10px] transition-transform',
                      isYearOpen && 'rotate-180'
                    )}
                  >
                    ▼
                  </span>
                </button>
                {isYearOpen && (
                  <div className="calendar-select calendar-year-wrap absolute top-full left-0 mt-1 bg-white border border-krds-gray-30 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    <ul
                      ref={yearListRef}
                      className="sel year py-1"
                      role="listbox"
                      aria-label="연도 목록"
                    >
                      {yearOptions.map((year) => (
                        <li
                          key={year}
                          role="option"
                          aria-selected={year === displayYear}
                        >
                          <button
                            type="button"
                            className={cn(
                              'w-full px-4 py-2 text-krds-body-sm text-left hover:bg-krds-gray-10 transition-colors',
                              year === displayYear &&
                                'active bg-krds-primary-base text-white hover:bg-krds-primary-base'
                            )}
                            onClick={() => {
                              setDisplayYear(year);
                              setIsYearOpen(false);
                            }}
                          >
                            {year}년
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 월 선택 */}
              <div className="calendar-drop-down relative">
                <button
                  type="button"
                  className="btn-cal-switch month px-3 py-1.5 text-krds-body-md font-medium text-krds-gray-90 hover:bg-krds-gray-10 rounded-md transition-colors flex items-center gap-1"
                  aria-label="월 선택"
                  aria-expanded={isMonthOpen}
                  aria-haspopup="listbox"
                  onClick={() => {
                    setIsMonthOpen(!isMonthOpen);
                    setIsYearOpen(false);
                  }}
                >
                  {MONTHS_KO[displayMonth]}
                  <span
                    className={cn(
                      'text-[10px] transition-transform',
                      isMonthOpen && 'rotate-180'
                    )}
                  >
                    ▼
                  </span>
                </button>
                {isMonthOpen && (
                  <div className="calendar-select calendar-mon-wrap absolute top-full left-0 mt-1 bg-white border border-krds-gray-30 rounded-md shadow-lg z-10">
                    <ul
                      ref={monthListRef}
                      className="sel month py-1"
                      role="listbox"
                      aria-label="월 목록"
                    >
                      {MONTHS_KO.map((monthName, index) => (
                        <li
                          key={index}
                          role="option"
                          aria-selected={index === displayMonth}
                        >
                          <button
                            type="button"
                            className={cn(
                              'w-full px-4 py-2 text-krds-body-sm text-left hover:bg-krds-gray-10 transition-colors',
                              index === displayMonth &&
                                'active bg-krds-primary-base text-white hover:bg-krds-primary-base'
                            )}
                            onClick={() => {
                              setDisplayMonth(index);
                              setIsMonthOpen(false);
                            }}
                          >
                            {monthName}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* 다음 달 버튼 */}
            <button
              type="button"
              className="btn-cal-move next p-2 rounded-md hover:bg-krds-gray-10 transition-colors focus:outline-none focus:ring-2 focus:ring-krds-primary-base"
              onClick={goToNextMonth}
              onKeyDown={(e) => {
                // Tab 키를 누르면 날짜 그리드로 포커스 이동
                if (e.key === 'Tab' && !e.shiftKey) {
                  e.preventDefault();
                  // 선택된 날짜 또는 오늘 또는 1일로 포커스 이동
                  const focusableButton =
                    calendarGridRef.current?.querySelector(
                      'button[tabindex="0"]'
                    ) as HTMLButtonElement | null;
                  focusableButton?.focus();
                }
              }}
            >
              <span className="sr-only">다음 달</span>
              <ChevronRight className="w-5 h-5 text-krds-gray-70" />
            </button>
          </div>

          {/* 달력 테이블 */}
          <div className="calendar-body">
            <div className="calendar-table-wrap">
              <table
                ref={calendarGridRef}
                className="calendar-tbl w-full"
                role="grid"
              >
                <caption className="sr-only">
                  {displayYear}년 {MONTHS_KO[displayMonth]}
                </caption>
                <thead>
                  <tr>
                    {WEEKDAYS_KO.map((day, index) => (
                      <th
                        key={day}
                        className={cn(
                          'p-2 font-medium text-center',
                          index === 0
                            ? 'text-krds-functional-error'
                            : 'text-krds-gray-60'
                        )}
                        scope="col"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((week, weekIndex) => (
                    <tr key={weekIndex} role="row">
                      {week.map(({ date, isOtherMonth }, dayIndex) => {
                        const isToday = isSameDay(today, date);
                        const isSelected =
                          mode === 'single' && isSameDay(value, date);
                        // 범위 선택: rangeSelecting(선택 중인 시작일) 또는 range.start(확정된 시작일)
                        const isRangeStart =
                          mode === 'range' &&
                          (isSameDay(range?.start, date) ||
                            (rangeSelecting &&
                              isSameDay(rangeSelecting, date)));
                        const isRangeEnd =
                          mode === 'range' && isSameDay(range?.end, date);
                        // 범위 내 날짜 표시 (시작/종료 확정 후)
                        const isInRange =
                          mode === 'range' &&
                          isDateInRange(
                            date,
                            range?.start ?? null,
                            range?.end ?? null
                          ) &&
                          !isSameDay(range?.start, date) &&
                          !isSameDay(range?.end, date);
                        const isDisabled = isDateDisabled(
                          date,
                          minDate,
                          maxDate,
                          disabledDates
                        );
                        const isHoliday =
                          dayIndex === 0 ||
                          holidayDates?.some((d) => isSameDay(d, date));
                        const hasEvent = eventDates?.some((d) =>
                          isSameDay(d, date)
                        );
                        const isFocused = isSameDay(focusedDate, date);

                        return (
                          <td
                            key={date.toISOString()}
                            role="gridcell"
                            aria-selected={
                              isSelected || isRangeStart || isRangeEnd
                            }
                            aria-disabled={isDisabled}
                            aria-current={isToday ? 'date' : undefined}
                            className={cn(
                              'p-0.5',
                              isOtherMonth && 'old',
                              isToday && 'today',
                              hasEvent && 'day-event',
                              isHoliday && !isOtherMonth && 'day-off',
                              isInRange && 'period',
                              isRangeStart && 'period start',
                              isRangeEnd && 'period end'
                            )}
                          >
                            <button
                              type="button"
                              aria-label={`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일${isToday ? ' 오늘' : ''}${isSelected ? ' 선택됨' : ''}${isRangeStart ? ' 시작일' : ''}${isRangeEnd ? ' 종료일' : ''}${isHoliday && !isOtherMonth ? ' 공휴일' : ''}`}
                              className={cn(
                                'btn-set-date w-10 h-10 flex items-center justify-center rounded-full text-krds-body-sm transition-colors focus:outline-none focus:ring-2 focus:ring-krds-primary-base focus:ring-offset-2',
                                // 기본 상태
                                'text-krds-gray-90 hover:bg-krds-gray-10',
                                // 다른 달
                                isOtherMonth && '!text-krds-gray-40',
                                // 오늘
                                isToday &&
                                  !isSelected &&
                                  'border border-krds-primary-base',
                                // 선택됨 (single 모드) - 배경색 + ring
                                isSelected &&
                                  'bg-krds-primary-10 text-krds-primary-base ring-2 ring-krds-primary-base ring-offset-2 hover:bg-krds-primary-10',
                                // 범위 시작/끝 (range 모드) - 기존 스타일 유지
                                (isRangeStart || isRangeEnd) &&
                                  !isSelected &&
                                  'bg-krds-primary-base text-white hover:bg-krds-primary-base',
                                // 범위 내
                                isInRange && 'bg-krds-primary-10 rounded-none',
                                // 범위 시작
                                isRangeStart && 'rounded-l-full rounded-r-none',
                                // 범위 끝
                                isRangeEnd && 'rounded-r-full rounded-l-none',
                                // 공휴일
                                isHoliday &&
                                  !isOtherMonth &&
                                  !isSelected &&
                                  'text-krds-functional-error',
                                // 비활성화
                                isDisabled &&
                                  'text-krds-gray-30 cursor-not-allowed hover:bg-transparent',
                                // 이벤트
                                hasEvent &&
                                  'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-krds-primary-base after:rounded-full',
                                // 포커스
                                isFocused && 'ring-2 ring-krds-primary-base'
                              )}
                              onClick={() => handleDateSelect(date)}
                              onKeyDown={(e) => handleKeyDown(e, date)}
                              disabled={isDisabled}
                              tabIndex={
                                // 현재 달 날짜만 탭 가능, 선택된 날짜는 건너뛰기
                                !isOtherMonth && !isSelected && !isDisabled
                                  ? 0
                                  : -1
                              }
                            >
                              <span>{date.getDate()}</span>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 하단 버튼 */}
          {(showTodayButton || showFooterActions) && (
            <div className="calendar-footer mt-4 pt-4 border-t border-krds-gray-20">
              <div className="calendar-btn-wrap flex items-center gap-2">
                {showTodayButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToToday}
                    className="text-krds-gray-70 !px-0"
                  >
                    오늘
                  </Button>
                )}
                {showFooterActions && (
                  <>
                    <Button
                      variant="tertiary"
                      size="sm"
                      onClick={onCancel}
                      className="ml-auto"
                    >
                      취소
                    </Button>
                    <Button variant="primary" size="sm" onClick={onConfirm}>
                      확인
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';
