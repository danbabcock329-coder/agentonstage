"use client";
import { useMemo, useState } from "react";

type Slot = { id:string; label:string; optional?:boolean; options:string[] };
type Card = { title:string; slug:string; summary:string; tools:string[]; category:string; tested:boolean };

export default function StackBuilder({slots,cards}:{slots:Slot[];cards:Card[]}){
  const [picked,setPicked]=useState<Record<string,string>>({});
  const selected=Object.values(picked).filter(Boolean);
  const matches=useMemo(()=>cards.map(card=>({card,hit:card.tools.filter(tool=>selected.includes(tool))})).filter(row=>row.hit.length).sort((a,b)=>b.hit.length-a.hit.length||Number(b.card.tested)-Number(a.card.tested)||a.card.title.localeCompare(b.card.title)),[cards,selected]);
  const required=slots.filter(slot=>!slot.optional);
  const optional=slots.filter(slot=>slot.optional);
  function choose(id:string, value:string){ setPicked(current=>({...current,[id]:value})); }
  return (<>
    <div className="rig-form">
      {required.map(slot=><label key={slot.id}>{slot.label}
        <select aria-label={slot.label} value={picked[slot.id]??""} onChange={e=>choose(slot.id,e.target.value)}>
          <option value="">None</option>
          {slot.options.map(option=><option key={option} value={option}>{option}</option>)}
        </select>
      </label>)}
    </div>
    <div className="rig-form">
      {optional.map(slot=><label key={slot.id}>{slot.label} <span className="optional">optional</span>
        <select aria-label={slot.label} value={picked[slot.id]??""} onChange={e=>choose(slot.id,e.target.value)}>
          <option value="">None</option>
          {slot.options.map(option=><option key={option} value={option}>{option}</option>)}
        </select>
      </label>)}
    </div>
    {selected.length===0?<p>Pick a lighting desk, a video switcher, or an audio console to see matching use cases.</p>:<p>{matches.length} matching use {matches.length===1?"case":"cases"}</p>}
    {matches.map(({card,hit})=><div className="card" key={card.slug}>
      <a href={`/use-cases/${card.slug}`}><strong>{card.title}</strong></a>
      <p className="protocol"><span className="tag">Protocol note</span> {card.summary}</p>
      {card.tested&&<span className="tag tested-badge">Tested on a real rig</span>}
      <span className="tag">{card.category}</span>
      {hit.map(tool=><span className="tag" key={tool}>{tool}</span>)}
    </div>)}
  </>);
}
