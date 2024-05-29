var audio;
var check = false;
function selectLevel(level){
    if(check == true)
        return;
    audio = new Audio("../music/bgm1.mp3");
    audio.volume = 0.2;
    audio.play();   
    $('.setting').fadeIn();
    $('.setting button').on("click",function(){
        var color = $('[name="color"]:checked').val()[1]-1;
        var music = $('[name="bgm"]:checked').val();
        var character = $('[name="character"]:checked').val()[2];
        location.href="../html/ingame.html?level=" + level + "&color=" + color + "&music=" + music + "&character=" + character;
    });
    check = true;
}

$(document).ready(function() {
    $("input[name='bgm']").change(function() {
        audio.pause();
        var music = $("input[name='bgm']:checked").val()[1];
        audio = new Audio("music/bgm" + music + ".mp3");
        audio.volume = 0.2;
        audio.play();
    });
    $("#x_img").on("click",function(){
        $('.setting').fadeOut();
        check = false;
        audio.pause();
    });

    $("#story-button").on("click",function(){
        $(".storyslide").fadeIn();
    });

    var cnt = 1;
    $(".storyslide").on("click", function(){
        cnt++;
        $("#slide").css({
            display:"none"
        });
        $("#slide").attr("src", "../image/slide" + cnt + ".JPG");
        $("#slide").fadeIn();
        if(cnt==6){
            $(".storyslide").fadeOut();
        }
    })
});
