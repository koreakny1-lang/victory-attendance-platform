// 알림 수신 및 앱 설치 전용. 출결·사진·개인정보 응답은 캐시하지 않습니다.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
 let data={};try{data=event.data?.json()||{}}catch{}
 const title=typeof data.title==='string'?data.title:'태권도 출석 알림';
 const body=typeof data.body==='string'?data.body:'출결 내역을 확인해 주세요.';
 const url=(typeof data.url==='string'&&data.url.startsWith('/parent.html?dojo='))?data.url:'/';
 event.waitUntil(self.registration.showNotification(title,{body,icon:'/icon.svg',badge:'/icon.svg',tag:'platform-attendance-'+(data.event_id||Date.now()),data:{url}}));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();const url=new URL(event.notification.data?.url||'/',self.location.origin);
 if(url.origin!==self.location.origin)return;
 event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async list=>{
  for(const client of list){if(client.url.startsWith(url.origin)){await client.focus();return}}
  await self.clients.openWindow(url.href);
 }));
});
