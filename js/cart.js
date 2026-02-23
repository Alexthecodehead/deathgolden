(function(){
  const KEY = "dg_cart_v1";
  const money = (v)=> (new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'})).format(v||0);

  function read(){ try{ return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch(e){ return []; } }
  function write(items){ localStorage.setItem(KEY, JSON.stringify(items||[])); renderBadge(); }
  function renderBadge(){
    const items = read();
    const count = items.reduce((a,i)=>a+(i.qty||0),0);
    const el = document.querySelector("[data-cart-badge]");
    if(el) el.textContent = count;
  }
  function add(item){
    const items = read();
    const ix = items.findIndex(x=>x.id===item.id);
    if(ix>=0) items[ix].qty += item.qty||1;
    else items.push({id:item.id, name:item.name, price:item.price, img:item.img, qty:item.qty||1});
    write(items);
  }
  function remove(id){
    write(read().filter(x=>x.id!==id));
  }
  function clear(){ write([]); }

  async function getProducts(){
    const res = await fetch("/api/products");
    return await res.json();
  }

  async function renderCartPage(){
    const wrap = document.querySelector("[data-cart-page]");
    if(!wrap) return;
    const items = read();
    if(items.length===0){
      wrap.innerHTML = '<div class="notice">Seu carrinho está vazio.</div>';
      return;
    }
    let total = 0;
    const rows = items.map(i=>{
      const sub = (i.price||0)*(i.qty||0);
      total += sub;
      return `
        <tr>
          <td style="width:70px"><img src="${i.img}" style="width:60px;height:60px;object-fit:cover;border-radius:12px;border:1px solid rgba(35,35,52,.85)"></td>
          <td><strong>${i.name}</strong><div class="small">${money(i.price)} • Qtd: ${i.qty}</div></td>
          <td style="width:140px"><strong>${money(sub)}</strong></td>
          <td style="width:90px"><button class="btn" data-remove="${i.id}">Remover</button></td>
        </tr>
      `;
    }).join("");
    wrap.innerHTML = `
      <table class="table">
        <thead><tr><th></th><th>Item</th><th>Subtotal</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <hr class="sep">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <div><span class="badge">Total</span> <span class="price">${money(total)}</span></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn" data-clear>Limpar</button>
          <a class="btn primary" href="/checkout">Finalizar</a>
        </div>
      </div>
    `;
    wrap.querySelectorAll("[data-remove]").forEach(b=>{
      b.addEventListener("click", ()=>{ remove(Number(b.getAttribute("data-remove"))); renderCartPage(); });
    });
    const clearBtn = wrap.querySelector("[data-clear]");
    if(clearBtn) clearBtn.addEventListener("click", ()=>{ clear(); renderCartPage(); });
  }

  function bindAddButtons(){
    document.querySelectorAll("[data-add-to-cart]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const id = Number(btn.getAttribute("data-id"));
        const name = btn.getAttribute("data-name");
        const price = Number(btn.getAttribute("data-price"));
        const img = btn.getAttribute("data-img");
        add({id,name,price,img,qty:1});
        btn.textContent = "Adicionado ✓";
        setTimeout(()=>btn.textContent="Adicionar ao carrinho", 900);
      });
    });
  }

  window.DGCart = {read, write, add, remove, clear, renderBadge, renderCartPage, bindAddButtons, getProducts, money};
  document.addEventListener("DOMContentLoaded", ()=>{
    renderBadge();
    bindAddButtons();
    renderCartPage();
  });
})();
