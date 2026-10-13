/* Shared browser-only behaviour for all pages. No build step or server required. */
(() => {
  "use strict";
  const STORAGE_KEY = "gml-mandals-v1";
  const starterMandals = [
    {id:"mira-road-cha-raja",name:"Mira Road Cha Raja",area:"Shanti Nagar, Mira Road East",address:"Ekta Yuva Mandal, Sector 10, Shanti Nagar, Mira Road East, Maharashtra",lat:19.2848,lng:72.8691,image:"https://images.unsplash.com/photo-1606293926075-69a00db0f6c3?auto=format&fit=crop&w=900&q=85",description:"A much-loved community celebration bringing devotees together for darshan, aarti and the spirit of Ganeshotsav.",morning:"",evening:"9:15 PM",instagram:"https://www.instagram.com/ladka_mumbai_cha/",phone:""},
    {id:"shanti-nagar-cha-gajavakra",name:"Shanti Nagar Cha Gajavakra",area:"Shanti Nagar, Mira Road",address:"Shanti Nagar, Mira Road East, Maharashtra, India",lat:19.2856,lng:72.8705,image:"https://images.unsplash.com/photo-1604608672516-8a7b6e6d2e34?auto=format&fit=crop&w=900&q=85",description:"A neighbourhood mandal celebrating devotion, tradition and togetherness. Please confirm the current programme with organisers.",morning:"",evening:"",instagram:"",phone:""},
    {id:"mira-bhayander-cha-vighneshwar",name:"Mira Bhayandar Cha Vighneshwar",area:"Bhayandar, Maharashtra",address:"Bhayandar Fatak area, Mira Bhayandar, Maharashtra, India",lat:19.3014,lng:72.8512,image:"https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85",description:"A community celebration honouring Bappa and bringing local families together during Ganeshotsav.",morning:"",evening:"",instagram:"https://www.instagram.com/mira_bhayander_cha_vighneshwar/",phone:""}
  ];
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const validUrl = value => { try { const u = new URL(value); return ["http:","https:"].includes(u.protocol) ? u.href : ""; } catch { return ""; } };
  const getMandals = () => { try { const raw=localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : starterMandals.slice(); } catch { return starterMandals.slice(); } };
  const saveMandals = list => localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  if (!localStorage.getItem(STORAGE_KEY)) saveMandals(starterMandals);
  const imageFallback = "https://placehold.co/900x600/eef4ff/3b82f6?text=Ganpati+Mandal";
  const mapUrl = m => Number.isFinite(Number(m.lat)) && Number.isFinite(Number(m.lng)) && m.lat!=="" && m.lng!=="" ? `https://www.openstreetmap.org/?mlat=${encodeURIComponent(m.lat)}&mlon=${encodeURIComponent(m.lng)}#map=17/${encodeURIComponent(m.lat)}/${encodeURIComponent(m.lng)}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.address || m.name)}`;
  const directionsUrl = m => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(Number.isFinite(Number(m.lat)) && m.lat!=="" ? `${m.lat},${m.lng}` : m.address || m.name)}`;
  function card(m) {
    const image=validUrl(m.image)||imageFallback;
    return `<article class="mandal-card reveal"><a href="mandal.html?id=${encodeURIComponent(m.id)}" class="mandal-image"><img src="${escapeHTML(image)}" alt="${escapeHTML(m.name)}" loading="lazy" onerror="this.src='${imageFallback}'"><span class="image-tag"><i class="fa-solid fa-location-dot"></i> ${escapeHTML(m.area||"Local mandal")}</span></a><div class="mandal-content"><span class="mandal-area">${escapeHTML(m.area||"Area not specified")}</span><h3>${escapeHTML(m.name)}</h3><p>${escapeHTML(m.description||"Mandal information will be updated soon.")}</p><div class="card-meta">${m.evening?`<span><i class="fa-regular fa-clock"></i>${escapeHTML(m.evening)}</span>`:""}<span><i class="fa-solid fa-map-pin"></i>Location details</span></div><div class="card-actions"><a href="mandal.html?id=${encodeURIComponent(m.id)}">View details</a><a href="${directionsUrl(m)}" target="_blank" rel="noopener noreferrer">Directions <i class="fa-solid fa-arrow-up-right-from-square"></i></a></div></div></article>`;
  }
  function observeReveals(root=document) {
    const els=$$(".reveal",root);
    if(!("IntersectionObserver" in window)){els.forEach(e=>e.classList.add("in-view"));return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("in-view");observer.unobserve(entry.target);}}),{threshold:.08});
    els.forEach(e=>observer.observe(e));
  }
  function initNav() {
    const toggle=$(".menu-toggle"),nav=$(".main-nav");
    toggle?.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.innerHTML=open?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>';});
    const applyTheme=theme=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem("gml-theme",theme)}catch{};$$(".theme-toggle").forEach(b=>b.innerHTML=theme==="dark"?'<i class="fa-solid fa-sun"></i>':'<i class="fa-solid fa-moon"></i>');};
    let initial="light";try{initial=localStorage.getItem("gml-theme")||"light"}catch{};applyTheme(initial);
    $$(".theme-toggle").forEach(b=>b.addEventListener("click",()=>applyTheme(document.documentElement.dataset.theme==="dark"?"light":"dark")));
    const top=$("#back-to-top");const onScroll=()=>top?.classList.toggle("visible",window.scrollY>500);window.addEventListener("scroll",onScroll,{passive:true});onScroll();top?.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
    $$("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());
    window.addEventListener("load",()=>{document.body.classList.remove("loading");$("#preloader")?.classList.add("done");});setTimeout(()=>$("#preloader")?.classList.add("done"),1800);
    observeReveals();
  }
  function initCanvas() {
    const canvas=$("#particle-canvas");if(!canvas)return;const ctx=canvas.getContext("2d");if(!ctx)return;let w=0,h=0,particles=[],raf;
    const resize=()=>{w=canvas.width=canvas.clientWidth*devicePixelRatio;h=canvas.height=canvas.clientHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);particles=Array.from({length:Math.min(65,Math.floor(canvas.clientWidth/16))},()=>({x:Math.random()*canvas.clientWidth,y:Math.random()*canvas.clientHeight,r:Math.random()*1.8+.5,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.22}));};
    const draw=()=>{ctx.clearRect(0,0,w,h);const width=canvas.clientWidth,height=canvas.clientHeight;particles.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>width)p.vx*=-1;if(p.y<0||p.y>height)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle="rgba(59,130,246,.34)";ctx.fill();for(let j=i+1;j<particles.length;j++){const q=particles[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy);if(d<105){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(59,130,246,${.09*(1-d/105)})`;ctx.stroke();}}});if(!matchMedia("(prefers-reduced-motion: reduce)").matches)raf=requestAnimationFrame(draw);};
    resize();draw();window.addEventListener("resize",()=>{cancelAnimationFrame(raf);resize();draw();});
  }
  function initHome() {
    const featured=$("#featured-mandals");if(featured){const list=getMandals();featured.innerHTML=list.slice(0,3).map(card).join("")||'<div class="empty-state">No mandals added yet. Visit Admin to add a listing.</div>';observeReveals(featured);const areas=new Set(list.map(m=>m.area).filter(Boolean));animateCounter($("#stat-mandals"),list.length);animateCounter($("#stat-areas"),areas.size);animateCounter($("#stat-community"),100);}
    $("#hero-search")?.addEventListener("submit",e=>{e.preventDefault();location.href=`mandals.html?q=${encodeURIComponent($("#hero-query").value.trim())}`;});
    const mapEl=$("#home-map");if(mapEl&&window.L){const list=getMandals().filter(m=>m.lat!==""&&m.lng!==""&&Number.isFinite(Number(m.lat))&&Number.isFinite(Number(m.lng)));const map=L.map(mapEl,{scrollWheelZoom:false}).setView([19.285,72.868],12);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(map);list.forEach(m=>L.marker([Number(m.lat),Number(m.lng)]).addTo(map).bindPopup(`<strong>${escapeHTML(m.name)}</strong><br>${escapeHTML(m.area||"")}<br><a href="mandal.html?id=${encodeURIComponent(m.id)}">View details</a>`));if(list.length>1)map.fitBounds(list.map(m=>[Number(m.lat),Number(m.lng)]),{padding:[30,30]});}
    initCanvas();
  }
  function animateCounter(el,target){if(!el)return;const start=performance.now(),duration=850;const step=now=>{const p=Math.min(1,(now-start)/duration);el.textContent=Math.round(target*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step);};requestAnimationFrame(step);}
  function initDirectory(){
    const grid=$("#directory-grid");if(!grid)return;const search=$("#directory-search"),filter=$("#area-filter"),count=$("#results-count"),empty=$("#directory-empty");
    const params=new URLSearchParams(location.search);if(params.has("q"))search.value=params.get("q");
    const areas=[...new Set(getMandals().map(m=>m.area).filter(Boolean))].sort();areas.forEach(a=>{const opt=document.createElement("option");opt.value=a;opt.textContent=a;filter.append(opt);});
    const render=()=>{const q=search.value.toLowerCase().trim(),area=filter.value;const list=getMandals().filter(m=>(`${m.name} ${m.area} ${m.address}`.toLowerCase().includes(q))&&(!area||m.area===area));grid.innerHTML=list.map(card).join("");count.textContent=`${list.length} ${list.length===1?"mandal":"mandals"}`;empty.hidden=list.length>0;observeReveals(grid);};
    search.addEventListener("input",render);filter.addEventListener("change",render);render();
  }
  function initDetail(){
    const root=$("#mandal-detail");if(!root)return;const id=new URLSearchParams(location.search).get("id"),m=getMandals().find(x=>x.id===id);
    if(!m){root.innerHTML='<a class="text-link" href="mandals.html"><i class="fa-solid fa-arrow-left"></i> Back to mandals</a><div class="empty-state" style="margin-top:25px">We couldn’t find that mandal. It may have been removed or the link may be incomplete.</div>';return;}
    document.title=`${m.name} | Ganpati Mandal Locator`;const image=validUrl(m.image)||imageFallback;
    root.innerHTML=`<a class="text-link" href="mandals.html"><i class="fa-solid fa-arrow-left"></i> Back to mandals</a><div class="detail-hero"><img class="detail-photo" src="${escapeHTML(image)}" alt="${escapeHTML(m.name)}" onerror="this.src='${imageFallback}'"><div class="detail-copy"><div class="eyebrow blue">MANDAL DETAILS</div><h1>${escapeHTML(m.name)}</h1><span class="mandal-area">${escapeHTML(m.area||"Area not specified")}</span><p>${escapeHTML(m.description||"More information about this mandal will be shared soon.")}</p><div class="detail-info"><div><i class="fa-solid fa-location-dot"></i><span>${escapeHTML(m.address||"Address not provided")}</span></div>${m.morning?`<div><i class="fa-regular fa-clock"></i><span>Morning aarti: ${escapeHTML(m.morning)}</span></div>`:""}${m.evening?`<div><i class="fa-regular fa-clock"></i><span>Evening aarti: ${escapeHTML(m.evening)}</span></div>`:""}${m.phone?`<div><i class="fa-solid fa-phone"></i><span>${escapeHTML(m.phone)}</span></div>`:""}</div><div class="detail-social"><a class="button button-primary" href="${directionsUrl(m)}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-diamond-turn-right"></i> Get directions</a>${validUrl(m.instagram)?`<a class="button button-outline" href="${escapeHTML(validUrl(m.instagram))}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-instagram"></i> Instagram</a>`:""}</div></div></div><h2 class="subheading">Find the location</h2><p class="muted">Check the pin and open directions before travelling.</p><div class="detail-map" id="detail-map"></div><p class="privacy-note">Aarti timings and event details can change. Please confirm directly with the organisers.</p>`;
    const mapEl=$("#detail-map");if(mapEl&&window.L&&m.lat!==""&&m.lng!==""&&Number.isFinite(Number(m.lat))&&Number.isFinite(Number(m.lng))){const map=L.map(mapEl).setView([Number(m.lat),Number(m.lng)],15);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; OpenStreetMap contributors'}).addTo(map);L.marker([Number(m.lat),Number(m.lng)]).addTo(map).bindPopup(escapeHTML(m.name)).openPopup();}else if(mapEl){mapEl.innerHTML=`<div class="empty-state">Coordinates have not been added for this listing. <a class="text-link" href="${mapUrl(m)}" target="_blank" rel="noopener noreferrer">Search this address on a map</a></div>`;}
  }
  function initContact(){const form=$("#contact-form");form?.addEventListener("submit",e=>{e.preventDefault();const status=$("#contact-status");if(!form.reportValidity()){status.textContent="Please complete the required fields with valid information.";return;}status.textContent="Your message is valid. This static demo does not send it yet—connect a form service to receive submissions.";});}
  function initGallery(){const lightbox=$("#lightbox");if(!lightbox)return;const img=$("img",lightbox);$$(".gallery-item").forEach(b=>b.addEventListener("click",()=>{img.src=validUrl(b.dataset.full)||imageFallback;img.alt=$("img",b)?.alt||"Gallery image";lightbox.hidden=false;document.body.classList.add("no-scroll");$(".lightbox-close",lightbox)?.focus();}));const close=()=>{lightbox.hidden=true;document.body.classList.remove("no-scroll");};$(".lightbox-close",lightbox)?.addEventListener("click",close);lightbox.addEventListener("click",e=>{if(e.target===lightbox)close();});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!lightbox.hidden)close();});}
  function initAdminLock(){
    const gate=$("#admin-lock");if(!gate)return;
    const lockForm=$("#admin-lock-form"),pinInput=$("#admin-lock-password"),status=$("#admin-lock-status"),copy=$("#admin-lock-copy"),submit=$("#admin-lock-submit");
    const SESSION_KEY="gml-admin-unlocked-v1";
    let idleTimer, adminInitialized=false;
    const configuredPin=()=>String(window.GML_ADMIN_PIN||"").trim();
    const lock=()=>{clearTimeout(idleTimer);try{sessionStorage.removeItem(SESSION_KEY)}catch{};gate.hidden=false;pinInput.value="";status.textContent="";pinInput.focus();};
    const startIdleTimer=()=>{clearTimeout(idleTimer);idleTimer=setTimeout(lock,10*60*1000);};
    const unlocked=()=>{try{return sessionStorage.getItem(SESSION_KEY)==="yes"}catch{return false}};
    const reveal=()=>{gate.hidden=true;if(!adminInitialized){initAdmin();adminInitialized=true;}startIdleTimer();};
    if(!/^\d{4,8}$/.test(configuredPin())){
      copy.textContent="Admin PIN is not configured. Open admin-pin.js and set GML_ADMIN_PIN to a 4–8 digit PIN.";
      pinInput.disabled=true;submit.disabled=true;status.textContent="Configuration required: admin-pin.js";
      gate.hidden=false;return;
    }
    if(unlocked())reveal();else{gate.hidden=false;setTimeout(()=>pinInput.focus(),0);}
    lockForm.addEventListener("submit",e=>{e.preventDefault();status.classList.remove("success");status.textContent="";const entered=pinInput.value.trim();if(!/^\d{4,8}$/.test(entered)){status.textContent="Enter a 4–8 digit PIN.";return;}if(entered!==configuredPin()){status.textContent="Incorrect PIN. Try again.";pinInput.select();return;}try{sessionStorage.setItem(SESSION_KEY,"yes")}catch{};status.classList.add("success");status.textContent="PIN verified. Dashboard unlocked.";reveal();
    });
    $("#admin-lock-now")?.addEventListener("click",lock);
    ["pointerdown","keydown","mousemove","touchstart"].forEach(evt=>document.addEventListener(evt,()=>{if(!gate.hidden)return;if(unlocked())startIdleTimer();},{passive:true}));
    window.addEventListener("pagehide",()=>{try{sessionStorage.removeItem(SESSION_KEY)}catch{}});
  }
  function initAdmin(){
    const form=$("#mandal-form");if(!form)return;const status=$("#admin-status"),listEl=$("#admin-list"),count=$("#admin-count");const fields={id:$("#edit-id"),name:$("#m-name"),area:$("#m-area"),address:$("#m-address"),lat:$("#m-lat"),lng:$("#m-lng"),image:$("#m-image"),description:$("#m-description"),morning:$("#m-morning"),evening:$("#m-evening"),instagram:$("#m-instagram"),phone:$("#m-phone")};
    const clear=()=>{form.reset();fields.id.value="";$("#form-heading").textContent="Add a mandal";status.textContent="";};
    const render=()=>{const list=getMandals();count.textContent=`${list.length} ${list.length===1?"mandal":"mandals"}`;listEl.innerHTML=list.map(m=>`<div class="admin-item"><img src="${escapeHTML(validUrl(m.image)||imageFallback)}" alt="" onerror="this.src='${imageFallback}'"><div class="admin-item-info"><b>${escapeHTML(m.name)}</b><small>${escapeHTML(m.area||"Area not specified")}</small></div><div class="admin-item-actions"><button type="button" data-edit="${escapeHTML(m.id)}" aria-label="Edit ${escapeHTML(m.name)}"><i class="fa-solid fa-pen"></i></button><button type="button" data-delete="${escapeHTML(m.id)}" aria-label="Delete ${escapeHTML(m.name)}"><i class="fa-solid fa-trash"></i></button></div></div>`).join("")||'<div class="empty-state">No listings saved.</div>';};
    listEl.addEventListener("click",e=>{const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");if(edit){const m=getMandals().find(x=>x.id===edit.dataset.edit);if(!m)return;Object.keys(fields).forEach(k=>fields[k].value=m[k]??"");$("#form-heading").textContent="Edit mandal";form.scrollIntoView({behavior:"smooth",block:"start"});status.textContent="Editing existing listing.";}if(del&&confirm("Delete this mandal from this browser?")){saveMandals(getMandals().filter(m=>m.id!==del.dataset.delete));render();status.textContent="Listing deleted from this browser."; }});
    form.addEventListener("submit",e=>{e.preventDefault();if(!form.reportValidity())return;const lat=fields.lat.value.trim(),lng=fields.lng.value.trim();if((lat&&!lng)||(!lat&&lng)){status.textContent="Enter both latitude and longitude, or leave both blank.";return;}const item={id:fields.id.value||`${fields.name.value.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}-${Date.now().toString(36)}`,name:fields.name.value.trim(),area:fields.area.value.trim(),address:fields.address.value.trim(),lat:lat?Number(lat):"",lng:lng?Number(lng):"",image:validUrl(fields.image.value)||"",description:fields.description.value.trim(),morning:fields.morning.value.trim(),evening:fields.evening.value.trim(),instagram:validUrl(fields.instagram.value)||"",phone:fields.phone.value.trim()};let all=getMandals();const existing=all.some(m=>m.id===item.id);all=existing?all.map(m=>m.id===item.id?item:m):[item,...all];try{saveMandals(all);render();clear();status.textContent=existing?"Mandal updated in this browser.":"Mandal added in this browser.";}catch{status.textContent="Could not save. Browser storage may be full or disabled.";}});$("#reset-form").addEventListener("click",clear);
    $("#export-data").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(getMandals(),null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="ganpati-mandals-backup.json";a.click();URL.revokeObjectURL(url);});
    $("#import-data").addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!Array.isArray(data)||!data.every(m=>m&&typeof m.name==="string"&&typeof m.address==="string"))throw Error("format");saveMandals(data);render();status.textContent="JSON backup imported into this browser."; }catch{status.textContent="Import failed. Choose a valid JSON export from this tool.";}e.target.value="";});
    $("#reset-demo").addEventListener("click",()=>{if(confirm("Replace browser-saved listings with the starter listings? Export a backup first if needed.")){saveMandals(starterMandals.slice());render();clear();status.textContent="Starter listings restored.";}});render();
  }
  
  function initFestivalCountdown(){
    const daysEl=$("#countdown-days"), hoursEl=$("#countdown-hours"), minsEl=$("#countdown-minutes"), secsEl=$("#countdown-seconds");
    if(!daysEl||!hoursEl||!minsEl||!secsEl)return;
    const target=new Date("2027-09-04T00:00:00+05:30").getTime();
    const pad=n=>String(n).padStart(2,"0");
    const tick=()=>{const diff=Math.max(0,target-Date.now()), total=Math.floor(diff/1000);daysEl.textContent=String(Math.floor(total/86400));hoursEl.textContent=pad(Math.floor((total%86400)/3600));minsEl.textContent=pad(Math.floor((total%3600)/60));secsEl.textContent=pad(total%60);if(diff<=0){const kicker=document.querySelector(".countdown-kicker");if(kicker)kicker.textContent="GANESHOTSAV IS HERE";}};
    tick();window.setInterval(tick,1000);
  }
document.addEventListener("DOMContentLoaded",()=>{
    initFestivalCountdown();initNav();initHome();initDirectory();initDetail();initContact();initGallery();initAdminLock();if(!$("#admin-lock"))initAdmin();});
})();