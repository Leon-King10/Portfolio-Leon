const projects=[
  {name:'OBJECT / 01',short:'OBJECT',type:'Identity & art direction · Concept',services:'IDENTITY / ART DIRECTION / PACKAGING',image:'https://images.unsplash.com/photo-1633002207645-ca81f5708b47?auto=format&fit=crop&w=1300&q=85',alt:'Black perfume bottle and box against a vivid orange background',description:'A study in restraint and contrast. Object is an imagined fragrance identity built around the tension between raw form and refined ritual.'},
  {name:'STRUCTURE / 02',short:'STRUCTURE',type:'Campaign & digital · Concept',services:'CAMPAIGN / DIGITAL / MOTION',image:'https://images.unsplash.com/photo-1761535315394-b9260c33fb03?auto=format&fit=crop&w=1300&q=85',alt:'Orange architectural facade against a blue sky',description:'A visual campaign inspired by architectural rhythm: strong geometry, warm color, and an unexpectedly human point of view.'},
  {name:'OPEN SPACE / 03',short:'OPEN SPACE',type:'Editorial & experience · Concept',services:'EDITORIAL / EXPERIENCE / ART DIRECTION',image:'https://images.unsplash.com/photo-1766231011673-730458d64e09?auto=format&fit=crop&w=1300&q=85',alt:'Sculptural gallery interior with soft natural light',description:'An imagined cultural platform that gives new ideas room to breathe. The system balances quiet typography with immersive spatial imagery.'}
];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s);

const hero = $('.hero');
if (hero && window.gsap && !reduced) {
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    hero.classList.add('is-entering');
    const rise = { autoAlpha: 0, y: 8, duration: .42, ease: 'power2.out' };
    const timeline = gsap.timeline({
      onComplete: () => hero.classList.remove('is-entering'),
    });
    timeline
      .from('.hero-letter', { yPercent: -110, duration: 1.6, ease: 'expo.out', clearProps: 'transform' }, 0)
      .from('.hero-photo-mask, .hero-panel-backdrop', {
        clipPath: 'inset(0 0 100% 0)', duration: 1.6, ease: 'expo.out', clearProps: 'clipPath',
      }, .15)
      .addLabel('details', 1.75)
      .from('.hero-disciplines li', { ...rise, stagger: .1, clearProps: 'opacity,visibility,transform' }, 'details')
      .from('.hero-location-letter', { ...rise, stagger: .024, clearProps: 'opacity,visibility,transform' }, 'details+=0.1')
      .from('.hero-ratio', { ...rise, clearProps: 'opacity,visibility,transform' }, 'details+=0.2')
      .from('.hero-intro p', { ...rise, stagger: .1, clearProps: 'opacity,visibility,transform' }, 'details+=0.3')
      .from('.site-header > :not(.menu-toggle)', { ...rise, clearProps: 'opacity,visibility,transform' }, 'details+=0.4');
    return () => hero.classList.remove('is-entering');
  });
}
const menuButton=$('.menu-toggle'),menu=$('#mobile-menu');
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.innerHTML='MENU <span aria-hidden="true">+</span>';document.body.style.overflow=''}
menuButton.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.innerHTML=open?'CLOSE <span>✕</span>':'MENU <span aria-hidden="true">+</span>';document.body.style.overflow=open?'hidden':''});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden)closeMenu()});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.15});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
let active=0;function showProject(index){active=index;const p=projects[index];$('#gallery-image').src=p.image;$('#gallery-image').alt=p.alt;$('#gallery-title').textContent=p.name;$('#gallery-type').textContent=p.type;$('#gallery-count').textContent=String(index+1).padStart(2,'0')+' / 03';document.querySelectorAll('.project-tile').forEach((b,i)=>b.classList.toggle('active',i===index))}
document.querySelectorAll('.project-tile').forEach((b,i)=>b.addEventListener('click',()=>{showProject(i);openProject()}));
function onScroll(){if(reduced)return;const vh=innerHeight;const g=$('.gallery').getBoundingClientRect();let gp=Math.max(0,Math.min(1,-g.top/(g.height-vh)));$('#gallery-art').style.transform=`translateX(-50%) scale(${.72+gp*.56}) translateY(${(gp-.5)*-15}px)`;const next=Math.min(2,Math.floor(gp*3));if(next!==active)showProject(next)}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
const dialog=$('#project-dialog');function openProject(){const p=projects[active];$('#dialog-image').src=p.image;$('#dialog-image').alt=p.alt;$('#dialog-title').textContent=p.short;$('#dialog-num').textContent='PROJECT / '+String(active+1).padStart(2,'0');$('#dialog-description').textContent=p.description;$('#dialog-services').textContent=p.services;dialog.showModal()}$('#project-open').addEventListener('click',openProject);$('#project-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
$('#inquiry-form').addEventListener('submit',async e=>{e.preventDefault();const data=new FormData(e.currentTarget);const brief=`FORM / FIELD — DEMO PROJECT BRIEF\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nScope: ${data.get('scope')}\n\nProject:\n${data.get('project')}`;const status=$('#form-status');try{await navigator.clipboard.writeText(brief);status.textContent='Brief copied. This demo does not send inquiries yet.'}catch{status.textContent='Clipboard unavailable. Select and copy your details from the form; this demo does not send inquiries yet.'}});
