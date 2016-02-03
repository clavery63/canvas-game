var levelData = [];

(function() {
  var NUM_LEVELS = 1;
  for (var i = 1; i <= NUM_LEVELS; i++) {
    var scriptTag = document.createElement('script');
    scriptTag.src = "levels/" + i + ".js";
    document.body.appendChild(scriptTag);
  }

  var mainScript = document.createElement('script');
  mainScript.src = "canvas-script.js";
  document.body.appendChild(mainScript);
})();
