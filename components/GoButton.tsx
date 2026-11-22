"use client";
import { usePathname } from "next/navigation";

const HUBS = new Set(["lighting","audio","show-control","led-video","touchdesigner","production-ops"]);

export type Cue = { slug:string; weight:number; hub:string };

function poolFor(cues:Cue[], hub?:string){
  if(!hub) return cues;
  const filtered=cues.filter(cue=>cue.hub===hub);
  return filtered.length?filtered:cues;
}

function fallback(pool:Cue[]){
  return [...pool].sort((a,b)=>b.weight-a.weight||a.slug.localeCompare(b.slug))[0];
}

function pick(pool:Cue[]){
  const total=pool.reduce((sum,cue)=>sum+cue.weight,0);
  let roll=Math.random()*total;
  for(const cue of pool){
    roll-=cue.weight;
    if(roll<0) return cue;
  }
  return pool[pool.length-1];
}

export default function GoButton({cues,hub}:{cues:Cue[];hub?:string}){
  const path=usePathname()||"/";
  const segment=path.split("/").filter(Boolean)[0]||"";
  const locked=hub??(HUBS.has(segment)?segment:undefined);
  const pool=poolFor(cues,locked);
  const steady=fallback(pool);
  return (
    <a className="go" href={`/use-cases/${steady.slug}`} onClick={(event)=>{
      event.preventDefault();
      const live=window.location.pathname.split("/").filter(Boolean)[0]||"";
      const liveHub=hub??(HUBS.has(live)?live:undefined);
      window.location.assign(`/use-cases/${pick(poolFor(cues,liveHub)).slug}`);
    }}>Cue a random use case</a>
  );
}
