/* Preserve the canonical registration form; add bounded IBM enquiry context only. */
(function(){
 'use strict';
 function prefill(){
  var p=new URLSearchParams(location.search);if(p.get('source')!=='ibm-learning')return;
  var select=document.getElementById('course');if(!select)return;
  var title=(p.get('course')||'IBM training enquiry').slice(0,300),codes=(p.get('courseId')||'').slice(0,600);
  var option=document.createElement('option');option.value=title;option.textContent=title;select.appendChild(option);select.value=title;
  var notes=document.getElementById('notes');if(notes&&!notes.value)notes.value='IBM training enquiry (not a reservation).\nRequested course codes: '+(codes||'Please help us choose.')+'\nPlease confirm delivery, dates, pricing and lab requirements.';
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',prefill);else prefill();
})();
