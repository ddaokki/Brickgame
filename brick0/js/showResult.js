$(document).ready(function(){
    setTimeout(showResult,5000);
});

function showResult(){

    $('#gameover-wrap').fadeIn();
    $('#score').text("100점");
    $('#beginning').on("click",function(){
        location.replace("../index.html");
    });
}