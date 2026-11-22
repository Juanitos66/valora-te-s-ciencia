/* VALÓRATE CON S-CIENCIA 5.0
 * Espacio personal local: no transmite datos a la nube ni al panel docente.
 */
(function(){
 "use strict";
 const KEY="sc_v5_personal";
 const defaults={checkins:[],goals:[],actions:{},journal:"",textScale:100,contrast:false};
 let state=load();
 function load(){
  try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||"{}"))}
  catch(e){return {...defaults}}
 }
 function save(){
  try{localStorage.setItem(KEY,JSON.stringify(state));return true}
  catch(e){return false}
 }
 function el(id){return document.getElementById(id)}
 function feedback(id,message){const node=el(id);if(node)node.textContent=message}
 function safeText(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
 function today(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")}
 function download(name,content,type){
  const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
 }
 window.v5GoCheckin=()=>{el("v5-checkin")?.scrollIntoView({behavior:"smooth",block:"start"})};
 window.v5GoGoal=()=>{el("v5-goal")?.focus();el("v5-goals")?.scrollIntoView({behavior:"smooth",block:"start"})};
 window.v5ChooseMood=(button)=>{
  document.querySelectorAll(".v5-moods button").forEach(b=>b.classList.remove("selected"));
  button.classList.add("selected");button.setAttribute("aria-pressed","true");
  document.querySelectorAll(".v5-moods button").forEach(b=>{if(b!==button)b.setAttribute("aria-pressed","false")});
  state.pendingMood=button.dataset.v5Mood;
 };
 window.v5SaveCheckin=()=>{
  const mood=state.pendingMood||document.querySelector(".v5-moods button.selected")?.dataset.v5Mood;
  if(!mood){feedback("v5-checkin-feedback","Elige una opción o selecciona «Prefiero no decirlo».");return}
  state.checkins.push({date:today(),mood,note:(el("v5-checkin-note").value||"").trim().slice(0,500)});
  delete state.pendingMood;
  if(!save()){feedback("v5-checkin-feedback","No se pudo guardar. Revisa el almacenamiento del navegador.");return}
  el("v5-checkin-note").value="";
  document.querySelectorAll(".v5-moods button").forEach(b=>{b.classList.remove("selected");b.setAttribute("aria-pressed","false")});
  feedback("v5-checkin-feedback","Pausa guardada en este dispositivo. Gracias por darte este momento.");
  render();
 };
 window.v5AddGoal=()=>{
  const title=(el("v5-goal").value||"").trim(),due=el("v5-goal-date").value;
  if(!title){feedback("v5-goal-feedback","Escribe una meta pequeña antes de agregarla.");el("v5-goal").focus();return}
  state.goals.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),title:title.slice(0,140),due,done:false,created:today()});
  if(!save()){feedback("v5-goal-feedback","No se pudo guardar la meta.");return}
  el("v5-goal").value="";feedback("v5-goal-feedback","Meta agregada. Puedes marcarla cuando la completes.");render();
 };
 window.v5ToggleGoal=(id)=>{
  const goal=state.goals.find(g=>g.id===id);if(!goal)return;
  goal.done=!goal.done;save();render();
 };
 window.v5DeleteGoal=(id)=>{
  state.goals=state.goals.filter(g=>g.id!==id);save();render();
 };
 window.v5SaveActions=()=>{
  const checked=[...document.querySelectorAll("#v5-actions-list input:checked")].map(x=>x.value);
  state.actions[today()]=checked;
  if(!save()){feedback("v5-actions-feedback","No se pudieron guardar las acciones.");return}
  feedback("v5-actions-feedback",checked.length?checked.length+" acción(es) guardadas para hoy.":"Hoy no marcaste acciones; puedes volver cuando quieras.");
  render();
 };
 window.v5SaveJournal=()=>{
  state.journal=(el("v5-journal").value||"").slice(0,1000);
  if(!save()){feedback("v5-journal-feedback","No se pudo guardar la reflexión.");return}
  feedback("v5-journal-feedback","Reflexión guardada solo en este dispositivo.");
 };
 window.v5ExportJournal=()=>{
  const payload={exportado:new Date().toISOString(),reflexion:state.journal,pausas:state.checkins,metas:state.goals,acciones:state.actions};
  download("valora-s-ciencia-mi-espacio.json",JSON.stringify(payload,null,2),"application/json;charset=utf-8");
  feedback("v5-journal-feedback","Se preparó una copia de tus datos personales para guardar.");
 };
 window.v5TextSize=(step)=>{
  state.textScale=Math.max(90,Math.min(125,(state.textScale||100)+step*5));applyDisplay();save();
 };
 window.v5ToggleContrast=()=>{state.contrast=!state.contrast;applyDisplay();save()};
 window.v5ResetDisplay=()=>{state.textScale=100;state.contrast=false;applyDisplay();save()};
 function applyDisplay(){
  document.documentElement.style.setProperty("--v5-font-scale",(state.textScale||100)+"%");
  document.body.classList.toggle("v5-high-contrast",!!state.contrast);
  const b=el("v5-contrast-btn");if(b)b.setAttribute("aria-pressed",String(!!state.contrast));
 }
 window.v5ClearPersonalData=()=>{
  if(!confirm("¿Borrar pausas, metas, acciones y reflexiones guardadas en este espacio de este navegador? Esta acción no se puede deshacer."))return;
  state={...defaults,actions:{}};save();
  if(el("v5-journal"))el("v5-journal").value="";
  if(el("v5-checkin-note"))el("v5-checkin-note").value="";
  feedback("v5-journal-feedback","Los datos personales de Mi espacio se borraron de este navegador.");
  render();
 };
 function render(){
  if(!el("mi-espacio"))return;
  const checkins=el("v5CheckinCount"),goals=el("v5GoalCount"),actions=el("v5ActionCount");
  if(checkins)checkins.textContent=state.checkins.length;
  if(goals)goals.textContent=state.goals.length;
  if(actions)actions.textContent=Object.values(state.actions).reduce((n,a)=>n+(Array.isArray(a)?a.length:0),0);
  const list=el("v5-goal-list");
  if(list)list.innerHTML=state.goals.length?state.goals.map(g=>'<div class="v5-goal-item"><label><input type="checkbox" '+(g.done?"checked":"")+' onchange="v5ToggleGoal(\''+g.id+'\')"> <span class="'+(g.done?"done":"")+'">'+safeText(g.title)+'</span></label><small>'+(g.due?"Fecha: "+safeText(g.due):"Sin fecha")+'</small><button type="button" class="v5-delete" onclick="v5DeleteGoal(\''+g.id+'\')" aria-label="Eliminar meta">Eliminar</button></div>').join(""):"<p class='v5-muted'>Todavía no tienes metas. Puedes agregar una pequeña cuando quieras.</p>";
  if(el("v5-journal")&&el("v5-journal")!==document.activeElement)el("v5-journal").value=state.journal||"";
  const todays=state.actions[today()]||[];
  document.querySelectorAll("#v5-actions-list input").forEach(x=>x.checked=todays.includes(x.value));
 }
 function addNav(){
  const nav=el("nav");if(!nav||nav.querySelector('[data-v5-nav="true"]'))return;
  const button=document.createElement("button");button.type="button";button.textContent="Mi espacio";button.dataset.v5Nav="true";button.addEventListener("click",()=>window.go&&window.go("mi-espacio"));nav.insertBefore(button,nav.children[1]||null);
 }
 function addHomeShortcut(){
  const home=el("inicio");if(!home||home.querySelector('[data-v5-home="true"]'))return;
  const card=document.createElement("div");card.className="v5-home-shortcut";card.dataset.v5Home="true";
  card.innerHTML="<div><b>Nuevo en la versión 5.0</b><p>Un espacio personal para registrar pequeñas metas, pausas y acciones de autocuidado.</p></div><button class='btn' type='button'>Abrir Mi espacio</button>";
  card.querySelector("button").addEventListener("click",()=>window.go&&window.go("mi-espacio"));
  home.appendChild(card);
 }
 document.addEventListener("DOMContentLoaded",()=>{
  addNav();addHomeShortcut();applyDisplay();render();
  const style=document.createElement("style");
  style.textContent=":root{--v5-font-scale:100%}body{font-size:var(--v5-font-scale)}.v5-high-contrast{filter:contrast(1.18)}";
  document.head.appendChild(style);
 });
})();
