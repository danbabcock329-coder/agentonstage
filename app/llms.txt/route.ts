import { getAll, SITE_URL, CATEGORIES } from "@/lib/content";
export const dynamic="force-static";
export function GET(){
  const all=getAll();
  const txt=`# AgentOnStage\n\n> A directory of AI agent use cases for live events and stage tech: show control, LED/video, audio (incl. Behringer X32), lighting, TouchDesigner and production ops.\n\nJSON: ${SITE_URL}/api/use-cases.json\n\n`+CATEGORIES.map(c=>`## ${c}\n\n`+all.filter(u=>u.category===c).map(u=>`- [${u.title}](${SITE_URL}/use-cases/${u.slug}): ${u.summary}`).join("\n")).join("\n\n")+"\n";
  return new Response(txt,{headers:{"Content-Type":"text/plain; charset=utf-8"}});
}
