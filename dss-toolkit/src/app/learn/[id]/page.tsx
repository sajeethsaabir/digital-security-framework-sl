import { notFound } from 'next/navigation';
import { getLearningPath, getLearningSteps, getLearningPaths } from '@/lib/db';
import LearnPathClient from './LearnPathClient';

export async function generateStaticParams() {
  const paths = await getLearningPaths();
  return paths.map((p: any) => ({ id: String(p.id) }));
}

export default async function LearnPathPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pathId = parseInt(id, 10);
  if (isNaN(pathId)) notFound();

  const path = await getLearningPath(pathId);
  if (!path) notFound();

  const steps = await getLearningSteps(pathId);

  return <LearnPathClient path={path} steps={steps} />;
}
