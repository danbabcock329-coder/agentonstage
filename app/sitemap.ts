import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { getAll, SITE_URL } from "@/lib/content";

const STATIC_PAGES: { file: string; path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { file: "app/page.tsx", path: "", priority: 1, changeFrequency: "weekly" },
  { file: "app/submit/page.tsx", path: "/submit", priority: 0.4, changeFrequency: "monthly" },
  { file: "app/sponsor/page.tsx", path: "/sponsor", priority: 0.3, changeFrequency: "monthly" },
];

function latestCommitDates(): Map<string, Date> {
  const dates = new Map<string, Date>();
  try {
    const out = execFileSync("git", ["log", "--pretty=format:COMMIT %cI", "--name-only"], {
      cwd: process.cwd(),
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
    let current: Date | null = null;
    for (const line of out.split("\n")) {
      if (line.startsWith("COMMIT ")) {
        const parsed = new Date(line.slice("COMMIT ".length).trim());
        current = Number.isNaN(parsed.getTime()) ? null : parsed;
        continue;
      }
      if (!line.trim() || !current || dates.has(line)) continue;
      dates.set(line, current);
    }
  } catch {
    // Fall back to file mtimes when git history is unavailable.
  }
  return dates;
}

function modified(dates: Map<string, Date>, rel: string): Date | undefined {
  const fromGit = dates.get(rel);
  if (fromGit) return fromGit;
  const abs = path.join(process.cwd(), rel);
  if (fs.existsSync(abs)) return fs.statSync(abs).mtime;
  return undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const dates = latestCommitDates();
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => {
    const lastModified = modified(dates, page.file);
    return {
      url: `${SITE_URL}${page.path}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    };
  });
  const useCases: MetadataRoute.Sitemap = getAll().map((useCase) => {
    const lastModified = modified(dates, `content/use-cases/${useCase.slug}.md`);
    return {
      url: `${SITE_URL}/use-cases/${useCase.slug}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });
  const newest = useCases.reduce<Date | undefined>((max, entry) => {
    const stamp = entry.lastModified;
    if (!(stamp instanceof Date)) return max;
    if (!max || stamp > max) return stamp;
    return max;
  }, undefined);
  const generated: MetadataRoute.Sitemap = [
    { file: "app/llms.txt/route.ts", path: "/llms.txt", priority: 0.3 },
    { file: "app/feed.json/route.ts", path: "/feed.json", priority: 0.5 },
  ].map((page) => {
    const lastModified = newest ?? modified(dates, page.file);
    return {
      url: `${SITE_URL}${page.path}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "weekly" as const,
      priority: page.priority,
    };
  });
  return [...staticEntries, ...generated, ...useCases];
}
