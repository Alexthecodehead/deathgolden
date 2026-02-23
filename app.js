// Deathgolden - header behavior (shrink logo on scroll)
(function(){
  const header = document.querySelector(".topbar");
  const logo = document.querySelector(".brand");
  if(!header || !logo) return;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const onScroll = () => {
    const y = window.scrollY || 0;
    const t = clamp(y / 260, 0, 1); // 0..1
    // scale logo from 1.0 to 0.72
    const s = 1 - (0.28 * t);
    logo.style.transform = `scale(${s})`;
    header.style.setProperty("--t", t.toFixed(3));
    header.classList.toggle("scrolled", y > 8);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive:true });

  // mobile menu
  const btn = document.querySelector("[data-menu-btn]");
  const panel = document.querySelector("[data-menu-panel]");
  if(btn && panel){
    btn.addEventListener("click", ()=>{
      const open = panel.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    panel.querySelectorAll("a").forEach(a=>a.addEventListener("click", ()=>panel.classList.remove("open")));
  }
})();
