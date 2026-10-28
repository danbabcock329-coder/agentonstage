import { getAll, SITE_URL, toHtml } from "@/lib/content";
import { gitFileDates } from "@/lib/git-dates";

export const dynamic = "force-static";

const DESCRIPTION = "Sourced AI agent use cases for live events: show control, LED/video, audio, lighting, TouchDesigner and production ops.";

export function GET() {
  const all = getAll();
  const dates = gitFileDates(all.map((useCase) => `content/use-cases/${useCase.slug}.md`));
  const items = all
    .map((useCase) => {
      const rel = `content/use-cases/${useCase.slug}.md`;
      const fileDates = dates.get(rel);
      const url = `${SITE_URL}/use-cases/${useCase.slug}`;
      return {
        id: url,
        url,
        title: useCase.title,
        summary: useCase.summary,
        content_html: toHtml(useCase.body),
        date_published: fileDates?.published?.toISOString(),
        date_modified: fileDates?.modified?.toISOString(),
        tags: [useCase.category, ...useCase.tools],
      };
    })
    .sort((a, b) => {
      const aTime = a.date_published ? Date.parse(a.date_published) : 0;
      const bTime = b.date_published ? Date.parse(b.date_published) : 0;
      if (bTime !== aTime) return bTime - aTime;
      return a.title.localeCompare(b.title);
    });

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "AgentOnStage",
    home_page_url: `${SITE_URL}/`,
    feed_url: `${SITE_URL}/feed.json`,
    description: DESCRIPTION,
    language: "en",
    items,
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  });
}
