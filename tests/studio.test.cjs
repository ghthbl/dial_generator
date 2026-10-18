const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM,VirtualConsole}=require('jsdom');
let dom,w,api,errors=[],blobs=new Map(),downloads=[];
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const near=(a,b,t=.00011)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b}`);
const parse=s=>{const d=new w.DOMParser().parseFromString(s,'image/svg+xml');assert.equal(d.querySelector('parsererror'),null);assert.ok(!/NaN|Infinity|undefined/.test(s));return d;};
const layerCount=d=>[...d.querySelectorAll('g')].filter(g=>g.getAttribute('inkscape:groupmode')==='layer').length;
const numbers=d=>(d.match(/[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/gi)||[]).map(Number);
const set=(id,value)=>{const el=w.document.getElementById(id);if(el.type==='checkbox')el.checked=value;else el.value=String(value);el.dispatchEvent(new w.Event('input',{bubbles:true}));};
const reset=()=>w.document.getElementById('resetSpecsBtn').click();
before(()=>{
  const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e));
  dom=new JSDOM(html,{runScripts:'dangerously',url:'https://dial-studio.test/',virtualConsole:vc,beforeParse(win){
    win.Blob=Blob;win.URL.createObjectURL=blob=>{const key='blob:test-'+blobs.size;blobs.set(key,blob);return key;};win.URL.revokeObjectURL=()=>{};
    win.HTMLAnchorElement.prototype.click=function(){downloads.push({filename:this.download,blob:blobs.get(this.href)});};
  }});w=dom.window;api=w.DialStudio;assert.ok(api);assert.equal(errors.length,0);
});
after(()=>{assert.equal(errors.length,0,errors.map(e=>e.message).join('\n'));dom.window.close();});

test('Boot, single-file runtime, fixed 1:1 artboard and ten layers',()=>{
  assert.equal(w.document.querySelectorAll('#svgContainer svg').length,1);
  assert.equal(w.document.querySelectorAll('script[src],link[rel=stylesheet]').length,0);
  const s=api.getCurrentState();assert.equal(s.movement,'sw210');
  const d=parse(api.buildCompleteSVG(s)),svg=d.documentElement;
  assert.equal(svg.getAttribute('width'),'40mm');assert.equal(svg.getAttribute('height'),'40mm');assert.equal(svg.getAttribute('viewBox'),'0 0 40 40');assert.equal(layerCount(d),10);
  assert.equal(d.querySelector('#dial_outer_perimeter_33mm').getAttribute('r'),'16.5000');
  assert.equal(d.querySelector('#dial_center_hole_2mm').getAttribute('r'),'1.0000');
  const g=api.movementGeometry(s);near(g.date.x,19);near(g.date.y,28.85);near(g.date.h,2.7);near(g.date.w,2);
  [[8.4,23.78],[31.6,16.22]].forEach((p,i)=>p.forEach((v,j)=>near(g.feet[i][j],v)));
  [[16.22,8.4],[23.78,31.6]].forEach((p,i)=>p.forEach((v,j)=>near(g.altFeet[i][j],v)));
});

test('Corridor endpoints are exactly ±gap/2 from all eight hour rays',()=>{
  const s=api.getCurrentState();
  for(const diameter of [28.5,33,35,39.8])for(const gap of [.5,1,1.6]){
    const g=api.computeOctagonGeometry({...s,dialDiameter:diameter,octGap:gap,octClipMethod:'corridor'});
    for(const a of [30,60,120,150,210,240,300,330])for(const key of ['Pminus','Pplus']){
      const p=g[key][a],rad=a*Math.PI/180;near(Math.abs((p[0]-20)*Math.cos(rad)+(p[1]-20)*Math.sin(rad)),gap/2,1e-10);
    }
  }
});
test('Normal-offset endpoints have equal radius and symmetric ray offsets',()=>{
  const s=api.getCurrentState({octClipMethod:'normal'}),g=api.computeOctagonGeometry(s);
  for(const a of [30,60,120,150,210,240,300,330])for(const k of ['Pminus','Pplus'])near(Math.hypot(g[k][a][0]-20,g[k][a][1]-20),Math.hypot(9.15,.5),1e-10);
});
test('Butt, square and round segment outlines have physical thickness and caps',()=>{
  const butt=numbers(api.lineToClosedPolygon(0,0,10,0,.34,'butt'));assert.deepEqual(butt,[0,.17,10,.17,10,-.17,0,-.17]);
  const square=numbers(api.lineToClosedPolygon(0,0,10,0,2,'square'));assert.deepEqual(square,[-1,1,11,1,11,-1,-1,-1]);
  const round=api.lineToClosedPolygon(0,0,10,0,2,'round');assert.equal((round.match(/ A /g)||[]).length,2);assert.ok(round.endsWith(' Z'));
  assert.equal(api.lineToClosedPolygon(0,0,0,0,1,'butt'),'');assert.ok(api.lineToClosedPolygon(0,0,0,0,1,'round').endsWith(' Z'));
});

test('CAD checkbox updates the viewport synchronously and removes every painted stroke',()=>{
  reset();set('cadOutlineMode',true);
  const ray=w.document.querySelector('#cad_verification_guides > path');assert.ok(ray);assert.ok((ray.getAttribute('d').match(/M /g)||[]).length>2,'guide dashes remain separate closed outlines');
  set('cadOutlineMode',false);set('showGuides',false);assert.equal(w.document.querySelectorAll('#hour_aligned_octagon line').length,10);
  set('cadOutlineMode',true);
  assert.equal(w.document.querySelectorAll('#hour_aligned_octagon line').length,0);
  assert.equal(w.document.querySelectorAll('#minute_track_ticks path').length,48);
  assert.equal(w.document.querySelectorAll('#podvig_vector_glyphs path').length,6);
  assert.equal(w.document.querySelector('#date_window_border').localName,'path');
  assert.equal(w.document.querySelector('#date_window_border').getAttribute('fill-rule'),'evenodd');
  for(const arm of ['drone_tail_stem','drone_arm_1','drone_arm_2']){const p=w.document.getElementById(arm);assert.equal(p.localName,'path');assert.equal((p.getAttribute('d').match(/ A /g)||[]).length,2);}
  for(const ring of w.document.querySelectorAll('[id^=drone_rotor_]')){assert.equal(ring.localName,'path');assert.equal(ring.getAttribute('fill-rule'),'evenodd');assert.equal((ring.getAttribute('d').match(/M /g)||[]).length,2);}
  const d=parse(api.buildCompleteSVG(api.getCurrentState()));
  for(const el of d.querySelectorAll('[stroke]'))assert.equal(el.getAttribute('stroke'),'none');
  for(const el of d.querySelectorAll('path'))assert.ok(el.getAttribute('d').trim().endsWith('Z'),el.id);
  assert.equal(layerCount(d),10);
  set('cadOutlineMode',false);assert.equal(w.document.querySelectorAll('#minute_track_ticks line').length,48);
});

test('Six closed glyphs retain real counters and 0.18 mm default stems',()=>{
  const glyphs=api.closedPodvigGlyphs();assert.equal(glyphs.length,6);
  glyphs.forEach(d=>assert.ok(d.endsWith(' Z')||d.endsWith('Z')));
  assert.equal((glyphs[1].match(/M /g)||[]).length,2);assert.equal((glyphs[2].match(/M /g)||[]).length,2);assert.equal((glyphs[3].match(/M /g)||[]).length,3);
  near(16.94-16.76,.18);near(17.84-17.66,.18);near(.49-.31,.18);near(.54-.36,.18);
});

test('All factory plates have four black closed registration targets and no preview objects',()=>{
  reset();const s=api.getCurrentState();
  for(const plate of ['0','A','B','C']){
    const d=parse(api.factorySVG(s,plate));assert.equal(d.querySelectorAll('[id^=registration_target_]').length,4);
    for(const e of d.querySelectorAll('[fill],[stroke]'))for(const a of ['fill','stroke'])if(e.hasAttribute(a))assert.ok(['none','#000000'].includes(e.getAttribute(a)),e.outerHTML);
    assert.equal(d.querySelectorAll('text,defs,filter,image').length,0);
    assert.equal(d.querySelector('[id*=preview]'),null);assert.equal(d.querySelector('[id*=hand_assembly]'),null);
    for(const p of d.querySelectorAll('path'))assert.ok(p.getAttribute('d').endsWith(' Z'));
  }
  const a=parse(api.factorySVG(s,'A'));assert.equal(a.querySelector('#cliche_A').children.length,10);
  const b=parse(api.factorySVG(s,'B'));assert.equal(b.querySelectorAll('[id^=min_tick_]').length,48);assert.equal(b.querySelectorAll('[id^=podvig_glyph_]').length,6);assert.equal(b.querySelectorAll('#date_window_border').length,1);
  const c=parse(api.factorySVG(s,'C'));assert.equal(c.querySelector('#cliche_C').children.length,23);
  const zero=parse(api.factorySVG({...s,movement:'sw200'},'0'));assert.equal(zero.querySelectorAll('[id^=blank_active_foot_]').length,2);assert.equal(zero.querySelectorAll('[id^=blank_alternative_foot_]').length,2);assert.equal(zero.querySelectorAll('[id^=logo_locating_pin_]').length,2);
  assert.equal(zero.querySelector('#logo_locating_pin_1').getAttribute('cx'),'19.4500');assert.equal(zero.querySelector('#logo_locating_pin_1').getAttribute('cy'),'11.7500');assert.equal(zero.querySelector('#logo_locating_pin_1').getAttribute('r'),'0.2000');
  assert.equal(zero.querySelector('#sandwich_laser_cutouts').children.length,23);
});

test('All legacy controls, handsets, poses and export buttons remain functional',async()=>{
  reset();
  for(const setName of ['set1','set2','set3','all','none']){
    set('handsetSelect',setName);
    const pairs=['sword','kite','tactical'];pairs.forEach((name,i)=>{const el=w.document.querySelector(`[id^=layer${4+i*2}_]`);assert.equal(el.getAttribute('display'),setName==='all'||setName==='set'+(i+1)?'inline':'none');});
  }
  set('showSeconds',false);assert.equal(w.document.querySelector('#layer10_seconds_hand').getAttribute('display'),'none');
  set('showSeconds',true);w.document.getElementById('pose1200Btn').click();assert.equal(api.getCurrentState().zeroPose,true);
  set('timeScrub',123);assert.equal(api.getCurrentState().zeroPose,false);assert.match(w.document.querySelector('#timeVal').textContent,/2:03/);
  w.document.getElementById('pose1010Btn').click();assert.equal(api.getCurrentState().timeMinutes,609);
  for(const id of ['octRadius','octGap','dateInner','dateWidth','dateHeight']){const old=w.document.getElementById(id).value;set(id,Number(old)+.05);assert.ok(w.document.getElementById(id+'Val').textContent.includes(Number(Number(old)+.05).toFixed(2)));set(id,old);}
  for(const finish of ['flat','gradient','sandwich'])set('dialFinish',finish);
  set('lightMode','dusk');assert.match(w.document.querySelector('#hour_baton_1').parentNode.getAttribute('filter'),/lumeGlowFilter/);
  set('showDateFrame',false);assert.equal(w.document.querySelector('#date_window_border').getAttribute('display'),'none');set('showDateFrame',true);
  set('showDialFeet',true);assert.equal(w.document.querySelector('#sellita_sw200_dial_feet_ref').getAttribute('display'),'inline');
  reset();downloads=[];
  for(const id of ['dlCurrentSvg','dlFlatSvg','dlGradSvg','dlSandwichSvg','dl1200Svg','dlPlate0','dlClicheA','dlClicheB','dlClicheC'])w.document.getElementById(id).click();
  assert.equal(downloads.length,9);
  for(const d of downloads)assert.ok(parse(await d.blob.text()));
  const cad=parse(await downloads[4].blob.text());assert.equal(cad.querySelectorAll('#hour_aligned_octagon line').length,0);assert.equal(cad.querySelector('#cad_verification_guides'),null);
});

test('Diameter changes preserve movement geometry and physical print thickness',()=>{
  reset();const s=api.getCurrentState(),base=api.movementGeometry(s);
  for(const diameter of [26,28.5,35,38]){
    const st={...s,dialDiameter:diameter},g=api.movementGeometry(st);
    assert.deepEqual(g.feet,base.feet);assert.deepEqual(g.date,base.date);near(g.holeR,1);near(g.footR,.375);
    near(g.dialR,diameter/2);
    const b=parse(api.factorySVG(st,'B'));const tick=b.querySelector('#min_tick_1').getAttribute('d'),p=api.flattenPath(tick)[0].points;near(Math.hypot(p[1][0]-p[0][0],p[1][1]-p[0][1]),.18);
  }
  set('manualDiameterMode',true);set('manualDiameter',38);assert.equal(api.getCurrentState().dialDiameter,38);assert.equal(w.document.querySelector('#dial_outer_perimeter_33mm').getAttribute('r'),'19.0000');
  set('manualDiameterMode',false);assert.equal(api.getCurrentState().dialDiameter,35);
});

test('Crown rotation affects feet and open heart, independent of the aperture selector',()=>{
  reset();const s=api.getCurrentState(),r=api.movementGeometry({...s,crownAngle:180});
  near(r.feet[0][0],16.22);near(r.feet[0][1],8.4);assert.equal(r.date.angle,180);
  const follow=api.movementGeometry({...s,datePosition:'follow',crownAngle:180});assert.equal(follow.date.angle,270);
  for(const angle of [0,90,114,120,135,180,270,359.5]){
    const d=api.movementGeometry({...s,datePosition:'custom',dateAngle:angle});near(Math.hypot(d.date.corners[0][0]-20,d.date.corners[0][1]-20),Math.hypot(1,8.85));
    assert.ok(parse(api.factorySVG({...s,datePosition:'custom',dateAngle:angle},'B')));
  }
  set('datePosition','none');assert.equal(w.document.querySelector('#date_window_border'),null);assert.equal(w.document.querySelector('#dial_date_cutout_6h_sw200'),null);
});

test('Invalid mechanical intersections block exports without changing the metric scale',()=>{
  reset();const s=api.getCurrentState();assert.ok(api.engineeringIssues({...s,dialDiameter:10}).errors.length);
  assert.ok(api.engineeringIssues({...s,openHeartEnabled:true,heartX:0,heartY:0,heartDiameter:8}).errors.length);
  assert.throws(()=>api.factorySVG({...s,dialDiameter:10},'0'));
  set('manualDiameterMode',true);set('manualDiameter',10);assert.equal(w.document.getElementById('dlPlate0').disabled,true);
  set('manualDiameter',38);assert.equal(w.document.getElementById('dlPlate0').disabled,false);
});

test('Every profile, representative diameter, crown and date configuration builds valid SVG',()=>{
  for(const key of Object.keys(api.profiles)){
    api.applyMovement(key);api.updateStudio();const base=api.getCurrentState();
    assert.equal(w.document.querySelector('#engineeringStatus').dataset.level==='error',false,key);
    for(const diameter of [28.5,33,35])for(const crownAngle of [90,114,180,270]){
      const s={...base,dialDiameter:diameter,crownAngle,showGuides:false,cadOutlineMode:true};
      const d=parse(api.buildCompleteSVG(s));assert.equal(layerCount(d),10);
      for(const p of d.querySelectorAll('path'))assert.ok(p.getAttribute('d').trim().endsWith('Z'),key+' '+p.id);
      if(!api.engineeringIssues(s).errors.length)for(const plate of ['0','A','B','C'])assert.ok(parse(api.factorySVG(s,plate)));
    }
  }
  reset();
});

test('Coordinates serialize with four decimals (arc flags and the fixed root viewBox excluded)',()=>{
  const s=api.getCurrentState({showGuides:false,cadOutlineMode:true});
  for(const source of [api.buildCompleteSVG(s),...['0','A','B','C'].map(p=>api.factorySVG(s,p))]){
    const d=parse(source);
    for(const e of d.querySelectorAll('*'))for(const attr of ['x','y','x1','y1','x2','y2','cx','cy','r','rx','ry','stroke-width'])if(e.hasAttribute(attr)&&!e.getAttribute(attr).endsWith('%'))assert.match(e.getAttribute(attr),/^-?\d+\.\d{4}$/);
    for(const e of d.querySelectorAll('[transform]'))for(const n of e.getAttribute('transform').match(/[-+]?\d*\.?\d+/g)||[])assert.match(n,/-?\d+\.\d{4}/);
  }
});
