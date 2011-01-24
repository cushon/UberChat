
jQuery(function(){
  
});

function submitRoom() {
    var fade_speed = 1000;
    var slide_speed = 1000;          
   
    $("#uwc_splash").animate({opacity:"0"}, function() {
      $("#uwc_splash").css("display", "none");
      $("#uwc_header").css("display", "block");
      $("#uwc_chat").css("display", "block");

      $("#uwc_header").animate({opacity:"1"}, slide_speed, function() {});

      $("#uwc_chat").animate({opacity:"1"},slide_speed,function(){});
        $("#log").animate({opacity:"1"},slide_speed,function(){});
      });
}

function resize() {
  $("#log_border").height(($(window).height() - 51 - 125) + "px");
  $("#toolbar").css("left", (($(window).width() - 981)/2) + "px");
  $("#log_border").css("left", (($(window).width() - 981)/2) + "px");
}

$(document).ready(function() {
  $("#log_border").height(($(window).height() - 51 - 125) + "px");
  $("#toolbar").css("left", (($(window).width() - 981)/2) + "px");
  $("#log_border").css("left", (($(window).width() - 981)/2) + "px");
  $("#toolbar_container").css("left", (($(window).width() - 981)/2) + "px");
  $("#log_background").css("left", (($(window).width() - 981)/2) + "px");
  $("#log_background").height(($(window).height() - 51 - 125) + "px");
});

$(window).resize(function() {
  $("#log_border").height(($(window).height() - 51 - 125) + "px");
  $("#toolbar").css("left", (($(window).width() - 981)/2) + "px");
  $("#log_border").css("left", (($(window).width() - 981)/2) + "px");
  $("#toolbar_container").css("left", (($(window).width() - 981)/2) + "px");
  $("#log_background").css("left", (($(window).width() - 981)/2) + "px");
  $("#log_background").height(($(window).height() - 51 - 125) + "px");
});
