const title="Sponsor";
const description="Sponsor AgentOnStage with a featured listing or a newsletter slot and reach AV, live-event and stage-tech pros adopting AI agents.";
export const metadata={title,description,alternates:{canonical:"/sponsor",types:{"application/feed+json":"/feed.json"}},openGraph:{type:"website",siteName:"AgentOnStage",title,description,url:"/sponsor"},twitter:{card:"summary",title,description}};
const tiers=[{name:"Featured listing",desc:"Your tool pinned at the top of a category for 30 days.",link:process.env.NEXT_PUBLIC_STRIPE_LINK_FEATURED},{name:"Newsletter slot",desc:"One sponsored slot in the AI on Stage weekly issue.",link:process.env.NEXT_PUBLIC_STRIPE_LINK_NEWSLETTER}];
export default function Sponsor(){ return (<><h1>Sponsor AgentOnStage</h1><p>Reach AV, live-event and stage-tech pros who are adopting AI agents.</p>
  {tiers.map(t=><div className="card" key={t.name}><h2>{t.name}</h2><p>{t.desc}</p>{t.link?<a href={t.link}>Book with Stripe →</a>:<em>Booking opens soon.</em>}</div>)}</>); }
