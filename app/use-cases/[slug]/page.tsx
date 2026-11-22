import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAll, getOne, toHtml, steps, faqs, SITE_URL, FEED_PATH, categoryPath, relatedEntries } from "@/lib/content";
export const dynamicParams=false;
export function generateStaticParams(){ return getAll().map(u=>({slug:u.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const u=getOne((await params).slug); if(!u) return {};
  const path=`/use-cases/${u.slug}`;
  return {title:u.title,description:u.summary,keywords:[u.category,...u.tools],alternates:{canonical:path,types:{"application/feed+json":FEED_PATH}},
    openGraph:{type:"article",url:path,title:u.title,description:u.summary,siteName:"AgentOnStage"},
    twitter:{card:"summary_large_image",title:u.title,description:u.summary}};
}
export default async function Page({params}:{params:Promise<{slug:string}>}){
  const u=getOne((await params).slug); if(!u) notFound();
  const url=`${SITE_URL}/use-cases/${u.slug}`;
  const st=steps(u.body), fq=faqs(u.body);
  const hub=categoryPath(u.category);
  const related=relatedEntries(u);
  const ld:object[]=[{"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[
    {"@type":"ListItem",position:1,name:"Home",item:SITE_URL},
    {"@type":"ListItem",position:2,name:u.category,item:`${SITE_URL}${hub}`},
    {"@type":"ListItem",position:3,name:u.title,item:url},
  ]}];
  if(st.length) ld.push({"@context":"https://schema.org","@type":"HowTo",name:u.title,description:u.summary,url,tool:u.tools.map(t=>({"@type":"HowToTool",name:t})),step:st.map((s,i)=>({"@type":"HowToStep",position:i+1,text:s}))});
  if(fq.length) ld.push({"@context":"https://schema.org","@type":"FAQPage",mainEntity:fq.map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))});
  return (<article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld).replace(/</g,"\\u003c")}}/>
    <nav className="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span aria-hidden="true">/</span> <a href={hub}>{u.category}</a> <span aria-hidden="true">/</span> <span>{u.title}</span></nav>
    <h1>{u.title}</h1>
    <p className="tldr"><strong>TL;DR.</strong>{` ${u.summary}`}</p>
    {(u.labels||[]).length>0&&<p className="notice">{u.labels!.includes("Commercial product")&&"This is a commercial product. AgentOnStage isn't paid for this listing. "}{u.labels!.includes("Experimental")&&"This tool is experimental or a prototype. Don't use it on a live show without testing."}</p>}
    {u.tested_on_rig&&<p className="notice tested"><span className="tag tested-badge">Tested on a real rig</span> Tested {u.tested_on_rig} on {u.rig}. <a href="/tested">All rig tests</a></p>}
    <p>{(u.labels||[]).map(l=><span className="tag label" key={l}>{l}</span>)}<a className="tag" href={hub}>{u.category}</a><a className="tag" href={`/?q=${encodeURIComponent(u.difficulty)}`}>{u.difficulty}</a>{u.tools.map(t=><a className="tag" key={t} href={`/?q=${encodeURIComponent(t)}`}>{t}</a>)}</p>
    <div dangerouslySetInnerHTML={{__html:toHtml(u.body)}}/>
    {related.length>0&&<section><h2>Also on this rig</h2><ul className="related">{related.map(item=><li key={item.slug}><a href={`/use-cases/${item.slug}`}>{item.title}</a></li>)}</ul></section>}
    {(u.rig_photos||[]).length>0&&<section><h2>Photos from the rig</h2><div className="gallery">{u.rig_photos!.map(ph=><figure key={ph.src}><a href={ph.src}><img src={ph.src} alt={ph.alt} loading="lazy"/></a>{ph.caption&&<figcaption>{ph.caption}</figcaption>}</figure>)}</div></section>}
    <p>Original source: <a href={u.source_url} rel="nofollow noopener">{u.source_url}</a></p>
  </article>);
}
