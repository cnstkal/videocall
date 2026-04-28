const $=(s)=>document.querySelector(s);
const pages=document.querySelectorAll('.page');
const navBtns=document.querySelectorAll('[data-page]');
const chatList=$('#chatList'),messages=$('#messages'),roomName=$('#roomName'),roomAvatar=$('#roomAvatar'),chatLayout=$('.chat-layout');
const defaultState={profile:{name:'CLOW official',photo:''},current:0,chats:[{name:'린위',avatar:'R',messages:[['other','오늘 영상통화 캡쳐처럼 보이게 해줘'],['me','오케이. 거치대 고정 전면카메라 느낌으로.']]},{name:'멤버 단체방',avatar:'M',messages:[['other','배경은 밝고 깨끗하게']]},{name:'Staff Room',avatar:'S',messages:[['other','상품 페이지 시안 업데이트 완료']]}]};
let state=JSON.parse(localStorage.getItem('lineDemoState')||'null')||defaultState;
function save(){localStorage.setItem('lineDemoState',JSON.stringify(state));}
function openPage(id){pages.forEach(p=>p.classList.toggle('active',p.id===id));document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===id));}
document.querySelectorAll('[data-page]').forEach(btn=>btn.addEventListener('click',()=>openPage(btn.dataset.page)));
function esc(t){return String(t).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));}
function renderProfile(){ $('#myNameView').textContent=state.profile.name; $('#profileName').value=state.profile.name; const av=$('#myAvatar'); av.style.backgroundImage=state.profile.photo?`url(${state.profile.photo})`:''; av.textContent=state.profile.photo?'':state.profile.name[0].toUpperCase(); }
function renderChats(){chatList.innerHTML='';state.chats.forEach((c,i)=>{const last=c.messages.at(-1);const row=document.createElement('button');row.type='button';row.className='chat-row '+(i===state.current?'active':'');row.innerHTML=`<div class="avatar blue">${esc(c.avatar)}</div><div class="chat-copy"><strong>${esc(c.name)}</strong><span>${last?esc(last[1]).replace(/&lt;[^&]*&gt;/g,'사진'):''}</span></div><time>방금</time>`;row.onclick=()=>{state.current=i;save();renderAll();chatLayout.classList.add('room-open')};chatList.appendChild(row);});}
function renderMessages(){const c=state.chats[state.current];roomName.textContent=c.name;roomAvatar.textContent=c.avatar;messages.innerHTML='<p class="date-chip">Today</p>';c.messages.forEach((m,i)=>{const wrap=document.createElement('div');wrap.className='msg-wrap '+m[0];wrap.innerHTML=`<div class="bubble ${m[0]}">${m[1]}</div><button class="delete-msg" type="button">삭제</button>`;wrap.querySelector('.delete-msg').onclick=()=>{c.messages.splice(i,1);save();renderAll();};messages.appendChild(wrap);});messages.scrollTop=messages.scrollHeight;}
function renderAll(){renderProfile();renderChats();renderMessages();}
$('#composer').addEventListener('submit',e=>{e.preventDefault();const input=$('#messageInput');const text=input.value.trim();if(!text)return;state.chats[state.current].messages.push(['me',esc(text)]);input.value='';save();renderAll();});
$('#photoBtn').onclick=()=>$('#photoInput').click();
$('#photoInput').onchange=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{state.chats[state.current].messages.push(['me',`<img class="sent-img" src="${r.result}">`]);save();renderAll();};r.readAsDataURL(file);};
$('#addChatBtn').onclick=()=>$('#addChatModal').classList.add('show');
$('#closeModal').onclick=()=>$('#addChatModal').classList.remove('show');
$('#createChat').onclick=()=>{const n=$('#newChatName').value.trim();if(!n)return;state.chats.push({name:n,avatar:n[0].toUpperCase(),messages:[['other','새 채팅이 시작됐어요']]});state.current=state.chats.length-1;$('#newChatName').value='';$('#addChatModal').classList.remove('show');openPage('chats');save();renderAll();};
$('#videoCallBtn').onclick=()=>{ $('#callLog').textContent=state.chats[state.current].name+'님과 영상통화 화면으로 연결되었습니다.'; openPage('calls'); };
$('#saveProfile').onclick=()=>{state.profile.name=$('#profileName').value.trim()||'Me';const file=$('#profilePhoto').files[0];if(file){const r=new FileReader();r.onload=()=>{state.profile.photo=r.result;save();renderAll();};r.readAsDataURL(file);}else{save();renderAll();}};
document.querySelectorAll('.back-to-list').forEach(btn=>btn.onclick=()=>chatLayout.classList.remove('room-open'));
renderAll();