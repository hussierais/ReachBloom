/* Shared approved-only discovery. No lightbox interception or network requests. */
(() => {
  'use strict';
  const unavailable = () => ({getItem:()=>null,setItem:()=>{throw Error('Storage unavailable');},removeItem:()=>{throw Error('Storage unavailable');}});
  let storage,sessions;
  try {storage=window.localStorage;sessions=window.sessionStorage;}catch(e){storage=unavailable();sessions=unavailable();}
  window.RB = ReachBloomModel.createModel(window.ReachBloomSeed,storage,sessions);
  window.RB.escape = text => String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.RB.url = b => ['bloom-and-stitch','savanna-kitchen','brightleaf-tech'].includes(b.id)?'stores/'+b.id+'.html':'stores/business.html?id='+encodeURIComponent(b.id);
  const input=document.querySelector('#business-search');if(!input)return;
  const rb=window.RB,e=rb.escape,grid=document.querySelector('.business-grid'),filters=[...document.querySelectorAll('[data-filter]')],location=document.querySelector('#location-filter');
  let category='All';
  const normalise=t=>t.normalize('NFKD').toLowerCase().trim();
  function update(){
    const all=rb.publicBusinesses(),selected=location.value,places=[...new Set(all.map(b=>b.location))].sort();
    location.innerHTML='<option value="All">All locations</option>'+places.map(l=>`<option value="${e(l)}">${e(l)}</option>`).join('');location.value=places.includes(selected)?selected:'All';
    const words=normalise(input.value).split(/\s+/).filter(Boolean);
    const results=all.filter(b=>(category==='All'||b.category===category)&&(location.value==='All'||b.location===location.value)&&words.every(w=>normalise([b.name,b.category,b.description,b.location,b.offerings||'',...b.products.map(p=>p.name+' '+p.description)].join(' ')).includes(w)));
    grid.innerHTML=results.map(b=>`<article class="thumb business-card" data-category="${e(b.category)}"><a class="store-link" href="${e(rb.url(b))}"><div class="image"><img src="${e(b.image)}" alt="Sample illustration for ${e(b.name)}" width="500" height="350"><span class="image-label">Sample business</span></div><div class="card-content"><span class="eyebrow">${e(b.category)}</span><h3>${e(b.name)}</h3><p>${e(b.description)}</p><div class="card-bottom"><span>${e(b.location)}</span><span class="visit">Visit storefront ↗</span></div></div></a></article>`).join('');grid.hidden=false;
    filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===category)));
    document.querySelector('#result-count').textContent=`Showing ${results.length} ${results.length===1?'business':'businesses'}`;
    document.querySelector('#empty-state').hidden=results.length!==0;
  }
  function reset(){input.value='';category='All';location.value='All';update();input.focus();}
  input.addEventListener('input',update);location.addEventListener('change',update);
  document.querySelector('#search-form').addEventListener('submit',event=>{event.preventDefault();update();});
  filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;update();}));
  document.querySelector('#clear-filters').addEventListener('click',reset);document.querySelector('#empty-reset').addEventListener('click',reset);
  window.addEventListener('storage',()=>{rb.refresh();update();});window.addEventListener('pageshow',()=>{rb.refresh();update();});update();
})();
