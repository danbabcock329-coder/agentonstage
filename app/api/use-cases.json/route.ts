import { getAll } from "@/lib/content";
export const dynamic="force-static";
export function GET(){ return Response.json(getAll().map(({body,...u})=>u)); }
