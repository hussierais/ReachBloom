/* Browser-only workflow model. The eventual server must enforce every permission. */
(function(root) {
  'use strict';
  const KEY = 'reachbloom.demo.v2';
  const SESSION = 'reachbloom.session.v2';
  const statuses = ['Draft','Pending Review','Approved','Changes Requested','Rejected','Suspended'];
  const categories = ['Clothing','Food & Drink','Technology','Services','Other'];
  const copy = value => JSON.parse(JSON.stringify(value));
  const id = () => 'RB-' + (root.crypto?.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2));
  const now = () => new Date().toISOString();
  function createModel(seed, storage, sessions) {
    let warning = '', state;
    function initial() {
      const businesses = copy(seed);
      const samples = [seed[0],seed[1],seed[2],seed[0],seed[2]];
      ['Draft','Pending Review','Changes Requested','Rejected','Suspended'].forEach((status,index) => businesses.push({...copy(samples[index]), id:'sample-'+index, name:['Thread & Loom','Green Basket','Urban Repair','Coast Crafts','Sunbeam Studio'][index], category:['Clothing','Food & Drink','Services','Other','Services'][index], status, ownerId:'owner-demo', createdBy:'owner-demo', feedback: status==='Changes Requested'?'Please clarify your service area.':status==='Rejected'?'Sample feedback: the submitted business description was incomplete.':'', history:[{at:now(),action:status,actor:'Demo scenario',reason:'Fictional workflow example'}]}));
      return {version:2, businesses, claims:[], favourites:{}, recent:{}, accounts:[{id:'customer-demo',alias:'customer@example.com',name:'Demo Customer',role:'customer'},{id:'owner-demo',alias:'owner@example.com',name:'Demo Owner',role:'owner'},{id:'admin-demo',alias:'reviewer@example.com',name:'Demo Administrator',role:'admin'}]};
    }
    try { const saved=storage.getItem(KEY);state=saved?JSON.parse(saved):initial();if(state.version!==2||!Array.isArray(state.businesses)||!Array.isArray(state.accounts))throw Error('Invalid demo data'); } catch(e) {state=initial();warning='Stored demo data could not be loaded. This tab is using fresh demo data.';}
    function user(){try{const sid=sessions.getItem(SESSION);return copy(state.accounts.find(a=>a.id===sid)||null);}catch(e){return null;}}
    function role(required){const u=user();if(!u||u.role!==required)throw Error('This action requires the '+required+' demo account.');return u;}
    function mutate(fn){const next=copy(state);const result=fn(next);try{storage.setItem(KEY,JSON.stringify(next));}catch(e){throw Error('Browser storage is unavailable or full. Your change was not saved. Remove large images or reset the demo.');}state=next;return result;}
    function record(s,businessId){const b=s.businesses.find(b=>b.id===businessId);if(!b)throw Error('Business not found.');return b;}
    function owned(s,businessId){const u=role('owner'),b=record(s,businessId);if(b.ownerId!==u.id)throw Error('You are not authorized to manage this business in the demo.');return b;}
    function history(b,u,action,reason=''){b.history.push({at:now(),actor:u.name,action,reason});}
    function fields(data){
      const clean={};for(const key of ['name','description','location','contactName','email','phone','website','hours','offerings'])clean[key]=String(data[key]||'').trim();
      for(const key of ['name','description','location','contactName','email'])if(!clean[key])throw Error('Please complete '+key+'.');
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email))throw Error('Enter a valid sample contact email.');
      if(!categories.includes(data.category))throw Error('Select a valid business category.');
      if(clean.website&&!/^https?:\/\//i.test(clean.website))throw Error('Website must start with https:// or http://.');
      if(clean.website){try{new URL(clean.website);}catch(e){throw Error('Enter a valid website URL.');}}
      if(clean.phone&&!/^\+?[\d ()-]{7,20}$/.test(clean.phone))throw Error('Use a valid sample phone format.');
      const imageOK=v=>!v||/^data:image\/(png|jpeg|webp);base64,/.test(v)||/^images\/reachbloom\/[a-z0-9-]+\.svg$/.test(v);
      if(!imageOK(data.image)||!imageOK(data.logo))throw Error('Unsupported image.');
      return {...clean,category:data.category,image:data.image||'images/reachbloom/bloom-and-stitch-shirt.svg',logo:data.logo||''};
    }
    return {
      statuses,categories, warning:()=>warning, snapshot:()=>copy(state), user,
      login(alias,pass,selected,adminEntry=false){const a=state.accounts.find(a=>a.alias.toLowerCase()===String(alias).trim().toLowerCase());if(pass!=='BloomDemo!'||!a|| (a.role==='admin'&&!adminEntry)||(adminEntry&&a.role!=='admin'))throw Error('Use a listed demo account and the public demo passphrase.');try{sessions.setItem(SESSION,a.id);}catch(e){throw Error('Enable browser session storage to use the demo.');}return {account:copy(a),mismatch:a.role!==selected};},
      logout(){sessions.removeItem(SESSION);},
      register(name,roleName){name=String(name).trim();if(!/^[a-zA-Z][a-zA-Z0-9_-]{2,30}$/.test(name))throw Error('Use a fictional alias of 3–31 letters, digits, underscores or hyphens.');if(!['owner','customer'].includes(roleName))throw Error('Choose customer or business owner.');return mutate(s=>{const alias=name.toLowerCase()+'@example.com';if(s.accounts.some(a=>a.alias===alias))throw Error('That demo alias already exists.');const a={id:id(),alias,name,role:roleName};s.accounts.push(a);return copy(a);});},
      publicBusinesses:()=>copy(state.businesses.filter(b=>b.status==='Approved')),
      business:businessId=>copy(state.businesses.find(b=>b.id===businessId)||null),
      ownedBusinesses(){const u=role('owner');return copy(state.businesses.filter(b=>b.ownerId===u.id));},
      apply(data,draft=false){const u=role('owner'),clean=fields(data);return mutate(s=>{const b={...clean,id:id(),status:draft?'Draft':'Pending Review',ownerId:u.id,createdBy:u.id,products:[],color:'#286148',bg:'#eaf0e5',headline:'Independent business. Individual story.',intro:clean.offerings,feedback:'',history:[]};history(b,u,b.status,'Demo application');s.businesses.push(b);return copy(b);});},
      createListing(data){const u=role('admin'),clean=fields(data);return mutate(s=>{const b={...clean,id:id(),status:'Approved',ownerId:null,createdBy:u.id,products:[],color:'#286148',bg:'#eaf0e5',headline:'Discover something new.',intro:clean.offerings,feedback:'',history:[]};history(b,u,'Approved','Direct administrator-created listing');s.businesses.push(b);return copy(b);});},
      edit(businessId,data,submit=false){const u=role('owner'),clean=fields(data);return mutate(s=>{const b=owned(s,businessId);Object.assign(b,clean);if(submit){if(b.status==='Suspended')throw Error('Only an administrator can reactivate a suspended listing.');b.status='Pending Review';b.feedback='';}history(b,u,submit?'Pending Review':'Profile updated',submit?'Submitted for administrator review':'Saved demo preparation');return copy(b);});},
      product(businessId,data,productId){const u=role('owner');if(!String(data.name||'').trim()||!String(data.description||'').trim())throw Error('Product or service name and description are required.');if(data.price!==''&&(!Number.isFinite(Number(data.price))||Number(data.price)<0))throw Error('Use a non-negative sample price or leave it blank.');return mutate(s=>{const b=owned(s,businessId);const product={id:productId||id(),name:String(data.name).trim(),description:String(data.description).trim(),price:data.price===''?null:Number(data.price),image:data.image||b.image};if(productId){const i=b.products.findIndex(p=>p.id===productId);if(i<0)throw Error('Offering not found.');b.products[i]=product;}else b.products.push(product);history(b,u,'Offering saved');});},
      removeProduct(businessId,productId){const u=role('owner');return mutate(s=>{const b=owned(s,businessId);b.products=b.products.filter(p=>p.id!==productId);history(b,u,'Offering removed');});},
      review(businessId,status,reason){const u=role('admin');return mutate(s=>{const b=record(s,businessId);const transitions={'Pending Review':['Approved','Rejected','Changes Requested'],Approved:['Suspended'],Suspended:['Approved']};if(!transitions[b.status]?.includes(status))throw Error('This status change is not available for this application.');if(status!=='Approved'&&!String(reason||'').trim())throw Error('Provide a reason or feedback for this decision.');b.status=status;b.feedback=String(reason||'').trim();history(b,u,status,b.feedback);return copy(b);});},
      claim(businessId,data){const u=role('owner');return mutate(s=>{const b=record(s,businessId);if(b.status!=='Approved'||b.ownerId)throw Error('Only approved, unassigned listings may be claimed.');if(s.claims.some(c=>c.businessId===businessId&&c.ownerId===u.id&&c.status==='Pending Review'))throw Error('You already have a pending claim for this business.');if(!String(data.contactName||'').trim()||!String(data.explanation||'').trim()||!/^\S+@\S+\.\S+$/.test(data.email||''))throw Error('Complete the contact name, sample email and relationship explanation.');const c={id:id(),businessId,ownerId:u.id,contactName:String(data.contactName).trim(),email:String(data.email).trim(),explanation:String(data.explanation).trim(),status:'Pending Review',feedback:'',history:[{at:now(),actor:u.name,action:'Pending Review',reason:'Verification is simulated'}]};s.claims.push(c);return copy(c);});},
      reviewClaim(claimId,approve,reason){const u=role('admin');return mutate(s=>{const c=s.claims.find(c=>c.id===claimId);if(!c||c.status!=='Pending Review')throw Error('Pending claim not found.');if(!String(reason||'').trim())throw Error('Record the simulated verification result or rejection reason.');const b=record(s,c.businessId);if(approve&&(b.ownerId||b.status!=='Approved'))throw Error('The business is no longer available to claim.');c.status=approve?'Approved':'Rejected';c.feedback=String(reason).trim();c.history.push({at:now(),actor:u.name,action:c.status,reason:c.feedback});if(approve){b.ownerId=c.ownerId;history(b,u,'Ownership claim approved',c.feedback);s.claims.filter(other=>other.businessId===b.id&&other.id!==c.id&&other.status==='Pending Review').forEach(other=>{other.status='Rejected';other.feedback='Another claim was approved.';other.history.push({at:now(),actor:u.name,action:'Rejected',reason:other.feedback});});}return copy(c);});},
      toggleFavourite(businessId){const u=role('customer');if(!this.publicBusinesses().some(b=>b.id===businessId))throw Error('Only publicly approved businesses can be saved.');return mutate(s=>{const list=s.favourites[u.id]||[];s.favourites[u.id]=list.includes(businessId)?list.filter(i=>i!==businessId):[...list,businessId];});},
      visit(businessId){const u=user();if(!u||u.role!=='customer')return;return mutate(s=>{s.recent[u.id]=[businessId,...(s.recent[u.id]||[]).filter(i=>i!==businessId)].slice(0,6);});},
      reset(){storage.removeItem(KEY);sessions.removeItem(SESSION);state=initial();},
      refresh(){try{const saved=storage.getItem(KEY);if(saved){const next=JSON.parse(saved);if(next.version===2)state=next;}}catch(e){warning='Unable to refresh local demo data.';}}
    };
  }
  root.ReachBloomModel={createModel,KEY,SESSION};
  if(typeof module!=='undefined')module.exports=root.ReachBloomModel;
})(typeof window!=='undefined'?window:globalThis);
