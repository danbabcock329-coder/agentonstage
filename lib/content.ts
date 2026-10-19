import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

export const CATEGORIES = ["Show Control","LED/Video","Audio","Lighting","TouchDesigner","Production Ops"] as const;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://agentonstage.com";
export const FEED_PATH = "/feed.json";
export type UseCase = { title:string; slug:string; category:string; tools:string[]; difficulty:string; labels?:string[]; source_url:string; summary:string; body:string };
const DIR = path.join(process.cwd(),"content/use-cases");

export function getAll(): UseCase[] {
  return fs.readdirSync(DIR).filter(f=>f.endsWith(".md")).map(f=>{
    const {data,content}=matter(fs.readFileSync(path.join(DIR,f),"utf8"));
    return {...(data as Omit<UseCase,"body">), body:content};
  }).sort((a,b)=>a.title.localeCompare(b.title));
}
export function getOne(slug:string){ return getAll().find(u=>u.slug===slug); }
export function toHtml(md:string){ return marked.parse(md) as string; }
export function steps(md:string){ const s=md.split("## How to set it up")[1]?.split("##")[0]||""; return s.split("\n").filter(l=>/^\d+\. /.test(l)).map(l=>l.replace(/^\d+\. /,"")); }
export function faqs(md:string){ const s=md.split("## FAQ")[1]||""; return s.split("### ").slice(1).map(b=>{const [q,...a]=b.trim().split("\n");return {q:q.trim(),a:a.join(" ").trim()};}); }
