import Directory from "@/components/Directory";
import GoButton from "@/components/GoButton";
import UseCaseCard from "@/components/UseCaseCard";
import { getAll, getTested, CATEGORY_HUBS, cardFields, toCues, newestEntries, FEED_PATH, SITE_URL } from "@/lib/content";
const title="AgentOnStage: AI agent use cases for live events";
const description="Sourced AI agent use cases for live events: show control, LED/video, audio, lighting, TouchDesigner and production ops.";
export const metadata={title:{absolute:title},description,alternates:{canonical:"/",types:{"application/feed+json":FEED_PATH}},openGraph:{type:"website",siteName:"AgentOnStage",url:"/",title,description},twitter:{card:"summary_large_image",title,description}};
export default function Home(){
  const all=getAll();
  const tested=getTested();
  const latest=newestEntries(all,12,tested.map(useCase=>useCase.slug));
  const featured=[...tested,...latest].slice(0,20);
  const counts=new Map<string,number>();
  for(const useCase of all) counts.set(useCase.category,(counts.get(useCase.category)??0)+1);
  const ld={"@context":"https://schema.org","@type":"CollectionPage",name:title,description,url:SITE_URL,mainEntity:{"@type":"ItemList",numberOfItems:featured.length,itemListElement:featured.map((useCase,index)=>({"@type":"ListItem",position:index+1,name:useCase.title,url:`${SITE_URL}/use-cases/${useCase.slug}`}))}};
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld).replace(/</g,"\\u003c")}}/>
    <header className="hero">
      <h1>AI agent use cases for live events and stage tech</h1>
      <p>Real tools and workflows for show control, LED/video, audio, lighting, TouchDesigner and production ops.</p>
      <p className="hero-actions"><GoButton cues={toCues(all)}/><a href="/rig">Build a stack</a></p>
    </header>
    <Directory items={all.map(cardFields)}>
      <section>
        <h2>Tested on a real rig</h2>
        <p>Run on the bench, with photos. <a href="/tested">All rig tests</a></p>
        {tested.map(useCase=><UseCaseCard key={useCase.slug} item={cardFields(useCase)} showPhotos/>)}
      </section>
      <section>
        <h2>Browse by category</h2>
        <div className="tiles">{CATEGORY_HUBS.map(hub=><a className="tile" key={hub.slug} href={`/${hub.slug}`}><strong>{hub.name}</strong><span>{counts.get(hub.name)??0} use cases</span></a>)}</div>
      </section>
      <section>
        <h2>Latest</h2>
        {latest.map(useCase=><UseCaseCard key={useCase.slug} item={cardFields(useCase)}/>)}
      </section>
    </Directory>
  </>);
}
