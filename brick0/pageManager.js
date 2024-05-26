var audio;
function selectLevel(level){ 
    audio = new Audio("music/bgm1.mp3");
    audio.volume = 0.2;
    audio.play();   
    $('.setting').fadeIn();
    $('.setting button').on("click",function(){
        var color = $('[name="color"]:checked').val()[1]-1;
        var music = $('[name="bgm"]:checked').val();
        var character = $('[name="character"]:checked').val()[2];
        location.href="ingame.html?level=" + level + "&color=" + color + "&music=" + music + "&character=" + character;
    });
    
}

$(document).ready(function(){
    $("input[name='bgm']").change(function(){
        audio.pause();
        var music = $("input[name='bgm']:checked").val()[1];
        audio = new Audio("music/bgm" + music + ".mp3");
        audio.volume = 0.2;
        audio.play();
    });
});
