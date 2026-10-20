"use client";
import { useState } from "react";
type U={title:string;slug:string;category:string;tools:string[];difficulty:string;summary:string;labels?:string[];tested_on_rig?:string;rig_photos?:unknown};
export default function Directory({items,categories}:{items:U[];categories:readonly string[]}){
  const [q,setQ]=useState(""); const [cat,setCat]=useState("All");
  const ql=q.toLowerCase();
  const shown=items.filter(u=>(cat==="All"||u.category===cat)&&(u.title+u.summary+u.tools.join(" ")).toLowerCase().includes(ql));
  return (<>
    <input aria-label="Search" placeholder="Search use cases, tools (X32, QLab, Resolume…)" value={q} onChange={e=>setQ(e.target.value)} style={{width:"60%"}}/>
    <div>{["All",...categories].map(c=><button key={c} className={c===cat?"active":""} onClick={()=>setCat(c)}>{c}</button>)}</div>
    <p>{shown.length} use cases</p>
    {shown.map(u=><div className="card" key={u.slug}><a href={`/use-cases/${u.slug}`}><strong>{u.title}</strong></a>
      <p>{u.summary}</p>{u.tested_on_rig&&<span className="tag tested-badge">Tested on a real rig</span>}{(u.labels||[]).map(l=><span className={"tag label"} key={l}>{l}</span>)}<span className="tag">{u.category}</span><span className="tag">{u.difficulty}</span>{u.tools.map(t=><span className="tag" key={t}>{t}</span>)}</div>)}
  </>);
}
