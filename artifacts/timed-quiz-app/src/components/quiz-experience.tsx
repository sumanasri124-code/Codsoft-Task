import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  RotateCcw,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { quizQuestions, type QuizQuestion } from '@/data/quiz-data';

type Screen = 'start' | 'quiz' | 'results';
type Response = {
  selected: number | null;
  outcome: 'correct' | 'incorrect' | 'unanswered';
};

const LETTERS = ['A', 'B', 'C', 'D'];
const QUESTION_TIME = 30;

function BrandMark() {
  return (
    <div className="flex items-center gap-3" data-testid="brand-mark">
      <div className="grid size-10 place-items-center rounded-[13px] bg-secondary text-accent shadow-[0_5px_0_hsl(var(--accent))]">
        <Zap className="size-5 fill-current" strokeWidth={2.5} />
      </div>
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Knowledge check</p>
        <p className="text-lg font-bold leading-none tracking-[-0.04em] text-secondary">Quickfire</p>
      </div>
    </div>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="quiz-shell flex flex-col">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12" data-testid="start-header">
        <BrandMark />
        <div className="hidden items-center gap-2 rounded-full border border-card-border bg-card/70 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground sm:flex">
          <span className="size-2 rounded-full bg-primary" />
          10 questions · 5 minutes
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-12 lg:pb-24 lg:pt-10">
        <div className="animate-rise-in max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-accent/20 px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">
            <Sparkles className="size-3.5 text-accent" />
            Take a quick lap around your brain
          </div>
          <h1 className="max-w-xl text-[clamp(3.4rem,8vw,6.8rem)] font-bold leading-[0.91] tracking-[-0.075em] text-secondary">
            Ready to<br /><span className="text-primary">spark?</span>
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Ten general-knowledge questions. Thirty seconds each. No pressure — just a bright little challenge to see what sticks.
          </p>
          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onStart}
              className="button-lift inline-flex items-center gap-3 rounded-2xl bg-secondary px-6 py-4 text-base font-bold text-secondary-foreground shadow-[0_6px_0_hsl(var(--accent))] transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/40"
              data-testid="button-start-quiz"
            >
              Start the quiz
              <ArrowRight className="size-5" />
            </button>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">One question at a time</span>
          </div>
        </div>

        <div className="relative animate-soft-pop lg:justify-self-end">
          <div className="absolute -right-4 -top-5 h-24 w-24 rounded-full border-[14px] border-accent/30 sm:-right-7 sm:-top-8" />
          <div className="absolute -bottom-7 -left-6 h-20 w-20 rounded-[24px] border-2 border-primary/35 sm:-left-9" />
          <div className="relative max-w-md rounded-[2rem] border border-card-border bg-card p-5 shadow-[var(--shadow-lift)] sm:p-7">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Question 01 / 10</p>
                <p className="mt-2 text-sm font-bold text-secondary">Warm-up round</p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-accent/20 px-3 py-2 font-mono text-xs font-bold text-secondary">
                <Clock3 className="size-3.5 text-accent" /> 00:30
              </div>
            </div>
            <p className="mt-7 text-xl font-bold leading-snug tracking-[-0.03em] text-secondary sm:text-2xl">Which planet is often called the Red Planet?</p>
            <div className="mt-7 grid gap-3">
              {['Venus', 'Jupiter', 'Mars', 'Mercury'].map((option, index) => (
                <div key={option} className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 ${index === 2 ? 'border-primary bg-primary/10' : 'border-border bg-background/60'}`}>
                  <span className={`grid size-7 shrink-0 place-items-center rounded-lg font-mono text-xs font-bold ${index === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{LETTERS[index]}</span>
                  <span className="text-sm font-semibold text-secondary">{option}</span>
                  {index === 2 && <Check className="ml-auto size-4 text-primary" />}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map((item) => <span key={item} className={`h-1.5 rounded-full ${item === 0 ? 'w-7 bg-primary' : 'w-1.5 bg-muted'}`} />)}
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Keep going</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl flex-wrap gap-x-8 gap-y-3 px-5 pb-7 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-muted-foreground sm:px-8 lg:px-12">
        <span>Fast feedback</span><span>•</span><span>Friendly stakes</span><span>•</span><span>Built for curious minds</span>
      </footer>
    </main>
  );
}

function Timer({ timeLeft }: { timeLeft: number }) {
  const urgent = timeLeft <= 8;
  return (
    <div className={`flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-sm font-bold ${urgent ? 'border-destructive/40 bg-destructive/10 text-destructive timer-pulse' : 'border-accent/30 bg-accent/15 text-secondary'}`} aria-live="polite" data-testid="status-timer">
      <Clock3 className="size-4" />
      <span>{`00:${String(timeLeft).padStart(2, '0')}`}</span>
    </div>
  );
}

function QuizScreen({
  question,
  currentIndex,
  total,
  timeLeft,
  selectedOption,
  response,
  onSelect,
  onSubmit,
  onNext,
  onPrevious,
}: {
  question: QuizQuestion;
  currentIndex: number;
  total: number;
  timeLeft: number;
  selectedOption: number | null;
  response: Response | null;
  onSelect: (index: number) => void;
  onSubmit: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const submitted = Boolean(response);
  const progress = ((currentIndex + 1) / total) * 100;
  const optionState = (index: number) => {
    if (!response) return selectedOption === index ? 'selected' : '';
    if (index === question.correctAnswer) return 'correct';
    if (index === response.selected) return 'incorrect';
    return '';
  };

  return (
    <main className="quiz-shell min-h-[100dvh]">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-6 sm:px-8 lg:py-8" data-testid="quiz-header">
        <BrandMark />
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-muted-foreground sm:block">Time left</span>
          <Timer timeLeft={timeLeft} />
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-5 pb-10 sm:px-8 sm:pb-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-primary" data-testid="text-question-number">Question {String(currentIndex + 1).padStart(2, '0')} <span className="text-muted-foreground">/ {String(total).padStart(2, '0')}</span></p>
            <div className="mt-4 h-1.5 w-44 rounded-full question-progress sm:w-64" aria-label={`${currentIndex + 1} of ${total} questions`}><span style={{ width: `${progress}%` }} /></div>
          </div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{submitted ? 'Answer locked' : 'Choose one'}</p>
        </div>

        <section className="animate-rise-in rounded-[1.7rem] border border-card-border bg-card p-5 shadow-[var(--shadow-soft)] sm:rounded-[2rem] sm:p-9 lg:p-12" aria-labelledby="question-heading" data-testid={`card-question-${question.id}`}>
          <div className="flex items-start justify-between gap-5">
            <h1 id="question-heading" className="max-w-3xl text-[clamp(1.7rem,4vw,3.2rem)] font-bold leading-[1.06] tracking-[-0.055em] text-secondary" data-testid="text-question">{question.question}</h1>
            <span className="hidden rounded-xl bg-muted px-3 py-2 font-mono text-xs font-bold text-muted-foreground sm:block">+ 1 point</span>
          </div>

          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2">
            {question.options.map((option, index) => {
              const state = optionState(index);
              const stateClass = state === 'selected'
                ? 'border-primary bg-primary/10 shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]'
                : state === 'correct'
                  ? 'border-primary bg-primary/12'
                  : state === 'incorrect'
                    ? 'border-destructive bg-destructive/10'
                    : 'border-border bg-background/45 hover:bg-primary/5';
              return (
                <button
                  key={option}
                  type="button"
                  disabled={submitted}
                  onClick={() => onSelect(index)}
                  className={`answer-option quiz-focus group flex min-h-[76px] items-center gap-4 rounded-2xl border p-4 text-left disabled:cursor-default sm:min-h-[88px] sm:p-5 ${stateClass}`}
                  data-testid={`button-option-${index}`}
                  aria-pressed={selectedOption === index}
                >
                  <span className={`grid size-9 shrink-0 place-items-center rounded-xl font-mono text-sm font-bold transition-colors ${state === 'selected' || state === 'correct' ? 'bg-primary text-primary-foreground' : state === 'incorrect' ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary'}`}>
                    {state === 'correct' ? <Check className="size-4" /> : state === 'incorrect' ? <X className="size-4" /> : LETTERS[index]}
                  </span>
                  <span className="text-sm font-semibold leading-snug text-secondary sm:text-base">{option}</span>
                  {state === 'correct' && <span className="ml-auto font-mono text-[10px] font-bold uppercase tracking-wider text-primary">Correct</span>}
                  {state === 'incorrect' && <span className="ml-auto font-mono text-[10px] font-bold uppercase tracking-wider text-destructive">Not quite</span>}
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className={`mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold animate-soft-pop ${response?.outcome === 'correct' ? 'bg-primary/10 text-primary' : response?.outcome === 'unanswered' ? 'bg-accent/15 text-secondary' : 'bg-destructive/10 text-destructive'}`} role="status" data-testid="status-answer-feedback">
              {response?.outcome === 'correct' ? <CheckCircle2 className="size-5 shrink-0" /> : response?.outcome === 'unanswered' ? <Clock3 className="size-5 shrink-0" /> : <X className="size-5 shrink-0" />}
              <span>{response?.outcome === 'correct' ? 'Nice work. That one landed.' : response?.outcome === 'unanswered' ? 'Time is up. The next question is ready.' : `The answer was ${question.options[question.correctAnswer]}. Keep the momentum.`}</span>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={onPrevious} disabled={currentIndex === 0} className="quiz-focus inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-secondary disabled:cursor-not-allowed disabled:opacity-35" data-testid="button-previous">
              <ArrowLeft className="size-4" /> Previous
            </button>
            {!submitted ? (
              <button type="button" onClick={onSubmit} disabled={selectedOption === null} className="button-lift quiz-focus inline-flex items-center justify-center gap-3 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-[0_5px_0_hsl(var(--secondary))] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none" data-testid="button-submit-answer">
                Lock in answer <Check className="size-4" />
              </button>
            ) : (
              <button type="button" onClick={onNext} className="button-lift quiz-focus inline-flex items-center justify-center gap-3 rounded-xl bg-secondary px-5 py-3.5 text-sm font-bold text-secondary-foreground shadow-[0_5px_0_hsl(var(--accent))]" data-testid="button-next-question">
                {currentIndex === total - 1 ? 'See my results' : 'Next question'} <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function ResultsScreen({ responses, onRestart }: { responses: Array<Response | null>; onRestart: () => void }) {
  const total = quizQuestions.length;
  const correct = responses.filter((item) => item?.outcome === 'correct').length;
  const incorrect = responses.filter((item) => item?.outcome === 'incorrect').length;
  const unanswered = responses.filter((item) => item?.outcome === 'unanswered' || !item).length;
  const percentage = Math.round((correct / total) * 100);
  const message = percentage >= 80 ? 'That was a strong run.' : percentage >= 50 ? 'Good instincts. You are building range.' : 'Every question gave you something useful.';

  return (
    <main className="quiz-shell min-h-[100dvh]">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-6 sm:px-8 lg:py-8">
        <BrandMark />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Round complete</span>
      </header>
      <section className="mx-auto w-full max-w-4xl px-5 pb-16 pt-8 sm:px-8 sm:pt-14">
        <div className="animate-rise-in text-center">
          <div className="mx-auto mb-7 grid size-16 place-items-center rounded-[22px] bg-accent/20 text-accent">
            <Sparkles className="size-8" />
          </div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-primary">You made it through</p>
          <h1 className="mt-4 text-[clamp(3rem,8vw,6rem)] font-bold leading-none tracking-[-0.08em] text-secondary" data-testid="text-results-title">Bright work.</h1>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-muted-foreground" data-testid="text-results-message">{message}</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-[0.8fr_1.2fr] sm:items-stretch">
          <div className="animate-soft-pop flex flex-col items-center justify-center rounded-[1.7rem] border border-card-border bg-secondary p-8 text-center text-secondary-foreground shadow-[var(--shadow-lift)]">
            <div className="relative grid size-44 place-items-center rounded-full" style={{ background: `conic-gradient(hsl(var(--accent)) ${percentage}%, hsl(245 22% 38%) 0)` }}>
              <div className="grid size-36 place-items-center rounded-full bg-secondary">
                <div>
                  <p className="font-mono text-4xl font-bold tracking-[-0.08em] text-accent" data-testid="text-score-percentage">{percentage}%</p>
                  <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-secondary-foreground/65">score</p>
                </div>
              </div>
            </div>
            <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.14em] text-secondary-foreground/65" data-testid="text-score-fraction">{correct} / {total} correct</p>
          </div>

          <div className="animate-soft-pop rounded-[1.7rem] border border-card-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8" style={{ animationDelay: '100ms' }}>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Your breakdown</p>
            <div className="mt-5 divide-y divide-border">
              <div className="flex items-center justify-between py-4 first:pt-0">
                <div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground"><span className="font-mono text-xs font-bold">#</span></span><span className="font-semibold text-secondary">Total questions</span></div>
                <span className="font-mono text-lg font-bold text-secondary" data-testid="text-total-count">{total}</span>
              </div>
              <div className="flex items-center justify-between py-4 first:pt-0">
                <div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-primary/12 text-primary"><Check className="size-4" /></span><span className="font-semibold text-secondary">Correct</span></div>
                <span className="font-mono text-lg font-bold text-primary" data-testid="text-correct-count">{correct}</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-destructive/10 text-destructive"><X className="size-4" /></span><span className="font-semibold text-secondary">Incorrect</span></div>
                <span className="font-mono text-lg font-bold text-destructive" data-testid="text-incorrect-count">{incorrect}</span>
              </div>
              <div className="flex items-center justify-between py-4 last:pb-0">
                <div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-accent/20 text-secondary"><Clock3 className="size-4" /></span><span className="font-semibold text-secondary">Unanswered</span></div>
                <span className="font-mono text-lg font-bold text-secondary" data-testid="text-unanswered-count">{unanswered}</span>
              </div>
            </div>
            <button type="button" onClick={onRestart} className="button-lift quiz-focus mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-[0_5px_0_hsl(var(--secondary))]" data-testid="button-restart-quiz">
              <RotateCcw className="size-4" /> Restart quiz
            </button>
          </div>
        </div>
        <p className="mt-8 text-center font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Different result, same curious you.</p>
      </section>
    </main>
  );
}

export default function QuizExperience() {
  const [screen, setScreen] = useState<Screen>('start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [responses, setResponses] = useState<Array<Response | null>>(() => Array(quizQuestions.length).fill(null));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = quizQuestions[currentIndex];
  const response = responses[currentIndex];

  const startQuiz = () => {
    setResponses(Array(quizQuestions.length).fill(null));
    setCurrentIndex(0);
    setSelectedOption(null);
    setTimeLeft(QUESTION_TIME);
    setScreen('quiz');
  };

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= quizQuestions.length) return;
    const nextResponse = responses[index];
    setCurrentIndex(index);
    setSelectedOption(nextResponse?.selected ?? null);
    setTimeLeft(nextResponse ? 0 : QUESTION_TIME);
  };

  const submitAnswer = () => {
    if (selectedOption === null || response) return;
    const outcome: Response['outcome'] = selectedOption === question.correctAnswer ? 'correct' : 'incorrect';
    setResponses((previous) => {
      const next = [...previous];
      next[currentIndex] = { selected: selectedOption, outcome };
      return next;
    });
  };

  const advance = () => {
    if (!responses[currentIndex]) return;
    if (currentIndex === quizQuestions.length - 1) {
      setScreen('results');
      return;
    }
    goToQuestion(currentIndex + 1);
  };

  const timeoutQuestion = () => {
    if (response) return;
    setSelectedOption(null);
    setResponses((previous) => {
      if (previous[currentIndex]) return previous;
      const next = [...previous];
      next[currentIndex] = { selected: null, outcome: 'unanswered' };
      return next;
    });
  };

  useEffect(() => {
    if (screen !== 'quiz' || response || timeLeft <= 0) return;
    const interval = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(interval);
          timeoutQuestion();
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [screen, currentIndex, response, timeLeft, timeoutQuestion]);

  useEffect(() => {
    if (screen !== 'quiz' || response?.outcome !== 'unanswered') return;
    timeoutRef.current = setTimeout(() => {
      if (currentIndex < quizQuestions.length - 1) {
        goToQuestion(currentIndex + 1);
      } else {
        setScreen('results');
      }
    }, 850);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [screen, response, currentIndex]);

  const safeResponses = useMemo(() => responses, [responses]);

  if (screen === 'start') return <StartScreen onStart={startQuiz} />;
  if (screen === 'results') return <ResultsScreen responses={safeResponses} onRestart={startQuiz} />;
  return (
    <QuizScreen
      question={question}
      currentIndex={currentIndex}
      total={quizQuestions.length}
      timeLeft={timeLeft}
      selectedOption={selectedOption}
      response={response}
      onSelect={(index) => { if (!response) setSelectedOption(index); }}
      onSubmit={submitAnswer}
      onNext={advance}
      onPrevious={() => goToQuestion(currentIndex - 1)}
    />
  );
}