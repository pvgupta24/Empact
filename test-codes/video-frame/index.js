var currentFrame = $('#currentFrame');
var video = VideoFrame({
    id : 'video',
    frameRate: 29.97,
    callback : function(frame) {
        currentFrame.html(frame);
    }
});

$('#play-pause').click(function(){
    ChangeButtonText();
});

function ChangeButtonText(){
  if(video.video.paused){
        video.video.play();
        video.listen('frame');
        $("#play-pause").html('Pause');
    }
    else{
        video.video.pause();
        video.stopListen();
        $("#play-pause").html('Play');
    }
  }