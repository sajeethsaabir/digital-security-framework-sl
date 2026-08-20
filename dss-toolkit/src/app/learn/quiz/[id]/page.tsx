'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export default function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, showAuthModal } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; passed: boolean; results: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/learn/quiz-data?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(null));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const selectAnswer = (qIndex: number, optIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optIndex;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!user) { showAuthModal(); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/learn/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathId: Number(id), answers }),
      });
      const data = await res.json();
      setResult(data);
      setSubmitted(true);
    } catch {
      // ignore
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-800 rounded w-1/3" />
          <div className="h-4 bg-slate-800 rounded w-2/3" />
          {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-slate-800 rounded" />)}
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-slate-500">No questions for this path.</p>
        <Link href="/learn" className="text-purple-400 text-sm mt-2 inline-block">Back to Learning</Link>
      </div>
    );
  }

  const allAnswered = answers.every((a) => a !== null);

  return (
    <div className="max-w-3xl mx-auto">
      <Link href={`/learn/${id}`} className="text-xs text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1 mb-4">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Learning Path
      </Link>

      {submitted && result ? (
        /* Results view */
        <div className="space-y-6">
          <div className={`relative p-6 lg:p-8 rounded-2xl border overflow-hidden ${
            result.passed ? 'border-green-500/30 bg-gradient-to-br from-green-500/10 via-slate-900/40 to-slate-800/40' :
            'border-red-500/30 bg-gradient-to-br from-red-500/10 via-slate-900/40 to-slate-800/40'
          }`}>
            <div className="relative text-center">
              <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                result.passed ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {result.passed ? (
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h2 className={`text-xl font-bold mb-1 ${result.passed ? 'text-green-300' : 'text-red-300'}`}>
                {result.passed ? 'Congratulations!' : 'Keep Learning'}
              </h2>
              <p className="text-sm text-slate-400 mb-3">
                You scored {result.score} out of {result.total} ({Math.round((result.score / result.total) * 100)}%)
              </p>
              {result.passed ? (
                <p className="text-xs text-green-400/80">You passed! You can now move to the next learning path.</p>
              ) : (
                <p className="text-xs text-red-400/80">You need at least 70% to pass. Review the material and try again.</p>
              )}
            </div>
          </div>

          {/* Question review */}
          <div className="space-y-3">
            {questions.map((q, i) => {
              const r = result.results[i];
              const isCorrect = r?.correct;
              return (
                <div key={q.id} className={`p-4 rounded-xl border ${
                  isCorrect ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'
                }`}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <p className="text-sm text-slate-200">{q.question}</p>
                  </div>
                  <p className="text-xs text-slate-500 ml-7">Correct answer: <span className="text-green-400">{q.options[q.correct_index]}</span></p>
                  {q.explanation && (
                    <p className="text-xs text-slate-600 mt-1 ml-7 italic">{q.explanation}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            {!result.passed && (
              <button onClick={() => { setSubmitted(false); setAnswers(new Array(questions.length).fill(null)); setResult(null); }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-sm text-slate-300 border border-slate-700 hover:border-purple-500/30 transition-all">
                Retry Quiz
              </button>
            )}
            <button onClick={() => router.push(`/learn/${id}`)}
              className="px-4 py-2 rounded-xl bg-purple-500/10 text-sm text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all">
              {result.passed ? 'Continue Learning' : 'Back to Learning Path'}
            </button>
          </div>
        </div>
      ) : (
        /* Quiz view */
        <div>
          <div className="mb-6">
            <h1 className="text-lg lg:text-xl font-bold text-slate-100">Knowledge Check</h1>
            <p className="text-xs text-slate-500 mt-1">Answer all questions to test your understanding. You need 70% to pass.</p>
          </div>

          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={q.id} className="p-5 rounded-xl border border-slate-700/50 bg-slate-800/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center text-xs font-mono text-purple-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-slate-500">{answers[i] !== null ? 'Answered' : 'Not answered'}</span>
                </div>
                <p className="text-sm text-slate-200 mb-3">{q.question}</p>
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => selectAnswer(i, oi)}
                      className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${
                        answers[i] === oi
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-200'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <span className={"inline-block w-5 h-5 rounded-full border mr-2 text-center text-xs leading-5 shrink-0 " + (
                        answers[i] === oi ? 'border-purple-400 bg-purple-500/20' : 'border-slate-600'
                      )}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <span className="text-xs text-slate-600">
              {answers.filter((a) => a !== null).length} of {questions.length} answered
            </span>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-sm text-white font-medium hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? 'Submitting...' : `Submit Answers (${answers.filter((a) => a !== null).length}/${questions.length})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
