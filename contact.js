/* Fun "Contact me" widget: email only */
(function(){
var s=document.currentScript,E='info@d3ddd.com',SUB=s.getAttribute('data-subject')||'Hello human!',LINE=s.getAttribute('data-line')||'A real human reads every email.',EMO=s.getAttribute('data-emoji')||'👋';
var css='.ct-fab{position:fixed;right:16px;bottom:16px;z-index:60;display:flex;align-items:center;gap:8px;padding:10px 16px 10px 12px;border:0;border-radius:999px;background:linear-gradient(135deg,#ff5f6d,#ffc371);color:#1a1a1a;font:600 14px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 8px 28px #0004;cursor:pointer;animation:ct-wig 4s ease-in-out infinite;transition:transform .2s;max-width:calc(100vw - 32px)}'+
'.ct-fab:hover,.ct-fab:focus-visible{transform:scale(1.07) rotate(-3deg);animation-play-state:paused}.ct-fab:active{transform:scale(.94)}.ct-fab:focus-visible{outline:3px solid #fff;outline-offset:3px}'+
'.ct-fab .ct-e{font-size:20px;display:inline-block}.ct-fab:hover .ct-e{animation:ct-wave .6s ease-in-out 2}'+
'@keyframes ct-wig{0%,86%,100%{transform:rotate(0)}89%{transform:rotate(-6deg)}92%{transform:rotate(6deg)}95%{transform:rotate(-3deg)}}@keyframes ct-wave{50%{transform:rotate(20deg)}}@keyframes ct-pop{from{transform:scale(.8) translateY(20px);opacity:0}}'+
'.ct-ov{position:fixed;inset:0;z-index:100;background:#0008;display:flex;align-items:center;justify-content:center;padding:16px}.ct-ov[hidden]{display:none}'+
'.ct-m{position:relative;background:#fff;color:#111;border-radius:20px;padding:24px 22px 20px;max-width:360px;width:100%;box-sizing:border-box;text-align:center;font:15px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;animation:ct-pop .3s cubic-bezier(.3,1.6,.6,1)}'+
'.ct-m h2{margin:4px 0 8px;font-size:20px}.ct-m p{margin:0 0 16px;color:#444}.ct-big{font-size:40px}.ct-x{position:absolute;top:8px;right:10px;border:0;background:none;font-size:22px;cursor:pointer;color:#555;padding:4px 8px}'+
'.ct-row{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.ct-row a,.ct-row button{flex:1 1 130px;padding:11px 12px;border-radius:12px;font:600 14px sans-serif;cursor:pointer;text-decoration:none;border:2px solid #111}.ct-row a{background:#111;color:#fff}.ct-row button{background:#fff;color:#111}.ct-addr{margin-top:12px;font-size:13px;color:#666;word-break:break-all}'+
'@media (max-width:600px){.ct-fab .ct-t{display:none}.ct-fab{padding:12px;right:12px}}'+
'@media (prefers-reduced-motion:reduce){.ct-fab,.ct-fab .ct-e,.ct-m{animation:none!important;transition:none!important}.ct-fab:hover,.ct-fab:focus-visible{transform:none}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var b=document.createElement('button');b.className='ct-fab';b.type='button';b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-label','Talk to the human behind the bots');
b.innerHTML='<span class="ct-e" aria-hidden="true">'+EMO+'</span><span class="ct-t">Talk to the human behind the bots</span>';
var href='mailto:'+E+'?subject='+encodeURIComponent(SUB);
var ov=document.createElement('div');ov.className='ct-ov';ov.hidden=true;
ov.innerHTML='<div class="ct-m" role="dialog" aria-modal="true" aria-labelledby="ct-h"><button class="ct-x" type="button" aria-label="Close">×</button><div class="ct-big" aria-hidden="true">'+EMO+'</div><h2 id="ct-h">Psst… a real human!</h2><p></p><div class="ct-row"><a class="ct-mail" href="'+href+'">✉️ Email me</a><button type="button" class="ct-copy">📋 Copy email</button></div><div class="ct-addr">'+E+'</div><div class="ct-live" aria-live="polite" style="position:absolute;left:-9999px"></div></div>';
ov.querySelector('p').textContent=LINE;
function count(){try{if(window.goatcounter&&window.goatcounter.count)window.goatcounter.count({path:'contact-click',title:'Contact click',event:true})}catch(e){}}
function open(){count();ov.hidden=false;ov.querySelector('.ct-mail').focus()}
function close(){ov.hidden=true;b.focus()}
b.addEventListener('click',open);ov.querySelector('.ct-x').addEventListener('click',close);
ov.addEventListener('click',function(e){if(e.target===ov)close()});
document.addEventListener('keydown',function(e){if(ov.hidden)return;if(e.key==='Escape')close();if(e.key==='Tab'){var f=ov.querySelectorAll('button,a'),a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
var cp=ov.querySelector('.ct-copy');cp.addEventListener('click',function(){function ok(){cp.textContent='✅ Copied!';ov.querySelector('.ct-live').textContent='Email copied';setTimeout(function(){cp.textContent='📋 Copy email'},1800)}
if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(E).then(ok,function(){fb();ok()});else{fb();ok()}
function fb(){var t=document.createElement('textarea');t.value=E;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(e){}t.remove()}});
/* keep clear of sticky pay bar / other bottom fixed bars */
function lift(){var off=16,vh=innerHeight;document.querySelectorAll('.vk-pay,[data-sticky-bottom]').forEach(function(el){var cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')return;var r=el.getBoundingClientRect();if(r.height&&r.bottom>vh-120)off=Math.max(off,vh-r.top+10)});b.style.bottom=off+'px'}
function init(){document.body.appendChild(b);document.body.appendChild(ov);lift();setTimeout(lift,800);setTimeout(lift,2500);try{new MutationObserver(function(){requestAnimationFrame(lift)}).observe(document.body,{attributes:true,attributeFilter:['class','hidden'],subtree:true})}catch(e){}}
addEventListener('resize',lift);addEventListener('scroll',function(){requestAnimationFrame(lift)},{passive:true});
if(document.body)init();else document.addEventListener('DOMContentLoaded',init);
})();
