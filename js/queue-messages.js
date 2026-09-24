(() => {
'use strict';
const $=id=>document.getElementById(id);
let messages=[],nextId=4,state='running',editing=null,collapsed=false,removed=null,taskStartTs=Date.now();
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const notice=text=>{$('feedback').textContent=text;};
function history(text,label=''){const node=document.createElement('div');node.className=label?'qm-log':'pv-reply';node.textContent=text;if(label){const small=document.createElement('span');small.className='qm-applied';small.textContent=label;node.append(small);}$('history').append(node);$('history').scrollTop=$('history').scrollHeight;}
function render(){
 const activeEdit=editing!==null&&$('edit-'+editing); const editDraft=activeEdit?activeEdit.value:null;
 const titles={running:'Reviewing accounts',adjusting:'Adjusting course…',paused:'Reviewing accounts',stopped:'Reviewing accounts',done:'Shortlist ready',approval:'Reviewing accounts'};
 const stateInfo={paused:['Paused','<span style="color:var(--color--foreground--shade-2);">&#9679;</span>'],approval:['Needs approval','<span style="color:var(--color--secondary);">&#9679;</span>'],done:['Completed','<span style="color:var(--color--success);">&#10003;</span>'],stopped:['Cancelled','<span style="color:var(--color--foreground--shade-2);">&#10005;</span>']};
 $('task-title').textContent=titles[state];
 if(['running','adjusting'].includes(state)){$('task-icon').innerHTML='<span class="lrt-spinner" style="color:var(--color--primary);"></span>';}
 else{const [stateWord,iconHtml]=stateInfo[state];$('task-icon').innerHTML=iconHtml;$('task-state-text').textContent=stateWord;}
 $('pending-section').hidden=messages.length===0;$('composer').classList.toggle('qm-fused',messages.length>0);
 $('pending-label').textContent=messages.length+' pending message'+(messages.length===1?'':'s');$('pending-list').hidden=collapsed;$('toggle-pending').setAttribute('aria-expanded',String(!collapsed));
 $('pending-list').innerHTML=messages.map((m,i)=>{
  const timingLabel=m.failed?'Not delivered · Retry available':state==='stopped'?'Not sent · Task cancelled':m.mode==='later'?'After task finishes':state==='done'?'Not applied · Task finished':state==='paused'?'Waiting for resume':state==='approval'?'Waiting for approval':'After current action';
  const extra=m.failed?'<button class="qm-icon-btn" data-action="retry" title="Retry" aria-label="Retry">&#8635;</button>':state==='done'?'<button class="qm-icon-btn" data-action="start" title="Start follow-up" aria-label="Start follow-up">&rarr;</button>':'';
  return editing===m.id
   ?`<div class="qm-row" data-id="${m.id}"><label for="edit-${m.id}" class="qm-sr">Edit message</label><textarea id="edit-${m.id}">${escape(m.text)}</textarea><div class="qm-row-actions"><button data-action="save">Save</button><button data-action="cancel">Cancel</button></div><small>This and later updates are held while you edit.</small></div>`
   :`<div class="qm-row" data-id="${m.id}"><div class="qm-row-main"><span class="qm-preview">${i+1}. ${escape(m.text)}</span><small>${timingLabel}</small></div><div class="qm-row-icons">${extra}<button class="qm-icon-btn" data-action="edit" title="Edit message" aria-label="Edit message"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button><button class="qm-icon-btn" data-action="remove" title="Remove message" aria-label="Remove message"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></div></div>`;
 }).join('');
 if(editDraft!==null&&$('edit-'+editing))$('edit-'+editing).value=editDraft;
 $('stop').classList.toggle('qm-link-disabled',['done','stopped'].includes(state));
 $('composer').hidden=state==='approval';$('send').disabled=messages.length>=5||['paused','stopped','done'].includes(state);
 $('gate').innerHTML=state==='approval'?'<div class="qm-gate"><p>Allow access to Salesforce account activity?</p><button id="approve">Allow and continue</button> <button id="reject">Decline and pause</button></div>':'';
 if(state==='approval'){$('approve').onclick=()=>{state='running';render();notice('Approval granted. Updates will apply at the next safe point.');};$('reject').onclick=()=>{state='paused';render();notice('Permission declined. Task paused; messages retained.');};}
}
function reset(){messages=[{id:1,mode:'steer',text:'Only include enterprise accounts with more than 500 employees.'},{id:2,mode:'steer',text:'Prioritize accounts with an open renewal in the next 30 days. Include the account owner, renewal date, and the most recent customer conversation in the shortlist. Please flag missing information instead of guessing.'},{id:3,mode:'later',text:'Then draft a short internal summary of the shortlist for the sales team. Do not send it.'}];nextId=4;state='running';editing=null;collapsed=false;taskStartTs=Date.now();$('draft').value='';$('history').innerHTML='<div class="pv-bubble">Find enterprise accounts that need a follow-up this week.</div><div class="pv-reply">I’ll review the accounts and their recent activity, then prepare a shortlist.</div>';$('task-detail').textContent='Reading Salesforce account activity. 14 accounts reviewed.';render();notice('Updates apply after the current action finishes.');}
$('pending-list').onclick=e=>{const button=e.target.closest('button[data-action]');if(!button)return;const id=Number(button.closest('.qm-row').dataset.id),m=messages.find(x=>x.id===id),action=button.dataset.action;if(!m)return;
 if(action==='edit'){if(editing!==null){notice('Save or cancel the current edit first.');return;}editing=id;render();$('edit-'+id).focus();return;}
 if(action==='save'){const text=$('edit-'+id).value.trim();if(!text){notice('Add text or remove the message.');return;}m.text=text;editing=null;notice('Message updated. Other messages are unchanged.');}
 if(action==='cancel'){editing=null;notice('Edit canceled. Original message retained.');}
 if(action==='remove'){if(editing!==null){notice('Save or cancel your edit before removing messages.');return;}removed={message:m,index:messages.indexOf(m)};messages=messages.filter(x=>x.id!==id);render();notice('Message removed.');const undo=document.createElement('button');undo.textContent='Undo';undo.onclick=()=>{if(messages.length>=5){notice('Queue is full. Remove a message before restoring this one.');return;}messages.splice(removed.index,0,removed.message);removed=null;render();notice('Message restored.');};$('feedback').append(undo);return;}
 if(action==='retry'){m.failed=false;notice('Saved again. Waiting for the next safe point.');}
 if(action==='start'){if(editing!==null){notice('Save or cancel your edit first.');return;}messages=messages.filter(x=>x.id!==id);state='running';history(m.text,'Follow-up started');notice('A new follow-up has started. Other messages remain pending.');}
 render();};
$('pending-list').onkeydown=e=>{if(e.key==='Escape'&&editing!==null){editing=null;render();notice('Edit canceled.');}};
$('toggle-pending').onclick=()=>{collapsed=!collapsed;$('pending-list').hidden=collapsed;$('toggle-pending').setAttribute('aria-expanded',String(!collapsed));};
let taskDetailOpen=false;
$('task-toggle').onclick=()=>{taskDetailOpen=!taskDetailOpen;$('task-detail-panel').style.display=taskDetailOpen?'block':'none';$('task-chevron').innerHTML=taskDetailOpen?'&#9652;':'&#9662;';};
$('composer').onsubmit=e=>{e.preventDefault();const text=$('draft').value.trim();if(!text){notice('Write a message first.');return;}if($('send').disabled)return;messages.push({id:nextId++,text,mode:'steer'});$('draft').value='';render();notice(messages.length===5?'5-message limit reached. Edit or remove a pending message to add another.':'Message saved. The current job keeps running.');};
$('draft').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();$('composer').requestSubmit();}};
$('stop').onclick=()=>{if(window.confirm('Stop this task? It cannot resume. Pending messages will remain visible but will not run.')){state='stopped';render();notice('Task cancelled explicitly. Pending messages were not sent.');}};
$('trace').onclick=()=>{history('Trace: Salesforce account activity → 14 accounts reviewed. The current action has not been canceled.');};
for(const button of document.querySelectorAll('[data-sim]'))button.onclick=()=>{
 for(const b of document.querySelectorAll('[data-sim]'))b.classList.remove('is-active');button.classList.add('is-active');
 const action=button.dataset.sim;
 if(editing!==null){notice('Save or cancel your edit before running a simulation step.');return;}
 if(['paused','stopped','done','approval'].includes(state)){notice('This task cannot advance in its current state. Resume, resolve approval, or start a follow-up.');return;}
 if(action==='safe'){
  const editIndex=messages.findIndex(m=>m.id===editing||m.failed);const batch=messages.filter((m,i)=>m.mode==='steer'&&!m.failed&&(editIndex<0||i<editIndex));
  if(!batch.length){notice(editing!==null?'Pending updates are held while you edit.':'No steering updates are ready. Follow-ups wait until task completion.');return;}
  batch.forEach(m=>history(m.text,'Applied to current task'));messages=messages.filter(m=>!batch.includes(m));state='adjusting';$('task-detail').textContent='Updating the account selection with your latest instructions.';render();notice('Updates acknowledged together. The job continues.');
 }else if(action==='continue'){state='running';$('task-detail').textContent='Reviewing enterprise renewals with the latest instructions.';render();notice('The agent continues with the updated context.');}
 else if(action==='done'){history('The account shortlist is ready.');state='done';const hasSteering=messages.some(m=>m.mode==='steer');const next=messages.find(m=>m.mode==='later');if(next&&!hasSteering&&editing===null){messages=messages.filter(m=>m.id!==next.id);state='running';history(next.text,'Follow-up started');$('task-detail').textContent='Preparing the internal sales summary.';notice('The next queued follow-up started as a new turn.');}else notice(hasSteering?'Task finished before all updates were applied. Open a message to start a follow-up.':'Task finished.');render();}
 else if(action==='approval'){state='approval';render();notice('Resolve the approval before continuing. Pending messages are retained.');}
 else if(action==='failure'){const m=messages.find(m=>m.mode==='steer');if(m){m.failed=true;render();notice('Message delivery failed. Retry from the message; the job is still running.');}else notice('No steering update to simulate a delivery failure.');}
};
$('fullscreen').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else $('prototype-frame').requestFullscreen().catch(()=>notice('Fullscreen is unavailable in this browser.'));};
setInterval(()=>{if(['running','adjusting'].includes(state)){const secs=Math.floor((Date.now()-taskStartTs)/1000);$('task-state-text').textContent=Math.floor(secs/60)+':'+String(secs%60).padStart(2,'0');}},1000);
reset();
})();
