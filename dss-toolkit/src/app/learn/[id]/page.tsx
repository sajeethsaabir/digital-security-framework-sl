'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

interface Step {
  id: number;
  step_number: number;
  title: string;
  content: string;
  action_type: string;
  action_url: string | null;
}

interface PathData {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  estimated_minutes: number;
  step_count: number;
  question_count: number;
}

export default function LearnPathPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, showAuthModal } = useAuth();
  const [path, setPath] = useState<PathData | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/learn/path-data?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPath(data.path);
        setSteps(data.steps);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    fetch(`/api/learn/progress`)
      .then((r) => r.json())
      .then((data) => {
        const prog = data.progress?.find((p: any) => p.path_id === Number(id));
        if (prog) {
          setCompletedSteps(prog.steps_completed || []);
        }
      })
      .catch(() => {});
  }, [user, id]);

  const markComplete = useCallback(async (stepId: number) => {
    if (!user) { showAuthModal(); return; }
    const newCompleted = completedSteps.includes(stepId)
      ? completedSteps
      : [...completedSteps, stepId];
    setCompletedSteps(newCompleted);

    await fetch('/api/learn/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pathId: Number(id), stepsCompleted: newCompleted }),
    });
  }, [user, showAuthModal, completedSteps, id]);

  const advanceStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep, steps]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-800 rounded w-1/3" />
          <div className="h-4 bg-slate-800 rounded w-2/3" />
          <div className="h-40 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  if (!path || steps.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <p className="text-slate-500">Learning path not found.</p>
        <Link href="/learn" className="text-purple-400 hover:text-purple-300 text-sm mt-2 inline-block">
          Back to Learning Center
        </Link>
      </div>
    );
  }

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const progressPct = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/learn" className="text-xs text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1 mb-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Learning Center
        </Link>
        <h1 className="text-lg lg:text-xl font-bold text-slate-100">{path.title}</h1>
        <p className="text-xs text-slate-500 mt-1">{path.description}</p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Step indicator dots */}
      <div className="flex gap-1.5 mb-6">
        {steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrentStep(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentStep
                ? 'w-8 bg-purple-400'
                : completedSteps.includes(s.id)
                  ? 'w-2 bg-green-500/60'
                  : 'w-2 bg-slate-700 hover:bg-slate-600'
            }`}
            title={s.title}
          />
        ))}
      </div>

      {/* Step card */}
      <div className="relative p-6 lg:p-8 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/40 via-slate-900/40 to-slate-800/40 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-[10px] font-mono text-purple-400 border border-purple-500/20">
              Step {step.step_number}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${
              step.action_type === 'quiz' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
              step.action_type === 'practice' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
              'bg-slate-800 text-slate-500 border-slate-700'
            }`}>
              {step.action_type === 'quiz' ? 'Quiz' : step.action_type === 'practice' ? 'Hands-On' : 'Learn'}
            </span>
          </div>

          <h2 className="text-lg lg:text-xl font-bold text-slate-100 mb-3">{step.title}</h2>

          <div className="text-sm text-slate-400 leading-relaxed mb-6 whitespace-pre-line">
            {step.content}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {step.action_type === 'quiz' && (
              <button
                onClick={() => router.push(`/learn/quiz/${id}`)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 text-yellow-300 text-sm border border-yellow-500/20 hover:bg-yellow-500/20 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Quiz
              </button>
            )}

            {step.action_type === 'practice' && step.action_url && (
              <a href={step.action_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-300 text-sm border border-green-500/20 hover:bg-green-500/20 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open Tool
              </a>
            )}

            <button
              onClick={() => markComplete(step.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-all ${
                completedSteps.includes(step.id)
                  ? 'bg-green-500/10 text-green-300 border-green-500/20'
                  : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20 hover:bg-cyan-500/20'
              }`}
            >
              {completedSteps.includes(step.id) ? (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg> Completed</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg> Mark Complete</>
              )}
            </button>

            {/* Link to related section content */}
            {path && (
              <Link href={`/sections/${id}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-sm border border-slate-700 hover:text-slate-300 hover:border-slate-600 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Read Full Section
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 rounded-xl bg-slate-800 text-sm text-slate-400 border border-slate-700 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>

        {isLastStep ? (
          <button
            onClick={() => router.push(`/learn/quiz/${id}`)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-sm text-white font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            Take Final Quiz
          </button>
        ) : (
          <button
            onClick={advanceStep}
            className="px-5 py-2 rounded-xl bg-slate-800 text-sm text-slate-300 border border-slate-700 hover:text-slate-100 hover:border-purple-500/30 transition-all"
          >
            Next Step
          </button>
        )}
      </div>
    </div>
  );
}
