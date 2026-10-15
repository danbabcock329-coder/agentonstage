import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAll, getOne, toHtml, steps, faqs, SITE_URL } from "@/lib/content";
export const dynamicParams=false;
export function generateStaticParams(){ return getAll().map(u=>({slug:u.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const u=getOne((await params).slug); return u?{title:u.title,description:u.summary,alternates:{canonical:`/use-cases/${u.slug}`}}:{};
}
export default async function Page({params}:{params:Promise<{slug:string}>}){
  const u=getOne((await params).slug); if(!u) notFound();
  const url=`${SITE_URL}/use-cases/${u.slug}`;
  const ld=[{"@context":"https://schema.org","@type":"HowTo",name:u.title,description:u.summary,url,tool:u.tools.map(t=>({"@type":"HowToTool",name:t})),step:steps(u.body).map((s,i)=>({"@type":"HowToStep",position:i+1,text:s}))},
    {"@context":"https://schema.org","@type":"FAQPage",mainEntity:faqs(u.body).map(f=>({"@type":"Question",name:f.q,acceptedAnswer:{"@type":"Answer",text:f.a}}))}];
  return (<article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld)}}/>
    <p><a href="/">← All use cases</a></p><h1>{u.title}</h1>
    {(u.labels||[]).length>0&&<p className="notice">{u.labels!.includes("Commercial product")&&"This is a commercial product. AgentOnStage isn't paid for this listing. "}{u.labels!.includes("Experimental")&&"This tool is experimental or a prototype. Don't use it on a live show without testing."}</p>}
    <p>{(u.labels||[]).map(l=><span className="tag label" key={l}>{l}</span>)}<span className="tag">{u.category}</span><span className="tag">{u.difficulty}</span>{u.tools.map(t=><span className="tag" key={t}>{t}</span>)}</p>
    <div dangerouslySetInnerHTML={{__html:toHtml(u.body)}}/>
    <p>Original source: <a href={u.source_url} rel="nofollow noopener">{u.source_url}</a></p>
  </article>);
}
