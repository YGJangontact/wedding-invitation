import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mapDestination,installNaverMapLinks} from './naverMapLinks.mjs';
const web='https://map.naver.com/p/search/'+encodeURIComponent('우리은행 ATM 한경미디어지점');
const page='https://ygjangontact.github.io/wedding-invitation/';
test('Android Kakao intent preserves Korean query and web fallback',()=>{
 const dest=mapDestination(web,page,'Android KAKAOTALK');
 assert.ok(dest.startsWith('intent://search?'));
 const params=new URLSearchParams(dest.split('?')[1].split('#')[0]);
 assert.equal(params.get('query'),'우리은행 ATM 한경미디어지점');
 assert.equal(params.get('appname'),page);
 assert.ok(dest.includes('package=com.nhn.android.nmap;'));
 assert.ok(dest.includes('S.browser_fallback_url='+encodeURIComponent(web)+';end'));
});
test('iPhone Kakao and desktop-mode iPad use nmap, desktop uses web',()=>{
 assert.ok(mapDestination(web,page,'iPhone KAKAOTALK').startsWith('nmap://search?'));
 assert.ok(mapDestination(web,page,'Macintosh',5).startsWith('nmap://search?'));
 assert.equal(mapDestination(web,page,'Windows'),null);
 assert.equal(mapDestination('https://example.org/p/search/test',page,'Android'),null);
});
function harness(ua='iPhone KAKAOTALK'){
 const doc=new EventTarget();doc.hidden=false;
 const win=new EventTarget();win.navigator={userAgent:ua,maxTouchPoints:0};
 const urls=[];win.location={origin:new URL(page).origin,pathname:new URL(page).pathname,assign:url=>urls.push(url)};
 const timers=new Map();let serial=0;
 win.setTimeout=fn=>{timers.set(++serial,fn);return serial;};
 win.clearTimeout=id=>timers.delete(id);
 const dispose=installNaverMapLinks(win,doc);
 const click=(prevented=false)=>{
  const e=new Event('click',{cancelable:true});e.button=0;
  Object.defineProperty(e,'target',{value:{closest:()=>({href:web})}});
  if(prevented)e.preventDefault();
  doc.dispatchEvent(e);return e;
 };
 return {doc,win,urls,timers,dispose,click,tick:()=>{for(const fn of [...timers.values()])fn();}};
}
test('unavailable app falls back to matching web destination',()=>{
 const h=harness();assert.equal(h.click().defaultPrevented,true);
 assert.ok(h.urls[0].startsWith('nmap://'));h.tick();assert.equal(h.urls[1],web);
});
test('returning from app does not navigate to fallback',()=>{
 const h=harness();h.click();h.doc.hidden=true;h.doc.dispatchEvent(new Event('visibilitychange'));
 h.doc.hidden=false;h.doc.dispatchEvent(new Event('visibilitychange'));h.tick();assert.equal(h.urls.length,1);
});
test('pagehide cancels fallback and repeated taps keep only latest timer',()=>{
 const h=harness();h.click();h.click();assert.equal(h.timers.size,1);
 h.win.dispatchEvent(new Event('pagehide'));h.tick();assert.equal(h.urls.length,2);
});
test('drag-cancelled clicks do not attempt app or web navigation',()=>{
 const h=harness();h.click(true);h.tick();assert.equal(h.urls.length,0);
});
test('desktop keeps native web link with no fallback timer',()=>{
 const h=harness('Windows');assert.equal(h.click().defaultPrevented,false);assert.equal(h.timers.size,0);
});
test('blocked scheme exception falls back immediately; cleanup cancels pending work',()=>{
 const h=harness();h.win.location.assign=url=>{if(url.startsWith('nmap:'))throw Error('blocked');h.urls.push(url);};
 h.click();assert.deepEqual(h.urls,[web]);assert.equal(h.timers.size,0);
 const other=harness();other.click();other.dispose();other.tick();assert.equal(other.urls.length,1);
});
