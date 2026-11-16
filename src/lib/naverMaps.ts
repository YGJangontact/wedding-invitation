let loading: Promise<any> | undefined;
export function loadNaverMaps(clientId:string):Promise<any> {
 const win=window as any;
 if(win.naver?.maps?.Service) return Promise.resolve(win.naver.maps);
 if(loading) return loading;
 loading=new Promise((resolve,reject)=>{
  if(!clientId){reject(new Error('Missing map key'));return;}
  let settled=false;
  const finish=(error?:Error)=>{
   if(settled)return;settled=true;clearTimeout(timer);
   if(error)reject(error);else resolve(win.naver.maps);
  };
  const timer=setTimeout(()=>finish(new Error('Map SDK timeout')),18000);
  win.navermap_authFailure=()=>finish(new Error('Map authorization failed'));
  win.initInvitationMaps=()=>win.naver?.maps?.Service?finish():finish(new Error('Map geocoder missing'));
  const script=document.createElement('script');
  script.src='https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId='+encodeURIComponent(clientId)+'&submodules=geocoder&callback=initInvitationMaps';
  script.async=true;script.onerror=()=>finish(new Error('Map network error'));
  document.head.append(script);
 });
 return loading;
}
