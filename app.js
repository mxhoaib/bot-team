'use strict';
/* GrokHire: builds a ready-to-paste Grok Bot setup in the browser. No backend, no keys.
   The only network call is a public keyless counter (abacus.jasoncameron.dev). */
(function(){
var URL0='https://mxhoaib.github.io/bot-team/',SITE='mxhoaib.github.io/bot-team';
var CNT='https://abacus.jasoncameron.dev',NS='grokhire',KEY='bots-built';
var $=function(s){return document.querySelector(s)};
function clean(s,n){return String(s==null?'':s).replace(/[\u0000-\u0009\u000b-\u001f<>]/g,'').trim().slice(0,n)}
function enc(o){var b=new TextEncoder().encode(JSON.stringify(o)),s='';b.forEach(function(c){s+=String.fromCharCode(c)});return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function dec(s){try{s=String(s).replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';var bin=atob(s);return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin,function(c){return c.charCodeAt(0)})))}catch(e){return null}}
function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
async function clip(s){try{await navigator.clipboard.writeText(s);return true}catch(e){var t=document.createElement('textarea');t.value=s;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();var ok=false;try{ok=document.execCommand('copy')}catch(_){}t.remove();return ok}}
function track(ev){try{if(window.goatcounter&&window.goatcounter.count)window.goatcounter.count({path:'grokhire/'+ev,title:ev,event:true})}catch(e){}}

/* ---------- data ---------- */
var PERS={
 friendly:{l:'Friendly',d:'Warm, upbeat and encouraging. Explain things in plain words.'},
 direct:{l:'Direct',d:'Direct and concise. Lead with the answer, then the evidence.'},
 witty:{l:'Witty',d:'Light and witty, but never at the cost of accuracy.'},
 calm:{l:'Calm',d:'Calm, patient and thorough. Double-check work before reporting.'},
 proactive:{l:'Proactive',d:'High-energy and proactive. Suggest the next step without being asked.'},
 expert:{l:'Expert',d:'Precise and expert. Use the right terms, cite sources and flag uncertainty.'}
};
var TPL=window.GH_T||[];
var SAFE=['Ask me before you send a message, post, buy, book, delete or change an account.','Keep a source link for every fact you report, and say when you are unsure.'];
var COLORS=[['#7c8cff','#c084fc'],['#5eead4','#7c8cff'],['#f0abfc','#818cf8'],['#93c5fd','#a78bfa'],['#fda4af','#c084fc'],['#86efac','#5eead4']];

/* ---------- model ---------- */
var pers='direct',bot=null,size='45';
function read(){return{name:clean($('#name').value,32),job:clean($('#job').value,120),pers:pers,ins:clean($('#ins').value,1200),safe:$('#safe').checked}}
function rules(s){var r=s.ins.split(/\n+/).map(function(x){return clean(x.replace(/^\s*[-*•\d.)]+\s*/,''),200)}).filter(Boolean).slice(0,12);return s.safe?r.concat(SAFE):r}
function low1(s){return s.charAt(0).toLowerCase()+s.slice(1)}
function make(s){var p=PERS[s.pers]||PERS.direct,r=rules(s),job=s.job.replace(/[.!]+$/,'');
 var desc=s.name+' is a Grok Bot. Job: '+job+'. '+p.d;
 var col=COLORS[hash(s.name.toLowerCase())%COLORS.length];
 var lines=['Name: '+s.name,'Job: '+job,'Personality: '+p.l,'','Description:',desc,'','Instructions:','- Own this job: '+low1(job)+'.','- Working style: '+p.d].concat(r.map(function(x){return '- '+x}));
 lines.push('','Please remember all of the above as lasting rules for this bot. Then reply with a one-line summary of your job and one question about my first task.');
 return{name:s.name,job:job,pers:s.pers,persLabel:p.l,persText:p.d,desc:desc,rules:r,user:s,color:col,text:lines.join('\n')}}
function json(b){return JSON.stringify({format:'grokhire.bot-setup',version:1,name:b.name,job:b.job,personality:b.persLabel,description:b.desc,instructions:['Own this job: '+low1(b.job)+'.','Working style: '+b.persText].concat(b.rules),firstMessage:b.text,picture:{gradient:b.color},howToImport:['Open the Grok Bot app and choose New Bot (+ or Cmd/Ctrl+N).','Name it "'+b.name+'" and choose Create.','Paste firstMessage as your first chat message.'],note:'This is a GrokHire export, not an official Grok Bot file format. GrokHire is an independent fan-made tool, not affiliated with Grok Bot or xAI.',createdWith:URL0},null,2)}

/* ---------- UI: templates, personality, preview ---------- */
/* template chips replaced by the gallery below */
Object.keys(PERS).forEach(function(k){var b=document.createElement('button');b.type='button';b.textContent=PERS[k].l;b.setAttribute('role','radio');b.setAttribute('data-p',k);b.onclick=function(){setPers(k);preview()};$('#pers').appendChild(b)});
function setPers(k){pers=PERS[k]?k:'direct';document.querySelectorAll('[data-p]').forEach(function(b){b.setAttribute('aria-checked',b.getAttribute('data-p')===pers)})}
setPers(pers);
function preview(){var s=read(),n=s.name||'Your bot',col=COLORS[hash(n.toLowerCase())%COLORS.length];$('#pvName').textContent=n;$('#pvJob').textContent=s.job||'Its job shows here';$('#pvAv').textContent=n.charAt(0).toUpperCase();$('#pvAv').style.background='linear-gradient(135deg,'+col[0]+','+col[1]+')';$('#pvPers').textContent=PERS[pers].l+' · '+PERS[pers].d;
 var ul=$('#pvRules');ul.innerHTML='';var r=rules(s);if(!r.length)r=['Add instructions to see them here.'];r.slice(0,5).forEach(function(x){var li=document.createElement('li');li.textContent=x;ul.appendChild(li)});if(r.length>5){var li=document.createElement('li');li.textContent='+ '+(r.length-5)+' more';ul.appendChild(li)}}
['#name','#job','#ins','#safe'].forEach(function(s){$(s).addEventListener('input',preview)});preview();

/* ---------- build ---------- */
function toast(m){$('#toast').textContent=m;clearTimeout(toast.t);toast.t=setTimeout(function(){$('#toast').textContent=''},3500)}
function link(){return URL0+'#b='+enc({n:bot.user.name,j:bot.user.job,p:bot.user.pers,i:bot.user.ins,s:bot.user.safe?1:0})}
function shareText(){return 'I just built "'+bot.name+'", a Grok Bot for: '+low1(bot.job)+'. Build yours free on GrokHire:'}
function build(scroll,fromLink){var s=read();if(!s.name||!s.job)return;bot=make(s);$('#out').hidden=false;$('#outTitle').textContent=bot.name+' is ready to hire';$('#stepName').textContent=bot.name;$('#setup').textContent=bot.text;
 var u=link();$('#xx').href='https://twitter.com/intent/tweet?text='+encodeURIComponent(shareText())+'&url='+encodeURIComponent(u);$('#li').href='https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(u);
 try{history.replaceState(null,'','#b='+u.split('#b=')[1])}catch(e){}draw();if(!fromLink)countBuild(bot);if(scroll)$('#out').scrollIntoView({behavior:'smooth',block:'start'})}
$('#f').onsubmit=function(e){e.preventDefault();build(true,false);track('build')};
$('#copySetup').onclick=async function(){toast(await clip(bot.text)?'Bot setup copied. Paste it into a new bot in Grok Bot.':'Copy failed. Select the text and copy it manually.');track('copy-setup')};
$('#dlJson').onclick=function(){var b=new Blob([json(bot)],{type:'application/json'});save(b,slug(bot.name)+'.grokhire.json');toast('Downloaded '+slug(bot.name)+'.grokhire.json');track('download-json')};
function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'bot'}
function save(b,name){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},2000)}

/* ---------- live counter ---------- */
var local=/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname)||location.protocol==='file:';
function showCount(v){if(typeof v!=='number'||v<0)return;$('#liveN').textContent=v.toLocaleString('en-US');$('#liveL').textContent=v===1?'bot built by people':'bots built by people';$('#live').hidden=false}
function req(path){var c=new AbortController();setTimeout(function(){c.abort()},6000);return fetch(CNT+path,{signal:c.signal,cache:'no-store'})}
req('/info/'+NS+'/'+KEY).then(function(r){if(!r.ok&&r.status!==404)throw 0;return r.json()}).then(function(d){if(d&&d.exists===false)showCount(0);else showCount(d&&d.value)}).catch(function(){/* counter down: keep it hidden */});
function countBuild(b){var id='gh-'+hash(b.text);try{if(sessionStorage.getItem(id))return;sessionStorage.setItem(id,'1')}catch(e){}
 if(local)return; /* local previews never touch the public number */
 req('/hit/'+NS+'/'+KEY).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){showCount(d&&d.value)}).catch(function(){})}

/* ---------- poster ---------- */
var F='Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
function wrapT(x,t,max,n){var w=String(t).split(/\s+/),out=[],l='';for(var i=0;i<w.length;i++){var tt=l?l+' '+w[i]:w[i];if(x.measureText(tt).width>max&&l){out.push(l);l=w[i]}else l=tt}if(l)out.push(l);if(out.length>n){out=out.slice(0,n);out[n-1]=out[n-1].replace(/\s*\S*$/,'')+'…'}return out}
function fitF(x,t,w,max,s,min){do{x.font=w+' '+s+'px '+F;if(x.measureText(t).width<=max)break;s-=2}while(s>min);return s}
function rr(x,a,b,w,h,r){x.beginPath();if(x.roundRect)x.roundRect(a,b,w,h,r);else x.rect(a,b,w,h)}
function drawPoster(cv,W,H,b,k){k=k||1;cv.width=W*k;cv.height=H*k;var x=cv.getContext('2d');x.scale(k,k);var tall=H/W>1.6,P=80;
 x.fillStyle='#07070b';x.fillRect(0,0,W,H);
 [[W*.85,-40,W*.9,b.color[0]+'66'],[0,H*.95,W*.9,b.color[1]+'44'],[W*.5,H*.42,W*.6,'#7c8cff18']].forEach(function(o){var g=x.createRadialGradient(o[0],o[1],0,o[0],o[1],o[2]);g.addColorStop(0,o[3]);g.addColorStop(1,'#07070b00');x.fillStyle=g;x.fillRect(0,0,W,H)});
 x.strokeStyle='#ffffff08';x.lineWidth=1;for(var gx=0;gx<W;gx+=60){x.beginPath();x.moveTo(gx,0);x.lineTo(gx,H*.5);x.stroke()}for(var gy=0;gy<H*.5;gy+=60){x.beginPath();x.moveTo(0,gy);x.lineTo(W,gy);x.stroke()}
 var y=P+(tall?60:0);
 var mg=x.createLinearGradient(P,y,P+52,y+52);mg.addColorStop(0,'#7c8cff');mg.addColorStop(1,'#c084fc');x.fillStyle=mg;rr(x,P,y,52,52,14);x.fill();x.fillStyle='#07070b';x.font='800 20px '+F;x.textAlign='center';x.fillText('GH',P+26,y+34);x.textAlign='left';
 x.fillStyle='#f4f4f7';x.font='700 30px '+F;x.fillText('GrokHire',P+70,y+36);x.fillStyle='#9a9aab';x.font='500 24px '+F;x.textAlign='right';x.fillText('NOW HIRING',W-P,y+35);x.textAlign='left';
 y+=tall?190:140;
 var av=tall?200:170,ag=x.createLinearGradient(P,y,P+av,y+av);ag.addColorStop(0,b.color[0]);ag.addColorStop(1,b.color[1]);x.shadowColor=b.color[0]+'99';x.shadowBlur=60;x.fillStyle=ag;rr(x,P,y,av,av,av*.3);x.fill();x.shadowBlur=0;
 x.fillStyle='#07070b';x.font='700 '+Math.round(av*.5)+'px '+F;x.textAlign='center';x.fillText(b.name.charAt(0).toUpperCase(),P+av/2,y+av*.67);x.textAlign='left';
 y+=av+(tall?90:70);
 x.fillStyle='#7c8cff';x.font='600 26px '+F;x.fillText('MEET YOUR NEW GROK BOT',P,y);y+=20;
 var ns=fitF(x,b.name,'700',W-2*P,tall?120:104,48);x.fillStyle='#ffffff';x.fillText(b.name,P,y+ns*.95);y+=ns*1.12;
 x.fillStyle='#c9c9d6';x.font='500 '+(tall?40:36)+'px '+F;wrapT(x,b.job,W-2*P,2).forEach(function(l){y+=tall?54:48;x.fillText(l,P,y)});
 y+=40;x.font='600 24px '+F;var pt=b.persLabel.toUpperCase(),pw=x.measureText(pt).width+40;x.fillStyle='#5eead41a';rr(x,P,y,pw,48,24);x.fill();x.strokeStyle='#5eead455';x.stroke();x.fillStyle='#5eead4';x.fillText(pt,P+20,y+32);y+=48+(tall?60:44);
 var foot=tall?230:170,rs=b.rules.length?b.rules:[b.persText],fs=tall?30:27,lh=fs*1.4;
 for(var i=0;i<rs.length;i++){x.font='500 '+fs+'px '+F;var ls=wrapT(x,rs[i],W-2*P-90,2),ch=ls.length*lh+36;if(y+ch>H-foot)break;x.fillStyle='#ffffff0a';rr(x,P,y,W-2*P,ch,22);x.fill();x.strokeStyle='#ffffff14';x.stroke();
  x.fillStyle=b.color[0];x.beginPath();x.arc(P+34,y+18+lh/2,6,0,7);x.fill();x.fillStyle='#e4e4ee';ls.forEach(function(l,j){x.fillText(l,P+62,y+18+lh*(j+1)-lh*.3)});y+=ch+14}
 var fy=H-P-(tall?60:20);x.strokeStyle='#ffffff1a';x.beginPath();x.moveTo(P,fy-70);x.lineTo(W-P,fy-70);x.stroke();
 x.fillStyle='#ffffff';x.font='700 30px '+F;x.fillText('Build yours free',P,fy-18);x.fillStyle='#9a9aab';x.font='500 26px '+F;x.fillText(SITE,P,fy+20);
 x.font='500 18px '+F;x.textAlign='right';x.fillStyle='#6b6b7b';x.fillText('Fan-made. Not affiliated with',W-P,fy-18);x.fillText('Grok Bot or xAI.',W-P,fy+10);x.textAlign='left'}
function dims(){return size==='45'?[1080,1350]:[1080,1920]}
function draw(){if(!bot)return;var d=dims();drawPoster($('#cv'),d[0],d[1],bot,1)}
document.querySelectorAll('[data-size]').forEach(function(b){b.onclick=function(){size=b.getAttribute('data-size');document.querySelectorAll('[data-size]').forEach(function(x){x.classList.toggle('on',x===b)});draw()}});
function hdBlob(){var d=dims(),c=document.createElement('canvas');drawPoster(c,d[0],d[1],bot,2);return new Promise(function(r){c.toBlob(r,'image/png')})}
function pname(){var d=dims();return 'grokhire-'+slug(bot.name)+'-'+d[0]*2+'x'+d[1]*2+'.png'}
$('#dl').onclick=async function(){save(await hdBlob(),pname());toast('HD poster downloaded. Free, as promised.');track('download-hd')};
$('#native').onclick=async function(){try{var bl=await hdBlob(),f=new File([bl],pname(),{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],text:shareText(),url:link()});return}if(navigator.share){await navigator.share({text:shareText(),url:link()});return}}catch(e){if(e&&e.name==='AbortError')return}toast(await clip(shareText()+' '+link())?'Sharing not supported here, so the link was copied.':'Copy failed')};
$('#copyLink').onclick=async function(){toast(await clip(link())?'Link copied. It rebuilds this bot for anyone who opens it.':'Copy failed')};


/* ---------- template gallery: search, category filter, one-click use, copy ---------- */
function findT(slug){for(var i=0;i<TPL.length;i++)if(TPL[i].s===slug)return TPL[i];return null}
function fill(t){$('#name').value=t.n;$('#job').value=t.j;$('#ins').value=t.i;$('#safe').checked=true;setPers(t.p);preview()}
function useT(slug,andBuild){var t=findT(slug);if(!t)return false;fill(t);track('template-'+slug);
 if(andBuild){build(true,true)}else{$('#build').scrollIntoView({behavior:'smooth',block:'start'});setTimeout(function(){$('#name').focus({preventScroll:true})},500)}
 try{history.replaceState(null,'','#t='+slug)}catch(e){}return true}
document.addEventListener('click',function(ev){var u=ev.target.closest&&ev.target.closest('[data-use]');if(u){ev.preventDefault();useT(u.getAttribute('data-use'),false);return}
 var c=ev.target.closest&&ev.target.closest('[data-copy]');if(c){var t=findT(c.getAttribute('data-copy'));if(!t)return;var b=make({name:t.n,job:t.j,pers:t.p,ins:t.i,safe:true});clip(b.text).then(function(ok){var o=c.textContent;c.textContent=ok?'Copied ✓':'Copy failed';setTimeout(function(){c.textContent=o},1600)});track('copy-template-'+t.s)}});
var cat='all';
function filter(){var q=($('#q').value||'').toLowerCase().trim(),words=q.split(/\s+/).filter(Boolean),n=0;
 document.querySelectorAll('.tcard').forEach(function(c){var hay=c.getAttribute('data-q'),ok=(cat==='all'||c.getAttribute('data-cat')===cat)&&words.every(function(w){return hay.indexOf(w)>=0});c.hidden=!ok;if(ok)n++});
 document.querySelectorAll('.gcat').forEach(function(g){g.hidden=!g.querySelector('.tcard:not([hidden])')});
 $('#count').textContent=n+(n===1?' template':' templates')+(cat!=='all'||q?' match':'');$('#empty').hidden=n>0}
function setCat(c){cat=c;document.querySelectorAll('#cats [data-cat]').forEach(function(b){var on=b.getAttribute('data-cat')===cat;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});filter()}
document.querySelectorAll('#cats [data-cat]').forEach(function(b){b.onclick=function(){setCat(b.getAttribute('data-cat'));try{history.replaceState(null,'',cat==='all'?location.pathname:'#c='+cat)}catch(e){}}});
$('#q').addEventListener('input',filter);filter();

/* ---------- open from a shared link ---------- */
function fromHash(){var h=location.hash,mt=h.match(/^#t=([a-z0-9-]{1,60})$/),mc=h.match(/^#c=([a-z]{1,30})$/);if(mt){if(useT(mt[1],true))track('open-template-link');return}if(mc){if(document.querySelector('#cats [data-cat="'+mc[1]+'"]')){setCat(mc[1]);$('#templates').scrollIntoView()}return}var m=h.match(/^#b=([A-Za-z0-9_-]{1,3000})$/);if(!m)return;var o=dec(m[1]);if(!o||typeof o!=='object')return;var n=clean(o.n,32),j=clean(o.j,120);if(!n||!j)return;$('#name').value=n;$('#job').value=j;$('#ins').value=clean(o.i,1200);$('#safe').checked=o.s!==0;setPers(o.p);preview();build(false,true);track('open-link')}
window.addEventListener('hashchange',fromHash);fromHash();

/* ---------- reveal on scroll ---------- */
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:0,rootMargin:'0px 0px -40px 0px'});document.querySelectorAll('.feat,.sechead').forEach(function(el){el.classList.add('reveal');io.observe(el)})}
window.GrokHire={make:make,json:json,drawPoster:drawPoster};
})();
