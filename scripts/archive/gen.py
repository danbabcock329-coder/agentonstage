# Skips existing files: Markdown in content/use-cases is the source of truth.
import re,os
os.makedirs('content/use-cases',exist_ok=True)
STEPS={
'TouchDesigner':["Install TouchDesigner (free non-commercial works for testing) and clone the project from its source repo.","Follow the repo's README to load the component or start the server alongside your .toe file.","Start with a copy of your show file, test on a non-show machine, and lock working versions before load-in."],
'Audio':["Put the console and the control computer on the same isolated show network with a fixed IP.","Install the tool from the source repo and point it at the console's IP (X32 OSC uses UDP port 10023).","Test in rehearsal with a saved scene backup, and limit agent write access during a live show."],
'Lighting':["Set up the console, onPC or software on a dedicated show network.","Install the tool from the source repo and enable the needed remote/OSC/WebSocket input on the desk.","Rehearse with a backed-up showfile and keep a human operator on the go button."],
'LED/Video':["Enable the software's remote API (OSC, REST or WebSocket) in its preferences.","Install the tool from the source repo and configure host/port to match.","Test against a non-program output first, then promote to the live rig once it behaves."],
'Show Control':["Enable OSC or network control on the target app (QLab, Companion, PowerPoint, etc.).","Install the tool from the source repo and map the triggers you need.","Run a full tech rehearsal and keep a manual override within reach."],
'Production Ops':["Export the input file (scene file, variables or show data) from your system.","Run the tool from the source repo against it to produce the document or dashboard.","Check the output against the live system before it goes into the show binder."],
}
for line in open('scripts/entries.tsv'):
    cat,title,url,tools,diff,summ=line.rstrip('\n').split('\t')
    slug=re.sub(r'[^a-z0-9]+','-',title.lower()).strip('-')[:70].strip('-')
    tl=[t.strip() for t in tools.split(',')]
    repo=url.split('github.com/')[1]
    q=lambda s:'"'+s.replace('"','\\"')+'"'
    fm=f"---\ntitle: {q(title)}\nslug: {slug}\ncategory: {q(cat)}\ntools: [{', '.join(q(t) for t in tl)}]\ndifficulty: {diff}\nsource_url: {url}\nsummary: {q(summ)}\n---\n"
    steps='\n'.join(f"{i+1}. {s}" for i,s in enumerate(STEPS[cat]))
    body=f"""
## What it does

{summ}

## How to set it up

{steps}

Source project: [{repo}]({url})

## FAQ

### Is this safe to use during a live show?
Treat it as rehearsal and prep tooling first. Use it live only after testing it on your exact rig, and keep a manual fallback.

### What do I need to get started?
{', '.join(tl)}. Check the source repository for exact versions and requirements.

### Is it free?
The linked project is published on GitHub. Check its license before you use it commercially. Some of the commercial software it controls needs its own license.
"""
    p=f'content/use-cases/{slug}.md'
    if os.path.exists(p): continue
    open(p,'w').write(fm+body)
