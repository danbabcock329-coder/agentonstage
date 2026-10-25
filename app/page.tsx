import Directory from "@/components/Directory";
import { getAll, CATEGORIES, FEED_PATH, SITE_URL } from "@/lib/content";
const title="AgentOnStage: AI agent use cases for live events";
const description="A directory of AI agent use cases for show control, LED/video, audio, lighting, TouchDesigner and production ops.";
export const metadata={title:{absolute:title},description,alternates:{canonical:"/",types:{"application/feed+json":FEED_PATH}},openGraph:{type:"website",siteName:"AgentOnStage",url:"/",title,description},twitter:{card:"summary",title,description}};
export default function Home(){
  const all=getAll();
  const items=all.map(({body,source_url,...u})=>u);
  const ld={"@context":"https://schema.org","@type":"CollectionPage",name:title,description,url:SITE_URL,mainEntity:{"@type":"ItemList",numberOfItems:all.length,itemListElement:all.map((useCase,index)=>({"@type":"ListItem",position:index+1,name:useCase.title,url:`${SITE_URL}/use-cases/${useCase.slug}`}))}};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld).replace(/</g,"\\u003c")}}/><h1>AI agent use cases for live events and stage tech</h1>
    <p>Real tools and workflows for show control, LED/video, audio, lighting, TouchDesigner and production ops.</p>
    <Directory items={items} categories={CATEGORIES}/></>);
}
