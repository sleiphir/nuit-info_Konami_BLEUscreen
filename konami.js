$(document).keydown(function(event){
  tmp = String.fromCharCode(event.which);
  if(tmp === konami[cpt])
    cpt++;
  else
    cpt = 0;
  if(cpt === konami.length)
  {
    alert("KONAMI code")
    cpt = 0;
  }
});
