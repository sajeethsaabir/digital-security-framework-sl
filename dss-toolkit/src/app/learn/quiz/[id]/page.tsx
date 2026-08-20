import { notFound } from 'next/navigation';
import { getLearningPaths, getQuizQuestions } from '@/lib/db';
import QuizClient from './QuizClient';

export async function generateStaticParams() {
  const paths = await getLearningPaths();
  return paths.map((p: any) => ({ id: String(p.id) }));
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pathId = parseInt(id, 10);
  if (isNaN(pathId)) notFound();

  const questions = await getQuizQuestions(pathId);

  return <QuizClient pathId={pathId} questions={questions} />;
}
