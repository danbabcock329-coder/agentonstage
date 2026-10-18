const title="Submit a use case";
const description="Submit a real AI or agent workflow you use in live events, with a public source link, to be reviewed for the AgentOnStage directory.";
export const metadata={title,description,alternates:{canonical:"/submit"},openGraph:{type:"website",siteName:"AgentOnStage",title,description,url:"/submit"},twitter:{card:"summary",title,description}};
export default function Submit(){ const url=process.env.NEXT_PUBLIC_SUBMIT_URL;
  return (<><h1>Submit a use case</h1><p>Send us a real AI or agent workflow you've used in live events. Include a public source link (repo, video, post or docs), the tools involved, and a few sentences on how it works. Every entry is reviewed and needs a verifiable source.</p>
  {url?<a href={url}>Open the submission form →</a>:<p><em>The submission form is coming soon.</em></p>}</>); }
