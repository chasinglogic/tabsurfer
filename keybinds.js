const boundKeys = [
  40,
  38,
  13,
  16,
  9
];

document.getElementById("surferInput").
  addEventListener("keyup", function (ev) {
    if (boundKeys.indexOf(ev.keyCode) !== -1) {
      return;
    }

    surf(ev.target.value);
  });

document.addEventListener("click", clickHandler);
document.addEventListener("keydown", returnKeyHandler);
document.addEventListener("keydown", arrowKeyHandler);
