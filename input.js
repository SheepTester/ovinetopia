function initInput() {
  document.addEventListener('keydown', e => {
    switch (e.keyCode) {
      case 80:
        pause();
        break;
    }
  });
}
