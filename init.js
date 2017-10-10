if (location.search !== "?surfInp") {
  location.search = "?surfInp";
  throw new Error; // load everything on the next page;
  // stop execution on this page
}

window.onload = function () {
  surf();
  document.getElementById("surferInput").focus();
  console.log('focused');
}
