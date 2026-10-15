import { NextResponse } from "next/server";
export async function POST(req: Request){
  const { email } = await req.json().catch(()=>({}));
  if(!email || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({message:"Please enter a valid email."},{status:400});
  const key=process.env.RESEND_API_KEY, aud=process.env.RESEND_AUDIENCE_ID;
  if(!key||!aud) return NextResponse.json({message:"Newsletter isn't configured yet. Check back soon!"},{status:503});
  const r=await fetch(`https://api.resend.com/audiences/${aud}/contacts`,{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({email,unsubscribed:false})});
  return r.ok?NextResponse.json({message:"You're subscribed!"}):NextResponse.json({message:"Something went wrong."},{status:502});
}
