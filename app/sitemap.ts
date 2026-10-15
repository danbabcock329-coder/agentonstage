import type { MetadataRoute } from "next";
import { getAll, SITE_URL } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return [...["","/sponsor","/submit"].map(p=>({url:SITE_URL+p})), ...getAll().map(u=>({url:`${SITE_URL}/use-cases/${u.slug}`}))];
}
