import { notFound } from "next/navigation";
import type { Metadata } from "next";
import GoButton from "@/components/GoButton";
import UseCaseCard from "@/components/UseCaseCard";
import { CATEGORY_HUBS, FEED_PATH, SITE_URL, cardFields, getAll, hubBySlug, toCues } from "@/lib/content";

export const dynamicParams=false;
export function generateStaticParams(){ return CATEGORY_HUBS.map(hub=>({hub:hub.slug})); }

export async function generateMetadata({params}:{params:Promise<{hub:string}>}):Promise<Metadata>{
  const hub=hubBySlug((await params).hub);
  if(!hub) return {};
  const title=`${hub.name} use cases`;
  const path=`/${hub.slug}`;
  return {title,description:hub.intro,alternates:{canonical:path,types:{"application/feed+json":FEED_PATH}},
    openGraph:{type:"website",url:path,title,description:hub.intro,siteName:"AgentOnStage"},
    twitter:{card:"summary_large_image",title,description:hub.intro}};
}

export default async function HubPage({params}:{params:Promise<{hub:string}>}){
  const hub=hubBySlug((await params).hub);
  if(!hub) notFound();
  const items=getAll().filter(useCase=>useCase.category===hub.name);
  const tested=items.filter(useCase=>useCase.tested_on_rig);
  const rest=items.filter(useCase=>!useCase.tested_on_rig);
  const ordered=[...tested,...rest];
  const url=`${SITE_URL}/${hub.slug}`;
  const title=`${hub.name} use cases`;
  const ld={"@context":"https://schema.org","@type":"CollectionPage",name:title,description:hub.intro,url,mainEntity:{"@type":"ItemList",numberOfItems:ordered.length,itemListElement:ordered.map((useCase,index)=>({"@type":"ListItem",position:index+1,name:useCase.title,url:`${SITE_URL}/use-cases/${useCase.slug}`}))}};
  return (<>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld).replace(/</g,"\\u003c")}}/>
    <header className="hero">
      <h1>{title}</h1>
      <p>{hub.intro}</p>
      <p>{items.length} use cases</p>
      <p className="hero-actions"><GoButton cues={toCues(items)} hub={hub.slug}/></p>
    </header>
    {tested.length>0&&<section>
      <h2>Tested on a real rig</h2>
      {tested.map(useCase=><UseCaseCard key={useCase.slug} item={cardFields(useCase)} showPhotos/>)}
    </section>}
    <section>
      {rest.map(useCase=><UseCaseCard key={useCase.slug} item={cardFields(useCase)}/>)}
    </section>
  </>);
}
