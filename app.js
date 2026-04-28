const chatList=document.getElementById('chatList'),messages=document.getElementById('messages'),roomName=document.getElementById('roomName'),roomAvatar=document.getElementById('roomAvatar');
let current=0;
let chats=[{name:'린위',avatar:'R',messages:[['other','테스트 메시지입니다']]}];

function render(){
  chatList.innerHTML='';
  chats.forEach((c,i)=>{
    const row=document.createElement('button');
    row.className='chat-row'+(i===current?' active':'');
    row.innerHTML=`<div class="avatar blue">${c.avatar}</div><div class="chat-copy"><strong>${c.name}</strong></div>`;
    row.onclick=()=>{current=i;render()};
    chatList.appendChild(row);
  });
  const c=chats[current];
  roomName.textContent=c.name;
  roomAvatar.textContent=c.avatar;
  messages.innerHTML='';
  c.messages.forEach((m,i)=>{
    const wrap=document.createElement('div');
    wrap.innerHTML=`<div class="bubble ${m[0]}">${m[1]}</div><button>삭제</button>`;
    wrap.querySelector('button').onclick=()=>{c.messages.splice(i,1);render()};
    messages.appendChild(wrap);
  });
}

// 🔥 전송 핵심 (확실하게 동작)
document.getElementById('sendBtn').addEventListener('click',(e)=>{
  e.preventDefault();
  const input=document.getElementById('messageInput');
  const text=input.value.trim();
  if(!text)return;
  chats[current].messages.push(['me',text]);
  input.value='';
  render();
});

// 엔터 전송
document.getElementById('messageInput').addEventListener('keydown',(e)=>{
  if(e.key==='Enter'){
    e.preventDefault();
    document.getElementById('sendBtn').click();
  }
});

// 채팅 추가
document.getElementById('createChat').onclick=()=>{
  const name=document.getElementById('newChatName').value.trim();
  if(!name)return;
  chats.push({name,avatar:name[0],messages:[]});
  current=chats.length-1;
  render();
};

// 사진 전송
document.getElementById('photoBtn').onclick=()=>document.getElementById('photoInput').click();
document.getElementById('photoInput').onchange=(e)=>{
  const file=e.target.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    chats[current].messages.push(['me',`<img src="${reader.result}" style="max-width:200px">`]);
    render();
  };
  reader.readAsDataURL(file);
};

// 영상통화
document.getElementById('videoCallBtn').onclick=()=>alert('영상통화 시작');

render();