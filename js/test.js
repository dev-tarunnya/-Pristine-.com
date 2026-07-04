
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: { 50:'#fef2f2',100:'#fee2e2',200:'#fecaca',300:'#fca5a5',400:'#f87171',500:'#ef4444',600:'#dc2626',700:'#b91c1c',800:'#991b1b',900:'#7f1d1d' },
                        dark: { 900:'#0a0a0a',800:'#141414',700:'#1a1a1a',600:'#222222',500:'#2a2a2a' }
                    },
                    fontFamily: { sans:['Inter','sans-serif'], mono:['JetBrains Mono','monospace'] }
                }
            }
        }
    
// NAV
const navbar=document.getElementById('navbar'),mobileToggle=document.getElementById('mobileToggle'),mobileClose=document.getElementById('mobileClose'),mobileMenu=document.getElementById('mobileMenu'),mobileLinks=document.querySelectorAll('.mobile-link');
window.addEventListener('scroll',()=>{navbar.classList.toggle('scrolled',window.scrollY>50)});
mobileToggle.addEventListener('click',()=>mobileMenu.classList.add('open'));
mobileClose.addEventListener('click',()=>mobileMenu.classList.remove('open'));
mobileMenu.addEventListener('click',(e)=>{if(e.target===mobileMenu)mobileMenu.classList.remove('open')});
mobileLinks.forEach(l=>l.addEventListener('click',()=>mobileMenu.classList.remove('open')));

// SCROLL REVEAL
const revealObs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');revealObs.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.reveal-on-scroll').forEach(el=>revealObs.observe(el));

// COUNTER
const counterObs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){const el=e.target,target=parseFloat(el.dataset.count),isD=el.dataset.decimal==='true',suf=el.dataset.suffix||'',dur=2000,start=performance.now();function anim(t){const p=Math.min((t-start)/dur,1),ease=1-Math.pow(1-p,4),cur=target*ease;el.textContent=isD?cur.toFixed(1)+suf:Math.floor(cur).toLocaleString()+(suf||'+');if(p<1)requestAnimationFrame(anim)}requestAnimationFrame(anim);counterObs.unobserve(el)}})},{threshold:.5});
document.querySelectorAll('.stat-number[data-count]').forEach(el=>counterObs.observe(el));

// BEFORE/AFTER
document.querySelectorAll('[data-ba]').forEach(c=>{const o=c.querySelector('.ba-overlay'),h=c.querySelector('.ba-handle'),oi=o.querySelector('img');let d=false;function u(x){const r=c.getBoundingClientRect(),cx=Math.max(0,Math.min(x-r.left,r.width)),p=(cx/r.width)*100;o.style.width=p+'%';h.style.left=p+'%';oi.style.width=r.width+'px'}function sw(){oi.style.width=c.getBoundingClientRect().width+'px'}sw();window.addEventListener('resize',sw);c.addEventListener('mousedown',e=>{d=true;u(e.clientX)});window.addEventListener('mousemove',e=>{if(d)u(e.clientX)});window.addEventListener('mouseup',()=>{d=false});c.addEventListener('touchstart',e=>{d=true;u(e.touches[0].clientX)},{passive:true});c.addEventListener('touchmove',e=>{if(d)u(e.touches[0].clientX)},{passive:true});c.addEventListener('touchend',()=>{d=false})});

// FILE UPLOAD
const uploadZone=document.getElementById('uploadZone'),fileInput=document.getElementById('fileInput'),filePreviewGrid=document.getElementById('filePreviewGrid'),uploadPrompt=document.getElementById('uploadPrompt'),fileCount=document.getElementById('fileCount');let uploadedFiles=[];
uploadZone.addEventListener('click',()=>fileInput.click());
uploadZone.addEventListener('dragover',e=>{e.preventDefault();uploadZone.classList.add('dragover')});
uploadZone.addEventListener('dragleave',()=>uploadZone.classList.remove('dragover'));
uploadZone.addEventListener('drop',e=>{e.preventDefault();uploadZone.classList.remove('dragover');handleFiles(e.dataTransfer.files)});
fileInput.addEventListener('change',()=>{handleFiles(fileInput.files);fileInput.value=''});
function handleFiles(f){Array.from(f).forEach(file=>{if(!file.type.startsWith('image/'))return;if(file.size>10*1024*1024){showToast('File too large (max 10MB): '+file.name,'error');return}uploadedFiles.push(file)});renderPreviews()}
function renderPreviews(){if(!uploadedFiles.length){uploadPrompt.classList.remove('hidden');filePreviewGrid.classList.add('hidden');fileCount.classList.add('hidden');uploadZone.classList.remove('has-files');return}uploadPrompt.classList.add('hidden');filePreviewGrid.classList.remove('hidden');fileCount.classList.remove('hidden');uploadZone.classList.add('has-files');fileCount.textContent=uploadedFiles.length+' photo'+(uploadedFiles.length>1?'s':'')+' selected';filePreviewGrid.innerHTML='';uploadedFiles.forEach((f,i)=>{const r=new FileReader;r.onload=e=>{const d=document.createElement('div');d.className='file-preview';d.innerHTML=`<img src="${e.target.result}" alt="Uploaded headlight photo"><button type="button" class="remove-btn" onclick="removeFile(${i})" aria-label="Remove photo"><i class="fa-solid fa-xmark"></i></button>`;filePreviewGrid.appendChild(d)};r.readAsDataURL(f)})}
function removeFile(i){uploadedFiles.splice(i,1);renderPreviews()}

// FORM
const quoteForm=document.getElementById('quoteForm'),submitBtn=document.getElementById('submitBtn');
quoteForm.addEventListener('submit',e=>{e.preventDefault();if(!uploadedFiles.length){showToast('Please upload at least one photo of your headlights.','error');return}submitBtn.disabled=true;submitBtn.innerHTML='<i class="fa-solid fa-spinner fa-spin text-xs"></i> <span>Sending...</span>';setTimeout(()=>{showToast('Quote request sent! We\'ll get back to you within 30 minutes during business hours.','success');quoteForm.reset();uploadedFiles=[];renderPreviews();submitBtn.disabled=false;submitBtn.innerHTML='<i class="fa-solid fa-paper-plane text-xs"></i> <span>Send My Quote Request</span>'},1500)});

// TOAST
function showToast(m,t='info'){const toast=document.getElementById('toast'),icons={success:'fa-solid fa-circle-check',error:'fa-solid fa-circle-exclamation',info:'fa-solid fa-circle-info'};toast.className=`toast toast-${t}`;toast.innerHTML=`<i class="${icons[t]}"></i> ${m}`;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),5000)}

// FAQ
function toggleFaq(btn){const item=btn.parentElement,content=item.querySelector('.faq-content'),icon=btn.querySelector('i'),isOpen=!content.classList.contains('hidden');document.querySelectorAll('.faq-content').forEach(c=>c.classList.add('hidden'));document.querySelectorAll('.faq-toggle i').forEach(i=>{i.classList.remove('fa-minus');i.classList.add('fa-plus');i.style.transform=''});if(!isOpen){content.classList.remove('hidden');icon.classList.remove('fa-plus');icon.classList.add('fa-minus');icon.style.transform='rotate(180deg)'}}

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',function(e){const h=this.getAttribute('href');if(h==='#')return;e.preventDefault();const t=document.querySelector(h);if(t){window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-80,behavior:'smooth'})}})});