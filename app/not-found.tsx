import type { Metadata } from "next";
import { FEED_PATH } from "@/lib/content";

const title = "This AgentOnStage page was not found";
const description = "That address is not in the AgentOnStage directory. Go back to the home page and browse the use cases, or open a category hub to keep looking.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  alternates: { types: { "application/feed+json": FEED_PATH } },
  openGraph: { type: "website", title, description, siteName: "AgentOnStage" },
  twitter: { card: "summary_large_image", title, description },
};

export default function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p>That address is not in the directory. <a href="/">Back to all use cases</a>.</p>
    </>
  );
}
