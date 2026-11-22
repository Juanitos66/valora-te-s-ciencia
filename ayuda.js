/* PESTAÑAS DE ORIENTACIÓN · ¿Qué hacemos si necesitamos ayuda? */
(function(){
 "use strict";
 function initHelp(){
  const root=document.getElementById("ayuda");
  if(!root)return;
  const tabs=[...root.querySelectorAll("[data-help-tab]")];
  const panels=[...root.querySelectorAll(".help-panel")];
  if(tabs.length!==5||panels.length!==5)return;
  function show(index,focusPanel){
   tabs.forEach((tab,i)=>{
    const active=i===index;
    tab.classList.toggle("active",active);
    tab.setAttribute("aria-selected",String(active));
    tab.tabIndex=active?0:-1;
    panels[i].hidden=!active;
    panels[i].classList.toggle("active",active);
   });
   if(focusPanel)panels[index].focus({preventScroll:true});
  }
  tabs.forEach((tab,i)=>{
   tab.addEventListener("click",()=>show(i,false));
   tab.addEventListener("keydown",event=>{
    let target=null;
    if(event.key==="ArrowRight"||event.key==="ArrowDown")target=(i+1)%tabs.length;
    if(event.key==="ArrowLeft"||event.key==="ArrowUp")target=(i+tabs.length-1)%tabs.length;
    if(event.key==="Home")target=0;
    if(event.key==="End")target=tabs.length-1;
    if(target!==null){event.preventDefault();show(target,false);tabs[target].focus()}
   });
  });
  show(0,false);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initHelp);
 else initHelp();
})();