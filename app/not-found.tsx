import type { Metadata } from "next";
import { FEED_PATH } from "@/lib/content";

const title = "Page not found";
const description = "That address is not in the AgentOnStage directory. Browse the use cases from the home page.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  alternates: { types: { "application/feed+json": FEED_PATH } },
  openGraph: { type: "website", title, description, siteName: "AgentOnStage" },
  twitter: { card: "summary", title, description },
};

export default function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p>That address is not in the directory. <a href="/">Back to all use cases</a>.</p>
    </>
  );
}
