$(document).ready(function(){
  function changeBackgroundColor(event) {
    var li = event.target.parentNode;
    li.classList.toggle('selected');
    event.preventDefault();
    $('#gameover-wrap').hide();
}

});

function showResult(){
    $('#gameover-wrap').fadeIn();
    var settingVairable = location.href.split("?")[1];
    var regex = /[^0-9]/g;
    settingVairable = settingVairable.replace(regex,""); 
    const level = settingVairable[0];
    const color = settingVairable[1];
    const music = settingVairable[2];
    const score = settingVairable.substr(3,settingVairable.length);
    $('#score').text(score + "점");
        
    $('#restart').on("click",function(){
        location.replace("ingame.html?level=" + level + "&color=" + color + "&music=" + music);
    });
    $('#beginning').on("click",function(){
        location.replace("gameEntryScreen.html");
    });
}