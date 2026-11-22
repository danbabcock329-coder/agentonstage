import type { Metadata } from "next";
import StackBuilder from "@/components/StackBuilder";
import { FEED_PATH, getAll } from "@/lib/content";
import { rigCards, rigSlots } from "@/lib/rig";

const title="Build a stack";
const description="Pick a lighting desk, video switcher, and audio console and see the AgentOnStage use cases that match, with protocol notes.";
export const metadata: Metadata={title,description,alternates:{canonical:"/rig",types:{"application/feed+json":FEED_PATH}},openGraph:{type:"website",siteName:"AgentOnStage",url:"/rig",title,description},twitter:{card:"summary_large_image",title,description}};

export default function RigPage(){
  const all=getAll();
  return (<>
    <h1>Build a stack</h1>
    <p>Pick a lighting desk, a video switcher, and an audio console. Companion, QLab, and a media server or TouchDesigner are optional. Matches are the use cases whose tool tags include what you picked.</p>
    <p className="notice">Test on a non-show rig first.</p>
    <StackBuilder slots={rigSlots(all)} cards={rigCards(all)}/>
  </>);
}
