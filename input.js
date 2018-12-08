function initInput() {
  document.addEventListener('keydown', e => {
    switch (e.keyCode) {
      case 80:
        pause();
        break;
      default:
        document.querySelectorAll(`[data-key="${e.key}"]:not(.hidden):not(:disabled)`).forEach(b => b.click());
    }
  });
}
