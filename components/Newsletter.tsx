"use client";
import { useState } from "react";
export default function Newsletter(){
  const [email,setEmail]=useState(""); const [msg,setMsg]=useState("");
  async function submit(e:React.FormEvent){ e.preventDefault(); setMsg("…");
    const r=await fetch("/api/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})});
    const j=await r.json(); setMsg(j.message); }
  return (<form onSubmit={submit} className="card">
    <strong>AI on Stage, a weekly newsletter</strong><p>New agent use cases for live events, once a week.</p>
    <input type="email" required placeholder="you@venue.com" value={email} onChange={e=>setEmail(e.target.value)}/>
    <button type="submit">Subscribe</button>{msg&&<p>{msg}</p>}</form>);
}
