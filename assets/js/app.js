// Scholar Junction - Global App
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('[data-burger]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const sidebar = document.querySelector('.app-sidebar');
      if (sidebar) sidebar.classList.toggle('open');
    });
  }

  // Tabs
  document.querySelectorAll('[data-tabs]').forEach(tabRoot => {
    const btns = tabRoot.querySelectorAll('[data-tab]');
    const panels = tabRoot.parentElement?.querySelectorAll('[data-tab-panel]') || [];
    btns.forEach(b => b.addEventListener('click', () => {
      const id = b.getAttribute('data-tab');
      btns.forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      panels.forEach(p => {
        p.hidden = p.getAttribute('data-tab-panel') !== id;
      });
    }));
  });

  // Toast demo
  document.querySelectorAll('[data-toast]').forEach(el=>{
    el.addEventListener('click', e=>{
      e.preventDefault();
      showToast(el.getAttribute('data-toast') || 'Coming soon in Scholar Junction');
    });
  });
});

function showToast(msg){
  let t = document.getElementById('sj-toast');
  if(!t){
    t = document.createElement('div');
    t.id='sj-toast';
    t.style.cssText='position:fixed;bottom:22px;right:22px;background:#0f172a;color:white;padding:12px 16px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.2);z-index:9999;font-size:14px;transition:.2s;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity='1';
  t.style.transform='translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(8px)'; }, 2200);
}
