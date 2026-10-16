import "./globals.css";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/content";
import Newsletter from "@/components/Newsletter";
import { Analytics } from "@vercel/analytics/next";
export const metadata: Metadata = { metadataBase:new URL(SITE_URL), title:{default:"AgentOnStage: AI agent use cases for live events",template:"%s | AgentOnStage"}, description:"A directory of AI agent use cases for show control, LED/video, audio, lighting, TouchDesigner and production ops.",
  openGraph:{type:"website",siteName:"AgentOnStage",title:"AgentOnStage: AI agent use cases for live events",description:"A directory of AI agent use cases for show control, LED/video, audio, lighting, TouchDesigner and production ops."},
  twitter:{card:"summary"} };
export default function RootLayout({children}:{children:React.ReactNode}){
  return (<html lang="en"><body>
    <nav><a href="/"><strong>AgentOnStage</strong></a><a href="/submit">Submit</a><a href="/sponsor">Sponsor</a><a href="/llms.txt">llms.txt</a></nav>
    <main>{children}</main><Newsletter/><Analytics/><footer><small>© AgentOnStage. Each entry links to its original source. Labels mark commercial products and experimental tools.</small></footer>
  </body></html>);
}
