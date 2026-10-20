import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAll, getOne, toHtml, steps, faqs, SITE_URL, FEED_PATH } from "@/lib/content";
export const dynamicParams=false;
export function generateStaticParams(){ return getAll().map(u=>({slug:u.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const u=getOne((await params).slug); if(!u) return {};
  const path=`/use-cases/${u.slug}`;
  return {title:u.title,description:u.summary,keywords:[u.category,...u.tools],alternates:{canonical:path,types:{"application/feed+json":FEED_PATH}},
    openGraph:{type:"article",url:path,title:u.title,description:u.summary,siteName:"AgentOnStage"},
    twitter:{card:"summary",title:u.title,description:u.summary}};
}
export default async function Page({params}:{params:Promise<{slug:string}>}){
  const u=getOne((await params).slug); if(!u) notFound();
  const url=`${SITE_URL}/use-cases/${u.slug}`;
  const st=steps(u.body), fq=faqs(u.body);
  const ld:object[]=[{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"AgentOnStage",item:SITE_URL},{"@type":"ListItem",position:2,name:u.title,item:url}]}];
  if(st.length) ld.push({"@context":"https://schema.org","@type":"HowTo",name:u.title,description:u.summary,url,tool:u.tools.map(t=>({"@type":"HowToTool",name:t})),step:st.map((s,i)=>({"@type":"HowToStep",position:i+1,text:s}))});
  if(fq.length) ld.push({"@context":"https://schema.org","@type":"FAQPage",mainEntity:fq.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))});
  return (<article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld)}}/>
    <p><a href="/">← All use cases</a></p><h1>{u.title}</h1>
    {(u.labels||[]).length>0&&<p className="notice">{u.labels!.includes("Commercial product")&&"This is a commercial product. AgentOnStage isn't paid for this listing. "}{u.labels!.includes("Experimental")&&"This tool is experimental or a prototype. Don't use it on a live show without testing."}</p>}
    {u.tested_on_rig&&<p className="notice tested"><span className="tag tested-badge">Tested on a real rig</span> Tested {u.tested_on_rig} on {u.rig}. <a href="/tested">All rig tests</a></p>}
    <p>{(u.labels||[]).map(l=><span className="tag label" key={l}>{l}</span>)}<span className="tag">{u.category}</span><span className="tag">{u.difficulty}</span>{u.tools.map(t=><span className="tag" key={t}>{t}</span>)}</p>
    <div dangerouslySetInnerHTML={{__html:toHtml(u.body)}}/>
    {(u.rig_photos||[]).length>0&&<section><h2>Photos from the rig</h2><div className="gallery">{u.rig_photos!.map(ph=><figure key={ph.src}><a href={ph.src}><img src={ph.src} alt={ph.alt} loading="lazy"/></a>{ph.caption&&<figcaption>{ph.caption}</figcaption>}</figure>)}</div></section>}
    <p>Original source: <a href={u.source_url} rel="nofollow noopener">{u.source_url}</a></p>
  </article>);
}
