import { getTested, FEED_PATH } from "@/lib/content";
const title="Tested on a real rig";
const description="AgentOnStage workflows run on real show hardware: a Behringer X32, an ENTTEC DMX USB Pro and an RGBW par, with photos from the bench.";
export const metadata={title,description,alternates:{canonical:"/tested",types:{"application/feed+json":FEED_PATH}},openGraph:{type:"website",siteName:"AgentOnStage",url:"/tested",title,description},twitter:{card:"summary",title,description}};
export default function Tested(){
  const items=getTested();
  return (<><h1>Tested on a real rig</h1>
    <p>These entries were run on real gear, not just read from documentation. Each one lists the hardware, what we checked, and photos from the test. Results apply to that setup; test on your own rig before a show.</p>
    {items.map(u=><div className="card" key={u.slug}><a href={`/use-cases/${u.slug}`}><strong>{u.title}</strong></a>
      <p>{u.summary}</p><span className="tag tested-badge">Tested {u.tested_on_rig}</span><span className="tag">{u.category}</span>
      {(u.rig_photos||[]).length>0&&<div className="gallery" style={{marginTop:".5rem"}}>{u.rig_photos!.slice(0,3).map(ph=><a key={ph.src} href={`/use-cases/${u.slug}`}><img src={ph.src} alt={ph.alt} loading="lazy" style={{width:"100%",borderRadius:8}}/></a>)}</div>}
    </div>)}
  </>);
}
