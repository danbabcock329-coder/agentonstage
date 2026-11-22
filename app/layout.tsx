import "./globals.css";
import type { Metadata, Viewport } from "next";
import { SITE_URL, FEED_PATH, getAll, toCues } from "@/lib/content";
import Newsletter from "@/components/Newsletter";
import GoButton from "@/components/GoButton";
import { Analytics } from "@vercel/analytics/next";
const description="Sourced AI agent use cases for live events: show control, LED/video, audio, lighting, TouchDesigner and production ops.";
export const viewport: Viewport = { themeColor: "#0b0d12" };
export const metadata: Metadata = { metadataBase:new URL(SITE_URL), title:{default:"AgentOnStage: AI agent use cases for live events",template:"%s | AgentOnStage"}, description,
  alternates:{types:{"application/feed+json":FEED_PATH}},
  openGraph:{type:"website",siteName:"AgentOnStage",title:"AgentOnStage: AI agent use cases for live events",description},
  twitter:{card:"summary_large_image",title:"AgentOnStage: AI agent use cases for live events",description} };
export default function RootLayout({children}:{children:React.ReactNode}){
  const cues=toCues(getAll());
  return (<html lang="en"><body>
    <nav><a href="/"><strong>AgentOnStage</strong></a><a href="/tested">Tested on a real rig</a><a href="/rig">Rig</a><GoButton cues={cues}/><a href="/submit">Submit</a><a href="/sponsor">Sponsor</a></nav>
    <main>{children}</main><Newsletter/><Analytics/><footer><small>© AgentOnStage. Each entry links to its original source. Labels mark commercial products and experimental tools.</small></footer>
  </body></html>);
}
