<script setup lang="ts">
/**
 * Calendar 컴포넌트
 * KRDS 가이드라인을 따르는 접근성 있는 달력
 */
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import Button from './Button.vue';

// 한국어 요일
const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

// 한국어 월 이름
const MONTHS_KO = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월',
];

// ============================================================================
// Props & Emits
// ============================================================================

export interface CalendarRange {
  start: Date | null;
  end: Date | null;
}

const props = withDefaults(
  defineProps<{
    /** 선택 모드 */
    mode?: 'single' | 'range';
    /** 선택된 날짜 (single 모드) */
    modelValue?: Date | null;
    /** 선택된 범위 (range 모드) */
    range?: CalendarRange;
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
    /** 추가 CSS 클래스 */
    class?: string;
  }>(),
  {
    mode: 'single',
    modelValue: null,
    showTodayButton: true,
    showFooterActions: true,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', date: Date | null): void;
  (e: 'update:range', range: CalendarRange): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

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

function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
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

function generateYearOptions(currentYear: number, startYear: number = 2001): number[] {
  const years: number[] = [];
  for (let i = startYear; i <= currentYear + 10; i++) {
    years.push(i);
  }
  return years;
}

// ============================================================================
// State
// ============================================================================

const today = new Date();

// 현재 표시 중인 년/월
const displayYear = ref(props.modelValue?.getFullYear() ?? today.getFullYear());
const displayMonth = ref(props.modelValue?.getMonth() ?? today.getMonth());

// 년/월 선택 드롭다운 열림 상태
const isYearOpen = ref(false);
const isMonthOpen = ref(false);

// Range 선택 중인 상태 (시작일만 선택됨)
const rangeSelecting = ref<Date | null>(null);

// 포커스된 날짜 (키보드 네비게이션용)
const focusedDate = ref<Date | null>(null);

// refs
const yearListRef = ref<HTMLUListElement | null>(null);
const monthListRef = ref<HTMLUListElement | null>(null);
const prevButtonRef = ref<HTMLButtonElement | null>(null);
const calendarGridRef = ref<HTMLTableElement | null>(null);

// 년도 옵션
const yearOptions = computed(() => generateYearOptions(today.getFullYear()));

// ============================================================================
// 네비게이션
// ============================================================================

function goToPrevMonth() {
  if (displayMonth.value === 0) {
    displayYear.value -= 1;
    displayMonth.value = 11;
  } else {
    displayMonth.value -= 1;
  }
}

function goToNextMonth() {
  if (displayMonth.value === 11) {
    displayYear.value += 1;
    displayMonth.value = 0;
  } else {
    displayMonth.value += 1;
  }
}

function goToToday() {
  displayYear.value = today.getFullYear();
  displayMonth.value = today.getMonth();
  if (props.mode === 'single') {
    emit('update:modelValue', today);
  }
}

// ============================================================================
// 날짜 선택
// ============================================================================

function handleDateSelect(date: Date) {
  if (isDateDisabled(date, props.minDate, props.maxDate, props.disabledDates)) return;

  if (props.mode === 'single') {
    emit('update:modelValue', date);
  } else if (props.mode === 'range') {
    if (!rangeSelecting.value) {
      // 첫 번째 날짜 선택 (시작일)
      rangeSelecting.value = date;
      emit('update:range', { start: date, end: null });
    } else {
      // 두 번째 날짜 선택 (종료일)
      const start = rangeSelecting.value;
      const end = date;
      if (start <= end) {
        emit('update:range', { start, end });
      } else {
        emit('update:range', { start: end, end: start });
      }
      rangeSelecting.value = null;
    }
  }
}

// ============================================================================
// 키보드 네비게이션
// ============================================================================

function handleKeyDown(e: KeyboardEvent, date: Date) {
  const newDate = new Date(date);

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
      emit('cancel');
      return;
    default:
      return;
  }

  e.preventDefault();
  focusedDate.value = newDate;

  // 월이 바뀌었으면 표시 월 업데이트
  if (newDate.getMonth() !== displayMonth.value || newDate.getFullYear() !== displayYear.value) {
    displayMonth.value = newDate.getMonth();
    displayYear.value = newDate.getFullYear();
  }
}

function handleNextButtonTab(e: KeyboardEvent) {
  if (e.key === 'Tab' && !e.shiftKey) {
    e.preventDefault();
    const focusableButton = calendarGridRef.value?.querySelector(
      'button[tabindex="0"]'
    ) as HTMLButtonElement | null;
    focusableButton?.focus();
  }
}

// ============================================================================
// 드롭다운 스크롤
// ============================================================================

watch(isYearOpen, async (open) => {
  if (open) {
    await nextTick();
    const activeItem = yearListRef.value?.querySelector('.active');
    activeItem?.scrollIntoView({ block: 'center' });
  }
});

watch(isMonthOpen, async (open) => {
  if (open) {
    await nextTick();
    const activeItem = monthListRef.value?.querySelector('.active');
    activeItem?.scrollIntoView({ block: 'center' });
  }
});

// 마운트 시 이전달 버튼으로 포커스
onMounted(() => {
  setTimeout(() => {
    prevButtonRef.value?.focus();
  }, 50);
});

// ============================================================================
// 달력 그리드 생성
// ============================================================================

interface CalendarDay {
  date: Date;
  isOtherMonth: boolean;
}

const calendarGrid = computed<CalendarDay[]>(() => {
  const daysInMonth = getDaysInMonth(displayYear.value, displayMonth.value);
  const firstDay = getFirstDayOfMonth(displayYear.value, displayMonth.value);

  // 이전 달 날짜들
  const prevMonthDays: CalendarDay[] = [];
  if (firstDay > 0) {
    const prevMonth = displayMonth.value === 0 ? 11 : displayMonth.value - 1;
    const prevYear = displayMonth.value === 0 ? displayYear.value - 1 : displayYear.value;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    for (let i = firstDay - 1; i >= 0; i--) {
      prevMonthDays.push({
        date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
        isOtherMonth: true,
      });
    }
  }

  // 현재 달 날짜들
  const currentMonthDays: CalendarDay[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push({
      date: new Date(displayYear.value, displayMonth.value, i),
      isOtherMonth: false,
    });
  }

  // 다음 달 날짜들
  const nextMonthDays: CalendarDay[] = [];
  const totalDays = prevMonthDays.length + currentMonthDays.length;
  const remainingDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
  const nextMonth = displayMonth.value === 11 ? 0 : displayMonth.value + 1;
  const nextYear = displayMonth.value === 11 ? displayYear.value + 1 : displayYear.value;
  for (let i = 1; i <= remainingDays; i++) {
    nextMonthDays.push({
      date: new Date(nextYear, nextMonth, i),
      isOtherMonth: true,
    });
  }

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
});

// 주 단위로 그룹화
const weeks = computed<CalendarDay[][]>(() => {
  const result: CalendarDay[][] = [];
  for (let i = 0; i < calendarGrid.value.length; i += 7) {
    result.push(calendarGrid.value.slice(i, i + 7));
  }
  return result;
});

// ============================================================================
// 날짜 상태 체크
// ============================================================================

function getDayClasses(day: CalendarDay, dayIndex: number) {
  const { date, isOtherMonth } = day;
  const isToday = isSameDay(today, date);
  const isSelected = props.mode === 'single' && isSameDay(props.modelValue, date);
  const isRangeStart =
    props.mode === 'range' &&
    (isSameDay(props.range?.start, date) ||
      (rangeSelecting.value && isSameDay(rangeSelecting.value, date)));
  const isRangeEnd = props.mode === 'range' && isSameDay(props.range?.end, date);
  const isInRange =
    props.mode === 'range' &&
    isDateInRange(date, props.range?.start ?? null, props.range?.end ?? null) &&
    !isSameDay(props.range?.start, date) &&
    !isSameDay(props.range?.end, date);
  const isDisabled = isDateDisabled(date, props.minDate, props.maxDate, props.disabledDates);
  const isHoliday = dayIndex === 0 || props.holidayDates?.some((d) => isSameDay(d, date));
  const hasEvent = props.eventDates?.some((d) => isSameDay(d, date));
  const isFocused = isSameDay(focusedDate.value, date);

  return {
    button: cn(
      'btn-set-date w-10 h-10 flex items-center justify-center rounded-full text-krds-body-sm transition-colors focus:outline-none focus:ring-2 focus:ring-krds-primary-base focus:ring-offset-2',
      'text-krds-gray-90 hover:bg-krds-gray-10',
      isOtherMonth && '!text-krds-gray-40',
      isToday && !isSelected && 'border border-krds-primary-base',
      isSelected &&
        'bg-krds-primary-10 text-krds-primary-base ring-2 ring-krds-primary-base ring-offset-2 hover:bg-krds-primary-10',
      (isRangeStart || isRangeEnd) &&
        !isSelected &&
        'bg-krds-primary-base text-white hover:bg-krds-primary-base',
      isInRange && 'bg-krds-primary-10 rounded-none',
      isRangeStart && 'rounded-l-full rounded-r-none',
      isRangeEnd && 'rounded-r-full rounded-l-none',
      isHoliday && !isOtherMonth && !isSelected && 'text-krds-functional-error',
      isDisabled && 'text-krds-gray-30 cursor-not-allowed hover:bg-transparent',
      hasEvent &&
        'relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-krds-primary-base after:rounded-full',
      isFocused && 'ring-2 ring-krds-primary-base'
    ),
    td: cn(
      'p-0.5',
      isOtherMonth && 'old',
      isToday && 'today',
      hasEvent && 'day-event',
      isHoliday && !isOtherMonth && 'day-off',
      isInRange && 'period',
      isRangeStart && 'period start',
      isRangeEnd && 'period end'
    ),
    isSelected,
    isRangeStart,
    isRangeEnd,
    isDisabled,
    isHoliday,
    isOtherMonth,
    isToday,
  };
}

function getAriaLabel(day: CalendarDay, dayIndex: number) {
  const { date, isOtherMonth } = day;
  const isToday = isSameDay(today, date);
  const isSelected = props.mode === 'single' && isSameDay(props.modelValue, date);
  const isRangeStart =
    props.mode === 'range' &&
    (isSameDay(props.range?.start, date) ||
      (rangeSelecting.value && isSameDay(rangeSelecting.value, date)));
  const isRangeEnd = props.mode === 'range' && isSameDay(props.range?.end, date);
  const isHoliday = dayIndex === 0 || props.holidayDates?.some((d) => isSameDay(d, date));

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일${isToday ? ' 오늘' : ''}${isSelected ? ' 선택됨' : ''}${isRangeStart ? ' 시작일' : ''}${isRangeEnd ? ' 종료일' : ''}${isHoliday && !isOtherMonth ? ' 공휴일' : ''}`;
}

function getTabIndex(day: CalendarDay) {
  const { isOtherMonth } = day;
  const isSelected = props.mode === 'single' && isSameDay(props.modelValue, day.date);
  const isDisabled = isDateDisabled(day.date, props.minDate, props.maxDate, props.disabledDates);
  return !isOtherMonth && !isSelected && !isDisabled ? 0 : -1;
}
</script>

<template>
  <div
    :class="cn(
      'krds-calendar-area bg-white border border-krds-gray-30 rounded-lg shadow-lg',
      props.class
    )"
    role="group"
    aria-label="달력"
  >
    <div class="calendar-wrap p-4">
      <!-- 헤더: 이전/다음 버튼 + 년/월 선택 -->
      <div class="calendar-head flex items-center justify-between mb-4">
        <!-- 이전 달 버튼 -->
        <button
          ref="prevButtonRef"
          type="button"
          class="btn-cal-move prev p-2 rounded-md hover:bg-krds-gray-10 transition-colors focus:outline-none focus:ring-2 focus:ring-krds-primary-base"
          @click="goToPrevMonth"
        >
          <span class="sr-only">이전 달</span>
          <ChevronLeft class="w-5 h-5 text-krds-gray-70" />
        </button>

        <!-- 년/월 선택 -->
        <div class="calendar-switch-wrap flex items-center gap-2">
          <!-- 년도 선택 -->
          <div class="calendar-drop-down relative">
            <button
              type="button"
              class="btn-cal-switch year px-3 py-1.5 text-krds-body-md font-medium text-krds-gray-90 hover:bg-krds-gray-10 rounded-md transition-colors flex items-center gap-1"
              aria-label="연도 선택"
              :aria-expanded="isYearOpen"
              aria-haspopup="listbox"
              @click="isYearOpen = !isYearOpen; isMonthOpen = false"
            >
              {{ displayYear }}년
              <span
                :class="cn(
                  'text-[10px] transition-transform',
                  isYearOpen && 'rotate-180'
                )"
              >
                ▼
              </span>
            </button>
            <div
              v-if="isYearOpen"
              class="calendar-select calendar-year-wrap absolute top-full left-0 mt-1 bg-white border border-krds-gray-30 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
            >
              <ul
                ref="yearListRef"
                class="sel year py-1"
                role="listbox"
                aria-label="연도 목록"
              >
                <li
                  v-for="year in yearOptions"
                  :key="year"
                  role="option"
                  :aria-selected="year === displayYear"
                >
                  <button
                    type="button"
                    :class="cn(
                      'w-full px-4 py-2 text-krds-body-sm text-left hover:bg-krds-gray-10 transition-colors',
                      year === displayYear &&
                        'active bg-krds-primary-base text-white hover:bg-krds-primary-base'
                    )"
                    @click="displayYear = year; isYearOpen = false"
                  >
                    {{ year }}년
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- 월 선택 -->
          <div class="calendar-drop-down relative">
            <button
              type="button"
              class="btn-cal-switch month px-3 py-1.5 text-krds-body-md font-medium text-krds-gray-90 hover:bg-krds-gray-10 rounded-md transition-colors flex items-center gap-1"
              aria-label="월 선택"
              :aria-expanded="isMonthOpen"
              aria-haspopup="listbox"
              @click="isMonthOpen = !isMonthOpen; isYearOpen = false"
            >
              {{ MONTHS_KO[displayMonth] }}
              <span
                :class="cn(
                  'text-[10px] transition-transform',
                  isMonthOpen && 'rotate-180'
                )"
              >
                ▼
              </span>
            </button>
            <div
              v-if="isMonthOpen"
              class="calendar-select calendar-mon-wrap absolute top-full left-0 mt-1 bg-white border border-krds-gray-30 rounded-md shadow-lg z-10"
            >
              <ul
                ref="monthListRef"
                class="sel month py-1"
                role="listbox"
                aria-label="월 목록"
              >
                <li
                  v-for="(monthName, index) in MONTHS_KO"
                  :key="index"
                  role="option"
                  :aria-selected="index === displayMonth"
                >
                  <button
                    type="button"
                    :class="cn(
                      'w-full px-4 py-2 text-krds-body-sm text-left hover:bg-krds-gray-10 transition-colors',
                      index === displayMonth &&
                        'active bg-krds-primary-base text-white hover:bg-krds-primary-base'
                    )"
                    @click="displayMonth = index; isMonthOpen = false"
                  >
                    {{ monthName }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 다음 달 버튼 -->
        <button
          type="button"
          class="btn-cal-move next p-2 rounded-md hover:bg-krds-gray-10 transition-colors focus:outline-none focus:ring-2 focus:ring-krds-primary-base"
          @click="goToNextMonth"
          @keydown="handleNextButtonTab"
        >
          <span class="sr-only">다음 달</span>
          <ChevronRight class="w-5 h-5 text-krds-gray-70" />
        </button>
      </div>

      <!-- 달력 테이블 -->
      <div class="calendar-body">
        <div class="calendar-table-wrap">
          <table
            ref="calendarGridRef"
            class="calendar-tbl w-full"
            role="grid"
          >
            <caption class="sr-only">
              {{ displayYear }}년 {{ MONTHS_KO[displayMonth] }}
            </caption>
            <thead>
              <tr>
                <th
                  v-for="(day, index) in WEEKDAYS_KO"
                  :key="day"
                  :class="cn(
                    'p-2 font-medium text-center',
                    index === 0 ? 'text-krds-functional-error' : 'text-krds-gray-60'
                  )"
                  scope="col"
                >
                  {{ day }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, weekIndex) in weeks" :key="weekIndex" role="row">
                <td
                  v-for="(day, dayIndex) in week"
                  :key="day.date.toISOString()"
                  role="gridcell"
                  :aria-selected="getDayClasses(day, dayIndex).isSelected || getDayClasses(day, dayIndex).isRangeStart || getDayClasses(day, dayIndex).isRangeEnd"
                  :aria-disabled="getDayClasses(day, dayIndex).isDisabled"
                  :aria-current="getDayClasses(day, dayIndex).isToday ? 'date' : undefined"
                  :class="getDayClasses(day, dayIndex).td"
                >
                  <button
                    type="button"
                    :aria-label="getAriaLabel(day, dayIndex)"
                    :class="getDayClasses(day, dayIndex).button"
                    :disabled="getDayClasses(day, dayIndex).isDisabled"
                    :tabindex="getTabIndex(day)"
                    @click="handleDateSelect(day.date)"
                    @keydown="handleKeyDown($event, day.date)"
                  >
                    <span>{{ day.date.getDate() }}</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div
        v-if="showTodayButton || showFooterActions"
        class="calendar-footer mt-4 pt-4 border-t border-krds-gray-20"
      >
        <div class="calendar-btn-wrap flex items-center gap-2">
          <Button
            v-if="showTodayButton"
            variant="ghost"
            size="sm"
            class="text-krds-gray-70 !px-0"
            @click="goToToday"
          >
            오늘
          </Button>
          <template v-if="showFooterActions">
            <Button
              variant="tertiary"
              size="sm"
              class="ml-auto"
              @click="emit('cancel')"
            >
              취소
            </Button>
            <Button
              variant="primary"
              size="sm"
              @click="emit('confirm')"
            >
              확인
            </Button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
