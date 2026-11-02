#!/usr/bin/env python3
"""Generates the static, crawlable parts of GrokHire from tools/templates.json:
templates.js, gallery/featured/FAQ/JSON-LD blocks in index.html, t/<slug>/ pages, sitemap.xml, robots.txt.
Run: python3 tools/build.py"""
import json, re, os, html, datetime
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE='https://mxhoaib.github.io/bot-team/'
D=json.load(open(os.path.join(ROOT,'tools','templates.json')))
CATS={c['id']:c for c in D['categories']}; T=D['templates']
PERS={'friendly':('Friendly','Warm, upbeat and encouraging. Explain things in plain words.'),
 'direct':('Direct','Direct and concise. Lead with the answer, then the evidence.'),
 'witty':('Witty','Light and witty, but never at the cost of accuracy.'),
 'calm':('Calm','Calm, patient and thorough. Double-check work before reporting.'),
 'proactive':('Proactive','High-energy and proactive. Suggest the next step without being asked.'),
 'expert':('Expert','Precise and expert. Use the right terms, cite sources and flag uncertainty.')}
SAFE=['Ask me before you send a message, post, buy, book, delete or change an account.','Keep a source link for every fact you report, and say when you are unsure.']
FAQ=[('Is GrokHire free?','Yes. Every template, the builder, the .json export and the HD poster are free. There is no account and no paywall.'),
 ('Is GrokHire official?','No. GrokHire is an independent fan-made tool, not affiliated with Grok Bot or xAI.'),
 ('How do I import a bot into Grok Bot?','Copy the bot setup, open the Grok Bot app, choose New Bot (the + button or Ctrl/Cmd+N), give it the same name, choose Create, and paste the setup as your first message. There is no public link that creates a bot from a website, so this paste step is the real import path.'),
 ('Can I share my bot as a Grok Bot template?','Yes, inside the Grok Bot app: open the bot\'s details, choose Share, then Create a copy, then Publish and Copy link. You can also share a GrokHire link that rebuilds your setup for anyone who opens it.'),
 ('Who are the engineering templates for?','EV, robotics and energy engineers: autonomy data labeling, battery cell testing, manufacturing OEE, firmware review, humanoid robot simulation, grid storage site planning, HIL validation and 8D quality work. They are inspired by public talks and job descriptions in the industry and are not affiliated with or endorsed by any company.'),
 ('Does GrokHire store what I type?','No. Bots are built in your browser. The only data sent is a +1 to a public, anonymous counter of bots built, and anonymous page-view stats.')]
def clean(s,n): return re.sub(r'[\x00-\x09\x0b-\x1f<>]','',str(s)).strip()[:n]
def low1(s): return s[:1].lower()+s[1:]
def rules(ins,safe=True):
    r=[clean(re.sub(r'^\s*[-*•\d.)]+\s*','',x),200) for x in re.split(r'\n+',ins)]
    r=[x for x in r if x][:12]; return r+SAFE if safe else r
def setup(t):
    pl,pd=PERS[t['p']]; job=re.sub(r'[.!]+$','',t['j']); r=rules(t['i'])
    desc=f"{t['n']} is a Grok Bot. Job: {job}. {pd}"
    L=['Name: '+t['n'],'Job: '+job,'Personality: '+pl,'','Description:',desc,'','Instructions:','- Own this job: '+low1(job)+'.','- Working style: '+pd]+['- '+x for x in r]
    L+=['','Please remember all of the above as lasting rules for this bot. Then reply with a one-line summary of your job and one question about my first task.']
    return '\n'.join(L)
e=html.escape
def card(t):
    c=CATS[t['cat']]; pl=PERS[t['p']][0]; rs=rules(t['i'],False)
    search=' '.join([t['n'],t['j'],c['label'],' '.join(t['tags']),t['i']]).lower()
    lis=''.join(f'<li>{e(x)}</li>' for x in rs)
    tags=''.join(f'<span>{e(x)}</span>' for x in t['tags'])
    return (f'<article class="tcard c-{t["cat"]}" id="tpl-{t["slug"]}" data-slug="{t["slug"]}" data-cat="{t["cat"]}" data-q="{e(search)}">'
      f'<div class="th"><span class="ti" aria-hidden="true">{e(t["n"][0])}</span><div><h3><a href="t/{t["slug"]}/">{e(t["n"])}</a></h3><p class="tc">{e(c["label"])} · {pl}</p></div></div>'
      f'<p class="tj">{e(t["j"])}</p><div class="tags">{tags}</div>'
      f'<details><summary>Instructions ({len(rs)})</summary><ul>{lis}</ul></details>'
      f'<div class="ta"><a class="btn sm" href="#t={t["slug"]}" data-use="{t["slug"]}">Use this template</a><button class="btn ghost sm" type="button" data-copy="{t["slug"]}">Copy setup</button></div></article>')
def fcard(t):
    return f'<a class="fcard c-{t["cat"]}" href="#t={t["slug"]}" data-use="{t["slug"]}"><span class="ti" aria-hidden="true">{e(t["n"][0])}</span><span><b>{e(t["n"])}</b><small>{e(CATS[t["cat"]]["label"])}</small></span></a>'
def sub(doc,key,content):
    return re.sub(r'(<!--GEN:%s-->).*?(<!--/GEN:%s-->)'%(key,key),lambda m:m.group(1)+content+m.group(2),doc,flags=re.S)
def ld(o): return '<script type="application/ld+json">'+json.dumps(o,ensure_ascii=False).replace('</','<\\/')+'</script>'
# ---- index.html
p=os.path.join(ROOT,'index.html'); doc=open(p).read()
gal=''
for cid,c in CATS.items():
    items=[t for t in T if t['cat']==cid]
    if not items: continue
    hid=' id="engineers"' if cid=='engineering' else ''
    gal+=f'<div class="gcat" data-group="{cid}"{hid}><h3 class="gh">{e(c["label"])}</h3><p class="small gb">{e(c["blurb"])}</p><div class="grid">'+''.join(card(t) for t in items)+'</div></div>'
doc=sub(doc,'gallery',gal)
doc=sub(doc,'featured',''.join(fcard(t) for t in T if t.get('featured')))
doc=sub(doc,'catbtns',''.join(f'<button type="button" data-cat="{c["id"]}" aria-pressed="false">{e(c["label"])}</button>' for c in D['categories']))
doc=sub(doc,'faq',''.join(f'<details class="card q"><summary><h3>{e(q)}</h3></summary><p>{e(a)}</p></details>' for q,a in FAQ))
j1={'@context':'https://schema.org','@type':'WebApplication','name':'GrokHire','alternateName':'GrokHire: Build and hire Grok Bots','url':BASE,'description':'Free Grok Bot templates and a builder to create a ready-to-paste Grok Bot setup, including AI agent templates for EV, robotics and energy engineers.','applicationCategory':'DeveloperApplication','operatingSystem':'Any (web browser)','isAccessibleForFree':True,'offers':{'@type':'Offer','price':'0','priceCurrency':'USD'},'image':BASE+'og-image.png','inLanguage':'en'}
j2={'@context':'https://schema.org','@type':'ItemList','name':'Free Grok Bot templates','numberOfItems':len(T),'itemListElement':[{'@type':'ListItem','position':i+1,'url':BASE+'t/'+t['slug']+'/','name':t['n']+': '+t['j']} for i,t in enumerate(T)]}
j3={'@context':'https://schema.org','@type':'FAQPage','mainEntity':[{'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}} for q,a in FAQ]}
doc=sub(doc,'jsonld',ld(j1)+ld(j2)+ld(j3))
open(p,'w').write(doc)
# ---- templates.js
js=[{'s':t['slug'],'c':t['cat'],'n':t['n'],'j':t['j'],'p':t['p'],'i':t['i']} for t in T]
open(os.path.join(ROOT,'templates.js'),'w').write('/* generated by tools/build.py */\nwindow.GH_T='+json.dumps(js,ensure_ascii=False,separators=(',',':'))+';\n')
# ---- template pages
PAGE=open(os.path.join(ROOT,'tools','page.tpl.html')).read()
for t in T:
    c=CATS[t['cat']]; pl,pd=PERS[t['p']]; txt=setup(t); url=BASE+'t/'+t['slug']+'/'
    title=f"{t['n']}: free Grok Bot template · GrokHire"
    desc=f"Free Grok Bot template: {t['j']}. {pl} personality, ready-to-paste instructions."+(' An AI agent template for EV, robotics and energy engineers.' if t['cat']=='engineering' else '')
    jl=ld({'@context':'https://schema.org','@type':'CreativeWork','name':t['n'],'headline':title,'description':desc,'url':url,'isAccessibleForFree':True,'keywords':', '.join(t['tags']+['Grok Bot template']),'isPartOf':{'@type':'WebSite','name':'GrokHire','url':BASE}})+ld({'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'GrokHire','item':BASE},{'@type':'ListItem','position':2,'name':c['label'],'item':BASE+'#templates'},{'@type':'ListItem','position':3,'name':t['n'],'item':url}]})
    rel=[x for x in T if x['cat']==t['cat'] and x['slug']!=t['slug']][:4]
    relh=''.join(f'<li><a href="../{x["slug"]}/">{e(x["n"])}</a> · {e(x["j"])}</li>' for x in rel)
    out=PAGE
    for k,v in {'TITLE':e(title),'DESC':e(desc),'URL':url,'JSONLD':jl,'NAME':e(t['n']),'JOB':e(t['j']),'CAT':e(c['label']),'PERS':e(pl+' · '+pd),'SLUG':t['slug'],
      'RULES':''.join(f'<li>{e(x)}</li>' for x in rules(t['i'])),'SETUP':e(txt),'SETUPJSON':json.dumps(txt).replace('</','<\\/'),'RELATED':relh,'TAGS':''.join(f'<span>{e(x)}</span>' for x in t['tags'])}.items():
        out=out.replace('{{'+k+'}}',v)
    os.makedirs(os.path.join(ROOT,'t',t['slug']),exist_ok=True); open(os.path.join(ROOT,'t',t['slug'],'index.html'),'w').write(out)
# ---- sitemap + robots
today=datetime.date.today().isoformat()
urls=[BASE]+[BASE+'t/'+t['slug']+'/' for t in T]
open(os.path.join(ROOT,'sitemap.xml'),'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'<url><loc>{u}</loc><lastmod>{today}</lastmod></url>\n' for u in urls)+'</urlset>\n')
open(os.path.join(ROOT,'robots.txt'),'w').write('User-agent: *\nAllow: /\n\nSitemap: '+BASE+'sitemap.xml\n')
print('built',len(T),'templates')
