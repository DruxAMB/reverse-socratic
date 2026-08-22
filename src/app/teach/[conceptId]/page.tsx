import { notFound } from "next/navigation";
import { getConcept, concepts } from "@/lib/concepts";
import TeachingView from "./teaching-view";

export function generateStaticParams() {
  return concepts.map((c) => ({ conceptId: c.id }));
}

export default async function TeachPage({
  params,
}: {
  params: Promise<{ conceptId: string }>;
}) {
  const { conceptId } = await params;
  const concept = getConcept(conceptId);
  if (!concept) notFound();

  return <TeachingView concept={concept} />;
}
