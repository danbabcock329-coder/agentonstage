import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { gitFileDates } from "./git-dates";

export const CATEGORIES = ["Show Control","LED/Video","Audio","Lighting","TouchDesigner","Production Ops"] as const;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://agentonstage.com";
export const FEED_PATH = "/feed.json";

export const CATEGORY_HUBS = [
  { slug: "show-control", name: "Show Control", intro: "Cue stacks, playback, and the protocols that fire them. Entries name the OSC, MSC, MIDI, or HTTP command the source documents." },
  { slug: "led-video", name: "LED/Video", intro: "Switchers, media servers, processors, and routing for LED walls and video. Entries record the port and the command that takes or plays." },
  { slug: "audio", name: "Audio", intro: "Consoles, processors, and spatial systems. Entries record the OSC, MIDI, or vendor protocol used to recall a scene or move a fader." },
  { slug: "lighting", name: "Lighting", intro: "Desks, DMX interfaces, and the assistants that read or fire them. Entries record the command path, from OSC and Art-Net to the vendor API." },
  { slug: "touchdesigner", name: "TouchDesigner", intro: "Networks, operators, and the MCP or OSC bridges that let an assistant edit or drive a TouchDesigner project." },
  { slug: "production-ops", name: "Production Ops", intro: "Schedules, paperwork, captions, and the crew tools around the show, separate from the desks and servers." },
] as const;

export type CategoryHub = (typeof CATEGORY_HUBS)[number];
export type RigPhoto = { src:string; alt:string; caption?:string };
export type UseCase = { tested_on_rig?:string; rig?:string; rig_photos?:RigPhoto[]; title:string; slug:string; category:string; tools:string[]; difficulty:string; labels?:string[]; source_url:string; summary:string; body:string };
export type CardFields = { title:string; slug:string; category:string; tools:string[]; difficulty:string; summary:string; labels?:string[]; tested_on_rig?:string; rig_photos?:{src:string;alt:string}[] };
export type Cue = { slug:string; weight:number; hub:string };

const DIR = path.join(process.cwd(),"content/use-cases");

export function getAll(): UseCase[] {
  return fs.readdirSync(DIR).filter(f=>f.endsWith(".md")).map(f=>{
    const {data,content}=matter(fs.readFileSync(path.join(DIR,f),"utf8"));
    return {...(data as Omit<UseCase,"body">), body:content};
  }).sort((a,b)=>a.title.localeCompare(b.title));
}
export function getTested(){ return getAll().filter(u=>u.tested_on_rig).sort((a,b)=>(b.tested_on_rig||"").localeCompare(a.tested_on_rig||"")); }
export function getOne(slug:string){ return getAll().find(u=>u.slug===slug); }
export function toHtml(md:string){ return marked.parse(md) as string; }
export function steps(md:string){ const s=md.split("## How to set it up")[1]?.split("##")[0]||""; return s.split("\n").filter(l=>/^\d+\. /.test(l)).map(l=>l.replace(/^\d+\. /,"")); }
export function faqs(md:string){ const s=md.split("## FAQ")[1]||""; return s.split("### ").slice(1).map(b=>{const [q,...a]=b.trim().split("\n");return {q:q.trim(),a:a.join(" ").trim()};}); }

export function hubForCategory(category:string){ return CATEGORY_HUBS.find(hub=>hub.name===category); }
export function hubBySlug(slug:string){ return CATEGORY_HUBS.find(hub=>hub.slug===slug); }
export function categoryPath(category:string){
  const hub=hubForCategory(category);
  return hub?`/${hub.slug}`:`/?q=${encodeURIComponent(category)}`;
}

export function cardFields(useCase:UseCase): CardFields {
  return {
    title:useCase.title, slug:useCase.slug, category:useCase.category, tools:useCase.tools,
    difficulty:useCase.difficulty, summary:useCase.summary, labels:useCase.labels, tested_on_rig:useCase.tested_on_rig,
    rig_photos:useCase.rig_photos?.map(({src,alt})=>({src,alt})),
  };
}

/** Beginner and rig-tested entries are drawn more often. */
export function cueWeight(useCase:Pick<UseCase,"difficulty"|"tested_on_rig">){
  let weight=1;
  if(useCase.difficulty==="Beginner") weight+=2;
  if(useCase.tested_on_rig) weight+=3;
  return weight;
}
export function toCues(items:UseCase[]): Cue[] {
  return items.map(useCase=>({slug:useCase.slug, weight:cueWeight(useCase), hub:hubForCategory(useCase.category)?.slug??""}));
}

/** Same primary tool first, then other entries that list it, then the same category. */
export function relatedEntries(current:UseCase, all:UseCase[]=getAll()){
  const others=all.filter(useCase=>useCase.slug!==current.slug);
  const primary=current.tools[0];
  const samePrimary=primary?others.filter(useCase=>useCase.tools[0]===primary):[];
  const sameTool=primary?others.filter(useCase=>useCase.tools[0]!==primary&&useCase.tools.includes(primary)):[];
  const used=new Set([...samePrimary,...sameTool].map(useCase=>useCase.slug));
  const sameCategory=others.filter(useCase=>useCase.category===current.category&&!used.has(useCase.slug));
  return [...samePrimary,...sameTool,...sameCategory].slice(0,6);
}

export function newestEntries(all:UseCase[], limit=12, skip:string[]=[]){
  const pool=all.filter(useCase=>!skip.includes(useCase.slug));
  const dates=gitFileDates(pool.map(useCase=>`content/use-cases/${useCase.slug}.md`));
  return [...pool].sort((a,b)=>{
    const aTime=dates.get(`content/use-cases/${a.slug}.md`)?.published?.getTime()??0;
    const bTime=dates.get(`content/use-cases/${b.slug}.md`)?.published?.getTime()??0;
    return bTime-aTime||a.title.localeCompare(b.title);
  }).slice(0,limit);
}
