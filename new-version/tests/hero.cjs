// Real-browser checks for the optional video. Test-only WebM is generated in OS temp, never shipped as advertising.
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path'),os=require('node:os'),{execFileSync}=require('node:child_process');
(async()=>{
  const root=path.resolve(__dirname,'..'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'reachbloom-hero-'));
  const fixture=path.join(temp,'test.webm');
  execFileSync(process.env.FFMPEG||'ffmpeg',['-loglevel','error','-f','lavfi','-i','color=c=green:s=320x180:r=15','-t','2','-c:v','libvpx','-b:v','100k','-an',fixture]);
  const server=http.createServer((req,res)=>{
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/__fixture.webm'){res.setHeader('Content-Type','video/webm');res.end(fs.readFileSync(fixture));return;}
    if(url.pathname==='/__invalid.webm'){res.setHeader('Content-Type','video/webm');res.end('not a valid film');return;}
    const file=path.join(root,url.pathname==='/'?'index.html':url.pathname);
    if(!file.startsWith(root+path.sep)){res.statusCode=403;res.end();return;}
    try{
      let bytes=fs.readFileSync(file);
      if(file.endsWith('index.html')&&url.searchParams.has('film'))bytes=Buffer.from(bytes.toString().replace('data-video-src=""','data-video-src="'+(url.searchParams.get('film')==='bad'?'/__invalid.webm':'/__fixture.webm')+'"'));
      res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.jpg')?'image/jpeg':file.endsWith('.svg')?'image/svg+xml':'text/html');res.end(bytes);
    }catch(e){res.statusCode=404;res.end();}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port+'/';let browser;
  try{
    browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE||undefined,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
    const context=await browser.newContext(),page=await context.newPage(),errors=[],requests=[];
    page.on('pageerror',err=>errors.push(err.message));page.on('request',req=>requests.push(req.url()));
    await page.goto(base+'index.html');
    assert.deepEqual(await page.locator('nav[aria-label="Main navigation"] a').allTextContents(),['Home','About','Login','Sign Up']);
    assert.equal(await page.locator('h1').innerText(),'Discover More.\nShop Beyond.');
    const media=await page.locator('#hero-video').evaluate(v=>({autoplay:v.autoplay,muted:v.muted,loop:v.loop,inline:v.playsInline,source:v.getAttribute('src')}));
    assert.deepEqual(media,{autoplay:true,muted:true,loop:true,inline:true,source:null});
    assert(await page.locator('#hero-media-status').innerText().then(t=>t.includes('Temporary')));
    assert(!requests.some(u=>/\.webm|\.mp4/.test(u)));
    await page.locator('nav a[href="#about"]').click();await page.waitForURL('**/index.html#about');
    await page.locator('.hero-actions a[href="#discover"]').click();await page.waitForURL('**/index.html#discover');
    await page.locator('.hero-actions a[href="list-business.html"]').click();await page.waitForURL('**/list-business.html');
    for(const viewport of [{width:1440,height:1000},{width:768,height:1024},{width:390,height:844}]){
      await page.setViewportSize(viewport);await page.goto(base+'index.html');
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      assert(await page.locator('.hero-poster').evaluate(i=>i.complete&&i.naturalWidth>0));
      assert(await page.locator('.hero-actions a').first().isVisible());
      await page.screenshot({path:path.join(os.tmpdir(),'reachbloom-hero-'+viewport.width+'.png'),fullPage:true});
    }
    await page.setViewportSize({width:1440,height:1000});await page.goto(base+'index.html?film=ok');
    await page.waitForFunction(()=>!document.querySelector('#hero-video').paused&&!document.querySelector('#hero-video').hidden);
    const t=await page.locator('#hero-video').evaluate(v=>v.currentTime);await page.waitForTimeout(250);assert(await page.locator('#hero-video').evaluate(v=>v.currentTime)>t);
    await page.getByRole('button',{name:'Pause promotional video'}).click();assert(await page.locator('#hero-video').evaluate(v=>v.paused));
    await page.getByRole('button',{name:'Play promotional video'}).click();await page.waitForFunction(()=>!document.querySelector('#hero-video').paused);
    await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>!document.querySelector('#hero-video').getAttribute('src'));assert(await page.locator('#hero-media-status').innerText().then(t=>t.includes('Reduced motion')));
    await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>!document.querySelector('#hero-video').paused);
    const reduced=await browser.newContext({reducedMotion:'reduce'}),reducedPage=await reduced.newPage(),reducedRequests=[];reducedPage.on('request',r=>reducedRequests.push(r.url()));await reducedPage.goto(base+'index.html?film=ok');assert.equal(await reducedPage.locator('#hero-video').getAttribute('src'),null);assert(!reducedRequests.some(u=>u.includes('__fixture')));await reduced.close();
    const blocked=await browser.newContext();await blocked.addInitScript(()=>{HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException('Playback blocked','NotAllowedError'));};});const blockedPage=await blocked.newPage();await blockedPage.goto(base+'index.html?film=ok');assert(await blockedPage.locator('#hero-media-status').innerText().then(t=>t.includes('Select Play')));assert(await blockedPage.getByRole('button',{name:'Play promotional video'}).isVisible());await blocked.close();
    await page.goto(base+'index.html?film=bad');await page.waitForFunction(()=>document.querySelector('#hero-media-status').textContent.includes('unavailable'));assert(await page.locator('#hero-video').isHidden());assert(await page.locator('.hero-poster').isVisible());
    const noJS=await browser.newContext({javaScriptEnabled:false}),staticPage=await noJS.newPage();await staticPage.goto(base+'index.html');assert(await staticPage.locator('.hero-poster').isVisible());assert.equal(await staticPage.locator('#hero-video').getAttribute('src'),null);await noJS.close();
    assert.deepEqual(errors,[]);console.log('PASS: hero copy/nav/buttons, poster/no missing film request, real test-film autoplay/mute/loop/inline flags, pause/play, blocked playback, reduced-motion no-download and changes, corrupt-film fallback, no-JS poster, and 1440/768/390px layouts.');
  }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));fs.rmSync(temp,{recursive:true,force:true});}
})().catch(err=>{console.error(err);process.exitCode=1;});
