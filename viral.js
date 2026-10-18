/* ViralKit: share cards, challenge links, local best scores and a sticky pay CTA.
   Fully client-side. No secrets, no backend. Payments go through the relative pay/?item= page. */
(function(){
'use strict';
var C={slug:'site',name:'Site',url:location.origin+location.pathname,emoji:'✨',c1:'#2997ff',c2:'#bf5af2',light:false};
var $=function(s,r){return (r||document).querySelector(s)};
function el(tag,attrs,kids){var e=document.createElement(tag);for(var k in attrs||{}){if(k==='text')e.textContent=attrs[k];else if(k==='html')e.innerHTML=attrs[k];else if(k.slice(0,2)==='on')e[k]=attrs[k];else e.setAttribute(k,attrs[k])}(kids||[]).forEach(function(c){if(c)e.appendChild(c)});return e}
function count(ev,title){try{if(window.goatcounter&&window.goatcounter.count)window.goatcounter.count({path:C.slug+'/'+ev,title:title||ev,event:true})}catch(e){}}
/* Any element with data-ev="share-x" etc. is counted on click. */
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-ev]');if(t)count(t.getAttribute('data-ev'),(t.textContent||'').trim().slice(0,40))},true);
/* base64url JSON (UTF-8 safe) */
function enc(o){var b=new TextEncoder().encode(JSON.stringify(o)),s='';b.forEach(function(c){s+=String.fromCharCode(c)});return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function dec(s){try{s=String(s).replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';var bin=atob(s);return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin,function(c){return c.charCodeAt(0)})))}catch(e){return null}}
function readChallenge(){var q=new URLSearchParams(location.search).get('c');if(!q||q.length>3000||!/^[A-Za-z0-9_-]+$/.test(q))return null;var o=dec(q);return o&&typeof o==='object'?o:null}
function challengeUrl(o){return C.url+'?c='+enc(o)}
function clean(s,n){return String(s==null?'':s).replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,n||40)}
function getName(){try{return localStorage.getItem('vk-name')||''}catch(e){return ''}}
function setName(v){try{localStorage.setItem('vk-name',clean(v,24))}catch(e){}}
var CSS='.vk{--vk1:VK1;--vk2:VK2}.vk-banner{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin:16px auto;max-width:900px;padding:14px 16px;border-radius:18px;border:1px solid color-mix(in srgb,var(--vk1) 55%,transparent);background:color-mix(in srgb,var(--vk1) 14%,transparent);font-weight:600;line-height:1.4;box-sizing:border-box}.vk-banner p{margin:0;flex:1 1 220px;overflow-wrap:anywhere}'+
'.vk-btn{display:inline-block;border:0;border-radius:999px;padding:11px 18px;font:800 15px/1.2 inherit;font-family:inherit;cursor:pointer;color:#fff;background:linear-gradient(90deg,var(--vk1),var(--vk2));text-decoration:none;text-align:center;white-space:nowrap}'+
'.vk-g{display:inline-block;border-radius:12px;padding:9px 13px;font:600 14px/1.2 inherit;font-family:inherit;cursor:pointer;text-decoration:none;border:1px solid VKLINE;background:VKG;color:inherit}'+
'.vk-share{margin-top:18px;text-align:left}.vk-share h3{margin:0 0 8px;font-size:18px}.vk-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px}.vk-cv{display:block;width:100%;max-width:520px;height:auto;border-radius:14px;margin-top:10px;box-shadow:0 8px 30px #0003}.vk-name{max-width:240px}.vk-small{font-size:13px;opacity:.75}'+
'.vk-seg .on{outline:2px solid var(--vk1)}.vk-board{margin-top:16px;text-align:left}.vk-board ol{margin:6px 0 0;padding-left:22px}.vk-board li{margin:3px 0}'+
'.vk-pay{position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:50;display:flex;gap:10px;align-items:center;max-width:calc(100% - 24px);width:max-content;box-sizing:border-box;padding:8px 8px 8px 16px;border-radius:999px;background:VKBAR;color:VKBARTXT;box-shadow:0 10px 40px #0005;border:1px solid VKLINE;font-weight:700;font-size:14px}.vk-pay span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}.vk-pay .vk-x{background:none;border:0;color:inherit;opacity:.6;cursor:pointer;font-size:18px;padding:4px 6px}'+
'.vk-hero-pay{margin-top:14px}.vk-price{display:inline-block;font-weight:800;margin-left:6px;padding:2px 8px;border-radius:999px;background:#0002}body.vk-has-pay{padding-bottom:84px}@media(max-width:480px){.vk-pay{font-size:13px;padding-left:12px}.vk-btn{padding:10px 14px;font-size:14px}}';
function init(cfg){for(var k in cfg)C[k]=cfg[k];var css=CSS.replace('VK1',C.c1).replace('VK2',C.c2).replace(/VKLINE/g,C.light?'#0000001f':'#ffffff2a').replace('VKG',C.light?'#0000000a':'#ffffff12').replace('VKBAR',C.light?'#ffffffee':'#141418ee').replace('VKBARTXT',C.light?'#1d1d1f':'#f5f5f7');document.head.appendChild(el('style',{text:css}));document.body.classList.add('vk')}
/* ---------- share card ---------- */
var F='-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
function lines(x,t,max,n){var w=String(t).split(/\s+/),out=[],l='';for(var i=0;i<w.length;i++){var tt=l?l+' '+w[i]:w[i];if(x.measureText(tt).width>max&&l){out.push(l);l=w[i];if(out.length===n)break}else l=tt}if(out.length<n&&l)out.push(l);else if(l&&out.length===n&&w.length){var last=out[n-1];if(l!==last)out[n-1]=last.replace(/\s*\S*$/,'')+'…'}return out}
function fit(x,t,weight,max,start,min){var s=start;do{x.font=weight+' '+s+'px '+F;if(x.measureText(t).width<=max)break;s-=4}while(s>min);return s}
function drawCard(cv,W,H,d){cv.width=W;cv.height=H;var x=cv.getContext('2d'),wide=W/H>1.5,P=wide?70:90,S=wide?0.86:1;
 var g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#0b0b10');g.addColorStop(1,'#16161d');x.fillStyle=g;x.fillRect(0,0,W,H);
 var r=x.createRadialGradient(W*.9,0,0,W*.9,0,W*.9);r.addColorStop(0,C.c1+'66');r.addColorStop(1,C.c1+'00');x.fillStyle=r;x.fillRect(0,0,W,H);
 r=x.createRadialGradient(0,H,0,0,H,W*.8);r.addColorStop(0,C.c2+'55');r.addColorStop(1,C.c2+'00');x.fillStyle=r;x.fillRect(0,0,W,H);
 x.textBaseline='alphabetic';x.fillStyle='#f5f5f7';x.font='800 '+Math.round(40*S)+'px '+F;x.fillText(C.emoji+'  '+C.name,P,P+30);
 var y=P+(wide?110:190);
 if(d.kicker){x.fillStyle='#ffffffaa';x.font='700 '+Math.round(30*S)+'px '+F;lines(x,String(d.kicker).toUpperCase(),W-2*P,1).forEach(function(l){x.fillText(l,P,y)});y+=wide?20:30}
 var area=W-2*P,lim=H-P-(wide?80:150);if(d.img){area=wide?W-2*P-420:area}
 if(d.big){var bs=fit(x,d.big,'800',area,wide?150:210,60);var gg=x.createLinearGradient(0,y,0,y+bs);gg.addColorStop(0,C.c1);gg.addColorStop(1,C.c2);x.fillStyle=gg;x.fillText(d.big,P,y+bs*.9);y+=bs*1.05}
 if(d.line){x.fillStyle='#f5f5f7';var ls=Math.round((wide?40:52));x.font='700 '+ls+'px '+F;lines(x,d.line,area,wide?2:3).forEach(function(l){if(y+ls*1.25>lim)return;y+=ls*1.25;x.fillText(l,P,y)})}
 if(d.sub){x.fillStyle='#d4d4d8';var ss=wide?28:36;x.font='500 '+ss+'px '+F;y+=ss*.6;lines(x,d.sub,area,wide?2:3).forEach(function(l){if(y+ss*1.3>lim)return;y+=ss*1.3;x.fillText(l,P,y)})}
 if(d.img){try{var iw=wide?380:W-2*P,ih=wide?380:Math.min(H-y-260,560),ix=wide?W-P-iw:P,iy=wide?(H-iw)/2-10:y+30,s=Math.min(iw/d.img.width,ih/d.img.height),dw=d.img.width*s,dh=d.img.height*s;x.fillStyle='#fff';x.beginPath();x.roundRect(ix+(iw-dw)/2-10,iy-10,dw+20,dh+20,18);x.fill();x.drawImage(d.img,ix+(iw-dw)/2,iy,dw,dh)}catch(e){}}
 var by=H-P+(wide?10:0),ch=Math.round(68*S);x.font='700 '+Math.round(30*S)+'px '+F;var uu=C.url.replace(/^https?:\/\//,'').replace(/\/$/,'');
 if(d.cta){x.font='800 '+Math.round(32*S)+'px '+F;var cw=x.measureText(d.cta).width+56,cy=wide?by-ch+12:by-ch-56;var cg=x.createLinearGradient(P,0,P+cw,0);cg.addColorStop(0,C.c1);cg.addColorStop(1,C.c2);x.fillStyle=cg;x.beginPath();x.roundRect(P,cy,cw,ch,ch/2);x.fill();x.fillStyle='#0b0b10';x.fillText(d.cta,P+28,cy+ch/2+Math.round(11*S))}
 x.fillStyle='#ffffffb0';x.font='700 '+Math.round(30*S)+'px '+F;if(wide){x.textAlign='right';x.fillText(uu,W-P,by);x.textAlign='left'}else x.fillText(uu,P,by)}
async function clip(s){try{await navigator.clipboard.writeText(s);return true}catch(e){var t=el('textarea');t.value=s;document.body.appendChild(t);t.select();var ok=false;try{ok=document.execCommand('copy')}catch(_){}t.remove();return ok}}
/* mount: element to append into. get(): {kicker,big,line,sub,cta,img,text,url,challenge(bool)} */
function sharePanel(mount,get,opts){opts=opts||{};var size='sq',toastEl,cv=el('canvas',{class:'vk-cv',width:1080,height:1080,'aria-label':'Share card preview'});
 var name=el('input',{class:'vk-name','aria-label':'Your name (optional)',placeholder:'Your name (optional)',maxlength:'24'});name.value=getName();name.oninput=function(){setName(name.value);upd()};
 function b(t,ev,fn){return el('button',{class:'vk-g',type:'button','data-ev':ev,text:t,onclick:fn})}
 function intent(t,ev){var a=el('a',{class:'vk-g',target:'_blank',rel:'noopener','data-ev':ev,text:t,href:'#'});return a}
 var sq=b('1:1 · 1080','share-size-square',function(){size='sq';upd()}),wd=b('1200×630','share-size-wide',function(){size='wd';upd()});
 var X=intent('X','share-x'),FB=intent('Facebook','share-facebook'),LI=intent('LinkedIn','share-linkedin'),RD=intent('Reddit','share-reddit');
 var data={};function url(){return data.url||C.url}
 function toast(m){toastEl.textContent=m}
 function upd(){data=get(name.value.trim())||{};var W=size==='sq'?1080:1200,H=size==='sq'?1080:630;drawCard(cv,W,H,data);sq.classList.toggle('on',size==='sq');wd.classList.toggle('on',size!=='sq');
  var u=url(),t=data.text||C.name;X.href='https://twitter.com/intent/tweet?text='+encodeURIComponent(t)+'&url='+encodeURIComponent(u);FB.href='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(u);LI.href='https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(u);RD.href='https://www.reddit.com/submit?url='+encodeURIComponent(u)+'&title='+encodeURIComponent(t)}
 function blob(){return new Promise(function(r){cv.toBlob(r,'image/png')})}
 var file=C.slug+'-card';
 var dl=b('⬇ Download PNG','download-card',async function(){var bl=await blob();var a=el('a',{href:URL.createObjectURL(bl),download:file+(size==='sq'?'-1080x1080':'-1200x630')+'.png'});document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},2000);toast('Card downloaded ✓');opts.onShare&&opts.onShare('download')});
 var sh=b('📤 Share','share-native',async function(){try{var bl=await blob(),f=new File([bl],file+'.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],text:data.text||'',url:url()});opts.onShare&&opts.onShare('native');return}if(navigator.share){await navigator.share({text:data.text||'',url:url()});opts.onShare&&opts.onShare('native');return}}catch(e){if(e&&e.name==='AbortError')return}var ok=await clip((data.text?data.text+' ':'')+url());toast(ok?'Sharing isn\'t supported here, so the text and link were copied ✓':'Copy not available here');opts.onShare&&opts.onShare('copy')});
 var cp=b(opts.copyLabel||'🔗 Copy challenge link','share-copy-link',async function(){var ok=await clip(url());toast(ok?'Link copied ✓ Send it to a friend':'Copy not available here');opts.onShare&&opts.onShare('link')});
 [X,FB,LI,RD].forEach(function(a){a.addEventListener('click',function(){opts.onShare&&opts.onShare('intent')})});
 toastEl=el('p',{class:'vk-small',role:'status'});
 var box=el('div',{class:'vk-share'},[el('h3',{text:opts.title||'Share your result'}),opts.noName?null:el('div',{class:'vk-row'},[name,el('span',{class:'vk-small',text:'Shown on your card and challenge link only.'})]),el('div',{class:'vk-row vk-seg',role:'group','aria-label':'Card size'},[sq,wd]),cv,el('div',{class:'vk-row'},[dl,sh,cp]),el('div',{class:'vk-row'},[el('span',{class:'vk-small',text:'Post to:'}),X,FB,LI,RD]),toastEl]);
 mount.appendChild(box);return{update:upd,canvas:cv,el:box}}
/* ---------- challenge banner ---------- */
function banner(text,cta,onCta,before){var b=el('div',{class:'vk-banner',role:'note'},[el('p',{text:text})]);var a=el(typeof onCta==='string'?'a':'button',{class:'vk-btn','data-ev':'challenge-accept',text:cta});if(typeof onCta==='string')a.href=onCta;else a.onclick=onCta;b.appendChild(a);(before&&before.parentNode?before.parentNode.insertBefore(b,before):document.body.prepend(b));count('challenge-open','Opened a challenge link');return b}
/* ---------- local best scores (this device only) ---------- */
function board(key,mount,fmt,opts){opts=opts||{};var k='vk-best-'+key,box=el('div',{class:'vk-board'});mount.appendChild(box);
 function load(){try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}}
 function render(hl){var l=load();box.innerHTML='';box.appendChild(el('b',{text:'🏆 Your best scores on this device'}));if(!l.length){box.appendChild(el('p',{class:'vk-small',text:'No scores yet. Play a round to set one.'}));return}var ol=el('ol');l.forEach(function(e){var li=el('li',{text:fmt(e)});if(hl&&e.t===hl)li.style.fontWeight='800';ol.appendChild(li)});box.appendChild(ol);box.appendChild(el('p',{class:'vk-small',text:'Stored only in this browser. There is no global leaderboard.'}))}
 function add(e){e.t=Date.now();var l=load();l.push(e);l.sort(function(a,b){return (b.s-a.s)||(a.t-b.t)});l=l.slice(0,opts.max||5);try{localStorage.setItem(k,JSON.stringify(l))}catch(_){}render(e.t);return l.some(function(x){return x.t===e.t})&&l[0].t===e.t}
 render();return{add:add,load:load,render:render}}
/* ---------- pay CTAs ---------- */
function payBar(o){var bar=el('div',{class:'vk-pay',role:'region','aria-label':'Paid option',hidden:''},[el('span',{text:o.label}),el('a',{class:'vk-btn',href:'pay/?item='+o.item,target:'_blank',rel:'noopener',text:o.cta+' · $'+o.price}),el('button',{class:'vk-x',type:'button','aria-label':'Dismiss','data-ev':'pay-bar-dismiss',text:'×',onclick:function(){bar.hidden=true;document.body.classList.remove('vk-has-pay');closed=true}})]);var closed=false;document.body.appendChild(bar);
 return{show:function(){if(closed)return;bar.hidden=false;document.body.classList.add('vk-has-pay')},el:bar}}
function heroPay(mount,o){var a=el('a',{class:'vk-btn vk-hero-pay',href:'pay/?item='+o.item,target:'_blank',rel:'noopener'});a.appendChild(document.createTextNode(o.cta+' '));a.appendChild(el('span',{class:'vk-price',text:'$'+o.price}));var p=el('p',{class:'vk-row',style:'justify-content:center'},[a]);if(o.note)p.appendChild(el('span',{class:'vk-small',text:o.note}));mount.appendChild(p);return a}
window.Viral={init:init,count:count,enc:enc,dec:dec,readChallenge:readChallenge,challengeUrl:challengeUrl,clean:clean,drawCard:drawCard,sharePanel:sharePanel,banner:banner,board:board,payBar:payBar,heroPay:heroPay,getName:getName,clip:clip,cfg:C};
})();
