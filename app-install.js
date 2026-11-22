/* Instalación progresiva de Valórate con S-Ciencia */
(function(){
 "use strict";
 let deferredPrompt=null;
 const install=document.getElementById("installAppBtn");
 const help=document.getElementById("installHelpBtn");
 const bar=document.getElementById("appInstallBar");
 if(!install||!help||!bar)return;
 const standalone=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true;
 if(standalone){bar.hidden=true;return;}
 window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();deferredPrompt=event;install.hidden=false;install.textContent="Instalar aplicación";
 });
 install.addEventListener("click",async()=>{
  if(!deferredPrompt){showHelp();return;}
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt=null;
 });
 window.addEventListener("appinstalled",()=>{bar.hidden=true;deferredPrompt=null;});
 function showHelp(){
  const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
  const isAndroid=/android/i.test(navigator.userAgent);
  let message="Puedes seguir usando la plataforma desde este navegador. Para instalarla, abre el menú del navegador y busca ‘Instalar aplicación’ o ‘Agregar a pantalla de inicio’.";
  if(isIOS)message="En iPhone o iPad: abre esta página en Safari, toca el botón Compartir y elige ‘Agregar a pantalla de inicio’. Después toca ‘Agregar’.";
  else if(isAndroid)message="En Android: abre esta página en Chrome, toca los tres puntos y elige ‘Instalar aplicación’ o ‘Agregar a pantalla principal’.";
  alert(message);
 }
 help.addEventListener("click",showHelp);
 install.hidden=false;
})();
