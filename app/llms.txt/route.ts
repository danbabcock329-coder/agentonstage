import { getAll, SITE_URL, CATEGORIES } from "@/lib/content";
export const dynamic = "force-static";
export function GET() {
  const all = getAll();
  const known = new Set<string>(CATEGORIES);
  const extra = [...new Set(all.map((useCase) => useCase.category).filter((category) => !known.has(category)))];
  const sections = [...CATEGORIES, ...extra];
  const txt = `# AgentOnStage\n\n> A directory of AI agent use cases for live events and stage tech: show control, LED/video, audio (incl. Behringer X32), lighting, TouchDesigner and production ops.\n\nJSON: ${SITE_URL}/api/use-cases.json\n\n` + sections.map((category) => `## ${category}\n\n` + all.filter((useCase) => useCase.category === category).map((useCase) => `- [${useCase.title}](${SITE_URL}/use-cases/${useCase.slug}): ${useCase.summary}`).join("\n")).join("\n\n") + "\n";
  return new Response(txt, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
