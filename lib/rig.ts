import type { UseCase } from "./content";

export type RigSlot = { id:string; label:string; optional?:boolean; options:string[] };
export type RigCard = { title:string; slug:string; summary:string; tools:string[]; category:string; tested:boolean };

const LIGHTING_DESKS = [
  "Avolites Titan","ChamSys MagicQ","ChamSys QuickQ","D::Light","DMXDesktop","DmxControlPro3",
  "Eos","ETC ColorSource AV","ETC Eos","ETC Mosaic","grandMA2","grandMA2 onPC","grandMA3","Hog 4",
  "Interactive Technologies CueServer","LightFactory","Lightkey","LXConsole","MA Lighting dot2","MA2/MA3",
  "Obsidian ONYX","Pharos Designer","QLC+","Show Designer","Unilighter","Vista","Visual Productions CueCore2",
  "Zero 88 FLX","Zero 88 ZerOS",
];

const VIDEO_SWITCHERS = [
  "Analog Way LivePremier","Analog Way Midra 4K","Barco Event Master","Barco PDS-4K","Blackmagic ATEM",
  "mimoLive","OBS","OBS Studio","Panasonic AV-HS6000","Roland V-160HD","Roland V-60HD","Ross Carbonite",
  "Vizrt TriCaster","vMix",
];

const AUDIO_CONSOLES = [
  "Allen & Heath Avantis","Allen & Heath CQ","Allen & Heath dLive","Allen & Heath Qu","Allen & Heath SQ",
  "Avid VENUE S6L","Behringer WING","Behringer X32","Behringer XR18","Blackmagic Fairlight Live","DiGiCo",
  "DiGiCo S21","DiGiCo S31","M32","Midas M32","PreSonus StudioLive","Q-SYS","Soundcraft Ui","SSL Live",
  "Tascam Sonicview","WING","X32","X32/M32","Yamaha CL","Yamaha DM3","Yamaha DM5","Yamaha DM7","Yamaha QL",
  "Yamaha RIVAGE PM","Yamaha TF",
];

const COMPANION = ["Bitfocus Companion"];
const QLAB = ["QLab","QLab 5"];
const MEDIA_SERVERS = [
  "7thSense Delta","Aximmetry","CasparCG","Christie Pandoras Box","Dataton WATCHOUT","disguise","HeavyM",
  "Hippotizer","Isadora","MadMapper","Millumin","Mitti","Modulo Kinetic","Notch","Pixera","PlaybackPro Plus",
  "Resolume","Resolume Arena","Resolume Avenue","Resolume Avenue/Arena","Smode","Synesthesia","TouchDesigner","Vezér",
];

function present(used:Set<string>, names:string[]){
  return names.filter(name=>used.has(name)).sort((a,b)=>a.localeCompare(b));
}

export function rigSlots(all:UseCase[]): RigSlot[] {
  const used=new Set(all.flatMap(useCase=>useCase.tools));
  return [
    { id:"lighting", label:"Lighting desk", options:present(used, LIGHTING_DESKS) },
    { id:"video", label:"Video switcher", options:present(used, VIDEO_SWITCHERS) },
    { id:"audio", label:"Audio console", options:present(used, AUDIO_CONSOLES) },
    { id:"companion", label:"Companion", optional:true, options:present(used, COMPANION) },
    { id:"qlab", label:"QLab", optional:true, options:present(used, QLAB) },
    { id:"media", label:"Media server / TouchDesigner", optional:true, options:present(used, MEDIA_SERVERS) },
  ].filter(slot=>slot.options.length>0);
}

export function rigCards(all:UseCase[]): RigCard[] {
  return all.map(useCase=>({
    title:useCase.title, slug:useCase.slug, summary:useCase.summary, tools:useCase.tools,
    category:useCase.category, tested:Boolean(useCase.tested_on_rig),
  }));
}
