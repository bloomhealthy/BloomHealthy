const DIV=document.querySelector('div');

window.onload = PAGECONTROL;

ZOOM = () => {
    // Disable zooming by preventing the default behavior of touchstart and wheel events
    document.addEventListener('touchstart', function(event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    }, { passive: false });
  
    document.addEventListener('wheel', function(event) {
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
        event.preventDefault();
      }
    });
};

if ('serviceWorker' in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register('./service-worker.js').then(function(registration) {
            console.log('ServiceWorker registered');
          }).catch(function(err) {
            console.log('ServiceWorker error: ', err);
          });
    })
}