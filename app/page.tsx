import Directory from "@/components/Directory";
import { getAll, CATEGORIES } from "@/lib/content";
export default function Home(){
  const items=getAll().map(({body,source_url,...u})=>u);
  return (<><h1>AI agent use cases for live events and stage tech</h1>
    <p>Real tools and workflows for show control, LED/video, audio, lighting, TouchDesigner and production ops.</p>
    <Directory items={items} categories={CATEGORIES}/></>);
}
