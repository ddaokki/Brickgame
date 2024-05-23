function selectLevel(level){    
    $('.setting').fadeIn();
    $('.setting button').on("click",function(){
        var color = $('[name="color"]:checked').val();
        var music = $('[name="bgm"]:checked').val();
        location.href="ingame.html?level=" + level + "&color=" + color + "&music=" + music;
    });
    
}