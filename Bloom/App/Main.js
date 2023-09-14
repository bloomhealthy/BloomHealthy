const DIV=document.querySelector('div');

window.onload = PAGECONTROL;

if ('serviceWorker' in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register('/ASSETS/service-worker.js').then(function(registration) {
            console.log('ServiceWorker registered');
          }).catch(function(err) {
            console.log('ServiceWorker error: ', err);
          });
    })
}