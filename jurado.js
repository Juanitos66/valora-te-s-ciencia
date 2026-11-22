/* MODO JURADO 5.1 · navegación de seis apartados */
(function(){
 "use strict";
 function initJury(){
  const root=document.getElementById("jurado");
  if(!root)return;
  const tabs=[...root.querySelectorAll("[data-jury-tab]")];
  const panels=[...root.querySelectorAll(".jury-panel")];
  const prev=document.getElementById("juryPrev"),next=document.getElementById("juryNext");
  const label=document.getElementById("juryStepLabel"),percent=document.getElementById("juryPercent");
  const bar=document.getElementById("juryProgressBar"),hint=document.getElementById("juryControlHint");
  if(tabs.length!==6||panels.length!==6)return;
  let current=0;
  function show(index,focusPanel){
   current=Math.max(0,Math.min(5,index));
   tabs.forEach((tab,i)=>{
    const active=i===current;
    tab.classList.toggle("active",active);
    tab.setAttribute("aria-selected",String(active));
    tab.tabIndex=active?0:-1;
    panels[i].hidden=!active;
    panels[i].classList.toggle("active",active);
   });
   const pct=Math.round((current+1)/6*100);
   label.textContent="Apartado "+(current+1)+" de 6";
   percent.textContent=pct+"% del recorrido";
   bar.style.width=pct+"%";
   prev.disabled=current===0;
   next.textContent=current===5?"Volver al inicio ↑":"Siguiente apartado →";
   hint.textContent=current===5?"Ha llegado al final de la presentación.":"Puede cambiar de apartado en cualquier momento.";
   if(focusPanel)panels[current].focus({preventScroll:true});
  }
  tabs.forEach((tab,i)=>{
   tab.addEventListener("click",()=>show(i,false));
   tab.addEventListener("keydown",event=>{
    let target=null;
    if(event.key==="ArrowRight"||event.key==="ArrowDown")target=(i+1)%6;
    if(event.key==="ArrowLeft"||event.key==="ArrowUp")target=(i+5)%6;
    if(event.key==="Home")target=0;
    if(event.key==="End")target=5;
    if(target!==null){event.preventDefault();show(target,false);tabs[target].focus()}
   });
  });
  prev.addEventListener("click",()=>show(current-1,true));
  next.addEventListener("click",()=>{
   if(current===5){show(0,true);return}
   show(current+1,true);
  });
  show(0,false);
  const params=new URLSearchParams(window.location.search);
  if(params.get("modo")==="jurado"||window.location.hash==="#jurado"){
   if(typeof window.go==="function")window.go("jurado");
  }
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initJury);
 else initJury();
})();