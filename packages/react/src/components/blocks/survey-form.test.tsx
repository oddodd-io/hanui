import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../../test/setup';
import { SurveyForm, type SurveyQuestion } from './survey-form';

const QUESTIONS: SurveyQuestion[] = [
  { id: 1, question: '전반적으로 만족하셨나요?', type: 'rating', required: true },
  {
    id: 2,
    question: '가장 유용했던 기능은?',
    type: 'choice',
    options: ['게시판', '검색', '알림'],
  },
  { id: 3, question: '개선할 점을 알려주세요', type: 'text' },
];

describe('SurveyForm', () => {
  it('제목과 질문이 렌더링되어야 합니다', () => {
    render(<SurveyForm questions={QUESTIONS} />);
    expect(screen.getByText('만족도 조사')).toBeInTheDocument();
    expect(screen.getByText(/전반적으로 만족하셨나요/)).toBeInTheDocument();
  });

  it('선택지 묶음이 질문으로 이름지어져야 합니다', () => {
    render(<SurveyForm questions={QUESTIONS} />);
    // radiogroup에 이름이 없으면 어떤 질문의 선택지인지 전달되지 않는다 (WCAG 1.3.1)
    const group = screen.getByRole('radiogroup', {
      name: /가장 유용했던 기능은/,
    });
    expect(within(group).getAllByRole('radio')).toHaveLength(3);
  });

  it('평점 묶음도 질문으로 이름지어져야 합니다', () => {
    render(<SurveyForm questions={QUESTIONS} />);
    expect(
      screen.getByRole('group', { name: /전반적으로 만족하셨나요/ })
    ).toBeInTheDocument();
  });

  it('서술형 입력이 질문과 연결되어야 합니다', () => {
    render(<SurveyForm questions={QUESTIONS} />);
    expect(
      screen.getByRole('textbox', { name: /개선할 점을 알려주세요/ })
    ).toBeInTheDocument();
  });

  it('필수 표시가 스크린리더로 전달되어야 합니다', () => {
    render(<SurveyForm questions={QUESTIONS} />);
    // 시각 기호 *는 aria-hidden, 대신 sr-only 텍스트가 읽혀야 한다
    expect(screen.getByText(/전반적으로 만족하셨나요/)).toHaveTextContent(
      '(필수)'
    );
  });

  it('평점 선택 상태가 색상 외 수단으로 전달되어야 합니다', async () => {
    const user = userEvent.setup();
    render(<SurveyForm questions={QUESTIONS} />);

    const four = screen.getByRole('button', { name: '4점 - 만족' });
    expect(four).toHaveAttribute('aria-pressed', 'false');

    await user.click(four);
    expect(four).toHaveAttribute('aria-pressed', 'true');
  });

  it('선택지를 고를 수 있어야 합니다', async () => {
    const user = userEvent.setup();
    render(<SurveyForm questions={QUESTIONS} />);

    const radio = screen.getByRole('radio', { name: '검색' });
    await user.click(radio);
    expect(radio).toBeChecked();
  });

  it('설문이 두 개여도 서로의 선택을 덮어쓰지 않아야 합니다', async () => {
    const user = userEvent.setup();
    render(
      <>
        <SurveyForm title="설문 A" questions={QUESTIONS} />
        <SurveyForm title="설문 B" questions={QUESTIONS} />
      </>
    );

    // radio name이 폼별로 격리되지 않으면 한쪽 선택이 다른 쪽을 해제한다
    const [firstSearch, secondSearch] = screen.getAllByRole('radio', {
      name: '검색',
    });
    await user.click(firstSearch);
    await user.click(secondSearch);

    expect(firstSearch).toBeChecked();
    expect(secondSearch).toBeChecked();
  });

  it('필수 항목을 채우기 전에는 제출할 수 없어야 합니다', () => {
    render(<SurveyForm questions={QUESTIONS} />);
    expect(screen.getByRole('button', { name: '제출하기' })).toBeDisabled();
  });

  it('필수 항목을 채우면 제출할 수 있어야 합니다', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SurveyForm questions={QUESTIONS} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: '5점 - 매우 만족' }));
    await user.click(screen.getByRole('button', { name: '제출하기' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.arrayContaining([{ questionId: 1, value: 5 }])
    );
  });

  it('접근성 위반이 없어야 합니다', async () => {
    const { container } = render(
      <SurveyForm questions={QUESTIONS} description="서비스 개선에 활용됩니다" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
