import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

export type FileDates = { published?: Date; modified?: Date };

/** First and latest commit dates for the given repo-relative paths. Falls back to mtime. */
export function gitFileDates(paths: string[]): Map<string, FileDates> {
  const result = new Map<string, FileDates>();
  for (const rel of paths) result.set(rel, {});
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
      if (!line.trim() || !current || !result.has(line)) continue;
      const entry = result.get(line)!;
      if (!entry.modified) entry.modified = current;
      entry.published = current;
    }
  } catch {
    // Fall back to file mtimes when git history is unavailable.
  }
  for (const [rel, entry] of result) {
    if (entry.published && entry.modified) continue;
    const abs = path.join(process.cwd(), rel);
    if (!fs.existsSync(abs)) continue;
    const mtime = fs.statSync(abs).mtime;
    if (!entry.published) entry.published = mtime;
    if (!entry.modified) entry.modified = mtime;
  }
  return result;
}
