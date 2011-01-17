
jQuery(function(){
  
});

function submitRoom() {
    var fade_speed = 1000;
    var slide_speed = 1000;          
   

    $("#uwc_splash").animate({opacity:"0"}, function() {
      $("#uwc_splash").css("display", "none");
      $("#uwc_header").css("display", "block");
      $("#logo").css("float", "left");
      $("#logo").css("display", "inline");
      $("#logo").css("margin-left", "30px");
      $("#logo").css("margin-top", "40px");
      
      $("#amp_text").css("display","inline");
      $("#amp_text").css("margin-left", ($(window).width()/2 -400) + 'px');
     
       $("#logo_right").css("float", "right");
      $("#logo_right").css("display", "inline");
      $("#logo_right").css("margin-right", "30px");
      $("#logo_right").css("margin-top", "40px");
  
      $("#amp_text").css("margin-left", $(window).width()/2 - 58 - 200);
        
      $("#uwc_chat").animate({opacity:"1"},slide_speed,function(){});
      $("#log").animate({opacity:"1"},slide_speed,function(){});
      $("#uwc_divider").animate({opacity:'1'},slide_speed,function(){
              $("#uwc_header").css("width", "100%"); 
              $("#uwc_header").css("position", "fixed");
              $("#uwc_header").css("top", "0px");
              $("#uwc_header").css("left", "0px");
      });
    });
    return; 

    $("#uwc_splash").animate({marginLeft:'auto', marginRight:'auto',marginTop:'0px',top:'0px'},slide_speed,function(){
//    $("#logo").animate({marginLeft:'0px'}, slide_speed, function(){
        $("#uwc_chat").animate({opacity:"1"},slide_speed,function(){});
        //$("#toolbar").animate({opacity:"1"},slide_speed,function(){});
        $("#log").animate({opacity:"1"},slide_speed,function(){});
        $("#uwc_divider").animate({opacity:'1'},slide_speed,function(){});
        $("#uwc_splash").attr('style', 'position:fixed; margin-top:0px; margin-left:auto; margin-right:auto;');
        //$("#uwc_splash").width('100%');
    });
    //$("#uwc_splash").animate({marginLeft:'auto', marginRight:'auto',marginTop:'0',left:'0px',top:'0px'},slide_speed,function(){});
//    $("#connect").animate({marginTop:'-27px'},slide_speed,function(){});
}

$(window).resize(function() {
  $('#entry').width(($(window).width())+'px');
  $("#amp_text").css("margin-left", ($(window).width()/2 - 58 - 130) + 'px');
});
