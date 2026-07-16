(function(app){
  app.showPage=function(id){
    document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));
    document.querySelectorAll('.menu-item').forEach(b=>b.classList.toggle('active',b.dataset.page===id));
    const selected=document.querySelector(`.menu-item[data-page="${id}"]`);
    document.getElementById('pageTitle').textContent=selected?.textContent.trim()||'GreenTime Pro';
    document.getElementById('sidebar').classList.remove('open');
  };
  app.initNavigation=function(){
    document.querySelectorAll('.menu-item').forEach(b=>b.onclick=()=>app.showPage(b.dataset.page));
    document.getElementById('menuToggle').onclick=()=>document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('themeToggle').onclick=()=>{
      const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
      document.documentElement.dataset.theme=next;localStorage.setItem('gtp_theme',next);app.themeIcon();
    };
    app.themeIcon=()=>document.getElementById('themeToggle').textContent=document.documentElement.dataset.theme==='dark'?'☀️':'🌙';
    app.themeIcon();
  };
})(window.GTP);

