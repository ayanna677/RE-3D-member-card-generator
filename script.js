document.addEventListener("DOMContentLoaded",()=>{
  const nameInput=document.getElementById('nameInput');
  const fontSelect=document.getElementById('fontSelect');
  const photoInput=document.getElementById('photoInput');
  const photoOk=document.getElementById('photoOk');
  const bgInput=document.getElementById('bgInput');
  const bgOk=document.getElementById('bgOk');
  const resetBtn=document.getElementById('resetBtn');
  const downloadBtn=document.getElementById('downloadBtn');

  const card=document.getElementById('card');
  const cardName=document.getElementById('cardName');
  const avatarImg=document.getElementById('avatarImg');
  const photoPlaceholder=document.getElementById('photoPlaceholder');
  const tiltWrap=document.getElementById('tiltWrap');
  const scene=document.body;

  nameInput.addEventListener('input',()=>cardName.textContent=nameInput.value.trim()||'LALA');
  fontSelect.addEventListener('change',()=>card.style.fontFamily=`'${fontSelect.value}',sans-serif`);

  photoInput.addEventListener('change',e=>{
    const f=e.target.files?.[0]; if(!f)return;
    const r=new FileReader();
    r.onload=()=>{
      avatarImg.src=r.result;
      const logo=f.name.toLowerCase().includes('logo');
      avatarImg.style.objectFit=logo?'contain':'cover';
      avatarImg.style.mixBlendMode=logo?'lighten':'normal';
      photoPlaceholder.style.opacity='0'; photoOk.hidden=false;
    }; r.readAsDataURL(f);
  });

  bgInput.addEventListener('change',e=>{
    const f=e.target.files?.[0]; if(!f)return;
    const r=new FileReader();
    r.onload=()=>{scene.dataset.bg=r.result;updateBg(r.result);bgOk.hidden=false;};
    r.readAsDataURL(f);
  });

  function updateBg(url){
    scene.style.background=`radial-gradient(800px 420px at 62% 10%, var(--scene-accent,rgba(90,120,255,.15)), transparent 60%), url('${url}') center/cover no-repeat #070a12`;
  }

  document.querySelectorAll('.theme-btn').forEach(b=>{
    b.addEventListener('click',()=>{
      const t=b.dataset.theme;
      scene.className=`scene theme-${t}`;
      const bg=scene.dataset.bg; if(bg)updateBg(bg);

      // text contrast
      const light=['silver','gold'];
      card.querySelectorAll('.main-title,.sub-title,.name,.role').forEach(el=>{
        if(light.includes(t)){el.style.color='#111';el.style.textShadow='none';}
        else{el.style.color='#fff';el.style.textShadow='0 2px 8px rgba(0,0,0,.4)';}
      });
      // page glow colour
      const glow={black:'rgba(180,180,200,.15)',silver:'rgba(255,255,255,.3)',gold:'rgba(255,210,120,.3)',
        aqua:'rgba(70,180,255,.3)',violet:'rgba(150,100,255,.3)',neon:'rgba(120,170,255,.3)',
        emerald:'rgba(60,220,170,.3)',crimson:'rgba(255,120,120,.3)',rose:'rgba(255,145,190,.3)',
        sunset:'rgba(255,160,110,.3)'};
      scene.style.background=`radial-gradient(800px 420px at 62% 10%,${glow[t]||'rgba(90,120,255,.15)'},transparent 60%),#070a12`;
      if(bg)updateBg(bg);
    });
  });

  resetBtn.addEventListener('click',()=>{
    nameInput.value='LALA';cardName.textContent='LALA';
    fontSelect.value='Poppins';card.style.fontFamily='';
    photoInput.value='';photoOk.hidden=true;
    avatarImg.src='https://api.dicebear.com/9.x/identicon/svg?seed=RE';
    avatarImg.style.objectFit='contain';avatarImg.style.mixBlendMode='lighten';
    photoPlaceholder.style.opacity='1';bgInput.value='';bgOk.hidden=true;
    delete scene.dataset.bg;scene.className='scene theme-black';
    scene.style.background='radial-gradient(800px 420px at 62% 10%,rgba(90,120,255,.15),transparent 60%),#070a12';
  });

  // 3D tilt
  let rect;const upd=()=>rect=tiltWrap.getBoundingClientRect();upd();window.addEventListener('resize',upd);
  tiltWrap.addEventListener('mousemove',e=>{
    if(!rect)return;const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
    const dx=(e.clientX-cx)/(rect.width/2),dy=(e.clientY-cy)/(rect.height/2);
    card.style.transform=`rotateX(${(-dy*12).toFixed(2)}deg) rotateY(${(dx*12).toFixed(2)}deg)`;
  });
  tiltWrap.addEventListener('mouseleave',()=>card.style.transform='rotateX(0) rotateY(0)');

  downloadBtn.addEventListener('click',async()=>{
    downloadBtn.disabled=true;downloadBtn.textContent='Rendering…';
    try{
      const canvas=await html2canvas(card,{backgroundColor:null,scale:2,useCORS:true});
      const a=document.createElement('a');a.href=canvas.toDataURL('image/png');
      a.download=`${nameInput.value||'RE_Member'}.png`;a.click();
    }finally{downloadBtn.disabled=false;downloadBtn.textContent='Download PNG';}
  });
});
