export type CardItem = {
  title:string; slug:string; category:string; tools:string[]; difficulty:string; summary:string;
  labels?:string[]; tested_on_rig?:string; rig_photos?:{src:string;alt:string}[];
};

export default function UseCaseCard({item,showPhotos=false}:{item:CardItem;showPhotos?:boolean}){
  return (
    <div className="card">
      <a href={`/use-cases/${item.slug}`}><strong>{item.title}</strong></a>
      <p>{item.summary}</p>
      {item.tested_on_rig&&<span className="tag tested-badge">Tested on a real rig</span>}
      {(item.labels||[]).map(label=><span className="tag label" key={label}>{label}</span>)}
      <span className="tag">{item.category}</span>
      <span className="tag">{item.difficulty}</span>
      {item.tools.map(tool=><span className="tag" key={tool}>{tool}</span>)}
      {showPhotos&&(item.rig_photos||[]).length>0&&<div className="gallery">{item.rig_photos!.slice(0,3).map(photo=><a key={photo.src} href={`/use-cases/${item.slug}`}><img src={photo.src} alt={photo.alt} loading="lazy"/></a>)}</div>}
    </div>
  );
}
