$(function(){
    console.log("inicia");
    var count = 0;
    var wordsArray = ["Conectate", "Previene", "Ayuda", "Avisa"];
    setInterval(function () {
      count++;
      $("#changeText").fadeOut(400, function () {
        $(this).text(wordsArray[count % wordsArray.length]).fadeIn(400);
      });
    }, 3000);
  });




      