export const labels={confirmed:'Confirmed',proposed:'Proposed','awaiting-partner-confirmation':'Awaiting partner confirmation',cancelled:'Cancelled'};
export function dayInZone(instant,zone){const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(instant)).map(x=>[x.type,x.value]));return `${p.year}-${p.month}-${p.day}`;}
export function filterCourses(courses,sessions,filters){
  const tokens=filters.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return courses.flatMap(course=>{
    if(filters.vendor&&course.vendor!==filters.vendor)return [];
    if(!tokens.every(t=>`${course.title} ${course.courseId} ${course.aliases.join(' ')} ${course.category} ${course.vendor}`.toLowerCase().includes(t)))return [];
    if(filters.mode==='self-paced'&&!/self.paced/i.test(course.deliveryMode))return [];
    const matching=filters.mode==='private'?[]:sessions.filter(s=>s.courseId===course.courseId&&(!filters.format||s.format===filters.format)&&(!filters.status||s.status===filters.status)&&s.slots.some(slot=>(!filters.from||dayInZone(slot.end,filters.timezone)>=filters.from)&&(!filters.to||dayInZone(slot.start,filters.timezone)<=filters.to)));
    if((filters.mode==='scheduled'||filters.from||filters.to||filters.format||filters.status)&&matching.length===0)return [];
    return [{course,sessions:matching}];
  });
}
export function requestUrl(course,session,timezone,mode){const p=new URLSearchParams({course:course.title,courseId:course.courseId,source:'training-schedule',timezone});if(session){p.set('session',session.id);p.set('intake',session.slots.map(s=>s.start).join(', '));p.set('delivery',session.format);}if(mode==='private')p.set('delivery','private');return '/course-registration/?'+p;}
