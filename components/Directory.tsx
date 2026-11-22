"use client";
import { useEffect, useState } from "react";
import UseCaseCard, { type CardItem } from "./UseCaseCard";

export default function Directory({items,children}:{items:CardItem[];children:React.ReactNode}){
  const [q,setQ]=useState("");
  useEffect(()=>{
    const fromUrl=new URLSearchParams(window.location.search).get("q")??"";
    if(fromUrl) setQ(fromUrl);
  },[]);
  const ql=q.trim().toLowerCase();
  const shown=ql?items.filter(item=>`${item.title} ${item.summary} ${item.tools.join(" ")} ${item.difficulty} ${item.category}`.toLowerCase().includes(ql)):items;
  function update(value:string){
    setQ(value);
    const next=value.trim()?`/?q=${encodeURIComponent(value.trim())}`:"/";
    window.history.replaceState(null,"",next);
  }
  return (<>
    <input className="search" type="search" aria-label="Search" placeholder="Search use cases, tools (X32, QLab, Resolume…)" value={q} onChange={e=>update(e.target.value)}/>
    {ql?null:children}
    <h2 id="directory">{ql?"Search results":"All use cases"}</h2>
    <p>{shown.length} use cases</p>
    {shown.map(item=><UseCaseCard key={item.slug} item={item}/>)}
  </>);
}
