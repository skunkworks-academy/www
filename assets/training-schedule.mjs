import {labels,dayInZone,filterCourses,requestUrl} from './schedule-model.mjs';
const $=id=>document.getElementById(id);
const state={courses:[],sessions:[],scheduleAvailable:false,mode:'all',view:'list',limit:20,month:new Date().toISOString().slice(0,7)};
const el=(tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;};
const filters=()=>({query:$('course-search').value,vendor:$('vendor-filter').value,format:$('format-filter').value,from:$('date-from').value,to:$('date-to').value,status:$('status-filter').value,timezone:$('timezone-filter').value,mode:state.mode});
function link(label,url){const a=el('a',label);a.href=url;return a;}
function dateRange(slot,zone){const fmt=new Intl.DateTimeFormat('en-ZA',{timeZone:zone,dateStyle:'medium',timeStyle:'short'});return fmt.format(new Date(slot.start))+' – '+fmt.format(new Date(slot.end));}
function render(){
  const f=filters();const invalid=f.from&&f.to&&f.from>f.to;
  const rows=invalid?[]:filterCourses(state.courses,state.sessions,f);
  $('schedule-result-count').textContent=invalid?'The end date must be on or after the start date.':`${rows.length} matching offerings · ${state.scheduleAvailable?rows.reduce((n,r)=>n+r.sessions.length,0)+' published sessions':'Dates unavailable'}`;
  $('schedule-results').replaceChildren();$('schedule-results').hidden=state.view!=='list';$('calendar').hidden=state.view!=='calendar';
  $('show-more').hidden=state.view!=='list'||rows.length<=state.limit;
  if(!rows.length){const empty=el('div',undefined,'training-empty');empty.append(el('h3','No matching training found'),el('p','Try a broader search or ask an advisor for your preferred course, dates and delivery format.'),link('Request training','/course-registration/'));$('schedule-results').append(empty);}
  for(const {course,sessions} of rows.slice(0,state.limit)){
    const card=el('article',undefined,'training-card'),intro=el('div'),details=el('div',undefined,'training-details');
    const meta=el('div',undefined,'training-meta');meta.append(el('span',course.vendor,'training-tag'),el('span',/[:/]/.test(course.courseId)?'Partner / specialist offering':course.courseId));
    intro.append(meta,el('h3',course.title),el('p',course.category,'schedule-muted'),el('p',[course.deliveryMode,course.estimatedEffort].filter(Boolean).join(' · '),'schedule-muted'),link('View course information →',course.courseUrl));
    if(course.catalogueScope==='partner-reference')intro.append(el('p','Partner catalogue reference · Academy delivery to be confirmed','schedule-muted'));
    if(course.schedulingEligibility==='reference-only')intro.append(el('p','Availability requires clarification. '+(course.partnerMetadata?.availability||'')+(course.partnerMetadata?.retireReason?' · '+course.partnerMetadata.retireReason:'')+(course.partnerMetadata?.replacedBy?' · Replacement: '+course.partnerMetadata.replacedBy:''),'schedule-muted'));
    if(!sessions.length){details.append(el('strong',state.mode==='private'?'Plan a private session':/self.paced/i.test(course.deliveryMode)?'Request learning access':'Dates on request'),el('p','An advisor will confirm availability, delivery options, fees and requirements.'),link(state.mode==='private'?'Request private training →':'Request training →',requestUrl(course,null,f.timezone,state.mode)));}
    for(const s of sessions){const item=el('div',undefined,'training-session');item.append(el('span',labels[s.status]||'To be confirmed','training-tag'));const dates=el('ul');s.slots.forEach(slot=>dates.append(el('li',dateRange(slot,f.timezone))));item.append(dates,el('p',`${f.timezone} · ${s.format}${s.location?' · '+s.location:''}`),el('p',`Instructor: ${s.instructor} · ${s.availableSeats} of ${s.capacity} seats available`));
      const info=el('details');info.append(el('summary','Delivery and enrolment details'),el('p',`Labs: ${s.labStatus} · Courseware: ${s.coursewareStatus}`),el('p','Platforms: '+(s.platformIds.join(', ')||'To be confirmed')),el('p',s.requirements||'Ask an advisor to confirm prerequisites and access requirements.'));item.append(info);
      if(s.status!=='cancelled')item.append(link(s.availableSeats===0?'Ask about the next session →':s.status==='confirmed'?'Request enrolment →':'Register interest →',requestUrl(course,s,f.timezone,state.mode)));
      details.append(item);
    }card.append(intro,details);$('schedule-results').append(card);
  }
  if(state.view==='calendar')renderCalendar(rows,f.timezone);
  const params=new URLSearchParams();for(const [key,val]of Object.entries(f))if(val&&!(key==='mode'&&val==='all'))params.set(key,val);if(state.view==='calendar')params.set('view','calendar');history.replaceState(null,'',location.pathname+(params.size?'?'+params:''));
}
function renderCalendar(rows,zone){
  const [year,month]=state.month.split('-').map(Number),date=new Date(Date.UTC(year,month-1,1));
  $('calendar-month').textContent=new Intl.DateTimeFormat('en',{month:'long',year:'numeric',timeZone:'UTC'}).format(date);
  $('calendar-jump').value=state.month;
  const grid=$('calendar-days');grid.replaceChildren();['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(d=>grid.append(el('div',d,'calendar-weekday')));
  for(let i=0;i<(date.getUTCDay()+6)%7;i++)grid.append(el('div',undefined,'calendar-day'));
  const days=new Date(Date.UTC(year,month,0)).getUTCDate();
  for(let day=1;day<=days;day++){
    const key=state.month+'-'+String(day).padStart(2,'0'),cell=el('div',undefined,'calendar-day');cell.append(el('strong',new Intl.DateTimeFormat('en',{weekday:'short',day:'numeric',timeZone:'UTC'}).format(new Date(key+'T12:00:00Z'))));
    for(const row of rows)for(const s of row.sessions)if(s.slots.some(slot=>dayInZone(slot.start,zone)<=key&&dayInZone(new Date(Date.parse(slot.end)-1).toISOString(),zone)>=key)){const button=el('button',row.course.title+' · '+labels[s.status]);button.addEventListener('click',()=>{$('course-search').value=row.course.courseId;setView('list');});cell.append(button);}grid.append(cell);
  }
}
function setView(view){state.view=view;$('list-view').setAttribute('aria-pressed',String(view==='list'));$('calendar-view').setAttribute('aria-pressed',String(view==='calendar'));render();}
function setMode(mode){state.mode=mode;state.limit=20;document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));$('mode-description').textContent={all:'Browse every listed offering, including courses with dates available on request.',scheduled:'Published Academy sessions. Check the confirmation status before making plans.','self-paced':'Explore self-paced learning; access and support are confirmed on enquiry.',private:'Request tailored dates for a private cohort or one-to-one training.'}[mode];render();}
async function json(url){const r=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('HTTP '+r.status);return r.json();}
async function init(){
  const zones=typeof Intl.supportedValuesOf==='function'?Intl.supportedValuesOf('timeZone'):['Africa/Johannesburg','Europe/London','America/New_York','Asia/Kolkata'];
  for(const zone of [...new Set(['Africa/Johannesburg','UTC',...zones])])$('timezone-filter').append(new Option(zone,zone));$('timezone-filter').value='Africa/Johannesburg';
  const params=new URLSearchParams(location.search);for(const [key,id] of Object.entries({query:'course-search',format:'format-filter',from:'date-from',to:'date-to',status:'status-filter',timezone:'timezone-filter'})){if(params.has(key))$(id).value=params.get(key);}if(!$('timezone-filter').value)$('timezone-filter').value='Africa/Johannesburg';
  document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
  $('schedule-filters').addEventListener('submit',e=>e.preventDefault());$('schedule-filters').addEventListener('input',()=>{state.limit=20;render();});$('schedule-filters').addEventListener('reset',()=>setTimeout(()=>{$('timezone-filter').value='Africa/Johannesburg';setMode('all');},0));
  $('list-view').onclick=()=>setView('list');$('calendar-view').onclick=()=>setView('calendar');$('show-more').onclick=()=>{state.limit+=20;render();};
  $('calendar-jump').onchange=()=>{if($('calendar-jump').value){state.month=$('calendar-jump').value;render();}};
  for(const [id,delta]of [['previous-month',-1],['next-month',1]])$(id).onclick=()=>{const d=new Date(state.month+'-01T12:00:00Z');d.setUTCMonth(d.getUTCMonth()+delta);state.month=d.toISOString().slice(0,7);render();};
  const api=['localhost','127.0.0.1'].includes(location.hostname)?'http://localhost:8080/api':'https://api.skunkworksacademy.com/api';
  const [catalogue,schedule]=await Promise.allSettled([json('/data/schedule/catalogue.json'),json(api+'/public/schedule')]);
  if(catalogue.status==='fulfilled'&&Array.isArray(catalogue.value.courses)){
    state.courses=catalogue.value.courses;$('catalogue-count').textContent=`${catalogue.value.counts.centralCatalogue} central catalogue courses, plus partner and specialist offerings.`;
    [...new Set(state.courses.map(c=>c.vendor))].sort().forEach(v=>$('vendor-filter').append(new Option(v,v)));if(params.has('vendor'))$('vendor-filter').value=params.get('vendor');
  }else{$('catalogue-count').textContent='The catalogue could not be loaded. Please reload or contact a training advisor.';}
  if(schedule.status==='fulfilled'&&schedule.value.schema==='academy-public-schedule/v1'&&Array.isArray(schedule.value.sessions)){
    state.scheduleAvailable=true;
    state.sessions=schedule.value.sessions;$('schedule-service-status').textContent=state.sessions.length?'Published Academy dates are shown below. Availability is confirmed during enrolment.':'No public dates have been published yet. You can request training for any listed course.';
  }else{$('schedule-service-status').textContent='Published dates are temporarily unavailable. Course enquiries remain open; please ask an advisor to confirm dates.';}
  $('schedule-results').setAttribute('aria-busy','false');
  setMode(['all','scheduled','self-paced','private'].includes(params.get('mode'))?params.get('mode'):'all');if(params.get('view')==='calendar')setView('calendar');
}
init().catch(()=>{$('schedule-service-status').textContent='Unable to load the schedule. Please reload or request training with an advisor.';$('schedule-results').setAttribute('aria-busy','false');});
