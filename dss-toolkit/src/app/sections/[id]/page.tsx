import { notFound } from 'next/navigation';
import { getSection, getSubsections, getContentBlocks, getSections } from '@/lib/db';
import SectionPage from '@/components/SectionPage';

export async function generateStaticParams() {
  const sections = await getSections();
  return sections.map((s: any) => ({ id: String(s.id) }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sectionId = parseInt(id, 10);
  if (isNaN(sectionId)) notFound();

  const section = await getSection(sectionId);
  if (!section) notFound();

  const subsections = await getSubsections(sectionId);
  const contentBlocks = await getContentBlocks(sectionId);

  return (
    <SectionPage
      section={section}
      subsections={subsections}
      contentBlocks={contentBlocks}
    />
  );
}
