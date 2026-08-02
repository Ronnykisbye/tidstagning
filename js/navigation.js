(function(app){
  const OVERVIEW='dashboardPage';
  const history=[];
  let currentPage=null;

  function updateControls(){
    const back=document.getElementById('navBack');
    if(back)back.disabled=history.length===0;
  }

  app.refreshPageTitle=function(){
    const selected=document.querySelector(`.menu-item[data-page="${currentPage}"]`);
    document.getElementById('pageTitle').textContent=selected?.textContent.trim()||'Overblik';
  };

  app.showPage=function(id,options={}){
    if(!document.getElementById(id))return;
    const push=options.push!==false;
    if(push&&currentPage&&currentPage!==id)history.push(currentPage);
    currentPage=id;
    document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));
    document.querySelectorAll('.menu-item').forEach(b=>b.classList.toggle('active',b.dataset.page===id));
    app.refreshPageTitle();
    document.getElementById('sidebar').classList.remove('open');
    window.scrollTo({top:0,behavior:'smooth'});
    updateControls();
  };

  app.goBack=function(){
    const previous=history.pop();
    if(previous)app.showPage(previous,{push:false});
    updateControls();
  };

  app.goOverview=function(){
    app.showPage(OVERVIEW);
  };

  app.initNavigation=function(){
    document.querySelectorAll('.menu-item').forEach(b=>b.onclick=()=>app.showPage(b.dataset.page));
    document.getElementById('menuToggle').onclick=()=>document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('navBack').onclick=app.goBack;
    document.getElementById('navOverview').onclick=app.goOverview;

    const themeButton=document.getElementById('themeToggle');
    themeButton.onclick=()=>{
      const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
      document.documentElement.dataset.theme=next;
      localStorage.setItem('gtp_theme',next);
      app.themeIcon();
    };
    app.themeIcon=()=>{
      const dark=document.documentElement.dataset.theme==='dark';
      themeButton.textContent=dark?'☀️ Lys':'🌙 Mørk';
      themeButton.setAttribute('aria-label',dark?'Skift til lyst tema':'Skift til mørkt tema');
      themeButton.title=dark?'Skift til lyst tema':'Skift til mørkt tema';
    };
    app.themeIcon();
    updateControls();
  };
})(window.GTP);
