/* Ask the data — deterministic NL matcher over the verified EBR figures.
   Client-side only. No external calls, no live feed: answers can only ever be
   the verified numbers behind this review. Shared across surfaces via /ask.js. */
(function () {
  if (window.__askData) return; window.__askData = 1;
  try {
    var C = { asphalt:'#0A0A0C', concrete:'#15151A', court:'#22222A', bone:'#F4F1EA', chalk:'#C8C4B8', blue:'#1B9BD1', canopy:'#D4FF3D' };

    /* Verified knowledge base. Every figure here matches the EBR spine. */
    var DATA = [
      { id:'spend', q:'Total spend YTD', kw:'spend spent invest investment investing budget total ytd year date money dollars overall program much',
        a:'<b>$377,570</b> in verified LinkedIn investment YTD across four regions, weighted <b>68 / 27 / 6</b> top to bottom of funnel. Over the trailing 90 days the mix runs hotter on conversion at <b>64 / 27 / 10</b>.', src:'/program', sl:'Program Performance' },
      { id:'region', q:'Spend by region', kw:'region regional geography geographic market markets country countries north america europe breakdown split na latam',
        a:'Trailing 90 days: <b>NA $142,122</b>, <b>EMEA €106,399</b>, <b>APAC $20,149</b>, <b>LATAM $20,878</b>. EMEA stays in euros and is never summed across currencies.', src:'/program', sl:'Program Performance' },
      { id:'funnel', q:'Funnel split', kw:'funnel stage tof mof bof top middle bottom awareness conversion nurture weighting balance rebalance',
        a:'Program-wide YTD: <b>68% top / 27% mid / 6% bottom</b>. Trailing 90 days it shifts toward conversion at <b>64 / 27 / 10</b>, and North America runs <b>50 / 38 / 12</b>. The rebalance is already underway.', src:'/program', sl:'Program Performance' },
      { id:'emea', q:'EMEA detail', kw:'emea europe european euros eur',
        a:'<b>€106,399</b> over the trailing 90 days, kept in euros. True 1:1 spend is <b>€11,048</b> across <b>17</b> named accounts.', src:'/program', sl:'Program Performance' },
      { id:'apac', q:'APAC', kw:'apac asia pacific australia japan trim maintenance',
        a:'<b>$20,149</b> over the trailing 90 days, the smallest region. The recommendation is to trim APAC to a maintenance level and redirect toward where conversion is most efficient.', src:'/program', sl:'Program Performance' },
      { id:'oneone', q:'True 1:1 spend', kw:'individual single concentrated per account oneone',
        a:'Clean 1:1 spend is <b>€11,048</b> across <b>17</b> EMEA accounts and <b>$424</b> across <b>4</b> NA test campaigns. Spend per account is only reported where it ties cleanly to one account.', src:'/program', sl:'Program Performance' },
      { id:'coverage', q:'Accounts engaging', kw:'accounts engaging engaged coverage covered active targets named how many 39 1016',
        a:'<b>1,016</b> named accounts under persona coverage. <b>27 of 39</b> active named targets are engaging, about <b>69%</b>. <b>257</b> are multithreaded across two or more personas, <b>38</b> across three or more, and <b>5</b> across all five.', src:'/account-signals', sl:'Account Signals' },
      { id:'multithread', q:'Multithreading', kw:'multithread multithreaded multi thread buying committee depth committees clusters',
        a:'<b>257</b> accounts are engaging two or more personas, the buying-committee signal. <b>38</b> reach three or more. The multithreaded clusters are the first place to work.', src:'/account-signals', sl:'Account Signals' },
      { id:'marquee', q:'Marquee accounts', kw:'marquee strongest best lit five 5 all personas verizon johnson jj allied charter labcorp',
        a:'Five marquee accounts engage across all five personas: <b>Verizon, Johnson &amp; Johnson, Allied Universal, Charter, and Labcorp</b>. J&amp;J is the textbook case, a competitive surge flagged a deal worth protecting in time for the rep.', src:'/account-signals', sl:'Account Signals' },
      { id:'search', q:'Un-retargeted search', kw:'search paid google intent retarget retargeting retargeted capture in-market unnurtured nurture 50k 600k',
        a:'NA paid search runs at <b>$50K or more per month</b>, generating in-market intent captured at the click and not yet retargeted, roughly <b>$600K+ a year</b>. It runs in Geotab&rsquo;s own Google account; Move 1 folds it into the measurement layer.', src:'/orchestration', sl:'The Orchestration Model' },
      { id:'pipeline', q:'Pipeline', kw:'pipeline mrr revenue deals qualified target 288k 938k close stage value influenced',
        a:'The qualified-pipeline target is <b>$288K</b> from the top 30 accounts by Q4. The named ABM pipeline shows about <b>$938K MRR</b> in motion across nine named accounts, with three near close (Apex, BrightView, Terminix) at roughly <b>$413K</b>.', src:'/program', sl:'Program Performance' },
      { id:'rogers', q:'The Rogers gap', kw:'rogers gap fell through channels 232 6sense web visits zero disappeared',
        a:'Rogers went to <b>zero</b> on LinkedIn the same week 6sense flagged it as the single biggest surge at <b>232 web visits</b>. The demand did not disappear, it fell through the gap between channels, the clearest case for the always-on layer.', src:'/orchestration', sl:'The Orchestration Model' },
      { id:'working', q:'What is working', kw:'working works best win wins strength proof exhibit abm motion blueprint',
        a:'The Field Service ABM motion: orchestrated, signal-led, full-funnel, and feeding sales. It is the model we would build from scratch, already running, and the blueprint for everything the plan scales.', src:'/executive', sl:'Executive Review' },
      { id:'creative', q:'What resonates', kw:'creative message messaging angle angles copy resonate convert winning brand outcome savings',
        a:'Cost-savings and outcome angles consistently beat generic brand, lines like <b>$400+ per vehicle</b> and <b>cut maintenance 20%</b>. The open-versus-closed platform line is the clearest white space against Samsara.', src:'/creative', sl:'Message &amp; Creative' },
      { id:'samsara', q:'Beating Samsara', kw:'samsara competitor competitive conquest displacement versus vs open closed against',
        a:'The conquest angle is open versus closed: Geotab&rsquo;s open platform against a closed one. <b>Safety and Compliance</b> is the net-new buying committee Samsara targets, and the place to deepen.', src:'/segments', sl:'Audience &amp; Segments' },
      { id:'plan', q:'The plan', kw:'plan moves recommendation recommend path forward steps strategy asks three',
        a:'Three moves. <b>1.</b> Rebalance the funnel and catch the search intent. <b>2.</b> Connect the measurement layer, DemandSense into Salesforce. <b>3.</b> Pilot person-level resolution (WebID) on the highest-intent accounts. Each compounds spend already in market.', src:'/orchestration', sl:'The Orchestration Model' },
      { id:'segments', q:'Who we reach', kw:'segments persona personas audience function seniority size operations safety risk compliance enterprise fleet buying center',
        a:'Operations carries the engagement today; <b>Safety and Compliance</b> is the net-new committee. Enterprise carries it, exactly the 500-plus-fleet target. The expansion is to deepen Safety and Risk where fit is strong.', src:'/segments', sl:'Audience &amp; Segments' },
      { id:'demandsense', q:'DemandSense', kw:'demandsense measurement attribution closed loop salesforce crm',
        a:'DemandSense is the measurement layer in Move 2: closed-loop attribution from advertising into Salesforce, closing the reseller hand-off blind spot so influenced pipeline is visible end to end.', src:'/orchestration', sl:'The Orchestration Model' },
      { id:'webid', q:'The WebID pilot', kw:'webid web identity resolution pilot contacts person',
        a:'WebID adds person-level resolution on the highest-intent accounts as a focused pilot in Move 3: sharper measurement, deeper ABM intelligence, and named, ready-to-contact fuel for the field.', src:'/orchestration', sl:'The Orchestration Model' },
      { id:'field', q:'What reps see', kw:'field rep reps sales zach onur accounts top25 25 activate activation',
        a:'The field layer is rep-scoped. <b>Zach</b> and <b>Onur</b> each open My Accounts to see their own accounts, the assigned play, and who to reach first, with Top 25 as the escalation tier.', src:'/field', sl:'My Accounts' },
      { id:'sources', q:'Where the numbers come from', kw:'source sources trust verified defensible methodology method accurate confidence reliable proof',
        a:'Spend is verified. Engagement and movement come from LinkedIn Company Hub snapshots, persona breadth from the five campaign streams, and competitive and surge flags from 6sense. EMEA is kept in euros and never summed across currencies.', src:'/program', sl:'Program Performance' }
    ];
    var SUGGEST = ['spend','region','funnel','coverage','search','plan'];

    var STOP = {};
    ('the a an of to in on for is are was we our us your you i how what which who when where why by and or with that this it as at be do does did show tell about can give get me my has have had will would should could than then so out over under into per s t re ve much there here their them'
      ).split(' ').forEach(function (w) { STOP[w] = 1; });

    function tok(s){ return s.toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim().split(' ').filter(function(t){return t && !STOP[t];}); }
    var INDEX = DATA.map(function(e){ var set={}; tok(e.kw+' '+e.q).forEach(function(t){set[t]=1;}); return set; });
    function match(query){
      var qs = tok(query); if(!qs.length) return null;
      var best=-1, bi=-1;
      for(var i=0;i<DATA.length;i++){
        var set=INDEX[i], sc=0;
        for(var j=0;j<qs.length;j++){
          var t=qs[j];
          if(set[t]){ sc+=2; continue; }
          for(var k in set){ if(k.length>3 && (k.indexOf(t)===0 || t.indexOf(k)===0)){ sc+=1; break; } }
        }
        if(sc>best){ best=sc; bi=i; }
      }
      return best>=2 ? DATA[bi] : null;
    }

    var css = ''+
      '#__ad_launch{position:fixed;bottom:24px;right:24px;z-index:9998;display:flex;align-items:center;gap:9px;background:'+C.concrete+';color:'+C.bone+';border:1px solid '+C.court+';border-radius:999px;padding:12px 18px;font-family:Inter,sans-serif;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,.45);transition:border-color .18s,transform .18s;}'+
      '#__ad_launch:hover{border-color:'+C.blue+';transform:translateY(-2px);}'+
      '#__ad_launch .d{width:8px;height:8px;border-radius:50%;background:'+C.canopy+';box-shadow:0 0 8px '+C.canopy+';}'+
      '#__ad_panel{position:fixed;bottom:84px;right:24px;z-index:9999;width:min(404px,calc(100vw - 40px));max-height:min(580px,calc(100vh - 120px));display:flex;flex-direction:column;background:#121217;border:1px solid '+C.court+';border-radius:10px;box-shadow:0 24px 64px rgba(0,0,0,.6);overflow:hidden;font-family:Inter,sans-serif;}'+
      '#__ad_panel[hidden]{display:none;}'+
      '#__ad_head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid '+C.court+';background:'+C.concrete+';}'+
      '#__ad_title{font-family:"Archivo Black",sans-serif;font-size:15px;color:'+C.bone+';letter-spacing:-.01em;}'+
      '#__ad_sub{font-family:"JetBrains Mono",monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:'+C.chalk+';opacity:.6;margin-top:3px;}'+
      '#__ad_close{background:none;border:none;color:'+C.chalk+';font-size:16px;cursor:pointer;opacity:.6;padding:4px;line-height:1;}#__ad_close:hover{opacity:1;}'+
      '#__ad_body{flex:1;overflow-y:auto;padding:18px;display:flex;flex-direction:column;gap:12px;}'+
      '.__ad_greet{font-size:13.5px;color:'+C.chalk+';line-height:1.6;}'+
      '.__ad_chips{display:flex;flex-wrap:wrap;gap:7px;}'+
      '.__ad_chip{background:rgba(27,155,209,.07);border:1px solid rgba(27,155,209,.28);color:'+C.bone+';border-radius:999px;padding:7px 13px;font-size:12px;cursor:pointer;font-family:Inter,sans-serif;transition:border-color .15s,background .15s;}'+
      '.__ad_chip:hover{border-color:'+C.blue+';background:rgba(27,155,209,.16);}'+
      '.__ad_q{align-self:flex-end;max-width:85%;background:'+C.blue+';color:#fff;border-radius:12px 12px 2px 12px;padding:9px 13px;font-size:13px;line-height:1.45;}'+
      '.__ad_a{align-self:flex-start;max-width:92%;background:'+C.concrete+';border:1px solid '+C.court+';border-left:2px solid '+C.canopy+';border-radius:2px 12px 12px 12px;padding:13px 15px;font-size:13.5px;color:'+C.chalk+';line-height:1.6;}'+
      '.__ad_a b{color:'+C.bone+';font-weight:700;}'+
      '.__ad_src{display:inline-block;margin-top:10px;font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:'+C.blue+';text-decoration:none;}'+
      '.__ad_src:hover{text-decoration:underline;}'+
      '#__ad_form{display:flex;gap:8px;padding:14px 16px;border-top:1px solid '+C.court+';background:'+C.concrete+';}'+
      '#__ad_input{flex:1;background:'+C.asphalt+';border:1px solid '+C.court+';border-radius:6px;padding:11px 13px;color:'+C.bone+';font-size:13.5px;font-family:Inter,sans-serif;outline:none;}'+
      '#__ad_input:focus{border-color:'+C.blue+';}'+
      '#__ad_send{background:'+C.blue+';border:none;border-radius:6px;width:42px;color:#fff;font-size:16px;cursor:pointer;flex-shrink:0;}#__ad_send:hover{opacity:.88;}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var root = document.createElement('div'); root.id = '__ad_root';
    root.innerHTML =
      '<button id="__ad_launch" aria-label="Ask the data"><span class="d"></span> Ask the data</button>'+
      '<div id="__ad_panel" role="dialog" aria-label="Ask the data" hidden>'+
        '<div id="__ad_head"><div><div id="__ad_title">Ask the data</div><div id="__ad_sub">Verified figures behind this review</div></div><button id="__ad_close" aria-label="Close">&times;</button></div>'+
        '<div id="__ad_body"></div>'+
        '<form id="__ad_form"><input id="__ad_input" type="text" placeholder="Ask a question…" autocomplete="off" aria-label="Ask a question"><button id="__ad_send" type="submit" aria-label="Send">&rarr;</button></form>'+
      '</div>';
    document.body.appendChild(root);

    var panel=root.querySelector('#__ad_panel'), body=root.querySelector('#__ad_body'),
        input=root.querySelector('#__ad_input'), form=root.querySelector('#__ad_form'),
        launch=root.querySelector('#__ad_launch'), greeted=false;

    function chipsHTML(){ return '<div class="__ad_chips">'+SUGGEST.map(function(id){var e=byId(id);return '<button class="__ad_chip" data-id="'+id+'">'+e.q+'</button>';}).join('')+'</div>'; }
    function byId(id){ for(var i=0;i<DATA.length;i++){ if(DATA[i].id===id) return DATA[i]; } return null; }
    function greet(){ if(greeted) return; greeted=true;
      var g=document.createElement('div'); g.className='__ad_greet';
      g.innerHTML='Ask a question about the program. Answers use the verified figures behind this review.'+chipsHTML();
      body.appendChild(g);
    }
    function scroll(){ body.scrollTop=body.scrollHeight; }
    function addQ(t){ var d=document.createElement('div'); d.className='__ad_q'; d.textContent=t; body.appendChild(d); }
    function addA(html){ var d=document.createElement('div'); d.className='__ad_a'; d.innerHTML=html; body.appendChild(d); }
    function answer(e){ addA(e.a+'<br><a class="__ad_src" href="'+e.src+'">&rarr; '+e.sl+'</a>'); scroll(); }
    function fallback(){ addA('I can answer questions on spend, regions, the funnel, account coverage, search intent, pipeline, creative, and the plan. Try one of these:'+chipsHTML()); scroll(); }

    function ask(text){ text=(text||'').trim(); if(!text) return; addQ(text); var e=match(text); if(e) answer(e); else fallback(); }

    body.addEventListener('click', function(ev){ var c=ev.target.closest('.__ad_chip'); if(c){ var e=byId(c.getAttribute('data-id')); addQ(e.q); answer(e); } });
    form.addEventListener('submit', function(ev){ ev.preventDefault(); ask(input.value); input.value=''; });
    function open(){ panel.hidden=false; greet(); setTimeout(function(){input.focus();},40); }
    function close(){ panel.hidden=true; }
    launch.addEventListener('click', function(){ panel.hidden ? open() : close(); });
    root.querySelector('#__ad_close').addEventListener('click', close);
    document.addEventListener('keydown', function(ev){ if(ev.key==='Escape' && !panel.hidden) close(); });
  } catch (e) { /* never break the page */ }
})();
